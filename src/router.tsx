import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
    const router = createTanStackRouter({
        routeTree,
        scrollRestoration: true,
        defaultPreload: "intent",
        defaultPreloadStaleTime: 0,
        defaultViewTransition: {
            types: ({ fromLocation, toLocation }) => {
                if (!fromLocation) return ["slide-none"];
                const from = fromLocation.state.__TSR_index;
                const to = toLocation.state.__TSR_index;
                return [from > to ? "slide-right" : "slide-left"];
            },
        },
    });

    return router;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
