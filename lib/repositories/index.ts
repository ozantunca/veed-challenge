import { getDb } from "@/lib/db/get-db";
import type { AttachmentRepository } from "@/lib/repositories/attachment-repository";
import { SqliteAttachmentRepository } from "@/lib/repositories/sqlite-attachment-repository";
import { SqliteVideoRepository } from "@/lib/repositories/sqlite-video-repository";
import type { VideoRepository } from "@/lib/repositories/video-repository";

export function getVideoRepository(): VideoRepository {
  return new SqliteVideoRepository(getDb());
}

export function getAttachmentRepository(): AttachmentRepository {
  return new SqliteAttachmentRepository(getDb());
}
