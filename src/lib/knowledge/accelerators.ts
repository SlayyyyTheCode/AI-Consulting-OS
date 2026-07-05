// Layer 10 — Industry Accelerators.

export interface IndustryAccelerator {
  key: string;
  name: string;
  commonProblems: string[];
  regulations: string[];
  aiUseCases: string[]; // keys into AI_USE_CASES
  referenceArchitectures: string[];
  kpis: string[];
}

export const INDUSTRY_ACCELERATORS: IndustryAccelerator[] = [
  {
    key: "banking",
    name: "Banking",
    commonProblems: [
      "Manual KYC/AML review backlogs",
      "Slow loan origination and underwriting",
      "Fragmented customer service across channels",
      "Fraud detection false positives",
    ],
    regulations: ["Basel III", "AML/KYC (FATF)", "GDPR", "PSD2", "SR 11-7 (model risk)", "EU AI Act (high-risk)"],
    aiUseCases: ["document-ai", "ai-agent", "predictive-analytics", "rag"],
    referenceArchitectures: ["Document AI pipeline with human review", "Customer service RAG + agent with escalation"],
    kpis: ["KYC cycle time", "Fraud detection precision/recall", "Cost per case", "NPS"],
  },
  {
    key: "insurance",
    name: "Insurance",
    commonProblems: [
      "Slow claims processing",
      "Manual underwriting document review",
      "Policy servicing call volume",
      "Subrogation leakage",
    ],
    regulations: ["Solvency II", "NAIC model laws", "GDPR/CCPA", "EU AI Act"],
    aiUseCases: ["document-ai", "ocr", "predictive-analytics", "ai-copilot"],
    referenceArchitectures: ["Claims intake Document AI with fraud scoring", "Underwriter copilot with RAG over guidelines"],
    kpis: ["Claims cycle time", "Straight-through processing rate", "Loss adjustment expense", "Combined ratio impact"],
  },
  {
    key: "healthcare",
    name: "Healthcare",
    commonProblems: [
      "Clinical documentation burden",
      "Prior authorization delays",
      "Patient communication gaps",
      "Claims denials",
    ],
    regulations: ["HIPAA", "HITECH", "FDA SaMD guidance", "EU MDR", "state privacy laws"],
    aiUseCases: ["nlp", "document-ai", "voice-ai", "ai-copilot"],
    referenceArchitectures: ["Ambient clinical documentation", "Prior-auth Document AI with payer rules RAG"],
    kpis: ["Documentation time per encounter", "Prior-auth turnaround", "Denial rate", "Clinician satisfaction"],
  },
  {
    key: "manufacturing",
    name: "Manufacturing",
    commonProblems: [
      "Unplanned downtime",
      "Quality defects and scrap",
      "Tribal knowledge loss",
      "Supply chain disruption",
    ],
    regulations: ["ISO 9001", "OSHA", "environmental regs", "export controls"],
    aiUseCases: ["predictive-analytics", "computer-vision", "rag", "knowledge-graph"],
    referenceArchitectures: ["Predictive maintenance on sensor data", "Vision QC at line speed", "Maintenance knowledge RAG"],
    kpis: ["OEE", "Unplanned downtime hours", "Scrap rate", "MTTR"],
  },
  {
    key: "retail",
    name: "Retail",
    commonProblems: [
      "Generic customer experience",
      "Inventory imbalance",
      "Content production bottlenecks",
      "Service cost at scale",
    ],
    regulations: ["PCI DSS", "GDPR/CCPA", "consumer protection laws"],
    aiUseCases: ["recommendation-systems", "predictive-analytics", "ai-agent", "nlp"],
    referenceArchitectures: ["Real-time personalization", "Demand forecasting", "Service agent with order tools"],
    kpis: ["Conversion rate", "Inventory turns", "Forecast accuracy", "Contact deflection rate"],
  },
  {
    key: "high-tech",
    name: "High Tech",
    commonProblems: [
      "Support ticket volume growth",
      "Developer productivity drag",
      "Documentation sprawl",
      "Churn prediction",
    ],
    regulations: ["SOC 2", "ISO 27001", "GDPR", "export controls"],
    aiUseCases: ["ai-copilot", "rag", "ai-agent", "predictive-analytics"],
    referenceArchitectures: ["Support copilot over product docs", "Internal engineering RAG", "Agentic ticket triage"],
    kpis: ["Ticket deflection", "Time to resolution", "Developer cycle time", "Net retention"],
  },
  {
    key: "public-sector",
    name: "Public Sector",
    commonProblems: [
      "Citizen service backlogs",
      "Paper-heavy case processing",
      "Legacy system fragmentation",
      "FOIA/records request volume",
    ],
    regulations: ["FedRAMP", "FISMA", "Section 508 accessibility", "records retention laws", "EU AI Act (public services)"],
    aiUseCases: ["document-ai", "rag", "ai-copilot", "ocr"],
    referenceArchitectures: ["Citizen service RAG portal", "Case file Document AI with audit trail"],
    kpis: ["Case processing time", "Backlog reduction", "Citizen satisfaction", "Cost per transaction"],
  },
];
