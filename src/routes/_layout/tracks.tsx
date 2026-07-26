import { PageWrapper } from "#/components/page/PageWrapper";
import { tracksParsed } from "#/lib/load";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/tracks")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <PageWrapper variant="half">
            <section className="pb-24 pt-16 max-w-[1080px]">
                <p className="font-light font-sans text-accent uppercase tracking-[0.42em] text-[11px] m-0">
                    Arranged by
                </p>
                <h1 className="font-medium text-[42px] tracking-wide">
                    Tracks
                </h1>
                <p className="text-[18px] text-subtext-1  max-w-xl">
                    Overall, there are {tracksParsed.length} tracks over more
                    than a decade of the franchise. Tracks on this page are
                    sorted and separated by release.
                </p>
            </section>
        </PageWrapper>
    );
}
