import { SectionHead } from "#/components/misc/SectionHead";
import type { TrackMotifResolved } from "#/lib/types/data/track";
import { Route } from "#/routes/_layout/track/$trackSlug";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export const TrackMotifs = () => {
    const track = Route.useLoaderData();
    return (
        <div>
            <SectionHead label="The Motifs" num={2} className="w-full mb-8" />
            <div className="divide-y divide-overlay-0">
                {track.motifs.map((m) => {
                    return <Motif motif={m} />;
                })}
            </div>
        </div>
    );
};

const Motif = ({ motif }: { motif: TrackMotifResolved }) => {
    return (
        <motion.div
            className="relative pl-2"
            initial="rest"
            whileHover="hover"
            animate="rest"
        >
            <motion.div
                className="absolute left-0 top-0 h-full w-1 bg-accent"
                style={{ originX: 0 }}
                variants={{
                    rest: { scaleX: 0 },
                    hover: { scaleX: 1 },
                }}
                transition={{ type: "tween", duration: 0.15 }}
            />
            <div>
                <Link
                    className="text-xl font-semibold hover:text-accent transition-colors"
                    to="/motif/$motifSlug"
                    params={{ motifSlug: motif.motifSlug }}
                >
                    {motif.motif.name}
                </Link>
            </div>
        </motion.div>
    );
};
