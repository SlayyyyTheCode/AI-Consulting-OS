"use client";

import { useEffect, useRef, useState } from "react";

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        mermaid.initialize({
          startOnLoad: false,
          theme: dark ? "dark" : "neutral",
          securityLevel: "strict",
        });
        const { svg } = await mermaid.render(`mmd-${Date.now()}`, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Diagram could not be rendered. Raw definition shown below.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <div>
      <div ref={ref} className="overflow-x-auto [&>svg]:mx-auto [&>svg]:max-w-full" />
      {error && (
        <div>
          <p className="mb-2 text-sm text-warning">{error}</p>
          <pre className="overflow-x-auto rounded-md bg-bg p-3 text-xs">{chart}</pre>
        </div>
      )}
    </div>
  );
}
