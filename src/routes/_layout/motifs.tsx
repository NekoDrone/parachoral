import { PageWrapper } from "#/components/page/PageWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/motifs")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <PageWrapper>
            <div>Hello "/motifs"!</div>
        </PageWrapper>
    );
}
