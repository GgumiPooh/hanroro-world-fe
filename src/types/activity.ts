import type { activitySchema } from "@/schemas/activity";
import type { z } from "zod";

export type Activity = z.infer<typeof activitySchema>;
