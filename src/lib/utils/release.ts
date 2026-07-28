import type { Release } from "#/lib/types/data/releases";
import { toRomanNumeral } from "#/lib/utils";

// Deliberately free of any `#/lib/load` import: `load.ts` pulls helpers back out of
// `#/lib/utils/track`, so a module in that cycle cannot safely be imported by a component.

/** The DOM id of a release's section on the tracks page. */
export const releaseSectionId = (slug: string): string => `release-${slug}`;

/**
 * How a release is numbered in the margin: the prelude by name, later releases by roman
 * numeral, and anything without a cardinality (i.e. `unreleased`) by its shorthand.
 */
export const releaseNumeralLabel = (release: Release): string => {
    const cardinality = Number.parseInt(release.slug.split("_")[0]);
    if (Number.isNaN(cardinality)) return release.shorthand;
    if (cardinality === 0) return "Prelude";
    return toRomanNumeral(cardinality);
};
