import type { userSchema } from "@/schemas/user";
import type { z } from "zod";

export type User = z.infer<typeof userSchema>;
