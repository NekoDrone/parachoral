import { Diamond } from "#/components/misc/Diamond";
import type { ReleaseSection } from "#/lib/data/get-release-sections";
import { useActiveSection } from "#/lib/hooks/useActiveSection";
import { releaseNumeralLabel, releaseSectionId } from "#/lib/utils/release";
import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

// Entries are a fixed height so the notch can be placed by index alone, with no
// measurement. Kept in step with the `h-6` / `gap-0.5` on the markup below.
const ENTRY_HEIGHT = 24;
const ENTRY_GAP = 2;
const STRIDE = ENTRY_HEIGHT + ENTRY_GAP;

/**
 * The margin of the tracks page: a hairline with one tick per release and a notch marking
 * where the reader currently is. Each tick jumps to its section.
 */
export const TrackSpine = ({
    sections,
}: {
    sections: Array<ReleaseSection>;
}) => {
    const ids = useMemo(
        () => sections.map(({ release }) => releaseSectionId(release.slug)),
        [sections],
    );
    const activeId = useActiveSection({ ids });
    const prefersReducedMotion = useReducedMotion();

    if (sections.length === 0) return null;

    const activeIndex = Math.max(0, ids.indexOf(activeId ?? ""));

    const jumpTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        // Not governed by MotionConfig, so reduced motion is honoured by hand.
        el.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
        });
        // Sections carry tabIndex={-1}, so keyboard reading continues from the heading
        // rather than from the tick that was just activated.
        el.focus({ preventScroll: true });
    };

    return (
        // `sticky` already makes this the containing block for the notch below.
        <nav
            aria-label="Releases"
            className="sticky top-27 self-start flex flex-col gap-0.5 border-l border-solid border-text/13"
        >
            <motion.span
                aria-hidden="true"
                className="absolute -left-px top-0 w-px h-6 bg-accent"
                animate={{ y: activeIndex * STRIDE }}
                transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 30,
                    mass: 0.6,
                }}
            >
                <Diamond className="left-[-3px]" />
            </motion.span>

            {sections.map(({ release }) => {
                const id = releaseSectionId(release.slug);
                const isActive = id === activeId;

                return (
                    <button
                        key={release.slug}
                        type="button"
                        onClick={() => jumpTo(id)}
                        aria-current={isActive ? "location" : undefined}
                        className={
                            "h-6 flex items-center pl-2.5 appearance-none bg-transparent border-0 cursor-pointer text-left font-mono text-[10px] tracking-[0.08em] whitespace-nowrap transition-colors duration-200 ease-[ease] " +
                            (isActive
                                ? "text-accent"
                                : "text-subtext-0 hover:text-subtext-1")
                        }
                    >
                        <span aria-hidden="true">
                            {releaseNumeralLabel(release)}
                        </span>
                        <span className="sr-only">{release.name}</span>
                    </button>
                );
            })}
        </nav>
    );
};
