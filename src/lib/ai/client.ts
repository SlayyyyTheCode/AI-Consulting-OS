import Anthropic from "@anthropic-ai/sdk";

// Lazy proxy: the SDK constructor throws when no API key is present, which
// would crash every route at module load — including demo-mode requests that
// never call the API. Instantiate on first real use instead.
let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured on the server");
    }
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});

/** Extract a readable message from Anthropic SDK / generic errors. */
export function aiErrorMessage(err: unknown): string {
  if (err instanceof Anthropic.APIError) {
    return `Anthropic API error (${err.status}): ${err.message}`;
  }
  if (err instanceof Error) return err.message;
  return "Unknown AI error";
}

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
  const response = await getClient().messages.create({
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
