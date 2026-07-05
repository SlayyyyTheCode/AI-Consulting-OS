// Layer 2 — Business Problem Classification taxonomy.
// Constrains AI classification outputs to a known, MECE structure.

export interface TaxonomyDomain {
  domain: string;
  subDomains: string[];
  typicalUseCases: string[];
}

export const TAXONOMY: TaxonomyDomain[] = [
  {
    domain: "Knowledge Management",
    subDomains: ["Enterprise Search", "Document Management", "Expertise Location", "Institutional Memory"],
    typicalUseCases: ["rag", "knowledge-graph", "ai-copilot"],
  },
  {
    domain: "Finance",
    subDomains: ["Invoice Processing", "Accounts Payable", "Financial Reporting", "Fraud Detection", "Forecasting"],
    typicalUseCases: ["document-ai", "ocr", "predictive-analytics", "ai-automation"],
  },
  {
    domain: "Human Resources",
    subDomains: ["Employee Support", "Recruiting", "Onboarding", "Learning & Development"],
    typicalUseCases: ["ai-copilot", "rag", "ai-agent"],
  },
  {
    domain: "Manufacturing",
    subDomains: ["Predictive Maintenance", "Quality Control", "Production Planning", "Supply Chain"],
    typicalUseCases: ["predictive-analytics", "computer-vision", "ai-automation"],
  },
  {
    domain: "Customer Service",
    subDomains: ["Contact Center", "Self-Service", "Case Management", "Voice Support"],
    typicalUseCases: ["ai-agent", "rag", "voice-ai", "nlp"],
  },
  {
    domain: "Sales & Marketing",
    subDomains: ["Lead Scoring", "Content Generation", "Personalization", "Market Intelligence"],
    typicalUseCases: ["recommendation-systems", "nlp", "predictive-analytics"],
  },
  {
    domain: "Operations",
    subDomains: ["Process Automation", "Logistics", "Field Service", "Procurement"],
    typicalUseCases: ["ai-automation", "ai-agent", "document-ai"],
  },
  {
    domain: "Legal & Compliance",
    subDomains: ["Contract Analysis", "Regulatory Monitoring", "eDiscovery", "Policy Management"],
    typicalUseCases: ["document-ai", "nlp", "rag"],
  },
  {
    domain: "IT & Engineering",
    subDomains: ["IT Service Desk", "DevOps", "Code Assistance", "Incident Management"],
    typicalUseCases: ["ai-copilot", "ai-agent", "rag"],
  },
  {
    domain: "Healthcare Operations",
    subDomains: ["Clinical Documentation", "Patient Engagement", "Claims Processing", "Care Coordination"],
    typicalUseCases: ["document-ai", "nlp", "voice-ai", "ai-copilot"],
  },
];

export const BUSINESS_FUNCTIONS = [
  "Strategy",
  "Operations",
  "Finance",
  "HR",
  "Sales",
  "Marketing",
  "Customer Service",
  "IT",
  "Legal",
  "Compliance",
  "R&D",
  "Supply Chain",
] as const;
