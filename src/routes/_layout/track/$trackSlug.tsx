import { PageWrapper } from "#/components/page/PageWrapper";
import { getTrackBySlug } from "#/lib/data/get-track-by-slug";
import { tracksMap } from "#/lib/load";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { string } from "zod";

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
    const { trackSlug } = Route.useParams();
    return (
        <PageWrapper>
            <div>Hello "/track/$trackSlug"!</div>
        </PageWrapper>
    );
}
