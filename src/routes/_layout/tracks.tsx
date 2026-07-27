import { CountUp } from "#/components/animated/CountUp";
import { PageWrapper } from "#/components/page/PageWrapper";
import { SortStrategy, Toolbar } from "#/components/page/Toolbar";
import { ByRelease } from "#/components/tracks/TracksSection/ByRelease";
import { getReleaseBySlug } from "#/lib/data/get-release-by-slug";
import { tracksParsed } from "#/lib/load";
import { sortTracksByRelease } from "#/lib/utils/track";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
                    showOriginsToggle={true}
                    originsOnly={originsOnly}
                    setOriginsOnly={setOriginsOnly}
                    sortStrategy={sortStrategy}
                    setSortStrategy={setSortStrategy}
                    placeholder="Search by title, composer, motif, or activity"
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
                        <span> Title </span>
                        <span> Composers </span>
                        <span> Heard in </span>
                        <span className="text-right"> Motifs </span>
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

            return tracksByRelease.map(([releaseSlug, tracks], i) => {
                const release = getReleaseBySlug(releaseSlug);
                if (releaseSlug !== "unreleased" && !release.ok)
                    throw new Error(release.error);
                return (
                    <ByRelease
                        release={
                            release.ok
                                ? release.value
                                : {
                                    slug: "unreleased",
                                    name: "Unreleased",
                                    year: 0,
                                    shorthand: "UNRL",
                                }
                        }
                        tracks={tracks}
                        key={release.ok ? release.value.slug : i}
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
            throw new Error(
                "Provided SortStrategy went to default case in switch statemenet. Did you forget to handle the case?",
            );
    }

    throw new Error(
        "Provided SortStrategy did not correspond to a valid strategy.",
    );
};
