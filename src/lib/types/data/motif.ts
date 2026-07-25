import { z } from "zod";

export const Motif = z.object({
    name: z.string(),
    aka: z.array(z.string()).default([]),
    description: z.string(),
    related: z
        .array(z.object({ motifSlug: z.string(), relation: z.string() }))
        .default([]),
});

export type Motif = z.infer<typeof Motif>;
