import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { engagements, governanceChecks, deliverables } from "@/lib/db/schema";
import { LIFECYCLE_PHASES } from "@/lib/knowledge/lifecycle";
import { Card, PageHeader, Badge, EmptyState, Button } from "@/components/ui";

export const dynamic = "force-dynamic";

const statusTone = {
  active: "success",
  on_hold: "warning",
  completed: "info",
  archived: "neutral",
} as const;

export default async function DashboardPage() {
  const [allEngagements, govCounts, deliverableCounts] = await Promise.all([
    db.select().from(engagements).orderBy(desc(engagements.updatedAt)),
    db
      .select({
        engagementId: governanceChecks.engagementId,
        total: sql<number>`count(*)::int`,
        done: sql<number>`count(*) filter (where ${governanceChecks.status} in ('compliant','not_applicable'))::int`,
      })
      .from(governanceChecks)
      .groupBy(governanceChecks.engagementId),
    db
      .select({
        engagementId: deliverables.engagementId,
        total: sql<number>`count(*)::int`,
      })
      .from(deliverables)
      .groupBy(deliverables.engagementId),
  ]);

  const govByEngagement = new Map(govCounts.map((g) => [g.engagementId, g]));
  const delByEngagement = new Map(deliverableCounts.map((d) => [d.engagementId, d.total]));

  const active = allEngagements.filter((e) => e.status === "active").length;
  const completed = allEngagements.filter((e) => e.status === "completed").length;
  const totalDeliverables = deliverableCounts.reduce((s, d) => s + d.total, 0);

  const phaseName = (key: string) =>
    LIFECYCLE_PHASES.find((p) => p.key === key)?.name ?? key;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Engagement portfolio across the consulting lifecycle."
        actions={
          <Link href="/engagements/new">
            <Button>New engagement</Button>
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Active engagements", value: active },
          { label: "Completed", value: completed },
          { label: "Total engagements", value: allEngagements.length },
          { label: "Deliverables produced", value: totalDeliverables },
        ].map((kpi) => (
          <Card key={kpi.label} className="!p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {kpi.label}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{kpi.value}</p>
          </Card>
        ))}
      </div>

      {allEngagements.length === 0 ? (
        <EmptyState
          icon="◆"
          title="No engagements yet"
          description="Start your first engagement — the AI discovery interview turns a client problem into a full consulting workplan."
          action={
            <Link href="/engagements/new">
              <Button>Start first engagement</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {allEngagements.map((e) => {
            const gov = govByEngagement.get(e.id);
            const govPct = gov ? Math.round((gov.done / gov.total) * 100) : 0;
            return (
              <Link key={e.id} href={`/engagements/${e.id}/discovery`} className="group">
                <Card className="h-full transition-shadow duration-150 group-hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold">{e.title}</h2>
                      <p className="mt-0.5 text-sm text-text-secondary">
                        {e.clientName} · {e.industry}
                      </p>
                    </div>
                    <Badge tone={statusTone[e.status]}>{e.status.replace("_", " ")}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                    <span>
                      Phase: <span className="font-medium text-text-secondary">{phaseName(e.currentPhase)}</span>
                    </span>
                    <span>{delByEngagement.get(e.id) ?? 0} deliverables</span>
                    <span className="flex items-center gap-1.5">
                      Governance
                      <span
                        className="inline-block h-1.5 w-16 overflow-hidden rounded-full bg-border"
                        role="progressbar"
                        aria-valuenow={govPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Governance ${govPct}% complete`}
                      >
                        <span
                          className="block h-full rounded-full bg-success"
                          style={{ width: `${govPct}%` }}
                        />
                      </span>
                      {govPct}%
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
