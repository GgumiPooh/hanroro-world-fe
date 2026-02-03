import type { songSchema } from "@/schemas/song";
import type { z } from "zod";

export type Song = z.infer<typeof songSchema>;
