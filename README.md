# AI Consulting Operating System (Consulting OS)

An AI-powered Consulting Operating System that transforms a business problem into a complete, enterprise-ready AI consulting engagement — guiding consultants through discovery, strategy, solution design, implementation, governance, operations, and continuous improvement using McKinsey-style structured problem solving (MECE issue trees, hypothesis-driven analysis, SCQA/Pyramid Principle deliverables) and responsible AI principles.

## Features (Phase 1)

- **AI Discovery Interview** — streaming chat with a McKinsey-trained AI interviewer; extracts a structured engagement brief (problem statement, current/future state, objectives, constraints, success metrics, stakeholders, timeline, budget, compliance)
- **Business Problem Classification** — MECE classification into the firm taxonomy + issue tree
- **Decision Engine Recommendations** — methodologies, AI use cases (ranked with confidence), industry accelerator, team composition, risks, and explicitly *not recommended* options with rationale
- **Solution Architecture** — AI-generated reference architecture with components, data flow, tech stack, and Mermaid system diagram
- **Project Lifecycle Orchestration** — 14 phases (Sales → Continuous Improvement) with objectives, exit-criteria gating, risks, and KPIs
- **Deliverable Generator** — 23 client-ready templates (RAID, AI Readiness Report, Solution Design, Runbook, SLA…) written with the Pyramid Principle, versioned and editable
- **Governance & Responsible AI** — per-engagement checklist across NIST AI RMF, ISO/IEC 42001/23894/27001, Responsible AI principles, LLM and agentic guardrails; risk register
- **Knowledge Repository** — browsable firm knowledge base powering the decision engine
- **Team & RBAC** — admin / consultant / viewer roles

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Drizzle ORM · Neon (Vercel Postgres) · Auth.js v5 · Anthropic Claude API (Sonnet 5 + Haiku 4.5) · Mermaid

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env.local` and fill in:

   | Variable | Where to get it |
   |---|---|
   | `DATABASE_URL` | Neon / Vercel Postgres connection string |
   | `ANTHROPIC_API_KEY` | https://console.anthropic.com |
   | `AUTH_SECRET` | `npx auth secret` |

3. **Database** — push the schema:

   ```bash
   npx drizzle-kit push
   ```

4. **Run**

   ```bash
   npm run dev
   ```

   The first registered user becomes **admin**.

## Deploy (Vercel)

1. Import the GitHub repo in Vercel.
2. Add the three environment variables in Project Settings → Environment Variables.
3. Deploy. Run `npx drizzle-kit push` locally against the production `DATABASE_URL` (or use Neon's console) to create tables.

## Roadmap (Phase 2+)

RAG knowledge repository (pgvector), lessons-learned capture, operations & managed-AI engine, FinOps dashboards, multi-agent orchestration, PDF/DOCX export, SSO.
