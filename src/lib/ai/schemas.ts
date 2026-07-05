import { z } from "zod";

export const briefSchema = z.object({
  problemStatement: z.string(),
  currentState: z.string(),
  futureState: z.string(),
  businessObjectives: z.array(z.string()),
  constraints: z.array(z.string()),
  successMetrics: z.array(z.string()),
  stakeholders: z.array(z.string()),
  timeline: z.string(),
  budget: z.string(),
  compliance: z.array(z.string()),
  whyAI: z.string(),
});
export type Brief = z.infer<typeof briefSchema>;

const issueTreeNode: z.ZodType<IssueTreeNode> = z.lazy(() =>
  z.object({
    label: z.string(),
    children: z.array(issueTreeNode).optional(),
  })
);
export interface IssueTreeNode {
  label: string;
  children?: IssueTreeNode[];
}

export const classificationSchema = z.object({
  domain: z.string(),
  subDomain: z.string(),
  businessFunction: z.string(),
  painPoints: z.array(z.string()),
  opportunityAreas: z.array(z.string()),
  issueTree: issueTreeNode,
});
export type Classification = z.infer<typeof classificationSchema>;

export const recommendationSchema = z.object({
  methodologies: z.array(
    z.object({ key: z.string(), rationale: z.string(), priority: z.number() })
  ),
  useCases: z.array(
    z.object({ key: z.string(), rationale: z.string(), confidence: z.number() })
  ),
  acceleratorKey: z.string(),
  acceleratorRationale: z.string(),
  team: z.array(z.object({ role: z.string(), rationale: z.string() })),
  risks: z.array(
    z.object({ risk: z.string(), category: z.string(), mitigation: z.string() })
  ),
  notRecommended: z.array(z.object({ option: z.string(), rationale: z.string() })),
});
export type Recommendation = z.infer<typeof recommendationSchema>;

export const architectureSchema = z.object({
  summary: z.string(),
  components: z.array(z.object({ name: z.string(), responsibility: z.string() })),
  dataFlow: z.array(z.string()),
  techStack: z.array(z.string()),
  mermaidDiagram: z.string(),
});
export type Architecture = z.infer<typeof architectureSchema>;

// JSON Schemas handed to Claude tool definitions (kept in sync with zod above).
export const briefJsonSchema = {
  type: "object" as const,
  properties: {
    problemStatement: { type: "string" },
    currentState: { type: "string" },
    futureState: { type: "string" },
    businessObjectives: { type: "array", items: { type: "string" } },
    constraints: { type: "array", items: { type: "string" } },
    successMetrics: { type: "array", items: { type: "string" } },
    stakeholders: { type: "array", items: { type: "string" } },
    timeline: { type: "string" },
    budget: { type: "string" },
    compliance: { type: "array", items: { type: "string" } },
    whyAI: { type: "string" },
  },
  required: [
    "problemStatement", "currentState", "futureState", "businessObjectives",
    "constraints", "successMetrics", "stakeholders", "timeline", "budget",
    "compliance", "whyAI",
  ],
};

export const classificationJsonSchema = {
  type: "object" as const,
  properties: {
    domain: { type: "string" },
    subDomain: { type: "string" },
    businessFunction: { type: "string" },
    painPoints: { type: "array", items: { type: "string" } },
    opportunityAreas: { type: "array", items: { type: "string" } },
    issueTree: {
      type: "object",
      properties: {
        label: { type: "string" },
        children: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              children: {
                type: "array",
                items: {
                  type: "object",
                  properties: { label: { type: "string" } },
                  required: ["label"],
                },
              },
            },
            required: ["label"],
          },
        },
      },
      required: ["label"],
    },
  },
  required: ["domain", "subDomain", "businessFunction", "painPoints", "opportunityAreas", "issueTree"],
};

export const recommendationJsonSchema = {
  type: "object" as const,
  properties: {
    methodologies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          rationale: { type: "string" },
          priority: { type: "number" },
        },
        required: ["key", "rationale", "priority"],
      },
    },
    useCases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          rationale: { type: "string" },
          confidence: { type: "number" },
        },
        required: ["key", "rationale", "confidence"],
      },
    },
    acceleratorKey: { type: "string" },
    acceleratorRationale: { type: "string" },
    team: {
      type: "array",
      items: {
        type: "object",
        properties: { role: { type: "string" }, rationale: { type: "string" } },
        required: ["role", "rationale"],
      },
    },
    risks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          risk: { type: "string" },
          category: { type: "string" },
          mitigation: { type: "string" },
        },
        required: ["risk", "category", "mitigation"],
      },
    },
    notRecommended: {
      type: "array",
      items: {
        type: "object",
        properties: { option: { type: "string" }, rationale: { type: "string" } },
        required: ["option", "rationale"],
      },
    },
  },
  required: ["methodologies", "useCases", "acceleratorKey", "acceleratorRationale", "team", "risks", "notRecommended"],
};

export const architectureJsonSchema = {
  type: "object" as const,
  properties: {
    summary: { type: "string" },
    components: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, responsibility: { type: "string" } },
        required: ["name", "responsibility"],
      },
    },
    dataFlow: { type: "array", items: { type: "string" } },
    techStack: { type: "array", items: { type: "string" } },
    mermaidDiagram: { type: "string" },
  },
  required: ["summary", "components", "dataFlow", "techStack", "mermaidDiagram"],
};
