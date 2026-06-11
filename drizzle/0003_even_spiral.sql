ALTER TABLE "tetherUsers" ALTER COLUMN "bio" SET DEFAULT 'NONE';--> statement-breakpoint
ALTER TABLE "tetherUsers" DROP COLUMN "display_name";--> statement-breakpoint
ALTER TABLE "tetherUsers" DROP COLUMN "avatar_url";