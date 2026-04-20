import type Database from "better-sqlite3";

import { toDisplayId } from "@/lib/ids";
import { NEW_VIDEO_NUMERIC_DEFAULTS, newVideoThumbnailUrl } from "@/lib/new-video-defaults";
import type { CreateVideoInput, UpdateVideoInput, Video, VideoSort } from "@/lib/types/video";
import type { ListVideosOptions, VideoRepository } from "@/lib/repositories/video-repository";

type Row = {
  id: number;
  title: string;
  description: string;
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
    description: row.description ?? "",
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

const SELECT_FIELDS =
  "id, title, description, thumbnail_url, created_at, duration, views, tags_json";

export class SqliteVideoRepository implements VideoRepository {
  constructor(private readonly db: Database.Database) {}

  async list(options: ListVideosOptions): Promise<Video[]> {
    const whereParts: string[] = [];
    const params: unknown[] = [];

    if (options.titleContains) {
      whereParts.push("instr(lower(title), lower(?)) > 0");
      params.push(options.titleContains);
    }

    if (options.tag) {
      whereParts.push(
        "EXISTS (SELECT 1 FROM json_each(tags_json) WHERE lower(value) = lower(?))",
      );
      params.push(options.tag);
    }

    if (options.createdFrom) {
      whereParts.push("created_at >= ?");
      params.push(options.createdFrom);
    }

    if (options.createdTo) {
      whereParts.push("created_at <= ?");
      params.push(options.createdTo);
    }

    const where =
      whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : "";
    const sql = `SELECT ${SELECT_FIELDS} FROM videos ${where} ${orderClause(options.sort)}`;
    const rows = this.db.prepare(sql).all(...params) as Row[];
    return rows.map(rowToVideo);
  }

  async create(input: CreateVideoInput): Promise<Video> {
    const tags = input.tags ?? [];
    const description = input.description?.trim() ?? "";
    const now = new Date().toISOString();

    const insert = this.db.prepare(`
      INSERT INTO videos (title, description, thumbnail_url, created_at, duration, views, tags_json)
      VALUES (@title, @description, @thumbnail_url, @created_at, @duration, @views, @tags_json)
    `);

    const result = insert.run({
      title: input.title,
      description,
      thumbnail_url: "__PLACEHOLDER__",
      created_at: now,
      duration: NEW_VIDEO_NUMERIC_DEFAULTS.duration,
      views: NEW_VIDEO_NUMERIC_DEFAULTS.views,
      tags_json: JSON.stringify(tags),
    });

    const id = Number(result.lastInsertRowid);
    if (!Number.isFinite(id) || id < 1) {
      throw new Error("Failed to create video: invalid row id");
    }

    const displayId = toDisplayId(id);
    const thumbnail_url = newVideoThumbnailUrl(displayId);

    this.db
      .prepare(
        `UPDATE videos SET thumbnail_url = @thumbnail_url WHERE id = @id`,
      )
      .run({ id, thumbnail_url });

    const row = this.db
      .prepare(
        `SELECT ${SELECT_FIELDS} FROM videos WHERE id = ?`,
      )
      .get(id) as Row | undefined;

    if (!row) {
      throw new Error("Failed to load created video");
    }

    return rowToVideo(row);
  }

  async getById(id: number): Promise<Video | null> {
    const row = this.db
      .prepare(`SELECT ${SELECT_FIELDS} FROM videos WHERE id = ?`)
      .get(id) as Row | undefined;
    if (!row) return null;
    return rowToVideo(row);
  }

  async update(id: number, input: UpdateVideoInput): Promise<Video | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    this.db
      .prepare(
        `UPDATE videos SET title = @title, description = @description, tags_json = @tags_json WHERE id = @id`,
      )
      .run({
        id,
        title: input.title,
        description: input.description,
        tags_json: JSON.stringify(input.tags),
      });

    return this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = this.db.prepare("DELETE FROM videos WHERE id = ?").run(id);
    return result.changes > 0;
  }
}
