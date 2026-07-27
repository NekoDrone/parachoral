import { CountUp } from "#/components/animated/CountUp";
import { DropdownModal } from "#/components/dropdown/DropdownModal";
import { Diamond } from "#/components/misc/Diamond";
import { PageWrapper } from "#/components/page/PageWrapper";
import { getActivityBySlug } from "#/lib/data/get-activity-by-slug";
import { getMotifBySlug } from "#/lib/data/get-motif-by-slug";
import { getReleaseBySlug } from "#/lib/data/get-release-by-slug";
import { tracksParsed } from "#/lib/load";
import type { Release } from "#/lib/types/data/releases";
import { toRomanNumeral } from "#/lib/utils";
import type { Enumify } from "#/lib/utils";
import { secondsToMinSecondsString } from "#/lib/utils/datetime";
import { sortTracksByRelease } from "#/lib/utils/track";
import {
    ArrowUpRightIcon,
    CaretDownIcon,
    PlusIcon,
} from "@phosphor-icons/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

const SortStrategy = {
    RELEASE: "Release",
    TITLE: "Title",
    COMPOSER: "Composer",
    DATE: "Date",
} as const;
type SortStrategy = Enumify<typeof SortStrategy>;

export const Route = createFileRoute("/_layout/tracks")({
    component: RouteComponent,
});

function RouteComponent() {
    const [query, setQuery] = useState("");
    const [originsOnly, setOriginsOnly] = useState(false);
    const [sortStrategy, setSortStrategy] = useState<SortStrategy>(
        SortStrategy.RELEASE,
    );

    return (
        <PageWrapper variant="half">
            <section className="pt-16 max-w-[1080px]">
                <p className="font-light font-sans text-accent uppercase tracking-[0.42em] text-[11px] m-0">
                    Arranged by
                </p>
                <h1 className="font-medium text-[42px] tracking-wide">
                    Tracks
                </h1>
                <p className="text-[18px] text-subtext-1  max-w-xl">
                    There are{" "}
                    <CountUp
                        to={tracksParsed.length}
                        className="text-accent-alt underline"
                        duration={1}
                        startOnView={false}
                    />{" "}
                    tracks across Destiny's history. Each of them bringing to
                    life the way a Guardian feels in a particular moment. This
                    is every one of them.
                </p>
                <Toolbar
                    query={query}
                    setQuery={setQuery}
                    originsOnly={originsOnly}
                    setOriginsOnly={setOriginsOnly}
                    sortStrategy={sortStrategy}
                    setSortStrategy={setSortStrategy}
                />
            </section>

            <div className="grid grid-cols-[54px_1fr] gap-8 pt-7">
                <nav className="sticky top-27 self-start flex flex-col gap-0.5 border-l border-solid border-text-text/13"></nav>
                <div>
                    <div
                        className="text-[10px] tracking-[0.28em] uppercase pt-0 pr-[10px] pb-[12px] pl-1 border-b border-text/13 font-mono text-subtext-0 grid grid-cols-[86px_1.5fr_1.25fr_1.05fr_108px_26px] gap-4 items-baseline mb-6"
                        aria-hidden="true"
                    >
                        <span>No.</span>
                        <span>Title</span>
                        <span>Composers</span>
                        <span>Heard in</span>
                        <span className="text-right">Motifs</span>
                        <span />
                    </div>
                    <TracksSectionWrapper
                        query={query}
                        originsOnly={originsOnly}
                        sortStrategy={sortStrategy}
                    />
                </div>
            </div>
        </PageWrapper>
    );
}

