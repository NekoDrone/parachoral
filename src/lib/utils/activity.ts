import { releasesParsed } from "#/lib/load";
import { err, ok } from "#/lib/result";
import type { Result } from "#/lib/result";
import type { Release } from "#/lib/types/data/releases";

/**
 * Given the relative path to a activity's releaseSlug key, return the release that the activity belongs to.
 */
export const activityReleaseFromSlug = (
    slug: string,
): Result<Release, string> => {
    const res = releasesParsed.find((v) => v.slug === slug);
    if (!res)
        return err(
            `could not find given activity's release. an activity must have a release. received ${slug}`,
        );
    return ok(res);
};
