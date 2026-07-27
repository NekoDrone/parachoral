import { Diamond } from "#/components/misc/Diamond";
import { getActivityBySlug } from "#/lib/data/get-activity-by-slug";
import { getMotifBySlug } from "#/lib/data/get-motif-by-slug";
import type { tracksParsed } from "#/lib/load";
import { secondsToMinSecondsString } from "#/lib/utils/datetime";
import { ArrowUpRightIcon, PlusIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const TrackRow = ({
    track,
}: {
    track: (typeof tracksParsed)[number];
}) => {
    const [open, setOpen] = useState(false);

    const hasOrigin = track.motifs.some((m) => m.origin);
    const trackMainActivityResult =
        track.playsIn.length > 0 &&
        getActivityBySlug(track.playsIn[0].activitySlug);

    return (
        <li
            className={
                "group" +
                (hasOrigin
                    ? " bg-linear-to-r from-accent/5.5 to-transparent to-55%"
                    : "") +
                (open ? " bg-text/3" : "")
            }
        >
            <button
                className="flex w-full justify-between items-center appearance-none bg-transparent border-0 text-left text-text pl-3 pr-[10px] py-[13px] transition-colors duration-180 ease-[ease] hover:bg-text/3 "
                onClick={() => {
                    setOpen(!open);
                }}
            >
                <div className="flex gap-2 items-center">
                    <span className="font-mono text-xs tracking-wide text-subtext-0 w-22">
                        {track.release.shorthand}-
                        {String(track.order).padStart(3, "0")}
                    </span>
                    <span className="font-serif text-[20px] leading-tight transition-colors w-64">
                        <Link
                            // @ts-expect-error i cannot be bothered to fix this
                            to={`/track/${track.slug}`}
                            className=" hover:text-accent transition-colors"
                        >
                            {track.title}
                        </Link>
                    </span>
                    <span className="text-[11.5px] tracking-[0.08em] overflow-hidden text-ellipsis whitespace-nowrap font-mono text-subtext-0 w-52">
                        {track.composers
                            .map((c) => c.split(" ")[c.split(" ").length - 1])
                            .join(" · ")}
                    </span>
                    <span className="font-mono text-subtext-1 uppercase">
                        {trackMainActivityResult && trackMainActivityResult.ok
                            ? `${trackMainActivityResult.value.name} · ${trackMainActivityResult.value.type}`
                            : "-"}
                    </span>
                </div>
                <div className="flex gap-6 items-center">
                    <span
                        className="flex gap-1.5 justify-end items-center"
                        title={
                            track.motifs.length
                                ? `${track.motifs.length} motif${track.motifs.length > 1 ? "s" : ""} tagged`
                                : "not yet transcribed"
                        }
                    >
                        {track.motifs.length ? (
                            track.motifs.map((m, i) => (
                                <Diamond key={i} filled={m.origin} size={8} />
                            ))
                        ) : (
                            <span className="font-mono text-subtext-0">—</span>
                        )}
                    </span>
                    <span
                        className="text-[15px] text-subtext-0 text-center transition-colors inline-block font-mono"
                        aria-hidden="true"
                    >
                        <PlusIcon
                            className="text-subtext-1 group-hover:text-accent group-hover:transform-[rotate(-45deg)] transition-all"
                            size={12}
                        />
                    </span>
                </div>
            </button>

            <div
                className={
                    "grid transition-all " +
                    (open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
                }
                role="region"
                aria-label={`Details for ${track.title}`}
            >
                <div className="overflow-hidden">
                    <div className="pt-0.5 pl-24 pb-6 pr-12">
                        {track.description && (
                            <p className="text-[16px] text-subtext-1 my-1 max-w-[60ch] font-medium">
                                {track.description}
                            </p>
                        )}

                        {track.motifs.length > 0 ? (
                            <ul className="list-none m-0 p-0 divide-y divide-overlay-0">
                                {track.motifs.map((m, i) => {
                                    const motifResolved = getMotifBySlug(
                                        m.motifSlug,
                                    );

                                    return (
                                        <li
                                            key={i}
                                            className="flex flex-col gap-2 py-3"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-end gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="justify-self-center">
                                                            <Diamond
                                                                filled={
                                                                    m.origin
                                                                }
                                                                size={8}
                                                            />
                                                        </span>
                                                        {motifResolved.ok && (
                                                            <Link
                                                                // @ts-expect-error same shit.
                                                                to={`/motif/${m.motifSlug}`}
                                                                className="font-serif text-[18px] hover:text-accent transition-colors"
                                                            >
                                                                {
                                                                    motifResolved
                                                                        .value
                                                                        .name
                                                                }
                                                            </Link>
                                                        )}
                                                    </div>
                                                    <span className="text-[9.5px] tracking-[0.26em] uppercase font-mono text-subtext-1 pb-1">
                                                        {m.origin
                                                            ? "origin"
                                                            : "reprise"}
                                                    </span>
                                                </div>
                                                <span className="flex gap-1.5">
                                                    {m.at.map((ts) => (
                                                        <span
                                                            key={ts.start}
                                                            className="text-[10.5px] border border-solid border-text/13 py-0.5 px-1 font-mono text-subtext-1"
                                                        >
                                                            {secondsToMinSecondsString(
                                                                ts.start,
                                                            )}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                            {m.note && (
                                                <span className="col-[2/-1] italic text-[14.5px] text-subtext-1 font-normal">
                                                    {m.note}
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="italic text-[15px] text-text/50 my-[6px]">
                                No motifs have been heard in this track.
                                Disagree?{" "}
                                <a
                                    href="https://github.com/NekoDrone/parachoral"
                                    className="text-accent hover:text-text"
                                >
                                    Submit a change
                                </a>
                                .
                            </p>
                        )}

                        {track.links && (
                            <p className="text-[11px] tracking-widest mt-4 font-mono flex gap-2">
                                <span className="text-subtext-1">Listen —</span>
                                {track.links.map((l, i) => (
                                    <>
                                        <a
                                            key={l.source}
                                            href={l.url}
                                            className="text-accent hover:text-text transition-colors flex"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {l.source}{" "}
                                            <span>
                                                <ArrowUpRightIcon size={8} />
                                            </span>
                                        </a>
                                        {track.links &&
                                            i < track.links.length - 1 ? (
                                            <span className="text-subtext-0">
                                                {" "}
                                                ·{" "}
                                            </span>
                                        ) : null}
                                    </>
                                ))}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
};
