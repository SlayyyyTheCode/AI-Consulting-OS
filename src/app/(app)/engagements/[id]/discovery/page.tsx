import { getDiscovery } from "@/lib/db/queries";
import type { Brief } from "@/lib/ai/schemas";
import { DiscoveryChat } from "@/components/discovery-chat";
import { BriefView } from "@/components/brief-view";

export const dynamic = "force-dynamic";

export default async function DiscoveryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const discovery = await getDiscovery(id);
  const messages = (discovery?.messages ?? []) as { role: "user" | "assistant"; content: string }[];
  const brief = (discovery?.extractedBrief ?? null) as Brief | null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,380px)]">
      <DiscoveryChat engagementId={id} initialMessages={messages} briefExists={!!brief} />
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Engagement brief
        </h2>
        <BriefView brief={brief} />
      </div>
    </div>
  );
}
