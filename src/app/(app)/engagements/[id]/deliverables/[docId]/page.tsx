import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { marked } from "marked";
import { db } from "@/lib/db";
import { deliverables } from "@/lib/db/schema";
import { PageHeader, Badge } from "@/components/ui";
import { DeliverableActions } from "@/components/deliverable-actions";

export const dynamic = "force-dynamic";

const statusTone = { draft: "neutral", in_review: "warning", final: "success" } as const;

export default async function DeliverablePage({
  params,
}: {
  params: Promise<{ id: string; docId: string }>;
}) {
  const { id, docId } = await params;
  const [doc] = await db.select().from(deliverables).where(eq(deliverables.id, docId));
  if (!doc || doc.engagementId !== id) notFound();

  const html = await marked.parse(doc.contentMd);

  return (
    <>
      <PageHeader
        title={doc.title}
        description={`Version ${doc.version} · Updated ${new Date(doc.updatedAt).toLocaleString()}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge tone={statusTone[doc.status]}>{doc.status.replace("_", " ")}</Badge>
          </div>
        }
      />
      <DeliverableActions
        deliverableId={doc.id}
        engagementId={id}
        contentMd={doc.contentMd}
        status={doc.status}
        title={doc.title}
        renderedHtml={html}
      />
    </>
  );
}
