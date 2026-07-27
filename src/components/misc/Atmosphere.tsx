import { hexToRgba, isRgbColor } from "#/lib/utils/color";

const resolveColor = (color: string, opacity?: number) =>
    isRgbColor(color) ? color : hexToRgba(color, opacity);

const edgeDefaults = {
    top: { position: "50% -8%", height: "480px" },
    bottom: { position: "50% 108%", height: "480px" },
} as const;

export const Atmosphere = ({
    variant = "top",
    color = "rgba(97, 126, 180, 0.13)",
    opacity,
    size = "900px 480px",
    position,
    positioning = "fixed",
    fade = "65%",
    height,
    className = "",
}: {
    variant?: "top" | "bottom";
    color?: string;
    opacity?: number;
    size?: string;
    position?: string;
    positioning: "fixed" | "absolute";
    fade?: string;
    height?: string;
    className?: string;
}) => {
    const resolved = resolveColor(color, opacity);
    const defaults = edgeDefaults[variant];
    const resolvedPosition = position ?? defaults.position;
    const resolvedHeight = height ?? defaults.height;

    const positioningClass =
        positioning === "fixed"
            ? "fixed inset-0"
            : "absolute inset-x-0 bottom-0";

    return (
        <div
            aria-hidden
            className={`pointer-events-none ${positioningClass} ${className}`}
            style={{
                ...(variant === "bottom" ? { height: resolvedHeight } : {}),
                backgroundImage: `radial-gradient(${size} at ${resolvedPosition}, ${resolved}, transparent ${fade})`,
            }}
        />
    );
};
