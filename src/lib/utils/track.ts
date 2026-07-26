import type { tracksParsed } from "#/lib/load";
import { releasesParsed } from "#/lib/load";
import { err, ok } from "#/lib/result";
import type { Result } from "#/lib/result";
import type { Release } from "#/lib/types/data/releases";

/**
 * Given the relative path to a track's YAML file, return the release that the track is filed under.
 */
export const trackReleaseFromPath = (path: string): Result<Release, string> => {
    const arr = path.split("/");
    const releaseString = arr[arr.length - 2];
    const res = releasesParsed.find((v) => v.slug === releaseString);
    if (!res)
        return err(
            `could not find given track's release slug, received ${path}`,
        );
    return ok(res);
};

export const sortTracksByRelease = (
    tracks: typeof tracksParsed,
)  => {
    const collator = new Intl.Collator(undefined, { numeric: true });

    const groups = Map.groupBy(tracks, (track) => track.release.slug);
    return [...groups].sort(([a], [b]) => collator.compare(a, b))
};
