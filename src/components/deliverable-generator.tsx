"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DELIVERABLE_TEMPLATES } from "@/lib/knowledge/deliverable-templates";
import { Card, Button, Spinner, Field, inputClass } from "@/components/ui";

const categories = [...new Set(DELIVERABLE_TEMPLATES.map((t) => t.category))];

export function DeliverableGenerator({ engagementId }: { engagementId: string }) {
  const router = useRouter();
  const [templateKey, setTemplateKey] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = DELIVERABLE_TEMPLATES.find((t) => t.key === templateKey);

  async function generate() {
    if (!templateKey || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/deliverable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ engagementId, templateKey, instructions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      router.push(`/engagements/${engagementId}/deliverables/${data.deliverable.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <Field label="Template" htmlFor="template">
          <select
            id="template"
            value={templateKey}
            onChange={(e) => setTemplateKey(e.target.value)}
            className={inputClass}
          >
            <option value="">Select a template…</option>
            {categories.map((cat) => (
              <optgroup key={cat} label={cat}>
                {DELIVERABLE_TEMPLATES.filter((t) => t.category === cat).map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Extra instructions (optional)" htmlFor="instructions">
          <input
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Focus on the pilot phase"
            className={inputClass}
          />
        </Field>
        <Button onClick={generate} disabled={!templateKey || loading} className="md:mb-0">
          {loading ? (
            <>
              <Spinner /> Generating…
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {selected && (
        <p className="mt-3 text-sm text-text-secondary">
          {selected.description} Sections: {selected.structure.join(" · ")}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 rounded-md bg-error-soft px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}
      {loading && (
        <p className="mt-3 text-sm text-muted">
          Writing the document from engagement context — typically 20–60 seconds.
        </p>
      )}
    </Card>
  );
}
