"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Spinner, inputClass } from "@/components/ui";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function DiscoveryChat({
  engagementId,
  initialMessages,
  briefExists,
}: {
  engagementId: string;
  initialMessages: ChatMessage[];
  briefExists: boolean;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setError(null);
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setStreaming(true);

    try {
      const res = await fetch("/api/ai/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ engagementId, messages: next }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: assistant }]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages(next); // keep user message, drop empty assistant
    } finally {
      setStreaming(false);
    }
  }

  async function completeDiscovery() {
    setCompleting(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ engagementId, action: "complete" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Extraction failed");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setCompleting(false);
    }
  }

  return (
    <Card className="flex h-[calc(100vh-16rem)] min-h-[420px] flex-col !p-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">AI Discovery Interview</h2>
        <Button
          size="sm"
          variant="secondary"
          onClick={completeDiscovery}
          disabled={completing || streaming || messages.length < 2}
        >
          {completing ? (
            <>
              <Spinner /> Extracting brief…
            </>
          ) : briefExists ? (
            "Re-extract brief"
          ) : (
            "Complete discovery"
          )}
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm font-medium">Start the discovery interview</p>
            <p className="mt-1 max-w-sm text-sm text-text-secondary">
              Describe the client&apos;s business problem in their words. The AI consultant
              will probe with McKinsey-style structured questions.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-fg"
                  : "border border-border bg-bg"
              }`}
            >
              {m.content || <Spinner className="text-muted" />}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p role="alert" className="mx-4 mb-2 rounded-md bg-error-soft px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      <form
        className="flex gap-2 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <textarea
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Describe the client problem or answer the interviewer…"
          rows={2}
          className={`${inputClass} resize-none`}
          disabled={streaming}
        />
        <Button type="submit" disabled={streaming || !input.trim()} aria-label="Send message">
          {streaming ? <Spinner /> : "Send"}
        </Button>
      </form>
    </Card>
  );
}
