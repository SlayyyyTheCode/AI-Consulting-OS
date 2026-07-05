"use client";

import { useTransition } from "react";
import { updateGovernanceCheck } from "@/lib/actions";
import { Card, Badge } from "@/components/ui";

type CheckStatus = "not_started" | "in_progress" | "compliant" | "not_applicable";

interface Check {
  id: string;
  framework: string;
  item: string;
  status: CheckStatus;
}

const statusLabel: Record<CheckStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  compliant: "Compliant",
  not_applicable: "N/A",
};

export function GovernanceChecklist({
  engagementId,
  checks,
}: {
  engagementId: string;
  checks: Check[];
}) {
  const [pending, startTransition] = useTransition();
  const frameworks = [...new Set(checks.map((c) => c.framework))];

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Governance checklist
      </h2>
      <div className="space-y-4">
        {frameworks.map((fw) => {
          const items = checks.filter((c) => c.framework === fw);
          const done = items.filter(
            (c) => c.status === "compliant" || c.status === "not_applicable"
          ).length;
          return (
            <Card key={fw} className="!p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-semibold">{fw}</h3>
                <Badge tone={done === items.length ? "success" : "neutral"}>
                  {done}/{items.length}
                </Badge>
              </div>
              <ul className="divide-y divide-border">
                {items.map((check) => (
                  <li
                    key={check.id}
                    className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span
                      className={`text-sm ${
                        check.status === "compliant" || check.status === "not_applicable"
                          ? "text-muted"
                          : ""
                      }`}
                    >
                      {check.item}
                    </span>
                    <label className="sr-only" htmlFor={`check-${check.id}`}>
                      Status for {check.item}
                    </label>
                    <select
                      id={`check-${check.id}`}
                      value={check.status}
                      disabled={pending}
                      onChange={(e) =>
                        startTransition(() =>
                          updateGovernanceCheck(
                            check.id,
                            engagementId,
                            e.target.value as CheckStatus
                          )
                        )
                      }
                      className={`w-full shrink-0 rounded-md border px-2 py-1.5 text-xs font-medium sm:w-36 ${
                        check.status === "compliant"
                          ? "border-transparent bg-success-soft text-success"
                          : check.status === "in_progress"
                            ? "border-transparent bg-info-soft text-info"
                            : check.status === "not_applicable"
                              ? "border-transparent bg-bg text-muted"
                              : "border-border-strong bg-surface text-text-secondary"
                      }`}
                    >
                      {(Object.keys(statusLabel) as CheckStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {statusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
