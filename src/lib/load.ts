import { unwrap, unwrapOr } from "#/lib/result";
import { Activity } from "#/lib/types/data/activity";
import { Album } from "#/lib/types/data/album";
import { Motif } from "#/lib/types/data/motif";
import { Releases } from "#/lib/types/data/releases";
import { Track } from "#/lib/types/data/track";
import { activityReleaseFromSlug } from "#/lib/utils/activity";
import { trackReleaseFromPath } from "#/lib/utils/track";
import { z } from "zod";

const releasesFile = import.meta.glob("/data/releases.yaml", {
    eager: true,
});
const motifFiles = import.meta.glob("/data/motifs/*.yaml", { eager: true });
const albumFiles = import.meta.glob("/data/albums/*.yaml", { eager: true });
const activityFiles = import.meta.glob("/data/activities/*/*.yaml", {
    eager: true,
});

const trackFiles = import.meta.glob("/data/tracks/*/*.yaml", {
    eager: true,
});

// Files at the wrong nesting level would silently not match — catch them.
const strayTracks = import.meta.glob("/data/tracks/*.yaml", { eager: true });
const strayActivities = import.meta.glob("/data/activities/*.yaml", {
    eager: true,
});

export const releasesParsed = (() => {
    const releasesParseResult = z
        .object({ default: Releases })
        .safeParse(Object.values(releasesFile)[0]);
    if (!releasesParseResult.success) {
        console.error(z.prettifyError(releasesParseResult.error));
        throw new Error(
            "`/data/releases.yaml` was not successfully parsed. Please check that the format of the yaml file follows that of the Releases schema.",
        );
    }

    return releasesParseResult.data.default;
})();

export const motifsParsed = Object.entries(motifFiles).map(([k, v]) => {
    const motifParse = Motif.safeParse(v);
    if (!motifParse.success) {
        console.error(z.prettifyError(motifParse.error));
        throw new Error(
            `\`${k}\` was not successfully parsed. Please check that the format of the yaml file follows that of the Motif schema.`,
        );
    }

    return motifParse.data;
});

export const albumsParsed = Object.entries(albumFiles).map(([k, v]) => {
    const albumParse = Album.safeParse(v);
    if (!albumParse.success) {
        console.error(z.prettifyError(albumParse.error));
        throw new Error(
            `\`${k}\` was not successfully parsed. Please check that the format of the yaml file follows that of the Album schema.`,
        );
    }
    return albumParse.data;
});

export const activitiesParsed = Object.entries(activityFiles)
    .concat(Object.entries(strayActivities))
    .map(([k, v]) => {
        const activityParse = Activity.safeParse(v);
        if (!activityParse.success) {
            console.error(z.prettifyError(activityParse.error));
            throw new Error(
                `\`${k}\` was not successfully parsed. Please check that the format of the yaml file follows that of the Activity schema.`,
            );
        }

        const segments = k.split("/");
        const activityDirectoryType = segments[segments.length - 2];
        if (activityParse.data.type !== activityDirectoryType) {
            throw new Error(
                `\`${k}\` was not successfully parsed. Please check that the you have placed the right activity type into the right folder. E.g. \`raid\`s should go into \`/data/activities/raid/last-wish.yaml\`. `,
            );
        }

        return {
            ...activityParse.data,
            // we force unwrap here because we want all activities to associate with a release
            // if an activity exists, it's probably gonna have been released at *some* point in the game
            // it does not make sense for an activity to be playable yet not be released into the game at some point in history.
            release: unwrap(
                activityReleaseFromSlug(activityParse.data.releaseSlug),
            ),
        };
    });

// TODO: Actually validate that the track's entries can resolve to the given slugs.
export const tracksParsed = Object.entries(trackFiles)
    .map(([k, v]) => {
        const trackParse = Track.safeParse(v);
        if (!trackParse.success) {
            console.error(z.prettifyError(trackParse.error));
            throw new Error(
                `\`${k}\` was not successfully parsed. Please check that the format of the yaml file follows that of the Track schema.`,
            );
        }

        return {
            ...trackParse.data,
            // if an activity is explicitly filed in a directory, we should assume that a release should be findable
            // so we actively force unwrap and crash if there's a nonexistent release on a track filed into a directory
            release: unwrap(trackReleaseFromPath(k)),
        };
    })
    .concat(
        // duplicate work because we need to treat failures from the trackReleaseFromPath function differently.
        Object.entries(strayTracks).map(([k, v]) => {
            const trackParse = Track.safeParse(v);
            if (!trackParse.success) {
                console.error(z.prettifyError(trackParse.error));
                throw new Error(
                    `\`${k}\` was not successfully parsed. Please check that the format of the yaml file follows that of the Track schema.`,
                );
            }

            return {
                ...trackParse.data,
                // but here, since we can collect stray tracks, we automatically assume stray tracks are either unreleased
                // or do not belong to a release.
                release: unwrapOr(trackReleaseFromPath(k), {
                    slug: "unreleased",
                    name: "Unreleased",
                    year: 0,
                }),
            };
        }),
    );
