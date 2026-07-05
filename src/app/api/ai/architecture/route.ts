import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MODELS, structuredCall, aiErrorMessage } from "@/lib/ai/client";
import { architecturePrompt } from "@/lib/ai/prompts";
import { isDemoMode, demoArchitecture } from "@/lib/ai/demo";
import type { Recommendation } from "@/lib/ai/schemas";
import {
  architectureSchema,
  architectureJsonSchema,
  type Architecture,
} from "@/lib/ai/schemas";
import { db } from "@/lib/db";
import { architectures } from "@/lib/db/schema";
import { getRecommendation, buildEngagementContext } from "@/lib/db/queries";

export const maxDuration = 120;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { engagementId } = await req.json();
  const recommendation = await getRecommendation(engagementId);
  if (!recommendation) {
    return NextResponse.json({ error: "Run recommendations first" }, { status: 400 });
  }

  try {
  const context = await buildEngagementContext(engagementId);
    const raw = isDemoMode()
      ? demoArchitecture(
          ((recommendation.payload as Recommendation).useCases ?? []).map((u) => u.key)
        )
      : await structuredCall<Architecture>({
      model: MODELS.reasoning,
      system: architecturePrompt(),
      userContent: `Design the solution architecture for this engagement:\n\n${context}`,
      toolName: "save_architecture",
      toolDescription: "Save the solution architecture with components, data flow, tech stack, and mermaid diagram.",
      inputSchema: architectureJsonSchema,
      maxTokens: 8192,
    });
    const result = architectureSchema.parse(raw);
  
    const [saved] = await db
      .insert(architectures)
      .values({
        engagementId,
        summary: result.summary,
        components: result.components,
        dataFlow: result.dataFlow,
        techStack: result.techStack,
        mermaidDiagram: result.mermaidDiagram,
      })
      .returning();
  
    return NextResponse.json({ architecture: saved });
  } catch (err) {
    return NextResponse.json({ error: aiErrorMessage(err) }, { status: 502 });
  }
}
