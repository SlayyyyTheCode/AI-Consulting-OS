import { getClassification, getDiscovery } from "@/lib/db/queries";
import type { IssueTreeNode } from "@/lib/ai/schemas";
import { Card, PageHeader, Badge, EmptyState } from "@/components/ui";
import { RunButton } from "@/components/run-button";

export const dynamic = "force-dynamic";

function IssueTree({ node, depth = 0 }: { node: IssueTreeNode; depth?: number }) {
  return (
    <div className={depth > 0 ? "ml-5 border-l border-border pl-4" : ""}>
      <p className={`py-1 text-sm ${depth === 0 ? "font-semibold" : depth === 1 ? "font-medium" : "text-text-secondary"}`}>
        {node.label}
      </p>
      {node.children?.map((child, i) => (
        <IssueTree key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default async function ClassificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [classification, discovery] = await Promise.all([
    getClassification(id),
    getDiscovery(id),
  ]);
  const briefReady = !!discovery?.extractedBrief;

  return (
    <>
      <PageHeader
        title="Business Problem Classification"
        description="MECE classification of the engagement into domain, function, pain points, and issue tree."
        actions={
          briefReady ? (
            <RunButton
              endpoint="/api/ai/classify"
              engagementId={id}
              label="Run classification"
              rerunLabel="Re-run classification"
              hasResult={!!classification}
            />
          ) : undefined
        }
      />

      {!briefReady ? (
        <EmptyState
          icon="▤"
          title="Discovery brief required"
          description="Complete the discovery interview and extract a brief before classifying the problem."
        />
      ) : !classification ? (
        <EmptyState
          icon="▤"
          title="Not classified yet"
          description="Run classification to map the problem to the firm taxonomy and generate a MECE issue tree."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Classification
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">Domain</dt>
                <dd className="mt-0.5 font-medium">
                  {classification.domain} <span className="text-muted">›</span>{" "}
                  {classification.subDomain}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Business function
                </dt>
                <dd className="mt-0.5">{classification.businessFunction}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">Pain points</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {(classification.painPoints as string[]).map((p, i) => (
                    <Badge key={i} tone="error">
                      {p}
                    </Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Opportunity areas
                </dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {(classification.opportunityAreas as string[]).map((o, i) => (
                    <Badge key={i} tone="success">
                      {o}
                    </Badge>
                  ))}
                </dd>
              </div>
            </dl>
          </Card>
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              MECE issue tree
            </h2>
            {classification.issueTree ? (
              <IssueTree node={classification.issueTree as IssueTreeNode} />
            ) : (
              <p className="text-sm text-muted">No issue tree generated.</p>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
