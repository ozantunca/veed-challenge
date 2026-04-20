import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const videos = sqliteTable("videos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  thumbnail_url: text("thumbnail_url").notNull(),
  created_at: text("created_at").notNull(),
  duration: integer("duration").notNull(),
  views: integer("views").notNull(),
  tags_json: text("tags_json").notNull().default("[]"),
});

export const videoAttachments = sqliteTable("video_attachments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  videoId: integer("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  storageKey: text("storage_key").notNull().unique(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  byteSize: integer("byte_size").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
