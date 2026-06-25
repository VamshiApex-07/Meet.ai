CREATE TYPE "public"."agent_voice" AS ENUM('Kore', 'Puck', 'Charon', 'Fenrir', 'Aoede', 'Leda', 'Orus', 'Zephyr');--> statement-breakpoint
ALTER TABLE "meetings" DROP CONSTRAINT "meetings_agent_id_agents_id_fk";
--> statement-breakpoint
ALTER TABLE "agents" ALTER COLUMN "voice" SET DEFAULT 'Kore'::"public"."agent_voice";--> statement-breakpoint
ALTER TABLE "agents" ALTER COLUMN "voice" SET DATA TYPE "public"."agent_voice" USING "voice"::"public"."agent_voice";--> statement-breakpoint
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_agent_id_user_id_agents_id_user_id_fk" FOREIGN KEY ("agent_id","user_id") REFERENCES "public"."agents"("id","user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_id_user_id_unique" UNIQUE("id","user_id");