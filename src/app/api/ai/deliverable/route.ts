import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { anthropic, MODELS, aiErrorMessage } from "@/lib/ai/client";
import { deliverablePrompt } from "@/lib/ai/prompts";
import { DELIVERABLE_TEMPLATES } from "@/lib/knowledge/deliverable-templates";
import { db } from "@/lib/db";
import { deliverables } from "@/lib/db/schema";
import { buildEngagementContext, getEngagement } from "@/lib/db/queries";

export const maxDuration = 180;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { engagementId, templateKey, instructions } = await req.json();
  const template = DELIVERABLE_TEMPLATES.find((t) => t.key === templateKey);
  if (!template) return NextResponse.json({ error: "Unknown template" }, { status: 400 });

  const engagement = await getEngagement(engagementId);
  if (!engagement) return NextResponse.json({ error: "Engagement not found" }, { status: 404 });

  const context = await buildEngagementContext(engagementId);
  try {
  const response = await anthropic.messages.create({
    model: MODELS.reasoning,
    max_tokens: 8192,
    system: deliverablePrompt(templateKey),
    messages: [
      {
        role: "user",
        content: `Engagement context:\n\n${context}${instructions ? `\n\nAdditional instructions from the consultant:\n${instructions}` : ""}\n\nWrite the deliverable now.`,
      },
    ],
  });

  const contentMd = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");

  const [saved] = await db
    .insert(deliverables)
    .values({
      engagementId,
      templateKey,
      title: `${template.name} — ${engagement.clientName}`,
      contentMd,
    })
    .returning();

  return NextResponse.json({ deliverable: saved });
  } catch (err) {
    return NextResponse.json({ error: aiErrorMessage(err) }, { status: 502 });
  }
}