const Toolbar = ({
    query,
    setQuery,
    originsOnly,
    setOriginsOnly,
    sortStrategy,
    setSortStrategy,
}: {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    originsOnly: boolean;
    setOriginsOnly: Dispatch<SetStateAction<boolean>>;
    sortStrategy: SortStrategy;
    setSortStrategy: Dispatch<SetStateAction<SortStrategy>>;
}) => {
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    return (
        <div className="flex items-center flex-wrap mt-8 gap-4 justify-between">
            <div className="flex items-center flex-wrap gap-4">
                <label className="flex items-center border border-text/13 bg-surface0/50 px-[14px] py-[11px] transition-colors duration-200 ease-[ease] focus-within:border-accent/40">
                    <input
                        className="bg-transparent border-0 outline-0 text-text font-mono font-light text-[12.5px] w-[330px] max-w-[60vw] placeholder:text-text/50"
                        type="search"
                        placeholder="Search by title, composer, motif, or activity"
                        aria-label="Search tracks"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>
                <button
                    className={
                        "appearance-none bg-transparent border border-text/13 text-text/70 font-sans font-normal text-[11px] tracking-[0.24em] uppercase px-[18px] py-[12px] inline-flex items-center gap-[10px] transition-colors duration-200 ease-[ease] hover:border-accent/40 hover:text-text" +
                        (originsOnly ? "border-accent text-accent" : "")
                    }
                    aria-pressed={originsOnly}
                    onClick={() => setOriginsOnly(!originsOnly)}
                >
                    <Diamond filled={originsOnly} size={7} /> Origins only
                </button>
                <DropdownModal
                    buttonComponent={
                        <div
                            role="button"
                            className="appearance-none bg-transparent border border-text/13 text-text/70 font-sans font-normal text-[11px] tracking-[0.24em] uppercase px-[18px] py-[12px] inline-flex items-center gap-[10px] transition-colors duration-200 ease-[ease] hover:border-accent/40 hover:text-text"
                        >
                            Sorted by {sortStrategy} <CaretDownIcon />
                        </div>
                    }
                    className="flex flex-col gap-3 bg-base border-overlay-1 border p-3 mt-2 ml-1 items-start"
                    showDropdownState={showSortDropdown}
                    setShowDropdownState={setShowSortDropdown}
                >
                    {Object.values(SortStrategy).map((strategy) => (
                        <div
                            role="button"
                            className="font-sans text-[11px] font-light uppercase tracking-[0.28em] text-subtext-1 transition-colors duration-200 hover:text-accent"
                            onClick={() => {
                                setSortStrategy(strategy);
                                console.log("Setting!!");
                                setShowSortDropdown(false);
                            }}
                            key={strategy}
                        >
                            {strategy}
                        </div>
                    ))}
                </DropdownModal>
                <button
                    className={
                        "transition-colors " +
                        (query !== "" ||
                            originsOnly ||
                            sortStrategy !== SortStrategy.RELEASE
                            ? "text-subtext-1  hover:text-accent"
                            : "text-subtext-0")
                    }
                    onClick={() => {
                        setQuery("");
                        setOriginsOnly(false);
                        setSortStrategy(SortStrategy.RELEASE);
                    }}
                >
                    reset
                </button>
            </div>{" "}
            <div className="flex gap-2 items-center">
                <AnimatePresence initial={false}>
                    {(query !== "" || originsOnly) && (
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 24 }}
                            transition={{ duration: 0.1, ease: "easeOut" }}
                        >
                            <p className="text-subtext-1 italic">
                                37 tracks found.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Diamond filled={query !== "" || originsOnly} />
            </div>
        </div>
    );
};

const TracksSectionWrapper = ({
    query,
    originsOnly,
    sortStrategy,
}: {
    query: string;
    originsOnly: boolean;
    sortStrategy: SortStrategy;
}) => {
    switch (sortStrategy) {
        case SortStrategy.RELEASE:
            // eslint-disable-next-line no-case-declarations
            const tracksByRelease = sortTracksByRelease(tracksParsed);

            return tracksByRelease.map(([releaseSlug, tracks]) => {
                const release = getReleaseBySlug(releaseSlug);
                if (!release.ok) throw new Error(release.error);
                return (
                    <TrackSection
                        release={release.value}
                        tracks={tracks}
                        originsOnly={originsOnly}
                    />
                );
            });
        case SortStrategy.COMPOSER:
            break;
        case SortStrategy.TITLE:
            break;
        case SortStrategy.DATE:
            break;
        default:
    }

    return <p>Tracks Section Wrapper</p>;
};

const TrackSection = ({
    release,
    tracks,
    originsOnly,
}: {
    release: Release;
    tracks: Array<(typeof tracksParsed)[number]>;
    originsOnly: boolean;
}) => {
    const releaseCardinality = Number.parseInt(release.slug.split("_")[0]);
    const tracksWithOrigins = tracks.filter((t) =>
        t.motifs.some((m) => m.origin),
    );
    return (
        <section className="pb-4">
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
                    {tracks.length} {tracks.length === 1 ? "track" : "tracks"} ·{" "}
                    {tracksWithOrigins.length}{" "}
                    {tracksWithOrigins.length === 1 ? "origin" : "origins"}
                </span>
            </header>

            <ul className="divide-y divide-overlay-0">
                {originsOnly
                    ? tracksWithOrigins.map((t) => <TrackRow track={t} />)
                    : tracks.map((t) => <TrackRow track={t} />)}
            </ul>
        </section>
    );
};

const TrackRow = ({ track }: { track: (typeof tracksParsed)[number] }) => {
    const [open, setOpen] = useState(false);

    const hasOrigin = track.motifs.some((m) => m.origin);
    const trackMainActivityResult =
        track.playsIn.length > 0 &&
        getActivityBySlug(track.playsIn[0].activitySlug);
    const trackTotalNumber =
        tracksParsed.findIndex(
            (t) => t.slug === track.slug && t.release === track.release,
        ) + 1;

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
                        PCH-{String(trackTotalNumber).padStart(3, "0")}
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
