const STAFF_LINES = [70, 90, 110, 130, 150];

const STRAY_NOTES: Array<[number, number]> = [
    [172, 90],
    [251, 130],
    [583, 70],
    [662, 110],
];

// Radial ticks at the cardinal points of the emblem: [x1, y1, x2, y2]
const CARDINAL_TICKS: Array<[number, number, number, number]> = [
    [400, 36, 400, 46],
    [400, 174, 400, 184],
    [326, 110, 336, 110],
    [464, 110, 474, 110],
];

export const Emblem = () => {
    return (
        <div aria-hidden className="relative -mx-7">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[560px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(213,226,255,0.10),rgba(199,166,91,0.05),transparent_75%)]" />

            <svg
                viewBox="0 0 800 220"
                className="mx-auto block h-auto w-full max-w-[800px]"
            >
                {STAFF_LINES.map((y) => (
                    <line
                        key={y}
                        x1={0}
                        y1={y}
                        x2={800}
                        y2={y}
                        className="stroke-overlay-1 stroke-1"
                    />
                ))}

                {STRAY_NOTES.map(([x, y]) => (
                    <rect
                        key={`${x}-${y}`}
                        x={-4.5}
                        y={-4.5}
                        width={9}
                        height={9}
                        transform={`translate(${x} ${y}) rotate(45)`}
                        className="fill-none stroke-accent/30 stroke-1"
                    />
                ))}

                <g
                    className="animate-spin-slow motion-reduce:animate-none"
                    style={{ transformOrigin: "400px 110px" }}
                >
                    <circle
                        cx={400}
                        cy={110}
                        r={62}
                        className="fill-none stroke-accent/30 stroke-1 [stroke-dasharray:2_7]"
                    />
                </g>

                <circle
                    cx={400}
                    cy={110}
                    r={47}
                    className="fill-ink stroke-subtext-1 stroke-1"
                />

                <g
                    className="animate-spin-slower motion-reduce:animate-none"
                    style={{ transformOrigin: "400px 110px" }}
                >
                    <circle
                        cx={400}
                        cy={110}
                        r={34}
                        className="fill-none stroke-overlay-1 stroke-1 [stroke-dasharray:1_5]"
                    />
                </g>

                {CARDINAL_TICKS.map(([x1, y1, x2, y2]) => (
                    <line
                        key={`${x1}-${y1}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        className="stroke-accent/30 stroke-1"
                    />
                ))}

                <circle
                    cx={400}
                    cy={110}
                    r={5.5}
                    className="fill-accent drop-shadow-[0_0_7px_rgba(199,166,91,0.75)]"
                />
            </svg>

            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-base to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-base to-transparent" />
        </div>
    );
};
