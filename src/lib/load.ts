import { Releases } from "#/lib/types/data/releases";
import { z } from "zod";

const releasesFile = import.meta.glob("/data/releases.yaml", {
    eager: true,
});
const trackFiles = import.meta.glob("/data/tracks/*/*.yaml", {
    eager: true,
});
const motifFiles = import.meta.glob("/data/motifs/*/*.yaml", { eager: true });
const albumFiles = import.meta.glob("/data/albums/*.yaml", { eager: true });
const activityFiles = import.meta.glob("/data/activities/*/*.yaml", {
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
        "/data/releases.yaml was not parsed properly. Please check to see that the format of the yaml file follows that of the Releases schema.",
    );
})();

export const test = () => { };
