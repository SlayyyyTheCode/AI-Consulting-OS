// Layer 3 — Methodology Recommendation Engine knowledge base.

export interface Methodology {
  key: string;
  name: string;
  category: "AI Strategy" | "Process Improvement" | "Architecture" | "Cloud" | "Problem Solving";
  description: string;
  whenToUse: string;
  outputs: string[];
}

export const METHODOLOGIES: Methodology[] = [
  // Problem Solving (McKinsey core)
  {
    key: "seven-step",
    name: "7-Step Problem Solving",
    category: "Problem Solving",
    description: "McKinsey structured problem solving: define, disaggregate, prioritize, plan, analyze, synthesize, communicate.",
    whenToUse: "Every engagement — the backbone for structuring any ambiguous business problem.",
    outputs: ["Problem Statement", "Issue Tree", "Workplan", "Synthesis"],
  },
  {
    key: "mece-issue-tree",
    name: "MECE Issue Tree",
    category: "Problem Solving",
    description: "Mutually exclusive, collectively exhaustive decomposition of a problem into root causes and opportunity branches.",
    whenToUse: "Early discovery when the problem space is broad or entangled.",
    outputs: ["Issue Tree", "Hypothesis Map"],
  },
  {
    key: "hypothesis-driven",
    name: "Hypothesis-Driven Analysis",
    category: "Problem Solving",
    description: "Form an answer-first hypothesis, then design analyses to prove or disprove it fast.",
    whenToUse: "When time-boxed and stakeholders need direction quickly.",
    outputs: ["Hypothesis Statement", "Analysis Plan", "Findings Deck"],
  },
  {
    key: "pyramid-principle",
    name: "Pyramid Principle (SCQA)",
    category: "Problem Solving",
    description: "Top-down communication: Situation, Complication, Question, Answer — grouping supporting arguments beneath a governing thought.",
    whenToUse: "All deliverables and executive communication.",
    outputs: ["Executive Summary", "Storyline", "Final Report"],
  },
  // AI Strategy
  {
    key: "ai-readiness",
    name: "AI Readiness Assessment",
    category: "AI Strategy",
    description: "Assess data, talent, infrastructure, governance, and culture readiness for AI adoption.",
    whenToUse: "Before committing to AI investment; first AI initiative for the org.",
    outputs: ["AI Readiness Report", "Gap Analysis", "Roadmap"],
  },
  {
    key: "ai-maturity",
    name: "AI Maturity Model",
    category: "AI Strategy",
    description: "Score organization across maturity dimensions (data, MLOps, governance, adoption) and chart progression path.",
    whenToUse: "Multi-year AI strategy or portfolio prioritization.",
    outputs: ["Maturity Scorecard", "Capability Roadmap"],
  },
  {
    key: "ai-governance",
    name: "AI Governance Framework",
    category: "AI Strategy",
    description: "Establish policies, roles, review boards, and controls for responsible AI (NIST AI RMF / ISO 42001 aligned).",
    whenToUse: "Any production AI; mandatory in regulated industries.",
    outputs: ["AI Governance Charter", "Responsible AI Policy", "AI Risk Register"],
  },
  // Process Improvement
  {
    key: "as-is-to-be",
    name: "As-Is / To-Be Analysis",
    category: "Process Improvement",
    description: "Document current-state process, design future state, quantify the delta.",
    whenToUse: "Process transformation with AI insertion points.",
    outputs: ["Current State Map", "Future State Map", "Gap Analysis"],
  },
  {
    key: "sipoc",
    name: "SIPOC",
    category: "Process Improvement",
    description: "Suppliers, Inputs, Process, Outputs, Customers — high-level process scoping.",
    whenToUse: "Kick-off workshops to bound a process quickly.",
    outputs: ["SIPOC Diagram"],
  },
  {
    key: "bpmn",
    name: "BPMN Process Modeling",
    category: "Process Improvement",
    description: "Standard notation for detailed process flows including gateways, events, and swim lanes.",
    whenToUse: "When automation requires precise process specification.",
    outputs: ["BPMN Diagrams", "Process Specification"],
  },
  {
    key: "process-mining",
    name: "Process Mining",
    category: "Process Improvement",
    description: "Derive real process flows from event logs to find bottlenecks and deviations.",
    whenToUse: "High-volume digital processes with system logs available.",
    outputs: ["Process Discovery Report", "Bottleneck Analysis"],
  },
  {
    key: "lean",
    name: "Lean",
    category: "Process Improvement",
    description: "Eliminate waste (muda) and maximize value-adding steps.",
    whenToUse: "Efficiency-driven engagements before automating waste.",
    outputs: ["Waste Analysis", "Kaizen Plan"],
  },
  {
    key: "six-sigma",
    name: "Six Sigma (DMAIC)",
    category: "Process Improvement",
    description: "Define, Measure, Analyze, Improve, Control — statistical quality improvement.",
    whenToUse: "Quality/defect problems with measurable outputs.",
    outputs: ["DMAIC Report", "Control Plan"],
  },
  {
    key: "rca",
    name: "Root Cause Analysis",
    category: "Process Improvement",
    description: "5 Whys / fishbone analysis to isolate underlying causes.",
    whenToUse: "Recurring failures or incidents.",
    outputs: ["RCA Report", "Corrective Actions"],
  },
  {
    key: "vsm",
    name: "Value Stream Mapping",
    category: "Process Improvement",
    description: "Map material/information flow end-to-end, expose lead time vs value-added time.",
    whenToUse: "End-to-end flow optimization across teams.",
    outputs: ["Value Stream Map", "Future State VSM"],
  },
  {
    key: "raci",
    name: "RACI",
    category: "Process Improvement",
    description: "Responsible, Accountable, Consulted, Informed role mapping.",
    whenToUse: "Governance setup and any cross-functional delivery.",
    outputs: ["RACI Matrix"],
  },
  // Architecture
  {
    key: "togaf",
    name: "TOGAF (ADM)",
    category: "Architecture",
    description: "Enterprise architecture development method spanning business, data, application, and technology architecture.",
    whenToUse: "Enterprise-scale, multi-system AI programs.",
    outputs: ["Architecture Vision", "Target Architecture", "Roadmap"],
  },
  {
    key: "ddd",
    name: "Domain-Driven Design",
    category: "Architecture",
    description: "Model software around business domains with bounded contexts and ubiquitous language.",
    whenToUse: "Complex domain logic; custom platform builds.",
    outputs: ["Domain Model", "Context Map"],
  },
  {
    key: "event-storming",
    name: "Event Storming",
    category: "Architecture",
    description: "Workshop technique mapping domain events, commands, and aggregates with stakeholders.",
    whenToUse: "Fast collaborative domain discovery before design.",
    outputs: ["Event Map", "Bounded Contexts"],
  },
  // Cloud
  {
    key: "caf",
    name: "Cloud Adoption Framework",
    category: "Cloud",
    description: "Vendor CAF (AWS/Azure/GCP) covering strategy, readiness, migration, governance.",
    whenToUse: "Cloud migration or first cloud-native AI workload.",
    outputs: ["Adoption Plan", "Readiness Assessment"],
  },
  {
    key: "landing-zone",
    name: "Landing Zone",
    category: "Cloud",
    description: "Pre-configured secure multi-account cloud foundation: identity, network, guardrails.",
    whenToUse: "Before deploying production AI workloads to cloud.",
    outputs: ["Landing Zone Design", "IaC Templates"],
  },
  {
    key: "devops",
    name: "DevOps / MLOps",
    category: "Cloud",
    description: "CI/CD, automated testing, model deployment pipelines, monitoring.",
    whenToUse: "Any implementation phase; mandatory for production AI.",
    outputs: ["Pipeline Design", "Deployment Runbook"],
  },
  {
    key: "platform-engineering",
    name: "Platform Engineering",
    category: "Cloud",
    description: "Internal developer platform with golden paths, self-service infra, paved-road AI services.",
    whenToUse: "Scaling AI across many teams.",
    outputs: ["Platform Blueprint", "Golden Path Templates"],
  },
];
