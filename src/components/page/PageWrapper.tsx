import { Atmosphere } from "#/components/misc/Atmosphere";
import { useAtmosphere } from "#/lib/hooks/useAtmosphere";
import type { ReactNode } from "react";

export const PageWrapper = ({
    children,
    variant = "full",
}: {
    children: ReactNode;
    variant?: "full" | "half";
}) => {
    const { color } = useAtmosphere();

    const atmosphere = (
        <Atmosphere variant="top" positioning="fixed" color={color} />
    );

    return variant === "full" ? (
        <main className="relative max-w-full px-7 min-h-screen">
            {atmosphere}
            {children}
        </main>
    ) : (
        <main className="relative px-7 min-h-screen mx-auto max-w-[1080px]">
            {atmosphere}
            {children}
        </main>
    );
};
