import { tracksParsed } from "#/lib/load";
import type { Release } from "#/lib/types/data/releases";
import { sortTracksByRelease } from "#/lib/utils/track";

export type ReleaseSection = {
    release: Release;
    tracks: typeof tracksParsed;
};

/**
 * The release-grouped sections of the tracks page, in release order. Groups left empty by
 * filtering are dropped, so this is exactly what gets rendered — the track list and the
 * spine that indexes it both read from here, and so cannot disagree on what exists.
 */
export const getReleaseSections = ({
    originsOnly,
}: {
    originsOnly: boolean;
}): Array<ReleaseSection> =>
    sortTracksByRelease(tracksParsed)
        .map(([, tracks]) => ({
            // Grouping is keyed on `track.release.slug`, so every track in a group carries
            // the same release. Groups are never empty, so [0] is always there.
            release: tracks[0].release,
            tracks: originsOnly
                ? tracks.filter((t) => t.motifs.some((m) => m.origin))
                : tracks,
        }))
        .filter(({ tracks }) => tracks.length !== 0);
