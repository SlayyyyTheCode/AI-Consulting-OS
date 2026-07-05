"use client";

import { useState, useTransition } from "react";
import { addRisk, updateRiskStatus } from "@/lib/actions";
import { Card, Badge, Button, Spinner, Field, inputClass } from "@/components/ui";

type RiskStatus = "open" | "mitigating" | "closed" | "accepted";

interface Risk {
  id: string;
  risk: string;
  category: string;
  likelihood: number;
  impact: number;
  mitigation: string | null;
  status: RiskStatus;
}

const statusTone: Record<RiskStatus, "error" | "warning" | "success" | "neutral"> = {
  open: "error",
  mitigating: "warning",
  closed: "success",
  accepted: "neutral",
};

function severityTone(score: number): "error" | "warning" | "success" {
  if (score >= 12) return "error";
  if (score >= 6) return "warning";
  return "success";
}

export function RiskRegisterTable({
  engagementId,
  risks,
}: {
  engagementId: string;
  risks: Risk[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Risk register ({risks.length})
        </h2>
        <Button size="sm" variant="secondary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add risk"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4 !p-4">
          <form
            action={(form) =>
              startTransition(async () => {
                await addRisk(engagementId, form);
                setShowForm(false);
              })
            }
            className="grid gap-3 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <Field label="Risk description" htmlFor="risk">
                <input id="risk" name="risk" required className={inputClass} />
              </Field>
            </div>
            <Field label="Category" htmlFor="category">
              <input id="category" name="category" defaultValue="General" className={inputClass} />
            </Field>
            <Field label="Mitigation" htmlFor="mitigation">
              <input id="mitigation" name="mitigation" className={inputClass} />
            </Field>
            <Field label="Likelihood (1–5)" htmlFor="likelihood">
              <input id="likelihood" name="likelihood" type="number" min={1} max={5} defaultValue={3} className={inputClass} />
            </Field>
            <Field label="Impact (1–5)" htmlFor="impact">
              <input id="impact" name="impact" type="number" min={1} max={5} defaultValue={3} className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? <Spinner /> : "Add to register"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {risks.length === 0 ? (
        <Card className="!p-4">
          <p className="text-sm text-text-secondary">
            No risks yet. Generating recommendations seeds the register automatically, or add risks manually.
          </p>
        </Card>
      ) : (
        <Card className="overflow-x-auto !p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg text-left">
                <th className="px-4 py-2.5 font-semibold">Risk</th>
                <th className="px-4 py-2.5 font-semibold">Category</th>
                <th className="px-4 py-2.5 font-semibold">Severity</th>
                <th className="px-4 py-2.5 font-semibold">Mitigation</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r) => {
                const score = r.likelihood * r.impact;
                return (
                  <tr key={r.id} className="border-b border-border align-top last:border-0">
                    <td className="max-w-xs px-4 py-2.5">{r.risk}</td>
                    <td className="px-4 py-2.5">
                      <Badge>{r.category}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge tone={severityTone(score)}>
                        {score} (L{r.likelihood}×I{r.impact})
                      </Badge>
                    </td>
                    <td className="max-w-xs px-4 py-2.5 text-text-secondary">
                      {r.mitigation ?? "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <label className="sr-only" htmlFor={`risk-${r.id}`}>
                        Status for risk
                      </label>
                      <select
                        id={`risk-${r.id}`}
                        value={r.status}
                        disabled={pending}
                        onChange={(e) =>
                          startTransition(() =>
                            updateRiskStatus(r.id, engagementId, e.target.value as RiskStatus)
                          )
                        }
                        className="rounded-md border border-border-strong bg-surface px-2 py-1 text-xs"
                      >
                        <option value="open">Open</option>
                        <option value="mitigating">Mitigating</option>
                        <option value="closed">Closed</option>
                        <option value="accepted">Accepted</option>
                      </select>
                      <span className="ml-2 inline-block sm:hidden">
                        <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </section>
  );
}
