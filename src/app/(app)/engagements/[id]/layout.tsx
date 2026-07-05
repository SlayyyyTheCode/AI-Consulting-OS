import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getEngagement } from "@/lib/db/queries";
import { LIFECYCLE_PHASES } from "@/lib/knowledge/lifecycle";
import { Badge } from "@/components/ui";
import { EngagementTabs } from "@/components/engagement-tabs";

export default async function EngagementLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const engagement = await getEngagement(id);
  if (!engagement) notFound();

  const phaseName =
    LIFECYCLE_PHASES.find((p) => p.key === engagement.currentPhase)?.name ??
    engagement.currentPhase;

  return (
    <>
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">{engagement.title}</h1>
          <Badge tone={engagement.status === "active" ? "success" : "neutral"}>
            {engagement.status.replace("_", " ")}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          {engagement.clientName} · {engagement.industry} · Phase: {phaseName}
        </p>
      </div>
      <EngagementTabs engagementId={id} />
      <div className="mt-6">{children}</div>
    </>
  );
}
