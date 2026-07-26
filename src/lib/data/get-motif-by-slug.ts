import { motifsMap } from "#/lib/load";
import { err, ok } from "#/lib/result";
import type { Result } from "#/lib/result";
import type { Motif } from "#/lib/types/data/motif";

export const getMotifBySlug = (slug: string): Result<Motif, string> => {
    const motif = motifsMap.get(slug);
    if (!motif) return err(`Could not find motif from given slug: ${slug}`);

    return ok(motif);
};
