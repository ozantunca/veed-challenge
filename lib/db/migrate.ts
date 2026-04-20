import type Database from "better-sqlite3";

export function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      created_at TEXT NOT NULL,
      duration INTEGER NOT NULL,
      views INTEGER NOT NULL,
      tags_json TEXT NOT NULL DEFAULT '[]'
    );
  `);
}
