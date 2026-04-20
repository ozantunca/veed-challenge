CREATE TABLE `video_attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`video_id` integer NOT NULL,
	`storage_key` text NOT NULL,
	`filename` text NOT NULL,
	`content_type` text NOT NULL,
	`byte_size` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `video_attachments_storage_key_unique` ON `video_attachments` (`storage_key`);