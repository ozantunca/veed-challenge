import { randomUUID } from "node:crypto";

/** Last path segment only; safe for storage object names. */
export function safeFileSegment(originalName: string): string {
  const base = originalName.replace(/^.*[/\\]/, "");
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "_");
  const trimmed = cleaned.replace(/^[._-]+|[._-]+$/g, "").slice(0, 200);
  return trimmed.length > 0 ? trimmed : "file";
}

export function makeAttachmentStorageKey(videoId: number, originalFilename: string): string {
  const safe = safeFileSegment(originalFilename);
  return `videos/${videoId}/${randomUUID()}_${safe}`;
}
