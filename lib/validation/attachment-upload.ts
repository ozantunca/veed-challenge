/** 100 MiB cap for local uploads (adjust when moving to cloud). */
export const MAX_ATTACHMENT_BYTES = 100 * 1024 * 1024;

export function isAllowedAttachmentMimeType(contentType: string): boolean {
  const t = contentType.trim().toLowerCase();
  if (t === "application/octet-stream") return true;
  return t.startsWith("video/");
}
