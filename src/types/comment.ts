import type { commentSchema } from "@/schemas/comment";
import type { z } from "zod";

export type Comment = z.infer<typeof commentSchema>;
