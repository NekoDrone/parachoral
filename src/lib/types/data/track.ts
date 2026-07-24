import { Sources } from "#/lib/types/data";
import { z } from "zod";

export const TrackTimestamp = z
    .string()
    .regex(/^\d+:\d{2}(-\d+:\d{2})?$/, 'expected "m:ss" or "m:ss-m:ss"')
    .transform((raw) => {
        const toSeconds = (t: string) => {
            const [m, s] = t.split(":").map(Number);
            return m * 60 + s;
        };
        const [start, end] = raw.split("-");
        return {
            start: toSeconds(start),
            end: end ? toSeconds(end) : undefined,
        };
    });

export type TrackTimestamp = z.infer<typeof TrackTimestamp>;

export const TrackMotifs = z.object({
    motifSlug: z.string(), // slug → resolved against motif index
    origin: z.boolean().default(false), // ≤1 per motif across ALL tracks
    at: z.array(TrackTimestamp).min(1),
    note: z.string().optional(),
    clip: z.string().optional(),
});

export type TrackMotifs = z.infer<typeof TrackMotifs>;

export const Track = z.object({
    title: z.string(),
    composers: z.array(z.string()).min(1),
    description: z.string().optional(),
    links: Sources.optional(),
    albums: z
        .array(
            z.object({
                albumSlug: z.string(), // slug → album index
                track: z.number().int().positive(),
            }),
        )
        .default([]),
    playsIn: z
        .array(
            z.object({
                activitySlug: z.string(), // slug → activity index
                note: z.string().optional(),
            }),
        )
        .default([]),
    motifs: z.array(TrackMotifs).default([]),
});

export type Track = z.infer<typeof Track>;
