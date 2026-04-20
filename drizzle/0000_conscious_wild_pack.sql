CREATE TABLE IF NOT EXISTS `videos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`thumbnail_url` text NOT NULL,
	`created_at` text NOT NULL,
	`duration` integer NOT NULL,
	`views` integer NOT NULL,
	`tags_json` text DEFAULT '[]' NOT NULL
);
