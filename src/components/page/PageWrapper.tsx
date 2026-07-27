import { Atmosphere } from "#/components/misc/Atmosphere";
import type { ReactNode } from "react";

export const PageWrapper = ({
    children,
    variant = "full",
}: {
    children: ReactNode;
    variant?: "full" | "half";
}) => {
    return variant === "full" ? (
        <main className="relative max-w-full px-7 min-h-screen">
            <Atmosphere />
            {children}
        </main>
    ) : (
        <main className="relative px-7 min-h-screen mx-auto max-w-[1080px]">
            <Atmosphere />
            {children}
        </main>
    );
};
