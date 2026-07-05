// Layer 6 — Deliverable Generator templates.
// `structure` guides Claude's generation; every deliverable follows Pyramid Principle (SCQA lead).

export interface DeliverableTemplate {
  key: string;
  name: string;
  category: "Discovery" | "Assessment" | "Strategy" | "Architecture" | "Implementation" | "Deployment" | "Operations";
  description: string;
  structure: string[];
}

export const DELIVERABLE_TEMPLATES: DeliverableTemplate[] = [
  {
    key: "meeting-minutes",
    name: "Meeting Minutes",
    category: "Discovery",
    description: "Structured record of a client meeting with decisions and actions.",
    structure: ["Attendees & Date", "Agenda", "Key Discussion Points", "Decisions Made", "Action Items (owner, due date)", "Open Questions"],
  },
  {
    key: "stakeholder-register",
    name: "Stakeholder Register",
    category: "Discovery",
    description: "Stakeholder map with influence, interest, and engagement strategy.",
    structure: ["Stakeholder Table (name, role, influence, interest, stance)", "Power/Interest Grid Summary", "Engagement Strategy per Quadrant", "Communication Plan"],
  },
  {
    key: "raid-log",
    name: "RAID Log",
    category: "Discovery",
    description: "Risks, Assumptions, Issues, Dependencies register.",
    structure: ["Risks (description, likelihood, impact, mitigation, owner)", "Assumptions", "Issues", "Dependencies"],
  },
  {
    key: "workshop-notes",
    name: "Workshop Notes",
    category: "Discovery",
    description: "Synthesis of a discovery/design workshop.",
    structure: ["Workshop Objective", "Participants", "Key Findings", "Themes & Insights", "Parking Lot", "Next Steps"],
  },
  {
    key: "ai-readiness-report",
    name: "AI Readiness Report",
    category: "Assessment",
    description: "Assessment of organizational readiness for AI across key dimensions.",
    structure: ["Executive Summary (SCQA)", "Readiness Scorecard (Data, Talent, Infrastructure, Governance, Culture)", "Key Findings per Dimension", "Gap Summary", "Prioritized Recommendations", "Roadmap"],
  },
  {
    key: "gap-analysis",
    name: "Gap Analysis",
    category: "Assessment",
    description: "Current vs target state gaps with closure plan.",
    structure: ["Executive Summary", "Current State", "Target State", "Gap Table (dimension, current, target, gap, priority)", "Closure Plan"],
  },
  {
    key: "swot",
    name: "SWOT Analysis",
    category: "Assessment",
    description: "Strengths, Weaknesses, Opportunities, Threats for the AI initiative.",
    structure: ["Context", "Strengths", "Weaknesses", "Opportunities", "Threats", "Strategic Implications"],
  },
  {
    key: "recommendations-report",
    name: "Recommendations Report",
    category: "Strategy",
    description: "Prioritized recommendations with rationale and roadmap.",
    structure: ["Executive Summary (SCQA)", "Approach & Methodology", "Findings", "Recommendations (prioritized, with rationale and effort/impact)", "Options Considered & Rejected", "Roadmap", "Risks"],
  },
  {
    key: "governance-charter",
    name: "AI Governance Charter",
    category: "Strategy",
    description: "Charter establishing AI governance roles, policies, and review processes.",
    structure: ["Purpose & Scope", "Governance Principles (aligned to NIST AI RMF / ISO 42001)", "Roles & Responsibilities (RACI)", "Review Board & Approval Gates", "Risk Management Process", "Policy Framework", "Metrics & Reporting"],
  },
  {
    key: "solution-design",
    name: "Solution Design Document",
    category: "Architecture",
    description: "Complete solution architecture: components, data flow, integrations, NFRs.",
    structure: ["Executive Summary", "Business Context & Requirements", "Solution Overview", "Component Architecture", "Data Flow", "Integration Design", "Technology Stack", "Non-Functional Requirements", "Security Considerations", "Open Decisions"],
  },
  {
    key: "security-design",
    name: "Security Design Document",
    category: "Architecture",
    description: "Security architecture including AI-specific guardrails and threat model.",
    structure: ["Security Objectives", "Threat Model (STRIDE + AI-specific: prompt injection, data leakage, model abuse)", "Identity & Access", "Data Protection & PII Handling", "LLM Guardrails (input/output filtering, grounding, rate limits)", "Audit & Logging", "Compliance Mapping"],
  },
  {
    key: "api-design",
    name: "API Design Document",
    category: "Architecture",
    description: "API contracts, authentication, versioning, and error handling.",
    structure: ["API Overview", "Authentication & Authorization", "Endpoint Specifications", "Data Models", "Error Handling", "Rate Limiting & Quotas", "Versioning Strategy"],
  },
  {
    key: "project-plan",
    name: "Project Plan",
    category: "Implementation",
    description: "Phased delivery plan with milestones, resources, and dependencies.",
    structure: ["Executive Summary", "Scope & Objectives", "Phases & Milestones", "Workstreams", "Team & Resource Plan", "Dependencies", "Risk Management", "Communication Plan"],
  },
  {
    key: "sprint-plan",
    name: "Sprint Plan",
    category: "Implementation",
    description: "Sprint-level backlog with goals and acceptance criteria.",
    structure: ["Sprint Goal", "Backlog Items (story, acceptance criteria, estimate)", "Capacity", "Definition of Done", "Risks & Blockers"],
  },
  {
    key: "test-plan",
    name: "Test Plan",
    category: "Implementation",
    description: "Testing strategy including AI evaluation approach.",
    structure: ["Test Strategy", "Functional Test Scenarios", "AI Evaluation Plan (golden datasets, eval metrics, thresholds)", "Non-Functional Testing (load, security)", "Red-Teaming Approach", "Entry/Exit Criteria", "Defect Management"],
  },
  {
    key: "uat-plan",
    name: "UAT Plan",
    category: "Implementation",
    description: "User acceptance testing plan with scenarios and sign-off criteria.",
    structure: ["UAT Objectives", "Participants & Roles", "Test Scenarios", "Schedule", "Defect Triage Process", "Sign-off Criteria"],
  },
  {
    key: "sop",
    name: "Standard Operating Procedure",
    category: "Deployment",
    description: "Step-by-step operating procedure for a business process using the AI solution.",
    structure: ["Purpose", "Scope", "Roles", "Procedure Steps", "Exception Handling", "Escalation Path", "Revision History"],
  },
  {
    key: "runbook",
    name: "Operations Runbook",
    category: "Deployment",
    description: "Operational runbook: monitoring, incident response, routine maintenance.",
    structure: ["System Overview", "Monitoring & Alerts", "Common Incidents & Resolutions", "Escalation Matrix", "Routine Maintenance Tasks", "Disaster Recovery Steps", "Contact List"],
  },
  {
    key: "training-plan",
    name: "Training Plan",
    category: "Deployment",
    description: "Enablement plan for end users and administrators.",
    structure: ["Training Objectives", "Audience Segments", "Curriculum & Modules", "Delivery Format & Schedule", "Materials", "Assessment & Certification", "Success Metrics"],
  },
  {
    key: "sla",
    name: "Service Level Agreement",
    category: "Operations",
    description: "SLA defining service levels, support tiers, and remedies.",
    structure: ["Service Description", "Service Levels (availability, response, resolution)", "Support Tiers & Hours", "AI-Specific SLOs (quality score, latency, grounding rate)", "Reporting", "Escalation", "Remedies"],
  },
  {
    key: "monitoring-plan",
    name: "Monitoring Plan",
    category: "Operations",
    description: "Observability plan: metrics, dashboards, alert thresholds.",
    structure: ["Monitoring Objectives", "SLIs & SLOs", "AI Quality Metrics (hallucination rate, grounding, user feedback)", "Cost Metrics (tokens, GPU)", "Dashboards", "Alerting Rules", "Review Cadence"],
  },
  {
    key: "ci-report",
    name: "Continuous Improvement Report",
    category: "Operations",
    description: "Quarterly review of impact, quality, and improvement backlog.",
    structure: ["Executive Summary", "KPI Performance vs Targets", "Adoption & Satisfaction Trends", "Cost & ROI Analysis", "Model/Prompt Quality Trends", "Improvement Backlog", "Lessons Learned"],
  },
  {
    key: "proposal",
    name: "Engagement Proposal",
    category: "Discovery",
    description: "Client-facing proposal: understanding, approach, team, commercials skeleton.",
    structure: ["Executive Summary (SCQA)", "Our Understanding of Your Situation", "Proposed Approach & Methodology", "Scope & Deliverables", "Timeline & Milestones", "Team", "Why Us", "Assumptions & Dependencies"],
  },
];
