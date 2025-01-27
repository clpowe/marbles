CREATE TABLE IF NOT EXISTS `children` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text DEFAULT '' NOT NULL,
	`last_name` text DEFAULT '' NOT NULL,
	`birth_date` integer,
	`mother_id` text NOT NULL,
	`father_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`mother_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`father_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `marbleTransactions` (
	`id` text PRIMARY KEY NOT NULL,
	`child_id` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`reason` text DEFAULT '',
	`created_at` text NOT NULL,
	FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text(255) DEFAULT '',
	`first_name` text DEFAULT '' NOT NULL,
	`last_name` text DEFAULT '' NOT NULL,
	`sex` text DEFAULT 'male' NOT NULL,
	`password` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `emailIndex` ON `users` (`email`);
