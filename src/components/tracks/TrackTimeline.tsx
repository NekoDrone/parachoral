import { SectionHead } from "#/components/misc/SectionHead";
import { Tooltip } from "#/components/misc/Tooltip";
import { durationToNum, numToDuration } from "#/lib/utils";
import { Route } from "#/routes/_layout/track/$trackSlug";
import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";

const fmt = numToDuration;

export const TrackTimeline = () => {
    const track = Route.useLoaderData();
    const { motifs, duration: durationStr } = track;
    const duration = durationToNum(durationStr);
    const minutes = [];
    for (let t = 0; t < duration; t += 60) minutes.push(t);
    minutes.push(duration);

    // if no motif, guarantee rendering track line
    if (motifs.length === 0)
        motifs.push({
            motif: {
                name: track.title,
                aka: [],
                description: "Placeholder for track title",
                related: [],
            },
            origin: false,
            at: [{ start: 0, end: undefined }],
            motifSlug: "",
        });

    return (
        <section className="px-0 pt-[56px] pb-[8px] flex flex-col gap-2 items-center justify-center">
            <SectionHead label="The Score" num={1} />
            <div
                className="w-[90%] mx-auto"
                style={
                    { "--label-w": "9rem", "--gap": "1.5rem" } as CSSProperties
                }
            >
                <div className="relative">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 right-0"
                        style={{ left: "calc(var(--label-w) + var(--gap))" }}
                    >
                        {minutes.map((t) => (
                            <span
                                key={t}
                                className="absolute inset-y-0 w-px bg-overlay-0"
                                style={{ left: `${(t / duration) * 100}%` }}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-[var(--label-w)_1fr] gap-x-(--gap) w-full">
                        {motifs.map((m) => (
                            <div
                                key={m.motif.name}
                                className={
                                    "grid grid-cols-subgrid col-span-2 gap-6 h-12 items-center" +
                                    (m.origin ? " relative isolate z-10" : "")
                                }
                            >
                                {m.origin && (
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute -inset-2 -z-10 col-span-2 bg-radial-[ellipse_80%_40%_at_50%_50%] from-accent/5.5 to-transparent to-85%"
                                    />
                                )}
                                <Tooltip
                                    tooltip={
                                        <span className="whitespace-nowrap font-mono text-xs text-subtext-1">
                                            {m.motif.description}
                                        </span>
                                    }
                                    showCaret={false}
                                    tooltipClassName="translate-y-1/2 bg-surface1 py-1 px-1 border-overlay-0 border-2 mb-4 -translate-x-1/4"
                                >
                                    <Link
                                        className="font-sans uppercase tracking-[0.2em] text-subtext-1 text-xs whitespace-nowrap hover:text-accent transition-colors"
                                        to="/motif/$motifSlug"
                                        params={{ motifSlug: m.motifSlug }}
                                    >
                                        {m.motif.name}
                                    </Link>
                                </Tooltip>
                                <div className="relative flex items-center border-l border-overlay-0 h-full">
                                    <span className="h-px w-full bg-overlay-0" />
                                    {m.at.map((t) => (
                                        <TrackNodeDiamond
                                            timestamp={t}
                                            duration={duration}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative h-6 ml-[calc(var(--label-w)+var(--gap))]">
                    {minutes.map((t, i) => (
                        <span
                            key={t}
                            className="absolute top-2 font-mono text-[10px] tabular-nums text-subtext-0"
                            style={{
                                left: `${(t / duration) * 100}%`,
                                transform:
                                    i === 0
                                        ? "none"
                                        : i === minutes.length - 1
                                            ? "translateX(-100%)"
                                            : "translateX(-50%)",
                            }}
                        >
                            {fmt(t)}
                        </span>
                    ))}
                </div>

                <div className="pt-4 text-end text-xs text-subtext-0 tracking-wider">
                    hover over the nodes to see the precise timestamp a motif
                    occurs in
                </div>
            </div>
        </section>
    );
};

const TrackNodeDiamond = ({
    timestamp: { start, end },
    duration,
}: {
    timestamp: { start: number; end?: number };
    duration: number;
}) => {
    const pct = (t: number) => `${(t / duration) * 100}%`;

    return (
        <div
            className="absolute inset-y-0"
            style={{
                left: pct(start),
                width: end === undefined ? 0 : pct(end - start),
            }}
        >
            <Tooltip
                tooltip={
                    <span className="whitespace-nowrap font-mono text-xs text-subtext-1">
                        {numToDuration(start) +
                            (end ? ` – ${numToDuration(end)}` : "")}
                    </span>
                }
                showCaret={false}
                tooltipClassName="translate-y-1/2 bg-surface1 py-1 px-1 border-overlay-0 border-2 mb-4"
            >
                {end !== undefined && (
                    <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-accent/60" />
                )}
                <span className="absolute left-0 top-1/2 size-[9px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
                {end !== undefined && (
                    <span className="absolute right-0 top-1/2 size-[6px] translate-x-1/2 -translate-y-1/2 rotate-45 border border-accent/70" />
                )}
            </Tooltip>
        </div>
    );
};
