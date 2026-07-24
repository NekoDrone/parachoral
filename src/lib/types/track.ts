import { z } from "zod";

export const trackSchema = z.object({
    title: z.string(),
});

export type Track = z.infer<typeof trackSchema>;
