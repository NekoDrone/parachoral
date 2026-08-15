import { Diamond } from "#/components/misc/Diamond";
import { SectionHead } from "#/components/misc/SectionHead";
import { getTrackCountByMotifSlug } from "#/lib/data/get-track-count-by-motif-slug";
import { unwrapOr } from "#/lib/result";
import type { TrackMotifResolved } from "#/lib/types/data/track";
import { numToDuration } from "#/lib/utils";
import { Route } from "#/routes/_layout/track/$trackSlug";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export const TrackMotifs = () => {
    const track = Route.useLoaderData();
    return (
        <div>
            <SectionHead label="The Motifs" num={2} className="w-full mb-8" />
            <div className="divide-y divide-overlay-0 flex flex-col items-center">
                {track.motifs.map((m) => {
                    return <Motif motif={m} />;
                })}
            </div>
        </div>
    );
};

const Motif = ({ motif }: { motif: TrackMotifResolved }) => {
    const backlinkCount = unwrapOr(
        getTrackCountByMotifSlug(motif.motifSlug),
        0,
    );

    return (
        <motion.div
            className="relative pl-4 py-2 hover:bg-surface0 transition-colors w-[98%] grid grid-cols-[20px_1fr]"
            initial="rest"
            whileHover="hover"
            animate="rest"
        >
            <motion.div
                className="absolute left-0 top-0 h-full w-0.5 bg-accent"
                variants={{
                    rest: { opacity: 0 },
                    hover: { opacity: 1 },
                }}
                transition={{ type: "tween", duration: 0.15 }}
            />
            <Diamond filled={motif.origin} size={8} className="mt-3" />
            <div className="flex flex-col">
                <div className="flex gap-2 items-end">
                    {motif.origin && (
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-accent/5.5 to-transparent to-85%"
                        />
                    )}
                    <Link
                        className="text-2xl hover:text-accent transition-colors"
                        to="/motif/$motifSlug"
                        params={{ motifSlug: motif.motifSlug }}
                    >
                        {motif.motif.name}
                    </Link>
                    {motif.motif.aka.length > 0 && (
                        <span className="mb-1 font-light text-subtext-1 text-sm">
                            aka {motif.motif.aka.join(", ")}
                        </span>
                    )}
                </div>
                <div className="font-mono text-subtext-0 tracking-wide lowercase text-[11px]"><span>{motif.note}</span></div>
                {motif.origin && (
                    <div className="py-1">
                        <span className="font-mono text-xs uppercase text-accent-alt tracking-wide">
                            Motif's Origin
                        </span>
                    </div>
                )}
                <div className="divide-x divide-subtext-0 flex py-1">
                    {motif.at.map(({ start, end }) => {
                        return (
                            <span className="whitespace-nowrap font-mono text-xs text-subtext-1 px-2 first:pl-0 last:pr-0">
                                {numToDuration(start) +
                                    (end ? ` – ${numToDuration(end)}` : "")}
                            </span>
                        );
                    })}
                </div>
                <div>
                    <span>{motif.motif.description}</span>
                </div>
                <Link
                    className="uppercase font-sans tracking-[0.2em] text-[9px] text-subtext-0 py-2 hover:text-accent flex gap-1 items-center"
                    to="/motif/$motifSlug"
                    params={{ motifSlug: motif.motifSlug }}
                >
                    <span>
                        {backlinkCount} other appearance
                        {backlinkCount > 1 ? "s" : ""}
                    </span>
                    <ArrowRightIcon size={12}/>
                </Link>
            </div>
        </motion.div>
    );
};
