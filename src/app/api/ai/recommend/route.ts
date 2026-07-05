import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MODELS, structuredCall, aiErrorMessage } from "@/lib/ai/client";
import { recommendationPrompt } from "@/lib/ai/prompts";
import {
  recommendationSchema,
  recommendationJsonSchema,
  type Recommendation,
} from "@/lib/ai/schemas";
import { db } from "@/lib/db";
import { recommendations, riskRegister } from "@/lib/db/schema";
import { getClassification, buildEngagementContext } from "@/lib/db/queries";

export const maxDuration = 120;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { engagementId } = await req.json();
  const classification = await getClassification(engagementId);
  if (!classification) {
    return NextResponse.json({ error: "Run classification first" }, { status: 400 });
  }

  try {
  const context = await buildEngagementContext(engagementId);
    const raw = await structuredCall<Recommendation>({
      model: MODELS.reasoning,
      system: recommendationPrompt(),
      userContent: `Generate recommendations for this engagement:\n\n${context}`,
      toolName: "save_recommendations",
      toolDescription: "Save methodology, use case, accelerator, team, and risk recommendations.",
      inputSchema: recommendationJsonSchema,
      maxTokens: 8192,
    });
    const result = recommendationSchema.parse(raw);
  
    const [saved] = await db
      .insert(recommendations)
      .values({ engagementId, payload: result })
      .returning();
  
    // Seed risk register from recommended risks.
    if (result.risks.length > 0) {
      await db.insert(riskRegister).values(
        result.risks.map((r) => ({
          engagementId,
          risk: r.risk,
          category: r.category,
          mitigation: r.mitigation,
        }))
      );
    }
  
    return NextResponse.json({ recommendation: saved });
  } catch (err) {
    return NextResponse.json({ error: aiErrorMessage(err) }, { status: 502 });
  }
}
