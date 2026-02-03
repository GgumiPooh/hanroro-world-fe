import { languageDataSchema, metaDataSchema } from "@/schemas/common";
import { z } from "zod";

export const albumSongSchema = z.object({
  id: z.number(),
  track_number: z.number().optional(),
});

export const albumSchema = z.object({
  id: z.number(),
  title: z.array(languageDataSchema),
  description: z.array(languageDataSchema).optional(),
  metadata: z.array(metaDataSchema).optional(),
  album_type: z.string().optional(),
  published_at: z.string().optional(),
  created_at: z.string().optional(),
  songs: z.array(albumSongSchema).optional(),
});

export const albumArraySchema = z.array(albumSchema);

export const albumDetailSchema = z.object({
  id: z.number(),
  title: z.array(languageDataSchema),
  description: z.array(languageDataSchema).optional(),
  published_at: z.string().optional(),
  metadata: z.array(metaDataSchema).optional(),
  created_at: z.string().optional(),
});
