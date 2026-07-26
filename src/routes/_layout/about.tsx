import { PageWrapper } from "#/components/page/PageWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/about")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <PageWrapper>
            <div>Hello "/about"!</div>
        </PageWrapper>
    );
}
