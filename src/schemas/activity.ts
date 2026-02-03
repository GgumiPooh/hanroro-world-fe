import { languageDataSchema, metaDataSchema } from "@/schemas/common";
import { z } from "zod";

export const activitySchema = z.object({
  id: z.number(),
  title: z.array(languageDataSchema),
  activityType: z.string().optional(),
  activeFrom: z.string(),
  activeTo: z.string(),
  metaData: z.array(metaDataSchema),
});

export const activityArraySchema = z.array(activitySchema);
