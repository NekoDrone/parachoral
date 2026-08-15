import { Diamond } from "#/components/misc/Diamond";
import { SectionHead } from "#/components/misc/SectionHead";
import { getReleaseBySlug } from "#/lib/data/get-release-by-slug";
import { unwrap } from "#/lib/result";
import { humaniseSourceType } from "#/lib/utils/data";
import { Route } from "#/routes/_layout/track/$trackSlug";
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

export const TrackActivities = () => {
    return (
        <div>
            <SectionHead label="Plays in" num={3} className="w-full mb-2" />
            <PlaysIn />
            <SectionHead label="Sources" num={4} className="w-full mb-2" />
            <Sources />
        </div>
    );
};

const PlaysIn = () => {
    const track = Route.useLoaderData();
    return (
        <div className="pb-4 flex flex-col gap-2">
            {track.playsIn.length > 0 ? (
                track.playsIn.map((a) => {
                    const activityRelease = unwrap(
                        getReleaseBySlug(a.activity.releaseSlug),
                    );
                    return (
                        <div className="border border-overlay-0 bg-surface0 px-4 py-4 flex flex-col gap-1">
                            <Link
                                to="/activity/$activitySlug"
                                params={{ activitySlug: a.activitySlug }}
                                className="hover:text-accent transition-colors text-lg"
                            >
                                {a.activity.name}
                            </Link>
                            <span className="font-mono uppercase tracking-widest text-xs text-subtext-0">
                                {a.activity.type} · {activityRelease.name} —{" "}
                                {activityRelease.year}
                            </span>{" "}
                            <span className="text-subtext-1 italic text-sm tracking-wide">
                                {a.note}
                            </span>{" "}
                            <Link
                                className="uppercase font-sans tracking-[0.2em] text-[9px] text-subtext-0 py-1 hover:text-accent flex gap-1 items-center"
                                to="/activity/$activitySlug"
                                params={{ activitySlug: activityRelease.slug }}
                            >
                                <span>See more</span>
                                <ArrowRightIcon size={12} />
                            </Link>
                        </div>
                    );
                })
            ) : (
                <div>
                    <span className="italic text-sm text-subtext-0 tracking-wide">
                        ...nowhere! This track does not play in an activity.
                        Disagree?{" "}
                        <a
                            href="https://github.com/NekoDrone/parachoral"
                            target="_blank"
                            className="text-accent hover:text-text"
                        >
                            Submit a change
                        </a>
                    </span>
                </div>
            )}
        </div>
    );
};

const Sources = () => {
    const track = Route.useLoaderData();
    return (
        track.links && (
            <div className="pb-4 flex flex-col gap-2">
                {track.links.map((l) => {
                    return (
                        <div className="flex gap-3 items-center">
                            <Diamond filled={true} size={4} />
                            <a
                                href={l.url}
                                className="hover:text-accent transition-colors text-lg flex gap-1 items-center"
                                target="_blank"
                            >
                                {humaniseSourceType(l.source)}
                                <ArrowUpRightIcon size={10} />
                            </a>
                        </div>
                    );
                })}
            </div>
        )
    );
};
