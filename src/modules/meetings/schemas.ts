import { z } from "zod";

export const meetingsInsertSchema = z.object({
  name: z.string().min(1).max(200, { message: "Name must be under 200 characters" }),
  agentId: z.string().min(1, { message: "Agent is required" }),
});

export const meetingsUpdateSchema = z.object({
  id: z.string().min(1, { message: "Id is required" }),
  name: z.string().min(1).max(200, { message: "Name must be under 200 characters" }).optional(),
});
