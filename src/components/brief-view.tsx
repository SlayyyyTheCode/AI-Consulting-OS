import type { Brief } from "@/lib/ai/schemas";
import { Card } from "@/components/ui";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</h3>
      <div className="mt-1 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  if (!items?.length) return <p className="text-muted">—</p>;
  return (
    <ul className="list-disc space-y-0.5 pl-4">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function BriefView({ brief }: { brief: Brief | null }) {
  if (!brief) {
    return (
      <Card className="!p-4">
        <p className="text-sm text-text-secondary">
          No brief yet. Run the interview, then click{" "}
          <span className="font-medium text-text">Complete discovery</span> to extract a
          structured engagement brief.
        </p>
      </Card>
    );
  }
  return (
    <Card className="space-y-4 !p-4">
      <Section label="Problem statement">{brief.problemStatement}</Section>
      <Section label="Why AI">{brief.whyAI}</Section>
      <Section label="Current state">{brief.currentState}</Section>
      <Section label="Future state">{brief.futureState}</Section>
      <Section label="Business objectives">
        <List items={brief.businessObjectives} />
      </Section>
      <Section label="Success metrics">
        <List items={brief.successMetrics} />
      </Section>
      <Section label="Constraints">
        <List items={brief.constraints} />
      </Section>
      <Section label="Stakeholders">
        <List items={brief.stakeholders} />
      </Section>
      <Section label="Compliance">
        <List items={brief.compliance} />
      </Section>
      <div className="grid grid-cols-2 gap-4">
        <Section label="Timeline">{brief.timeline}</Section>
        <Section label="Budget">{brief.budget}</Section>
      </div>
    </Card>
  );
}
