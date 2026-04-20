import fs from "node:fs";
import path from "node:path";

import type Database from "better-sqlite3";

import { fromDisplayId } from "@/lib/ids";

type SeedFile = {
  videos: Array<{
    id: string;
    title: string;
    thumbnail_url: string;
    created_at: string;
    duration: number;
    views: number;
    tags: string[];
  }>;
};

export type SeedVideosOptions = {
  /** Defaults to `data/videos.json` under cwd */
  jsonPath?: string;
};

/**
 * Replaces all rows in `videos` with data from the JSON seed file and syncs AUTOINCREMENT.
 */
export function seedVideosFromJson(
  db: Database.Database,
  options?: SeedVideosOptions,
): void {
  const seedPath =
    options?.jsonPath ?? path.join(process.cwd(), "data", "videos.json");

  const raw = fs.readFileSync(seedPath, "utf8");
  const parsed = JSON.parse(raw) as SeedFile;

  db.prepare("DELETE FROM videos").run();

  const insert = db.prepare(`
    INSERT INTO videos (id, title, thumbnail_url, created_at, duration, views, tags_json)
    VALUES (@id, @title, @thumbnail_url, @created_at, @duration, @views, @tags_json)
  `);

  const insertMany = db.transaction(() => {
    for (const v of parsed.videos) {
      const id = fromDisplayId(v.id);
      insert.run({
        id,
        title: v.title,
        thumbnail_url: v.thumbnail_url,
        created_at: v.created_at,
        duration: v.duration,
        views: v.views,
        tags_json: JSON.stringify(v.tags),
      });
    }
  });

  insertMany();

  syncAutoincrementSequence(db, "videos");
}

function syncAutoincrementSequence(db: Database.Database, tableName: "videos"): void {
  const row = db.prepare(`SELECT MAX(id) as m FROM ${tableName}`).get() as {
    m: number | null;
  };
  const max = row.m ?? 0;
  if (max <= 0) return;

  const hasSeqTable = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence'",
    )
    .get() as { name: string } | undefined;

  if (!hasSeqTable) {
    return;
  }

  const existing = db
    .prepare("SELECT seq FROM sqlite_sequence WHERE name = ?")
    .get(tableName) as { seq: number } | undefined;

  if (existing) {
    db.prepare("UPDATE sqlite_sequence SET seq = ? WHERE name = ?").run(max, tableName);
  } else {
    db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES (?, ?)").run(tableName, max);
  }
}
