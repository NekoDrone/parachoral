import { Sources } from "#/lib/types/data";
import { z } from "zod";

export const Album = z.object({
    title: z.string(),
    released: z.iso.date(),
    links: Sources.optional(),
});

export type Album = z.infer<typeof Album>;
