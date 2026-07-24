import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/track/$trackSlug")({
    component: RouteComponent,
});

function RouteComponent() {
    const { trackSlug } = Route.useParams();
    return <div>Hello "/track/$trackSlug"!</div>;
}
