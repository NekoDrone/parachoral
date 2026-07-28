/**
 * Slug generation, shared by the scripts in this directory.
 *
 * `slugFromPath` in `/src/lib/utils/data.ts` takes a data file's name as its
 * slug verbatim, so whatever this emits ends up in a URL untouched. Every
 * script that names a file has to agree on it — otherwise an importer happily
 * writes `the-travelers.yaml` alongside a hand-made `the-traveler.yaml` and
 * nobody notices until the route 404s.
 */

export const kebab = (s) =>
    s
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

/** `10a_season-of-the-undying` → `season-of-the-undying`. */
export const withoutOrdinal = (releaseSlug) =>
    releaseSlug.replace(/^\d+[a-z]?_/, "");
