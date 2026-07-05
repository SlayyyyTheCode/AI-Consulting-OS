import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODELS = {
  reasoning: "claude-sonnet-5",
  fast: "claude-haiku-4-5-20251001",
} as const;

/**
 * Call Claude with a forced tool to get schema-conforming JSON output.
 * The tool's input schema constrains the model; the tool_use input is the result.
 */
export async function structuredCall<T>(opts: {
  model: string;
  system: string;
  userContent: string;
  toolName: string;
  toolDescription: string;
  inputSchema: Anthropic.Tool.InputSchema;
  maxTokens?: number;
}): Promise<T> {
  const response = await anthropic.messages.create({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 4096,
    system: opts.system,
    messages: [{ role: "user", content: opts.userContent }],
    tools: [
      {
        name: opts.toolName,
        description: opts.toolDescription,
        input_schema: opts.inputSchema,
      },
    ],
    tool_choice: { type: "tool", name: opts.toolName },
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Model did not return structured output");
  }
  return toolUse.input as T;
}
