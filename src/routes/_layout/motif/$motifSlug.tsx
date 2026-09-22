import { Breadcrumb } from "#/components/nav/Breadcrumb";
import { PageWrapper } from "#/components/page/PageWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/motif/$motifSlug")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <PageWrapper>
            <Breadcrumb />
            <div>Hello "/_layout/motif/$motifSlug"!</div>
        </PageWrapper>
    );
}
