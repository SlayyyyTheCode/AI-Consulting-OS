import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { governanceChecks, riskRegister } from "@/lib/db/schema";
import { PageHeader } from "@/components/ui";
import { GovernanceChecklist } from "@/components/governance-checklist";
import { RiskRegisterTable } from "@/components/risk-register";

export const dynamic = "force-dynamic";

export default async function GovernancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [checks, risks] = await Promise.all([
    db.select().from(governanceChecks).where(eq(governanceChecks.engagementId, id)),
    db.select().from(riskRegister).where(eq(riskRegister.engagementId, id)),
  ]);

  const done = checks.filter((c) => c.status === "compliant" || c.status === "not_applicable").length;

  return (
    <>
      <PageHeader
        title="Governance & Responsible AI"
        description={`${done} of ${checks.length} governance items addressed. Frameworks: NIST AI RMF, ISO/IEC 42001, 23894, 27001, Responsible AI, LLM & Agentic guardrails.`}
      />
      <div className="space-y-8">
        <GovernanceChecklist
          engagementId={id}
          checks={checks.map((c) => ({
            id: c.id,
            framework: c.framework,
            item: c.item,
            status: c.status,
          }))}
        />
        <RiskRegisterTable
          engagementId={id}
          risks={risks.map((r) => ({
            id: r.id,
            risk: r.risk,
            category: r.category,
            likelihood: r.likelihood,
            impact: r.impact,
            mitigation: r.mitigation,
            status: r.status,
          }))}
        />
      </div>
    </>
  );
}
