import { releasesMap } from "#/lib/load";
import { err, ok } from "#/lib/result";
import type { Result } from "#/lib/result";
import type { Release } from "#/lib/types/data/releases";

export const getReleaseBySlug = (slug: string): Result<Release, string> => {
    const release = releasesMap.get(slug);
    if (!release) return err(`Could not find release from given slug: ${slug}`);

    return ok(release);
};
