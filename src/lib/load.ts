import { unwrapOr } from "#/lib/result";
import { Releases } from "#/lib/types/data/releases";
import { Track } from "#/lib/types/data/track";
import { trackReleaseFromPath } from "#/lib/utils/track";
import { z } from "zod";

const releasesFile = import.meta.glob("/data/releases.yaml", {
    eager: true,
});
const motifFiles = import.meta.glob("/data/motifs/*/*.yaml", { eager: true });
const albumFiles = import.meta.glob("/data/albums/*.yaml", { eager: true });
const activityFiles = import.meta.glob("/data/activities/*/*.yaml", {
    eager: true,
});

const trackFiles = import.meta.glob("/data/tracks/*/*.yaml", {
    eager: true,
});

// Files at the wrong nesting level would silently not match — catch them.
const strayTracks = import.meta.glob("/data/tracks/*.yaml", { eager: true });
const strayMotifs = import.meta.glob("/data/motifs/*.yaml", { eager: true });
const strayActivities = import.meta.glob("/data/activities/*.yaml", {
    eager: true,
});

export const releasesParsed = (() => {
    const releasesParseResult = z
        .object({ default: Releases })
        .safeParse(Object.values(releasesFile)[0]);
    if (releasesParseResult.success) return releasesParseResult.data.default;
    console.error(z.prettifyError(releasesParseResult.error));
    throw new Error(
        "`/data/releases.yaml` was not successfully parsed. Please check that the format of the yaml file follows that of the Releases schema.",
    );
})();

export const test = () => {
    console.log(tracksParsed);
};

export const tracksParsed = Object.entries(trackFiles)
    .concat(Object.entries(strayTracks))
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
            release: unwrapOr(trackReleaseFromPath(k), {
                slug: "unreleased",
                name: "Unreleased",
                year: 0,
            }),
        };
    });
