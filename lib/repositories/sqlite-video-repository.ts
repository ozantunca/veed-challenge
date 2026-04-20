import type Database from "better-sqlite3";

import { toDisplayId } from "@/lib/ids";
import type { CreateVideoInput, Video, VideoSort } from "@/lib/types/video";
import type { ListVideosOptions, VideoRepository } from "@/lib/repositories/video-repository";

type Row = {
  id: number;
  title: string;
  thumbnail_url: string;
  created_at: string;
  duration: number;
  views: number;
  tags_json: string;
};

function rowToVideo(row: Row): Video {
  let tags: string[];
  try {
    tags = JSON.parse(row.tags_json) as string[];
    if (!Array.isArray(tags)) tags = [];
  } catch {
    tags = [];
  }
  return {
    id: row.id,
    displayId: toDisplayId(row.id),
    title: row.title,
    thumbnail_url: row.thumbnail_url,
    created_at: row.created_at,
    duration: row.duration,
    views: row.views,
    tags,
  };
}

function orderClause(sort: VideoSort): string {
  return sort === "newest"
    ? "ORDER BY datetime(created_at) DESC, id DESC"
    : "ORDER BY datetime(created_at) ASC, id ASC";
}

export class SqliteVideoRepository implements VideoRepository {
  constructor(private readonly db: Database.Database) {}

  async list(options: ListVideosOptions): Promise<Video[]> {
    const sql = `SELECT id, title, thumbnail_url, created_at, duration, views, tags_json FROM videos ${orderClause(options.sort)}`;
    const rows = this.db.prepare(sql).all() as Row[];
    return rows.map(rowToVideo);
  }

  async create(input: CreateVideoInput): Promise<Video> {
    const tags = input.tags ?? [];
    const now = new Date().toISOString();

    const insert = this.db.prepare(`
      INSERT INTO videos (title, thumbnail_url, created_at, duration, views, tags_json)
      VALUES (@title, @thumbnail_url, @created_at, @duration, @views, @tags_json)
    `);

    const result = insert.run({
      title: input.title,
      thumbnail_url: "__PLACEHOLDER__",
      created_at: now,
      duration: 0,
      views: 0,
      tags_json: JSON.stringify(tags),
    });

    const id = Number(result.lastInsertRowid);
    if (!Number.isFinite(id) || id < 1) {
      throw new Error("Failed to create video: invalid row id");
    }

    const displayId = toDisplayId(id);
    const thumbnail_url = `https://picsum.photos/seed/${encodeURIComponent(displayId)}/300/200`;

    this.db
      .prepare(
        `UPDATE videos SET thumbnail_url = @thumbnail_url WHERE id = @id`,
      )
      .run({ id, thumbnail_url });

    const row = this.db
      .prepare(
        `SELECT id, title, thumbnail_url, created_at, duration, views, tags_json FROM videos WHERE id = ?`,
      )
      .get(id) as Row | undefined;

    if (!row) {
      throw new Error("Failed to load created video");
    }

    return rowToVideo(row);
  }
}
