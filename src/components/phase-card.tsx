"use client";

import { useState, useTransition } from "react";
import type { LifecyclePhaseDef } from "@/lib/knowledge/lifecycle";
import { updatePhaseStatus, toggleExitCriterion } from "@/lib/actions";
import { Badge, Spinner } from "@/components/ui";

type PhaseStatus = "not_started" | "in_progress" | "completed" | "skipped";

const statusMeta: Record<PhaseStatus, { label: string; tone: "neutral" | "info" | "success" | "warning" }> = {
  not_started: { label: "Not started", tone: "neutral" },
  in_progress: { label: "In progress", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  skipped: { label: "Skipped", tone: "warning" },
};

export function PhaseCard({
  engagementId,
  def,
  status,
  exitCriteria,
}: {
  engagementId: string;
  def: LifecyclePhaseDef;
  status: PhaseStatus;
  exitCriteria: { text: string; done: boolean }[];
}) {
  const [open, setOpen] = useState(status === "in_progress");
  const [pending, startTransition] = useTransition();

  const allCriteriaDone = exitCriteria.every((c) => c.done);
  const meta = statusMeta[status];

  return (
    <div
      className={`rounded-lg border bg-surface transition-colors ${
        status === "in_progress" ? "border-accent" : "border-border"
      }`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              status === "completed"
                ? "bg-success text-white"
                : status === "in_progress"
                  ? "bg-accent text-white"
                  : "bg-bg text-muted"
            }`}
            aria-hidden
          >
            {status === "completed" ? "✓" : def.order}
          </span>
          <span className="font-semibold">{def.name}</span>
          {pending && <Spinner className="text-muted" />}
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={meta.tone}>{meta.label}</Badge>
          <span aria-hidden className="text-muted">
            {open ? "▾" : "▸"}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-4 py-4 sm:px-5">
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
                Objectives
              </h4>
              <ul className="mt-1.5 list-disc space-y-1 pl-4">
                {def.objectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
              <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Key risks
              </h4>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-text-secondary">
                {def.risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
                KPIs
              </h4>
              <p className="mt-1.5 text-text-secondary">{def.kpis.join(" · ")}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
                Exit criteria
              </h4>
              <ul className="mt-1.5 space-y-1.5">
                {exitCriteria.map((c, i) => (
                  <li key={i}>
                    <label className="flex cursor-pointer items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={c.done}
                        disabled={pending}
                        onChange={() =>
                          startTransition(() =>
                            toggleExitCriterion(engagementId, def.key, i)
                          )
                        }
                        className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
                      />
                      <span className={c.done ? "text-muted line-through" : ""}>{c.text}</span>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {status !== "in_progress" && status !== "completed" && (
                  <PhaseButton
                    label="Start phase"
                    onClick={() =>
                      startTransition(() => updatePhaseStatus(engagementId, def.key, "in_progress"))
                    }
                    disabled={pending}
                  />
                )}
                {status === "in_progress" && (
                  <PhaseButton
                    label={allCriteriaDone ? "Complete phase" : "Complete phase (criteria pending)"}
                    onClick={() =>
                      startTransition(() => updatePhaseStatus(engagementId, def.key, "completed"))
                    }
                    disabled={pending || !allCriteriaDone}
                    title={allCriteriaDone ? undefined : "All exit criteria must be checked first"}
                  />
                )}
                {status === "completed" && (
                  <PhaseButton
                    label="Reopen phase"
                    onClick={() =>
                      startTransition(() => updatePhaseStatus(engagementId, def.key, "in_progress"))
                    }
                    disabled={pending}
                  />
                )}
              </div>
              {status === "in_progress" && !allCriteriaDone && (
                <p className="mt-2 text-xs text-muted">
                  Check all exit criteria to unlock phase completion.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseButton({
  label,
  onClick,
  disabled,
  title,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="min-h-[36px] rounded-md border border-border-strong bg-surface px-3 text-sm font-medium hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}
