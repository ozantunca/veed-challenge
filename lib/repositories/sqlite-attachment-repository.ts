import type Database from "better-sqlite3";

import type {
  CreateAttachmentInput,
  VideoAttachment,
} from "@/lib/types/video-attachment";
import type { AttachmentRepository } from "@/lib/repositories/attachment-repository";

type Row = {
  id: number;
  video_id: number;
  storage_key: string;
  filename: string;
  content_type: string;
  byte_size: number;
  created_at: string;
};

function rowToAttachment(row: Row): VideoAttachment {
  return {
    id: row.id,
    videoId: row.video_id,
    storageKey: row.storage_key,
    filename: row.filename,
    contentType: row.content_type,
    byteSize: row.byte_size,
    createdAt: row.created_at,
  };
}

export class SqliteAttachmentRepository implements AttachmentRepository {
  constructor(private readonly db: Database.Database) {}

  async listByVideoId(videoId: number): Promise<VideoAttachment[]> {
    const rows = this.db
      .prepare(
        `SELECT id, video_id, storage_key, filename, content_type, byte_size, created_at
         FROM video_attachments WHERE video_id = ?
         ORDER BY datetime(created_at) DESC, id DESC`,
      )
      .all(videoId) as Row[];
    return rows.map(rowToAttachment);
  }

  async create(input: CreateAttachmentInput): Promise<VideoAttachment> {
    const createdAt = new Date().toISOString();
    const result = this.db
      .prepare(
        `INSERT INTO video_attachments (video_id, storage_key, filename, content_type, byte_size, created_at)
         VALUES (@video_id, @storage_key, @filename, @content_type, @byte_size, @created_at)`,
      )
      .run({
        video_id: input.videoId,
        storage_key: input.storageKey,
        filename: input.filename,
        content_type: input.contentType,
        byte_size: input.byteSize,
        created_at: createdAt,
      });
    const id = Number(result.lastInsertRowid);
    const row = this.db
      .prepare(
        `SELECT id, video_id, storage_key, filename, content_type, byte_size, created_at
         FROM video_attachments WHERE id = ?`,
      )
      .get(id) as Row | undefined;
    if (!row) {
      throw new Error("Failed to load created attachment");
    }
    return rowToAttachment(row);
  }

  async getByIdForVideo(
    attachmentId: number,
    videoId: number,
  ): Promise<VideoAttachment | null> {
    const row = this.db
      .prepare(
        `SELECT id, video_id, storage_key, filename, content_type, byte_size, created_at
         FROM video_attachments WHERE id = ? AND video_id = ?`,
      )
      .get(attachmentId, videoId) as Row | undefined;
    if (!row) return null;
    return rowToAttachment(row);
  }

  async deleteByIdForVideo(
    attachmentId: number,
    videoId: number,
  ): Promise<boolean> {
    const result = this.db
      .prepare(
        "DELETE FROM video_attachments WHERE id = ? AND video_id = ?",
      )
      .run(attachmentId, videoId);
    return result.changes > 0;
  }
}
