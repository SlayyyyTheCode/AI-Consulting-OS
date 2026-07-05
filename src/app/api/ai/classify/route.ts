import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MODELS, structuredCall, aiErrorMessage } from "@/lib/ai/client";
import { classificationPrompt } from "@/lib/ai/prompts";
import { isDemoMode, demoClassify } from "@/lib/ai/demo";
import {
  classificationSchema,
  classificationJsonSchema,
  type Classification,
} from "@/lib/ai/schemas";
import { db } from "@/lib/db";
import { classifications } from "@/lib/db/schema";
import { getDiscovery, buildEngagementContext } from "@/lib/db/queries";

export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { engagementId } = await req.json();
  const discovery = await getDiscovery(engagementId);
  if (!discovery?.extractedBrief) {
    return NextResponse.json({ error: "Complete discovery first" }, { status: 400 });
  }

  try {
  const context = await buildEngagementContext(engagementId);
    const raw = isDemoMode()
      ? demoClassify(context)
      : await structuredCall<Classification>({
      model: MODELS.fast,
      system: classificationPrompt(),
      userContent: `Classify this engagement:\n\n${context}`,
      toolName: "save_classification",
      toolDescription: "Save the business problem classification and MECE issue tree.",
      inputSchema: classificationJsonSchema,
    });
    const result = classificationSchema.parse(raw);
  
    const [saved] = await db
      .insert(classifications)
      .values({
        engagementId,
        domain: result.domain,
        subDomain: result.subDomain,
        businessFunction: result.businessFunction,
        painPoints: result.painPoints,
        opportunityAreas: result.opportunityAreas,
        issueTree: result.issueTree,
      })
      .returning();
  
    return NextResponse.json({ classification: saved });
  } catch (err) {
    return NextResponse.json({ error: aiErrorMessage(err) }, { status: 502 });
  }
}
