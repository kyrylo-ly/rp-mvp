CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TYPE "public"."community_role" AS ENUM('OWNER', 'ADMIN', 'MEMBER');--> statement-breakpoint
CREATE TYPE "public"."community_visibility" AS ENUM('PUBLIC', 'PRIVATE');--> statement-breakpoint
CREATE TYPE "public"."initiative_status" AS ENUM('ACTIVE', 'COMPLETED', 'FAILED', 'CANCELLED', 'PROCESSING');--> statement-breakpoint
CREATE TYPE "public"."initiative_type" AS ENUM('CROWDFUNDING', 'WHOLESALE');--> statement-breakpoint
CREATE TABLE "communities" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"visibility" "community_visibility" DEFAULT 'PUBLIC' NOT NULL,
	"avatar_url" text,
	"cover_url" text,
	"address" text,
	"location" geometry(point),
	"owner_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crowdfunding_initiatives" (
	"initiative_id" uuid PRIMARY KEY NOT NULL,
	"target_amount" bigint NOT NULL,
	"min_contribution" integer NOT NULL,
	"max_contribution" integer NOT NULL,
	CONSTRAINT "target_amount_positive_check" CHECK ("crowdfunding_initiatives"."target_amount" > 0),
	CONSTRAINT "contribution_range_check" CHECK ("crowdfunding_initiatives"."min_contribution" <= "crowdfunding_initiatives"."max_contribution" AND "crowdfunding_initiatives"."min_contribution" > 0)
);
--> statement-breakpoint
CREATE TABLE "initiatives" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"community_id" uuid NOT NULL,
	"created_by_user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "initiative_type" NOT NULL,
	"status" "initiative_status" DEFAULT 'ACTIVE' NOT NULL,
	"deadline" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"community_id" uuid NOT NULL,
	"member_id" text NOT NULL,
	"role" "community_role" DEFAULT 'MEMBER' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "memberships_community_id_member_id_pk" PRIMARY KEY("community_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "wholesale_initiatives" (
	"initiative_id" uuid PRIMARY KEY NOT NULL,
	"wholesale_max_quantity" integer NOT NULL,
	"wholesale_tiers" jsonb NOT NULL,
	CONSTRAINT "wholesale_max_qty_positive_check" CHECK ("wholesale_initiatives"."wholesale_max_quantity" > 0)
);
--> statement-breakpoint
ALTER TABLE "crowdfunding_initiatives" ADD CONSTRAINT "crowdfunding_initiatives_initiative_id_initiatives_id_fk" FOREIGN KEY ("initiative_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wholesale_initiatives" ADD CONSTRAINT "wholesale_initiatives_initiative_id_initiatives_id_fk" FOREIGN KEY ("initiative_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "communities_owner_id_idx" ON "communities" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "communities_location_gist_idx" ON "communities" USING gist ("location");--> statement-breakpoint
CREATE INDEX "initiatives_community_id_status_idx" ON "initiatives" USING btree ("community_id","status");--> statement-breakpoint
CREATE INDEX "initiatives_status_deadline_idx" ON "initiatives" USING btree ("status","deadline");--> statement-breakpoint
CREATE INDEX "initiatives_created_by_user_id_idx" ON "initiatives" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "memberships_member_id_idx" ON "memberships" USING btree ("member_id");