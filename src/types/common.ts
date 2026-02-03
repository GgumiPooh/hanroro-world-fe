import type { languageDataSchema, metaDataSchema } from "@/schemas/common";
import type { z } from "zod";

export type LanguageData = z.infer<typeof languageDataSchema>;
export type MetaData = z.infer<typeof metaDataSchema>;
