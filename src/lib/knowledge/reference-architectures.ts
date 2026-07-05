// Layer 5 — Reference architecture patterns used as few-shot anchors for generation.

export interface ReferenceArchitecture {
  key: string;
  name: string;
  components: string[];
  mermaid: string;
}

export const REFERENCE_ARCHITECTURES: ReferenceArchitecture[] = [
  {
    key: "rag-pipeline",
    name: "Enterprise RAG Pipeline",
    components: ["Document Sources", "Chunking Pipeline", "Embedding Model", "Vector Database", "Hybrid Retriever", "LLM", "Guardrails", "API Layer", "Frontend"],
    mermaid: `flowchart LR
  DS[Document Sources] --> CH[Chunking Pipeline]
  CH --> EM[Embedding Model]
  EM --> VDB[(Vector Database)]
  U[User] --> FE[Frontend]
  FE --> API[API Layer]
  API --> RET[Hybrid Retriever]
  RET --> VDB
  RET --> LLM[LLM]
  LLM --> GR[Guardrails]
  GR --> API`,
  },
  {
    key: "customer-service-agent",
    name: "Customer Service AI Agent",
    components: ["CRM", "Knowledge Base", "RAG Retriever", "AI Agent", "Tool Layer", "Guardrails", "Human Escalation"],
    mermaid: `flowchart LR
  U[Customer] --> CH[Chat/Voice Channel]
  CH --> AG[AI Agent]
  AG --> RET[RAG Retriever]
  RET --> KB[(Knowledge Base)]
  AG --> TL[Tool Layer]
  TL --> CRM[(CRM)]
  AG --> GR[Guardrails]
  GR -->|low confidence| HE[Human Escalation]`,
  },
  {
    key: "document-ai",
    name: "Document AI Processing Pipeline",
    components: ["Intake Channel", "OCR Engine", "LLM Extraction", "Validation Rules", "Human Review Queue", "System of Record", "Audit Log"],
    mermaid: `flowchart LR
  IN[Intake: Email/Scan/Upload] --> OCR[OCR Engine]
  OCR --> EX[LLM Extraction]
  EX --> VAL{Validation Rules}
  VAL -->|pass| SOR[(System of Record)]
  VAL -->|fail/low confidence| HR[Human Review Queue]
  HR --> SOR
  SOR --> AUD[(Audit Log)]`,
  },
];
