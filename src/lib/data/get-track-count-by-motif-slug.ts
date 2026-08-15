import { motifsMap, tracksParsed } from "#/lib/load";
import { err, ok } from "#/lib/result";
import type { Result } from "#/lib/result";

export const getTrackCountByMotifSlug = (
    slug: string,
): Result<number, string> => {
    if (!motifsMap.has(slug))
        return err(`Could not find motif from given slug: ${slug}`);

    const count = tracksParsed.filter((track) =>
        track.motifs.some((m) => m.motifSlug === slug),
    ).length;

    return ok(count);
};
