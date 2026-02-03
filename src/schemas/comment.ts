import { z } from "zod";

export const commentSchema = z.object({
  id: z.number(),
  content: z.string(),
  author: z.string(),
  createdAt: z.string(),
});

export const commentArraySchema = z.array(commentSchema);
