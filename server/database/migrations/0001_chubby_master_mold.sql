CREATE TABLE `marbleTransactions` (
	`id` text PRIMARY KEY NOT NULL,
	`child_id` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`reason` text DEFAULT '',
	`created_at` text NOT NULL,
	FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `marble_transactions`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text(255) DEFAULT '',
	`first_name` text DEFAULT '' NOT NULL,
	`last_name` text DEFAULT '' NOT NULL,
	`sex` text DEFAULT 'male' NOT NULL,
	`password` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "first_name", "last_name", "sex", "password", "created_at") SELECT "id", "email", "first_name", "last_name", "sex", "password", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `emailIndex` ON `users` (`email`);