import type { ReactNode } from "react";

export const Tooltip = ({
    children,
    tooltip,
    className = "flex items-center",
    tooltipClassName = "bg-surface1 mb-2 w-64 px-3 py-2 text-sm",
    showCaret = true,
    caretClassName = "border-t-surface1 border-4 border-transparent",
}: {
    children: ReactNode;
    tooltip: ReactNode;
    className?: string;
    tooltipClassName?: string;
    showCaret?: boolean;
    caretClassName?: string;
}) => {
    return (
        <div className={`group ${className} `}>
            {children}
            <div
                className={`pointer-events-none absolute bottom-full -translate-x-1/2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 ${tooltipClassName}`}
            >
                {tooltip}
                {showCaret && (
                    <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 ${caretClassName}`}
                    />
                )}
            </div>
        </div>
    );
};
