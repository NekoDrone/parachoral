import { Diamond } from "#/components/misc/Diamond";
import { RuleMark } from "#/components/misc/RuleMark";
import { Breadcrumb } from "#/components/nav/Breadcrumb";
import { PageWrapper } from "#/components/page/PageWrapper";
import { TrackTimeline } from "#/components/tracks/TrackTimeline";
import { getTrackBySlug } from "#/lib/data/get-track-by-slug";
import { useAtmosphereColor } from "#/lib/hooks/useAtmosphere";
import { tracksMap } from "#/lib/load";
import { durationToNum, toRomanNumeral } from "#/lib/utils";
import {
    DEFAULT_ATMOSPHERE_COLOR,
    RELEASE_ATMORPHSERE_COLOR,
} from "#/lib/utils/color";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/_layout/track/$trackSlug")({
    loader: ({ params }) => {
        const track = getTrackBySlug(params.trackSlug);
        if (!track.ok)
            throw notFound({
                data: {
                    err: track.error,
                    slug: params.trackSlug,
                    map: tracksMap,
                },
            });
        return track.value;
    },
    notFoundComponent: (e) => {
        if (
            e.data === undefined ||
            e.data === null ||
            !(typeof e.data === "object" && "err" in e.data) ||
            !(typeof e.data === "object" && "slug" in e.data) ||
            !(typeof e.data === "object" && "map" in e.data)
        )
            throw new Error(
                "Track not found but no data to support it. Something went very wrong.",
            );

        const { data } = e;
        const { err, slug, map } = data;

        if (typeof err !== "string")
            throw new Error("mismatched error data from track slug lookup.");

        if (typeof slug !== "string")
            throw new Error("mismatched slug data from track slug lookup.");

        if (!(map instanceof Map))
            throw new Error("mismatched map data from track slug lookup.");

        return (
            <div>
                <p>No track with that name in the songbook.</p>
                <p>Error details:</p>
                <p>err: {err}</p>
                <p>slug: {slug}</p>
                <p>map: {JSON.stringify(Array.from(map.entries()))}</p>
            </div>
        );
    },
    component: RouteComponent,
});

function RouteComponent() {
    const track = Route.useLoaderData();
    const { release } = track;
    const releaseCardinality = Number.parseInt(release.slug.split("_")[0]);
    const atmosphereColor =
        RELEASE_ATMORPHSERE_COLOR[release.slug] ?? DEFAULT_ATMOSPHERE_COLOR;
    useAtmosphereColor(atmosphereColor);

    return (
        <PageWrapper variant="half">
            <Breadcrumb />
            <section className="pt-20 max-w-[1080px] flex flex-col items-center">
                <div className="font-sans font-light text-[11px] text-subtext-0 uppercase tracking-[0.24em] flex gap-4 items-center">
                    <span>
                        {releaseCardinality === 0
                            ? "Prelude"
                            : toRomanNumeral(releaseCardinality)}{" "}
                        - {track.release.name}
                    </span>
                    <Diamond filled size={5} />
                    <span>
                        {release.shorthand}-
                        {String(track.order).padStart(3, "0")}
                    </span>
                </div>
                <h2 className="tracking-wide text-7xl font-normal uppercase mt-4">
                    {track.title}
                </h2>
                <div className="italic text-subtext-1 mt-3 flex gap-2 tracking-wide text-[16px] font-light">
                    {track.composers.map((c, i) =>
                        i === track.composers.length - 1 ? (
                            <span key={c}>{c}</span>
                        ) : (
                            <Fragment key={c}>
                                <span>{c}</span>
                                <span>·</span>
                            </Fragment>
                        ),
                    )}
                </div>
            </section>
            <RuleMark width={600} className="mx-auto" />
            <section className="pt-8 max-w-[1080px] flex flex-col items-center gap-6">
                <div className="font-sans font-light text-[11px] text-subtext-1 uppercase tracking-[0.24em] flex gap-3 items-center">
                    <span>
                        {track.release.name}, Tr. {track.order}
                    </span>
                    <Diamond filled={false} size={3} />
                    <span>{toRomanNumeral(track.release.year)}</span>
                    <>
                        <Diamond filled={false} size={3} />
                        <span>{track.duration}</span>
                    </>
                    {track.motifs.some((m) => m.origin) && (
                        <Fragment>
                            <Diamond filled={false} size={3} />
                            <span>
                                Origin of:{" "}
                                <Link
                                    /* @ts-expect-error yay tanstack router type safety. boo cause i can't give it nice strings. */
                                    to={`/motif/${track.motifs.find((m) => m.origin)?.motifSlug}`}
                                    className="hover:text-accent text-text transition-colors"
                                >
                                    {
                                        track.motifs.find((m) => m.origin)
                                            ?.motif.name
                                    }
                                </Link>
                            </span>
                        </Fragment>
                    )}
                </div>
                {track.description && (
                    <p className="text-lg text-wrap max-w-120 text-center">
                        {track.description}
                    </p>
                )}
            </section>
            <TrackTimeline
                track={track}
            />
        </PageWrapper>
    );
}
