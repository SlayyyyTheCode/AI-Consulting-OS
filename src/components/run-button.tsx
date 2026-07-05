"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@/components/ui";

export function RunButton({
  endpoint,
  engagementId,
  label,
  rerunLabel,
  hasResult,
}: {
  endpoint: string;
  engagementId: string;
  label: string;
  rerunLabel: string;
  hasResult: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ engagementId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {error && (
        <p role="alert" className="rounded-md bg-error-soft px-3 py-1.5 text-sm text-error">
          {error}
        </p>
      )}
      <Button onClick={run} disabled={loading} variant={hasResult ? "secondary" : "primary"}>
        {loading ? (
          <>
            <Spinner /> Working…
          </>
        ) : hasResult ? (
          rerunLabel
        ) : (
          label
        )}
      </Button>
    </div>
  );
}
