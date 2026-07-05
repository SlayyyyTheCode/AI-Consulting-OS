"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateDeliverable, deleteDeliverable } from "@/lib/actions";
import { Card, Button, Spinner, inputClass } from "@/components/ui";

export function DeliverableActions({
  deliverableId,
  engagementId,
  contentMd,
  status,
  title,
  renderedHtml,
}: {
  deliverableId: string;
  engagementId: string;
  contentMd: string;
  status: "draft" | "in_review" | "final";
  title: string;
  renderedHtml: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(contentMd);
  const [docStatus, setDocStatus] = useState(status);
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function download() {
    const blob = new Blob([contentMd], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function save() {
    const form = new FormData();
    form.set("contentMd", content);
    form.set("status", docStatus);
    startTransition(async () => {
      await updateDeliverable(deliverableId, engagementId, form);
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {!editing ? (
          <>
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button size="sm" variant="secondary" onClick={download}>
              Download .md
            </Button>
            {!confirmDelete ? (
              <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(true)}>
                Delete
              </Button>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-sm text-error">Delete permanently?</span>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await deleteDeliverable(deliverableId, engagementId);
                      router.push(`/engagements/${engagementId}/deliverables`);
                    })
                  }
                >
                  {pending ? <Spinner /> : "Yes, delete"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
              </span>
            )}
          </>
        ) : (
          <>
            <label htmlFor="doc-status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="doc-status"
              value={docStatus}
              onChange={(e) => setDocStatus(e.target.value as typeof docStatus)}
              className={`${inputClass} !w-auto`}
            >
              <option value="draft">Draft</option>
              <option value="in_review">In review</option>
              <option value="final">Final</option>
            </select>
            <Button size="sm" onClick={save} disabled={pending}>
              {pending ? <Spinner /> : "Save (new version)"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setContent(contentMd);
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </div>

      <Card>
        {editing ? (
          <>
            <label htmlFor="doc-editor" className="sr-only">
              Document markdown
            </label>
            <textarea
              id="doc-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={28}
              className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
            />
          </>
        ) : (
          <div className="prose-doc" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
        )}
      </Card>
    </div>
  );
}
