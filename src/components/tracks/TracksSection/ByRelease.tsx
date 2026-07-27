import { TrackRow } from "#/components/tracks/TrackRow";
import type { tracksParsed } from "#/lib/load";
import type { Release } from "#/lib/types/data/releases";
import { toRomanNumeral } from "#/lib/utils";
import { motion } from "motion/react";

export const ByRelease = ({
    release,
    tracks,
}: {
    release: Release;
    tracks: Array<(typeof tracksParsed)[number]>;
}) => {
    const tracksSorted = tracks.toSorted(
        (a, b) => a.albums[0].track - b.albums[0].track,
    );
    const releaseCardinality = Number.parseInt(release.slug.split("_")[0]);
    const tracksWithOrigins = tracksSorted.filter((t) =>
        t.motifs.some((m) => m.origin),
    );
    return (
        <motion.section
            className="pb-4"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
        >
            <header className="flex align-baseline items-center gap-4 mb-2">
                <span className="text-accent font-mono w-16 shrink-0 text-[13px]">
                    {releaseCardinality === 0
                        ? "Prelude"
                        : toRomanNumeral(releaseCardinality)}
                </span>
                <h2 className="font-medium text-2xl m-0">{release.name}</h2>
                <span className="text-subtext-1">{release.year}</span>
                <span className="flex-1 h-px bg-overlay-0" />
                <span className="text-subtext-1">
                    {tracksSorted.length}{" "}
                    {tracksSorted.length === 1 ? "track" : "tracks"} ·{" "}
                    {tracksWithOrigins.length}{" "}
                    {tracksWithOrigins.length === 1 ? "origin" : "origins"}
                </span>
            </header>

            <ul className="divide-y divide-overlay-0">
                {tracksSorted.map((t) => (
                    <TrackRow track={t} key={t.slug} />
                ))}
            </ul>
        </motion.section>
    );
};
