import { useEffect, useState } from "react";

/**
 * Tracks which of the given sections the reader is currently on, by testing each one's
 * position against an activation line `offset` pixels below the top of the viewport.
 *
 * `ids` must be referentially stable between renders — memoise it at the call site.
 */
export const useActiveSection = ({
    ids,
    offset = 160,
}: {
    ids: Array<string>;
    offset?: number;
}): string | null => {
    const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

    useEffect(() => {
        if (ids.length === 0) {
            setActiveId(null);
            return;
        }

        let frame = 0;

        const resolve = () => {
            frame = 0;

            // A short final section may never reach the activation line, so the bottom of
            // the page belongs to the last section by fiat.
            const atBottom =
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight - 2;
            if (atBottom) {
                setActiveId(ids[ids.length - 1]);
                return;
            }

            // Sections are contiguous and in document order, so the last one to have
            // crossed the line is the one being read.
            let next = ids[0];
            for (const id of ids) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= offset) next = id;
            }
            setActiveId(next);
        };

        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(resolve);
        };

        resolve();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [ids, offset]);

    return activeId;
};
