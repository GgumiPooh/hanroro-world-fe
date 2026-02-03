import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  nickname: z.string(),
  username: z.string(),
  email: z.email(),
});
