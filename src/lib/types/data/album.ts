import { z } from "zod";

export const Album = z.object({
    title: z.string(),
    released: z.iso.date(),
    links: z.record(z.string(), z.url()).optional(),
});

export type Album = z.infer<typeof Album>;
