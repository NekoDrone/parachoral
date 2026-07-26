import { PageWrapper } from "#/components/page/PageWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/activities")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <PageWrapper>
            <div>Hello "/_layout/activities"!</div>
        </PageWrapper>
    );
}
