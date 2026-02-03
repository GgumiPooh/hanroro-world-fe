import { z } from "zod";

export const languageDataSchema = z.object({
  language: z.string(),
  content: z.string(),
});

export const metaDataSchema = z.object({
  type: z.string(),
  url: z.string(),
});
