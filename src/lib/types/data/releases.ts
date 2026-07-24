import { z } from "zod";

export const Releases = z.array(
    z.object({
        slug: z.string(),
        name: z.string(),
        year: z.number().int(),
    }),
);

export type Releases = z.infer<typeof Releases>;
