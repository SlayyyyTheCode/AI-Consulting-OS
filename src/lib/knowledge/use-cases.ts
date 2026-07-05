// Layer 4 — AI Solution / Use Case knowledge base.

export interface AIUseCase {
  key: string;
  name: string;
  description: string;
  bestFor: string;
  technologies: string[];
  complexity: "Low" | "Medium" | "High";
}

export const AI_USE_CASES: AIUseCase[] = [
  {
    key: "rag",
    name: "RAG (Retrieval-Augmented Generation)",
    description: "Ground LLM answers in enterprise documents via embeddings + vector search.",
    bestFor: "Enterprise search, policy Q&A, knowledge management.",
    technologies: ["Vector Database", "Embeddings", "LLM API", "Chunking Pipeline", "Hybrid Search"],
    complexity: "Medium",
  },
  {
    key: "ai-copilot",
    name: "AI Copilot",
    description: "Assistant embedded in a workflow that drafts, summarizes, and answers in context.",
    bestFor: "Employee support, IT helpdesk, sales enablement.",
    technologies: ["LLM API", "RAG", "Function Calling", "Prompt Engineering"],
    complexity: "Medium",
  },
  {
    key: "ai-agent",
    name: "AI Agent",
    description: "Autonomous LLM system that plans, calls tools, and completes multi-step tasks.",
    bestFor: "Case resolution, ticket triage, research workflows.",
    technologies: ["Function Calling", "MCP", "Orchestration", "Guardrails", "Memory"],
    complexity: "High",
  },
  {
    key: "multi-agent",
    name: "Multi-Agent System",
    description: "Multiple specialized agents coordinating on complex workflows with a supervisor.",
    bestFor: "End-to-end process automation with distinct roles.",
    technologies: ["Agent Orchestration", "MCP", "Message Bus", "Approval Gates"],
    complexity: "High",
  },
  {
    key: "computer-vision",
    name: "Computer Vision",
    description: "Image/video analysis: detection, classification, inspection.",
    bestFor: "Quality control, safety monitoring, visual inspection.",
    technologies: ["Vision Models", "Edge Inference", "GPU Infrastructure"],
    complexity: "High",
  },
  {
    key: "nlp",
    name: "NLP / Text Analytics",
    description: "Classification, sentiment, entity extraction, summarization at scale.",
    bestFor: "Voice-of-customer, contract analysis, content routing.",
    technologies: ["LLM API", "Embeddings", "Fine-Tuning"],
    complexity: "Medium",
  },
  {
    key: "ocr",
    name: "OCR / Intelligent Document Processing",
    description: "Extract structured data from scans, PDFs, handwriting.",
    bestFor: "Invoice processing, forms intake, claims.",
    technologies: ["OCR Engine", "Document AI", "Validation Rules"],
    complexity: "Medium",
  },
  {
    key: "voice-ai",
    name: "Voice AI",
    description: "Speech-to-text, text-to-speech, real-time voice agents.",
    bestFor: "Contact centers, hands-free field operations.",
    technologies: ["STT/TTS", "Real-time LLM", "Telephony Integration"],
    complexity: "High",
  },
  {
    key: "knowledge-graph",
    name: "Knowledge Graph",
    description: "Entity-relationship graph connecting enterprise knowledge for reasoning and discovery.",
    bestFor: "Expertise location, impact analysis, graph-RAG.",
    technologies: ["Graph Database", "Entity Extraction", "Ontology Design"],
    complexity: "High",
  },
  {
    key: "predictive-analytics",
    name: "Predictive Analytics",
    description: "Forecast outcomes (demand, churn, failure) from historical data.",
    bestFor: "Predictive maintenance, forecasting, risk scoring.",
    technologies: ["ML Models", "Feature Store", "MLOps"],
    complexity: "Medium",
  },
  {
    key: "document-ai",
    name: "Document AI",
    description: "End-to-end document understanding: classify, extract, validate, route.",
    bestFor: "Finance ops, legal review, compliance workflows.",
    technologies: ["OCR", "LLM Extraction", "Human-in-the-loop Review"],
    complexity: "Medium",
  },
  {
    key: "recommendation-systems",
    name: "Recommendation System",
    description: "Personalized ranking of content, products, or actions.",
    bestFor: "E-commerce, content platforms, next-best-action.",
    technologies: ["Embeddings", "Ranking Models", "Real-time Serving"],
    complexity: "Medium",
  },
  {
    key: "ai-automation",
    name: "AI Automation",
    description: "LLM-augmented workflow automation replacing manual swivel-chair work.",
    bestFor: "Back-office operations, data entry, routing.",
    technologies: ["Workflow Engine", "LLM API", "API Integration", "RPA Bridge"],
    complexity: "Low",
  },
];

export const TECHNOLOGIES = [
  "API",
  "MCP",
  "Vector Database",
  "Embeddings",
  "Prompt Engineering",
  "Fine-Tuning",
  "Function Calling",
  "LLM Gateway",
  "Hybrid Search",
  "GPU Infrastructure",
  "Kubernetes",
  "CI/CD",
  "Terraform",
] as const;
