import { getTrackBySlug } from "#/lib/data/get-track-by-slug";
import { motifsMap, tracksParsed } from "#/lib/load";
import { err, ok } from "#/lib/result";
import type { Result } from "#/lib/result";
import type { TrackResolved } from "#/lib/types/data/track";

export const getTracksByMotifSlug = (
    slug: string,
): Result<Array<TrackResolved>, string> => {
    if (!motifsMap.has(slug))
        return err(`Could not find motif from given slug: ${slug}`);

    const matches = tracksParsed.filter((track) =>
        track.motifs.some((m) => m.motifSlug === slug),
    );

    const resolved: Array<TrackResolved> = [];
    for (const track of matches) {
        const result = getTrackBySlug(track.slug);
        if (!result.ok) return result; // propagate first resolution error
        resolved.push(result.value);
    }

    return ok(resolved);
};
