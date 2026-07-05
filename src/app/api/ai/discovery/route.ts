import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { anthropic, MODELS, structuredCall, aiErrorMessage } from "@/lib/ai/client";
import { isDemoMode, demoDiscoveryReply, demoBrief } from "@/lib/ai/demo";
import { DISCOVERY_SYSTEM_PROMPT, BRIEF_EXTRACTION_PROMPT } from "@/lib/ai/prompts";
import { briefSchema, briefJsonSchema, type Brief } from "@/lib/ai/schemas";
import { db } from "@/lib/db";
import { discoverySessions } from "@/lib/db/schema";
import { getEngagement, getDiscovery } from "@/lib/db/queries";

export const maxDuration = 120;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// POST { engagementId, messages } -> streams assistant reply, persists transcript.
// POST { engagementId, action: "complete" } -> extracts structured brief.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { engagementId } = body as { engagementId: string };
  const engagement = await getEngagement(engagementId);
  if (!engagement) return NextResponse.json({ error: "Engagement not found" }, { status: 404 });

  const existing = await getDiscovery(engagementId);

  if (body.action === "complete") {
    const messages = (existing?.messages ?? []) as ChatMessage[];
    if (messages.length < 2) {
      return NextResponse.json({ error: "Not enough conversation to extract a brief" }, { status: 400 });
    }
    const transcript = messages
      .map((m) => `${m.role === "user" ? "CLIENT/CONSULTANT" : "INTERVIEWER"}: ${m.content}`)
      .join("\n\n");

    try {
    if (isDemoMode()) {
      const brief = briefSchema.parse(demoBrief(messages));
      await db
        .update(discoverySessions)
        .set({ extractedBrief: brief, completedAt: new Date(), updatedAt: new Date() })
        .where(eq(discoverySessions.id, existing!.id));
      return NextResponse.json({ brief });
    }
    const raw = await structuredCall<Brief>({
      model: MODELS.reasoning,
      system: BRIEF_EXTRACTION_PROMPT,
      userContent: `Engagement: ${engagement.title} for ${engagement.clientName} (${engagement.industry}).\n\nInterview transcript:\n\n${transcript}\n\nExtract the engagement brief.`,
      toolName: "save_engagement_brief",
      toolDescription: "Save the structured engagement brief extracted from the discovery interview.",
      inputSchema: briefJsonSchema,
    });
    const brief = briefSchema.parse(raw);

    await db
      .update(discoverySessions)
      .set({ extractedBrief: brief, completedAt: new Date(), updatedAt: new Date() })
      .where(eq(discoverySessions.id, existing!.id));

    return NextResponse.json({ brief });
    } catch (err) {
      return NextResponse.json({ error: aiErrorMessage(err) }, { status: 502 });
    }
  }

  const messages = (body.messages ?? []) as ChatMessage[];
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
  }

  const contextHeader = `Engagement: "${engagement.title}" for client "${engagement.clientName}" in the ${engagement.industry} industry.`;

  if (isDemoMode()) {
    // Scripted interviewer — no LLM required.
    const reply = demoDiscoveryReply(messages);
    const fullMessages = [...messages, { role: "assistant" as const, content: reply }];
    if (existing) {
      await db
        .update(discoverySessions)
        .set({ messages: fullMessages, updatedAt: new Date() })
        .where(eq(discoverySessions.id, existing.id));
    } else {
      await db.insert(discoverySessions).values({ engagementId, messages: fullMessages });
    }
    return new Response(reply, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const stream = anthropic.messages.stream({
    model: MODELS.reasoning,
    max_tokens: 1024,
    system: `${DISCOVERY_SYSTEM_PROMPT}\n\n${contextHeader}`,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let assistantText = "";
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            assistantText += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        // Persist full transcript after stream completes.
        const fullMessages = [...messages, { role: "assistant" as const, content: assistantText }];
        if (existing) {
          await db
            .update(discoverySessions)
            .set({ messages: fullMessages, updatedAt: new Date() })
            .where(eq(discoverySessions.id, existing.id));
        } else {
          await db.insert(discoverySessions).values({ engagementId, messages: fullMessages });
        }
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
