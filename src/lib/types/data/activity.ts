import { z } from "zod";

export const Activity = z.object({
    name: z.string(),
    type: z.enum([
        "strike",
        "raid",
        "dungeon",
        "mission",
        "destination",
        "pvp-map",
        "menu",
        "cinematic",
        "other",
    ]),
    flavorText: z.string().optional(),
    description: z.string().optional(),
    releaseSlug: z.string(),
});

export type Activity = z.infer<typeof Activity>;
