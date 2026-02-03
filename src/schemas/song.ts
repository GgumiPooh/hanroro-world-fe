import { languageDataSchema, metaDataSchema } from "@/schemas/common";
import { z } from "zod";

export const songSchema = z.object({
  id: z.number(),
  album_id: z.number(),
  title: z.array(languageDataSchema).optional(),
  description: z.array(languageDataSchema).optional(),
  lyrics: z.array(languageDataSchema).optional(),
  metadata: z.array(metaDataSchema).optional(),
  track_number: z.number().optional(),
  created_at: z.string().optional(),
});

export const songArraySchema = z.array(songSchema);
