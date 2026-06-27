import { z } from "zod";

export const AGENT_VOICES = [
  "Kore",
  "Puck",
  "Charon",
  "Fenrir",
  "Aoede",
  "Leda",
  "Orus",
  "Zephyr",
] as const;

export const agentsInsertSchema = z.object({
  name: z.string().min(1).max(100, { message: "Name must be under 100 characters" }),
  instructions: z.string().min(1).max(2000, { message: "Instructions must be under 2000 characters" }),
  voice: z.enum(AGENT_VOICES),
});

export const agentsUpdateSchema = agentsInsertSchema.partial().extend({
  id: z.string().min(1, { message: "Id is required" }),
});
