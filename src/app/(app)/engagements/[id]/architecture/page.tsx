import { getArchitecture, getRecommendation } from "@/lib/db/queries";
import { Card, PageHeader, Badge, EmptyState } from "@/components/ui";
import { RunButton } from "@/components/run-button";
import { MermaidDiagram } from "@/components/mermaid-diagram";

export const dynamic = "force-dynamic";

interface Component {
  name: string;
  responsibility: string;
}

export default async function ArchitecturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [architecture, recommendation] = await Promise.all([
    getArchitecture(id),
    getRecommendation(id),
  ]);

  return (
    <>
      <PageHeader
        title="Solution Architecture"
        description="AI-generated reference architecture grounded in the brief, classification, and recommendations."
        actions={
          recommendation ? (
            <RunButton
              endpoint="/api/ai/architecture"
              engagementId={id}
              label="Generate architecture"
              rerunLabel="Regenerate"
              hasResult={!!architecture}
            />
          ) : undefined
        }
      />

      {!recommendation ? (
        <EmptyState
          icon="⬡"
          title="Recommendations required"
          description="Generate recommendations first — the architecture is designed around the selected use cases."
        />
      ) : !architecture ? (
        <EmptyState
          icon="⬡"
          title="No architecture yet"
          description="Generate a reference architecture with components, data flow, tech stack, and a system diagram."
        />
      ) : (
        <div className="space-y-6">
          <Card>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
              Summary
            </h2>
            <p className="text-sm leading-relaxed">{architecture.summary}</p>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              System diagram
            </h2>
            <MermaidDiagram chart={architecture.mermaidDiagram} />
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Components
              </h2>
              <ul className="space-y-2.5">
                {(architecture.components as Component[]).map((c, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-text-secondary"> — {c.responsibility}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <div className="space-y-6">
              <Card>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                  Data flow
                </h2>
                <ol className="list-decimal space-y-1.5 pl-5 text-sm">
                  {(architecture.dataFlow as string[]).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </Card>
              <Card>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                  Technology stack
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {(architecture.techStack as string[]).map((t, i) => (
                    <Badge key={i} tone="info">
                      {t}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
