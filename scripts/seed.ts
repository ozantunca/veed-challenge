import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { migrate } from "../lib/db/migrate";
import { seedVideosFromJson } from "../lib/db/seed-videos";

function resolveDbPath(): string {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (process.env.VIDEO_DB_PATH) {
    return path.isAbsolute(process.env.VIDEO_DB_PATH)
      ? process.env.VIDEO_DB_PATH
      : path.join(process.cwd(), process.env.VIDEO_DB_PATH);
  }
  return path.join(dataDir, "videos.db");
}

function main() {
  const dbPath = resolveDbPath();
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  try {
    migrate(db);
    seedVideosFromJson(db);
    console.log(`Seeded ${dbPath} from data/videos.json`);
  } finally {
    db.close();
  }
}

main();
