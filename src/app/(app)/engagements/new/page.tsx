import { createEngagement } from "@/lib/actions";
import { INDUSTRY_ACCELERATORS } from "@/lib/knowledge/accelerators";
import { Card, PageHeader, Button, Field, inputClass } from "@/components/ui";

export default function NewEngagementPage() {
  return (
    <>
      <PageHeader
        title="New engagement"
        description="Create the engagement, then run the AI discovery interview."
      />
      <Card className="max-w-lg">
        <form action={createEngagement} className="flex flex-col gap-4">
          <Field label="Engagement title" htmlFor="title" helper='e.g. "AI-Powered Claims Processing Transformation"'>
            <input id="title" name="title" required className={inputClass} />
          </Field>
          <Field label="Client name" htmlFor="clientName">
            <input id="clientName" name="clientName" required className={inputClass} />
          </Field>
          <Field label="Industry" htmlFor="industry">
            <select id="industry" name="industry" required className={inputClass} defaultValue="">
              <option value="" disabled>
                Select industry
              </option>
              {INDUSTRY_ACCELERATORS.map((i) => (
                <option key={i.key} value={i.name}>
                  {i.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </Field>
          <Button type="submit" className="mt-2 self-start">
            Create engagement
          </Button>
        </form>
      </Card>
    </>
  );
}
