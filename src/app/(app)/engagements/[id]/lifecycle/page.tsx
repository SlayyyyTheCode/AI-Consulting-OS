import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { lifecyclePhases } from "@/lib/db/schema";
import { LIFECYCLE_PHASES } from "@/lib/knowledge/lifecycle";
import { PageHeader } from "@/components/ui";
import { PhaseCard } from "@/components/phase-card";

export const dynamic = "force-dynamic";

export default async function LifecyclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const phases = await db
    .select()
    .from(lifecyclePhases)
    .where(eq(lifecyclePhases.engagementId, id));

  const byKey = new Map(phases.map((p) => [p.phaseKey, p]));
  const completedCount = phases.filter((p) => p.status === "completed").length;

  return (
    <>
      <PageHeader
        title="Project Lifecycle"
        description={`${completedCount} of ${LIFECYCLE_PHASES.length} phases completed. Each phase has objectives, deliverables, exit criteria, risks, and KPIs.`}
      />
      <ol className="space-y-3">
        {LIFECYCLE_PHASES.map((def) => {
          const state = byKey.get(def.key);
          return (
            <li key={def.key}>
              <PhaseCard
                engagementId={id}
                def={def}
                status={state?.status ?? "not_started"}
                exitCriteria={
                  (state?.exitCriteria as { text: string; done: boolean }[]) ??
                  def.exitCriteria.map((c) => ({ text: c, done: false }))
                }
              />
            </li>
          );
        })}
      </ol>
    </>
  );
}
