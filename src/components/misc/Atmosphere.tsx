import { hexToRgba, isRgbColor } from "#/lib/utils/color";

const resolveColor = (color: string, opacity?: number) =>
    isRgbColor(color) ? color : hexToRgba(color, opacity);

type AtmosphereProps = {
    /** rgba()/rgb() string, or a hex color (#rgb, #rgba, #rrggbb, #rrggbbaa) */
    color?: string;
    /** 0–1, only applied when `color` is hex — overrides any alpha in the hex itself */
    opacity?: number;
    /** ellipse size, e.g. "900px 480px" */
    size?: string;
    /** gradient origin, e.g. "50% -8%" */
    position?: string;
    /** distance at which the gradient fades to transparent */
    fade?: string;
    className?: string;
};

export const Atmosphere = ({
    color = "rgba(97, 126, 180, 0.13)",
    opacity,
    size = "900px 480px",
    position = "50% -8%",
    fade = "65%",
    className = "",
}: AtmosphereProps) => {
    const resolved = resolveColor(color, opacity);

    return (
        <div
            aria-hidden
            className={`pointer-events-none fixed inset-0 ${className}`}
            style={{
                backgroundImage: `radial-gradient(${size} at ${position}, ${resolved}, transparent ${fade})`,
            }}
        />
    );
};
