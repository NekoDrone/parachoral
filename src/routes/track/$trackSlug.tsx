import { getTrackBySlug } from "#/lib/data/get-track-by-slug";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/track/$trackSlug")({
    loader: ({ params }) => {
        const track = getTrackBySlug(params.trackSlug);
        if (!track.ok) throw notFound();
        return track.value;
    },
    notFoundComponent: () => <p>No track with that name in the songbook.</p>,
    component: RouteComponent,
});

function RouteComponent() {
    const { trackSlug } = Route.useParams();
    return <div>Hello "/track/$trackSlug"!</div>;
}
