import type { albumDetailSchema, albumSchema } from "@/schemas/album";
import type { z } from "zod";

export type Album = z.infer<typeof albumSchema>;
export type AlbumDetail = z.infer<typeof albumDetailSchema>;
