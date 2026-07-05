import { METHODOLOGIES } from "@/lib/knowledge/methodologies";
import { AI_USE_CASES } from "@/lib/knowledge/use-cases";
import { INDUSTRY_ACCELERATORS } from "@/lib/knowledge/accelerators";
import { DELIVERABLE_TEMPLATES } from "@/lib/knowledge/deliverable-templates";
import { Card, PageHeader, Badge } from "@/components/ui";

const methodCategories = [...new Set(METHODOLOGIES.map((m) => m.category))];

export default function KnowledgePage() {
  return (
    <>
      <PageHeader
        title="Knowledge Repository"
        description="Firm methodologies, AI use cases, industry accelerators, and deliverable templates that power the decision engine."
      />

      <div className="space-y-10">
        <section id="methodologies">
          <h2 className="mb-3 text-lg font-semibold">Methodologies</h2>
          {methodCategories.map((cat) => (
            <div key={cat} className="mb-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                {cat}
              </h3>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {METHODOLOGIES.filter((m) => m.category === cat).map((m) => (
                  <Card key={m.key} className="!p-4">
                    <h4 className="font-semibold">{m.name}</h4>
                    <p className="mt-1 text-sm text-text-secondary">{m.description}</p>
                    <p className="mt-2 text-xs text-muted">
                      <span className="font-medium">When:</span> {m.whenToUse}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.outputs.map((o) => (
                        <Badge key={o}>{o}</Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section id="use-cases">
          <h2 className="mb-3 text-lg font-semibold">AI Use Cases</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {AI_USE_CASES.map((u) => (
              <Card key={u.key} className="!p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold">{u.name}</h4>
                  <Badge
                    tone={u.complexity === "High" ? "error" : u.complexity === "Medium" ? "warning" : "success"}
                  >
                    {u.complexity}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-text-secondary">{u.description}</p>
                <p className="mt-2 text-xs text-muted">
                  <span className="font-medium">Best for:</span> {u.bestFor}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {u.technologies.map((t) => (
                    <Badge key={t} tone="info">
                      {t}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="accelerators">
          <h2 className="mb-3 text-lg font-semibold">Industry Accelerators</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {INDUSTRY_ACCELERATORS.map((a) => (
              <Card key={a.key} className="!p-4">
                <h4 className="font-semibold">{a.name}</h4>
                <dl className="mt-2 space-y-2 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                      Common problems
                    </dt>
                    <dd className="mt-0.5 text-text-secondary">{a.commonProblems.join("; ")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                      Regulations
                    </dt>
                    <dd className="mt-0.5 flex flex-wrap gap-1">
                      {a.regulations.map((r) => (
                        <Badge key={r} tone="warning">
                          {r}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">KPIs</dt>
                    <dd className="mt-0.5 text-text-secondary">{a.kpis.join(" · ")}</dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>
        </section>

        <section id="templates">
          <h2 className="mb-3 text-lg font-semibold">
            Deliverable Templates ({DELIVERABLE_TEMPLATES.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {DELIVERABLE_TEMPLATES.map((t) => (
              <Card key={t.key} className="!p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold">{t.name}</h4>
                  <Badge tone="accent">{t.category}</Badge>
                </div>
                <p className="mt-1 text-sm text-text-secondary">{t.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
