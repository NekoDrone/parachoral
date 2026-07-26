import { useEffect, useMemo, useRef } from "react";
import {
    animate,
    motion,
    useInView,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from "motion/react";
import type { Easing } from "motion/react";

export type CountUpProps = {
    /** The number to land on. Changing this animates from wherever the counter currently is. */
    to: number;
    /** Starting value for the first run. Defaults to 0. */
    from?: number;
    /** Seconds. */
    duration?: number;
    /** Seconds to wait before starting. */
    delay?: number;
    ease?: Easing;
    /** Wait until the element scrolls into view before counting. */
    startOnView?: boolean;
    /** If false, the count replays every time it re-enters the viewport. */
    once?: boolean;
    /** Passed straight to Intl.NumberFormat — currency, percent, decimals, compact notation, etc. */
    format?: Intl.NumberFormatOptions;
    /** Defaults to the browser locale. Pass one explicitly to keep SSR and client output identical. */
    locale?: string;
    prefix?: string;
    suffix?: string;
    className?: string;
};

export const CountUp = ({
    to,
    from = 0,
    duration = 1.6,
    delay = 0,
    ease = "easeOut",
    startOnView = true,
    once = true,
    format,
    locale,
    prefix = "",
    suffix = "",
    className,
}: CountUpProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once, amount: 0.4 });
    const prefersReducedMotion = useReducedMotion();

    const count = useMotionValue(from);
    const lastTarget = useRef<number | null>(null);

    // Object props have unstable identity, so key the memo on the contents.
    const formatKey = JSON.stringify(format ?? null);
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                maximumFractionDigits: 0,
                ...format,
            }),
        [locale, formatKey],
    );

    const text = useTransform(
        count,
        (value) => `${prefix}${formatter.format(value)}${suffix}`,
    );

    useEffect(() => {
        if (startOnView && !inView) return;

        // If the target hasn't changed, we're here because the element re-entered
        // the viewport — rewind so there's something to watch.
        const isNewTarget = lastTarget.current !== to;
        if (!isNewTarget && !once) count.set(from);
        lastTarget.current = to;

        if (prefersReducedMotion) {
            count.set(to);
            return;
        }

        const controls = animate(count, to, { duration, delay, ease });
        return () => controls.stop();
    }, [
        to,
        from,
        duration,
        delay,
        ease,
        inView,
        startOnView,
        once,
        prefersReducedMotion,
        count,
    ]);

    const finalText = `${prefix}${formatter.format(to)}${suffix}`;

    return (
        <span ref={ref} className={className}>
            {/* The ticking number is noise for a screen reader, so expose only the result. */}
            <motion.span aria-hidden>{text}</motion.span>
            <span className="sr-only">{finalText}</span>
        </span>
    );
};
