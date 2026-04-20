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
