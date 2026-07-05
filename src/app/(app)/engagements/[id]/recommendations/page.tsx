import { getRecommendation, getClassification } from "@/lib/db/queries";
import type { Recommendation } from "@/lib/ai/schemas";
import { METHODOLOGIES } from "@/lib/knowledge/methodologies";
import { AI_USE_CASES } from "@/lib/knowledge/use-cases";
import { INDUSTRY_ACCELERATORS } from "@/lib/knowledge/accelerators";
import { Card, PageHeader, Badge, EmptyState } from "@/components/ui";
import { RunButton } from "@/components/run-button";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [recommendation, classification] = await Promise.all([
    getRecommendation(id),
    getClassification(id),
  ]);
  const payload = recommendation?.payload as Recommendation | undefined;

  const methodName = (key: string) => METHODOLOGIES.find((m) => m.key === key)?.name ?? key;
  const useCaseName = (key: string) => AI_USE_CASES.find((u) => u.key === key)?.name ?? key;
  const accelerator = payload
    ? INDUSTRY_ACCELERATORS.find((a) => a.key === payload.acceleratorKey)
    : undefined;

  return (
    <>
      <PageHeader
        title="Recommendations"
        description="Decision engine output: methodologies, AI use cases, industry accelerator, team, risks — and rejected options."
        actions={
          classification ? (
            <RunButton
              endpoint="/api/ai/recommend"
              engagementId={id}
              label="Generate recommendations"
              rerunLabel="Regenerate"
              hasResult={!!payload}
            />
          ) : undefined
        }
      />

      {!classification ? (
        <EmptyState
          icon="◈"
          title="Classification required"
          description="Run business problem classification before generating recommendations."
        />
      ) : !payload ? (
        <EmptyState
          icon="◈"
          title="No recommendations yet"
          description="The decision engine will select methodologies, AI use cases, an industry accelerator, team composition, and risks — with explicit rationale."
        />
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Recommended methodologies
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[...payload.methodologies]
                .sort((a, b) => a.priority - b.priority)
                .map((m) => (
                  <Card key={m.key} className="!p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold">{methodName(m.key)}</h3>
                      <Badge tone="info">P{m.priority}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-text-secondary">{m.rationale}</p>
                  </Card>
                ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Recommended AI use cases
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[...payload.useCases]
                .sort((a, b) => b.confidence - a.confidence)
                .map((u) => (
                  <Card key={u.key} className="!p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold">{useCaseName(u.key)}</h3>
                      <Badge tone={u.confidence >= 70 ? "success" : "warning"}>
                        {u.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-text-secondary">{u.rationale}</p>
                  </Card>
                ))}
            </div>
          </section>

          {accelerator && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Industry accelerator
              </h2>
              <Card className="!p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{accelerator.name}</h3>
                  <Badge tone="accent">Accelerator</Badge>
                </div>
                <p className="mt-1.5 text-sm text-text-secondary">
                  {payload.acceleratorRationale}
                </p>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      Key regulations
                    </p>
                    <p className="mt-1">{accelerator.regulations.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      Benchmark KPIs
                    </p>
                    <p className="mt-1">{accelerator.kpis.join(", ")}</p>
                  </div>
                </div>
              </Card>
            </section>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Recommended team
              </h2>
              <Card className="!p-4">
                <ul className="space-y-2.5">
                  {payload.team.map((t, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium">{t.role}</span>
                      <span className="text-text-secondary"> — {t.rationale}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Not recommended
              </h2>
              <Card className="!p-4">
                <ul className="space-y-2.5">
                  {payload.notRecommended.map((n, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium line-through decoration-error/60">
                        {n.option}
                      </span>
                      <span className="text-text-secondary"> — {n.rationale}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          </div>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Engagement risks (added to risk register)
            </h2>
            <Card className="overflow-x-auto !p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg text-left">
                    <th className="px-4 py-2.5 font-semibold">Risk</th>
                    <th className="px-4 py-2.5 font-semibold">Category</th>
                    <th className="px-4 py-2.5 font-semibold">Mitigation</th>
                  </tr>
                </thead>
                <tbody>
                  {payload.risks.map((r, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5">{r.risk}</td>
                      <td className="px-4 py-2.5">
                        <Badge>{r.category}</Badge>
                      </td>
                      <td className="px-4 py-2.5 text-text-secondary">{r.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>
        </div>
      )}
    </>
  );
}
