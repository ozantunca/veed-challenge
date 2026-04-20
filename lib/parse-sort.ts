import type { VideoSort } from "@/lib/types/video";
import { videoSortSchema } from "@/lib/validation/video";

export function parseSort(raw: string | undefined): VideoSort {
  const parsed = videoSortSchema.safeParse(raw ?? "newest");
  return parsed.success ? parsed.data : "newest";
}
