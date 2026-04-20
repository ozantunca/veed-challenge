/** Default `duration` / `views` for newly created videos (server-side). */
export const NEW_VIDEO_NUMERIC_DEFAULTS = {
  duration: 0,
  views: 0,
} as const;

/**
 * Thumbnail URL for a new row after `displayId` is known (matches product default).
 */
export function newVideoThumbnailUrl(displayId: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(displayId)}/300/200`;
}
