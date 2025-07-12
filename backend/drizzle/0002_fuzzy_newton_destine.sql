ALTER TABLE "endorsements" RENAME COLUMN "endorser_user_id" TO "endorser_id";--> statement-breakpoint
ALTER TABLE "endorsements" DROP CONSTRAINT "endorsements_skill_id_endorser_user_id_unique";--> statement-breakpoint
ALTER TABLE "endorsements" DROP CONSTRAINT "endorsements_endorser_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "endorsements" ADD COLUMN "comment" text;--> statement-breakpoint
ALTER TABLE "endorsements" ADD CONSTRAINT "endorsements_endorser_id_users_id_fk" FOREIGN KEY ("endorser_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;