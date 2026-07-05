import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { deliverables } from "@/lib/db/schema";
import { DELIVERABLE_TEMPLATES } from "@/lib/knowledge/deliverable-templates";
import { Card, PageHeader, Badge, EmptyState } from "@/components/ui";
import { DeliverableGenerator } from "@/components/deliverable-generator";

export const dynamic = "force-dynamic";

const statusTone = { draft: "neutral", in_review: "warning", final: "success" } as const;

export default async function DeliverablesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const docs = await db
    .select()
    .from(deliverables)
    .where(eq(deliverables.engagementId, id))
    .orderBy(desc(deliverables.updatedAt));

  const templateName = (key: string) =>
    DELIVERABLE_TEMPLATES.find((t) => t.key === key)?.name ?? key;

  return (
    <>
      <PageHeader
        title="Deliverables"
        description="Generate client-ready documents from firm templates, grounded in this engagement's context."
      />
      <DeliverableGenerator engagementId={id} />

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted">
        Document library ({docs.length})
      </h2>
      {docs.length === 0 ? (
        <EmptyState
          icon="▤"
          title="No deliverables yet"
          description="Pick a template above — the generator pulls the discovery brief, classification, and recommendations into a structured, SCQA-led document."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {docs.map((d) => (
            <Link key={d.id} href={`/engagements/${id}/deliverables/${d.id}`} className="group">
              <Card className="h-full !p-4 transition-shadow duration-150 group-hover:shadow-lg">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{d.title}</h3>
                  <Badge tone={statusTone[d.status]}>{d.status.replace("_", " ")}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {templateName(d.templateKey)} · v{d.version} · Updated{" "}
                  {new Date(d.updatedAt).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
