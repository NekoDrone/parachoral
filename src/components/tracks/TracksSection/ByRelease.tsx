import { TrackRow } from "#/components/tracks/TrackRow";
import type { tracksParsed } from "#/lib/load";
import type { Release } from "#/lib/types/data/releases";
import { releaseNumeralLabel, releaseSectionId } from "#/lib/utils/release";
import { motion } from "motion/react";

export const ByRelease = ({
    release,
    tracks,
}: {
    release: Release;
    tracks: Array<(typeof tracksParsed)[number]>;
}) => {
    const tracksSorted = tracks.toSorted((a, b) => a.order - b.order);
    const tracksWithOrigins = tracksSorted.filter((t) =>
        t.motifs.some((m) => m.origin),
    );
    return (
        <motion.section
            id={releaseSectionId(release.slug)}
            // Focusable so a jump from the spine lands here; scroll-mt matches the spine's
            // own `top-27` so the heading settles level with it instead of at the edge.
            tabIndex={-1}
            className="pb-4 scroll-mt-27 outline-none"
            initial={{ opacity: 0, y: -24 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
        >
            <header className="flex align-baseline items-center gap-4 mb-2">
                <span className="text-accent font-mono w-16 shrink-0 text-[13px]">
                    {releaseNumeralLabel(release)}
                </span>
                {/* TODO: Resolve full release object, then change this h2 to a link component that brings you to the release page. */}
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
