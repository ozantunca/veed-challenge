"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatVideoDate } from "@/lib/format-date";
import { formatFileSize } from "@/lib/format-file-size";
import type { VideoAttachment } from "@/lib/types/video-attachment";

export function VideoAttachmentsPanel({
  videoId,
  initialAttachments,
}: {
  videoId: number;
  initialAttachments: VideoAttachment[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch(`/api/videos/${videoId}/attachments`, {
      method: "POST",
      body: fd,
    });
    const json = (await res.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    if (!res.ok) {
      setError(json?.error?.message ?? "Upload failed");
      setBusy(false);
      return;
    }
    setBusy(false);
    router.refresh();
  }

  async function remove(attachmentId: number) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/videos/${videoId}/attachments/${attachmentId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError("Could not remove file");
      setBusy(false);
      return;
    }
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-4" data-testid="video-attachments">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="video/*,application/octet-stream"
          className="text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm"
          disabled={busy}
          onChange={(e) => void onFileChange(e)}
          aria-label="Upload a video file"
        />
        {busy ? (
          <span className="text-sm text-muted-foreground">Working…</span>
        ) : null}
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="divide-y rounded-xl border">
        {initialAttachments.length === 0 ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">
            No video files attached yet.
          </li>
        ) : (
          initialAttachments.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{a.filename}</div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(a.byteSize)} · {formatVideoDate(a.createdAt)}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button asChild variant="secondary" size="sm">
                  <a
                    href={`/api/videos/${videoId}/attachments/${a.id}/file`}
                    download={a.filename}
                  >
                    Download
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => void remove(a.id)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
