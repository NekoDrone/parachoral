import { Footer } from "#/components/nav/Footer";
import { Header } from "#/components/nav/Header";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}
