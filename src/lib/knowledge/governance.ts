// Layer 12 — Enterprise AI Governance, Responsible AI & Guardrails checklists.

export interface GovernanceItem {
  framework: string;
  item: string;
}

export const GOVERNANCE_CHECKLIST: GovernanceItem[] = [
  // NIST AI RMF
  { framework: "NIST AI RMF", item: "GOVERN: AI risk management roles and accountability defined" },
  { framework: "NIST AI RMF", item: "MAP: Context, intended use, and impact of AI system documented" },
  { framework: "NIST AI RMF", item: "MEASURE: AI risks identified, analyzed, and tracked with metrics" },
  { framework: "NIST AI RMF", item: "MANAGE: Risk responses prioritized, planned, and monitored" },
  // ISO/IEC 42001
  { framework: "ISO/IEC 42001", item: "AI management system scope and policy established" },
  { framework: "ISO/IEC 42001", item: "AI system impact assessment completed" },
  { framework: "ISO/IEC 42001", item: "AI lifecycle processes documented and controlled" },
  { framework: "ISO/IEC 42001", item: "Continual improvement process for AIMS in place" },
  // ISO/IEC 23894
  { framework: "ISO/IEC 23894", item: "AI risk management integrated with enterprise risk (ISO 31000 aligned)" },
  { framework: "ISO/IEC 23894", item: "Risk sources across AI lifecycle identified and documented" },
  // ISO/IEC 27001
  { framework: "ISO/IEC 27001", item: "Information security controls applied to AI data pipeline" },
  { framework: "ISO/IEC 27001", item: "Access control and encryption for training/retrieval data" },
  // Responsible AI
  { framework: "Responsible AI", item: "Fairness: bias assessment performed on model outputs" },
  { framework: "Responsible AI", item: "Transparency: users informed they interact with AI" },
  { framework: "Responsible AI", item: "Explainability: decisions traceable and explainable to stakeholders" },
  { framework: "Responsible AI", item: "Accountability: human owner assigned for AI system outcomes" },
  { framework: "Responsible AI", item: "Privacy: PII minimization and consent handling verified" },
  { framework: "Responsible AI", item: "Reliability & Robustness: performance validated under edge cases" },
  { framework: "Responsible AI", item: "Human Oversight: intervention mechanism exists for consequential decisions" },
  { framework: "Responsible AI", item: "Traceability: model versions, prompts, and data lineage logged" },
  // LLM Guardrails
  { framework: "LLM Guardrails", item: "Prompt injection protection implemented and tested" },
  { framework: "LLM Guardrails", item: "Output filtering and content moderation active" },
  { framework: "LLM Guardrails", item: "PII detection and DLP on inputs and outputs" },
  { framework: "LLM Guardrails", item: "Hallucination detection / grounding validation in place" },
  { framework: "LLM Guardrails", item: "Policy enforcement layer and rate limiting configured" },
  // Agentic AI Guardrails
  { framework: "Agentic Guardrails", item: "Human-in-the-loop / approval gates for consequential actions" },
  { framework: "Agentic Guardrails", item: "Role-based access and tool permissions scoped per agent" },
  { framework: "Agentic Guardrails", item: "Agent isolation and memory controls enforced" },
  { framework: "Agentic Guardrails", item: "Kill switch and audit logs operational" },
];

export const GOVERNANCE_DELIVERABLES = [
  "AI Governance Charter",
  "Responsible AI Policy",
  "AI Risk Register",
  "Model Card",
  "System Card",
  "Threat Model",
  "Privacy Impact Assessment",
  "Compliance Matrix",
] as const;
