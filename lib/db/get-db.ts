import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { migrate } from "@/lib/db/migrate";

const globalForDb = globalThis as unknown as {
  videoDb?: Database.Database;
};

export function getDb(): Database.Database {
  if (!globalForDb.videoDb) {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = process.env.VIDEO_DB_PATH
      ? path.isAbsolute(process.env.VIDEO_DB_PATH)
        ? process.env.VIDEO_DB_PATH
        : path.join(process.cwd(), process.env.VIDEO_DB_PATH)
      : path.join(dataDir, "videos.db");
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    migrate(db);
    globalForDb.videoDb = db;
  }
  return globalForDb.videoDb;
}
