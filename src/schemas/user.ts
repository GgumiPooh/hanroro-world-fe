import { z } from "zod";

export const userSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  nickname: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  isNewUser: z.boolean().optional(),
});
