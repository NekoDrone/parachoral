import type { ReactNode } from "react";

export const PageWrapper = ({
    children,
    variant = "full",
}: {
    children: ReactNode;
    variant: "full" | "half";
}) => {
    return variant === "full" ? (
        <main className="relative max-w-full px-7 min-h-screen">
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_480px_at_50%_-8%,rgba(97,126,180,0.13),transparent_65%)]"
            />
            {children}
        </main>
    ) : (
        <main className="relative px-7 min-h-screen mx-auto max-w-[1080px]">
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_480px_at_50%_-8%,rgba(97,126,180,0.13),transparent_65%)]"
            />
            {children}
        </main>
    );
};
