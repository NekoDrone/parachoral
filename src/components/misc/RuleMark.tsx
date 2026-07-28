export const RuleMark = ({
    width = "full",
    className = "",
}: {
    width?: number | "full";
    className?: string;
}) => {
    return (
        <div
            aria-hidden
            className={"mt-6 flex max-w-full items-center gap-3.5 " + className}
            style={{ maxWidth: width === "full" ? "100%" : width }}
        >
            <span className="h-px flex-1 bg-linear-to-r from-transparent to-accent/30" />
            <span className="size-1.5 rotate-45 bg-accent" />
            <span className="h-px flex-1 bg-linear-to-l from-transparent to-accent/30" />
        </div>
    );
};
