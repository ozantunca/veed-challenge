import { getDb } from "@/lib/db/get-db";
import { SqliteVideoRepository } from "@/lib/repositories/sqlite-video-repository";
import type { VideoRepository } from "@/lib/repositories/video-repository";

export function getVideoRepository(): VideoRepository {
  return new SqliteVideoRepository(getDb());
}
