#!/usr/bin/env node
/**
 * Seed `/data` from a Destiny Music Archive Mp3tag HTML export.
 *
 * The export has columns `Title | Artist | Album | Track | Year | Genre | Filename`
 * and, crucially, no release column — but `/data/tracks` is filed by release
 * (`trackReleaseFromPath` in `/src/lib/utils/track.ts`). An album is not a
 * release: "Destiny 2: Curse of Osiris/Warmind" is two of them, and the
 * compilations span a dozen. There are only ~25 distinct album strings though,
 * so the mapping is a small table a human can hold in their head.
 *
 * Hence two phases:
 *
 *   node scripts/import-dma.mjs <export.html> --scaffold   writes scripts/dma-map.mjs
 *   node scripts/import-dma.mjs <export.html>              writes .import/
 *
 * Nothing is ever written to `/data`. The import lands in a staging tree you
 * diff and promote by hand, so hand-curated tracks can't be clobbered by a
 * careless re-run.
 *
 * Usage: pnpm data:import <export.html> [--scaffold] [--out DIR]
 */

import {
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { kebab, withoutOrdinal } from "./lib/slug.mjs";
import { albumToYaml, releasesToYaml, trackToYaml } from "./lib/yaml.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const mapPath = join(root, "scripts", "dma-map.mjs");

const BANNER = "imported from the DMA export; unreviewed";
const COLUMNS = [
    "title",
    "artist",
    "album",
    "track",
    "year",
    "genre",
    "filename",
];

const rel = (path) => relative(root, path);

// --- html ------------------------------------------------------------------
// Mp3tag's output is machine-generated and perfectly regular, so a regex is
// honest here. We assert the header matches rather than trusting it, because
// silently mis-indexing columns on a re-export would be a miserable bug.

const ENTITIES = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
};

const unescapeHtml = (s) =>
    s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, body) => {
        if (body[0] !== "#") return ENTITIES[body.toLowerCase()] ?? match;
        const code =
            body[1] === "x" || body[1] === "X"
                ? Number.parseInt(body.slice(2), 16)
                : Number.parseInt(body.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    });

const cellText = (html) => unescapeHtml(html.replace(/<[^>]+>/g, "")).trim();

const parseExport = (html) => {
    const header = [...html.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map(
        (m) => cellText(m[1]).toLowerCase(),
    );
    if (header.length && header.join(",") !== COLUMNS.join(",")) {
        throw new Error(
            `unexpected export columns.\n  expected: ${COLUMNS.join(", ")}\n  found:    ${header.join(", ")}`,
        );
    }

    const rows = [];
    for (const [, inner] of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
        const cells = [...inner.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(
            (m) => cellText(m[1]),
        );
        if (!cells.length) continue; // the <th> header row
        if (cells.length !== COLUMNS.length) {
            throw new Error(
                `expected ${COLUMNS.length} columns, found ${cells.length}: ${cells.join(" | ")}`,
            );
        }
        rows.push(Object.fromEntries(COLUMNS.map((c, i) => [c, cells[i]])));
    }
    return rows;
};

// --- what's already on disk -------------------------------------------------

const yamlFilesIn = (dir) => {
    const abs = join(dataDir, dir);
    if (!existsSync(abs)) return [];
    return readdirSync(abs, { withFileTypes: true })
        .filter((e) => e.isFile() && /\.ya?ml$/.test(e.name))
        .map((e) => e.name);
};

const titleOf = (path) => {
    const match = readFileSync(path, "utf8").match(/^title:\s*(.+)$/m);
    return match ? match[1].trim().replace(/^"(.*)"$/, "$1") : undefined;
};

const existingAlbums = () =>
    new Map(
        yamlFilesIn("albums").map((name) => [
            name.replace(/\.ya?ml$/, ""),
            titleOf(join(dataDir, "albums", name)),
        ]),
    );

/** Track slug → the path it already lives at, across every release directory. */
const existingTracks = () => {
    const res = new Map();
    const tracks = join(dataDir, "tracks");
    if (!existsSync(tracks)) return res;
    const walk = (dir) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const path = join(dir, entry.name);
            if (entry.isDirectory()) walk(path);
            else if (/\.ya?ml$/.test(entry.name)) {
                res.set(entry.name.replace(/\.ya?ml$/, ""), rel(path));
            }
        }
    };
    walk(tracks);
    return res;
};

/** Same line-wise read as `new-track.mjs` — no YAML parser at hand. */
const existingReleases = () => {
    const file = join(dataDir, "releases.yaml");
    if (!existsSync(file)) return [];
    const res = [];
    for (const line of readFileSync(file, "utf8").split("\n")) {
        const slug = line.match(/^-\s*slug:\s*(.+)$/);
        if (slug) res.push({ slug: slug[1].trim() });
        const name = line.match(/^\s+name:\s*(.+)$/);
        if (name && res.length) res[res.length - 1].name = name[1].trim();
        const year = line.match(/^\s+year:\s*(\d+)$/);
        if (year && res.length) res[res.length - 1].year = Number(year[1]);
        const shorthand = line.match(/^\s+shorthand:\s*(.+)$/);
        if (shorthand && res.length) {
            res[res.length - 1].shorthand = shorthand[1]
                .trim()
                .replace(/^"(.*)"$/, "$1");
        }
    }
    return res;
};

// --- guessing ---------------------------------------------------------------

/**
 * "Destiny 2: Shadowkeep" → "shadowkeep". Only the game prefix is stripped;
 * the ordinal that turns this into a real release slug is editorial, so it is
 * left as a TODO for whoever edits the map.
 */
const guessReleaseSlug = (albumString, knownReleases) => {
    const stripped = albumString.replace(/^Destiny(\s+\d+)?\s*:\s*/i, "");
    const guess = kebab(stripped || albumString);
    const known = knownReleases.find((r) => withoutOrdinal(r.slug) === guess);
    return known ? known.slug : guess;
};

/** `shorthand` is `z.string().length(4)` — exactly four, no more, no less. */
const guessShorthand = (name) => {
    const words = name
        .replace(/[^A-Za-z0-9]+/g, " ")
        .split(" ")
        .filter(Boolean);
    const base =
        words.length > 1 ? words.map((w) => w[0]).join("") : (words[0] ?? "x");
    return base.toUpperCase().slice(0, 4).padEnd(4, "_");
};

// --- scaffold ---------------------------------------------------------------

const loadMap = async () => {
    if (!existsSync(mapPath)) return { releases: [], albums: {} };
    const mod = await import(pathToFileURL(mapPath).href);
    return { releases: mod.releases ?? [], albums: mod.albums ?? {} };
};

const q = (s) => JSON.stringify(s);

const scaffoldSource = (albums, releases, { albumsOnDisk, releasesOnDisk }) => {
    const out = [];
    out.push(
        "// Maps the DMA export's Album column onto Parachoral releases and albums.",
    );
    out.push("//");
    out.push(
        "// Generated by `pnpm data:import <export.html> --scaffold`, then hand-corrected.",
    );
    out.push(
        "// Re-scaffolding preserves every value below but NOT your own comments, so keep",
    );
    out.push("// notes to yourself somewhere else.");
    out.push("//");
    out.push(
        "// Set an album's `releaseSlug` to null when its tracks span several releases, then",
    );
    out.push(
        "// re-scaffold: you'll get a `tracks` block listing every title in that album to",
    );
    out.push(
        "// resolve one by one. Anything still null is skipped by the import and reported.",
    );
    out.push("//");
    out.push(
        `// Albums already in /data:   ${[...albumsOnDisk.keys()].join(", ") || "none"}`,
    );
    out.push(
        `// Releases already in /data: ${releasesOnDisk.map((r) => r.slug).join(", ") || "none"}`,
    );
    out.push("");
    out.push(
        "/** Proposed additions to /data/releases.yaml. Merge them in by hand. */",
    );
    out.push("export const releases = [");
    for (const r of releases) {
        const todo = r.onDisk
            ? ""
            : " // TODO: ordinal prefix, name, shorthand";
        out.push(
            `    { slug: ${q(r.slug)}, name: ${q(r.name)}, year: ${r.year}, shorthand: ${q(r.shorthand)} },${todo}`,
        );
    }
    out.push("];");
    out.push("");
    out.push("export const albums = {");
    for (const a of albums) {
        out.push(`    ${q(a.albumString)}: {`);
        out.push(
            `        albumSlug: ${q(a.albumSlug)},${a.albumOnDisk ? " // already in /data/albums" : ""}`,
        );
        out.push(
            a.releaseSlug === null
                ? "        releaseSlug: null, // TODO: spans releases — resolve per track below"
                : `        releaseSlug: ${q(a.releaseSlug)},${a.releaseOnDisk ? "" : " // TODO: confirm"}`,
        );
        if (a.releasedAt) {
            out.push(
                `        releasedAt: ${q(a.releasedAt)}, // TODO: real date, export only gives Year`,
            );
        }
        if (a.tracks) {
            out.push("        tracks: {");
            for (const [slug, value] of a.tracks) {
                const todo = value === null ? " // TODO" : "";
                out.push(
                    `            ${q(slug)}: ${value === null ? "null" : q(value)},${todo}`,
                );
            }
            out.push("        },");
        }
        out.push("    },");
    }
    out.push("};");
    return `${out.join("\n")}\n`;
};

const scaffold = async (rows) => {
    const prior = await loadMap();
    const albumsOnDisk = existingAlbums();
    const releasesOnDisk = existingReleases();

    const byAlbum = new Map();
    for (const row of rows) {
        if (!byAlbum.has(row.album)) byAlbum.set(row.album, []);
        byAlbum.get(row.album).push(row);
    }

    const albums = [...byAlbum]
        .map(([albumString, albumRows]) => {
            const previous = prior.albums[albumString];
            const year = Math.min(
                ...albumRows.map((r) => Number(r.year) || Infinity),
            );

            // Prefer an album already on disk: match on slug, then on title, so
            // "Destiny" lands on the hand-made `destiny-ost` instead of minting
            // a near-duplicate.
            const guessSlug = kebab(albumString);
            const matched =
                (albumsOnDisk.has(guessSlug) && guessSlug) ||
                [...albumsOnDisk].find(
                    ([, title]) => title === albumString,
                )?.[0];
            const albumSlug = previous?.albumSlug ?? matched ?? guessSlug;

            const releaseSlug =
                previous === undefined
                    ? guessReleaseSlug(albumString, releasesOnDisk)
                    : (previous.releaseSlug ?? null);

            return {
                albumString,
                albumSlug,
                albumOnDisk: albumsOnDisk.has(albumSlug),
                releaseSlug,
                releaseOnDisk: releasesOnDisk.some(
                    (r) => r.slug === releaseSlug,
                ),
                releasedAt: albumsOnDisk.has(albumSlug)
                    ? undefined
                    : (previous?.releasedAt ??
                      `${Number.isFinite(year) ? year : 1970}-01-01`),
                // Only offer the per-track escape hatch once the whole-album
                // mapping has been explicitly given up on.
                tracks:
                    releaseSlug === null
                        ? albumRows
                              .map((r) => kebab(r.title))
                              .sort()
                              .map((slug) => [
                                  slug,
                                  previous?.tracks?.[slug] ?? null,
                              ])
                        : undefined,
                year,
            };
        })
        .sort(
            (a, b) =>
                a.year - b.year || a.albumString.localeCompare(b.albumString),
        );

    // Every release referenced by the map has to exist before the import will
    // file anything under it, so propose the missing ones here.
    const releases = [...prior.releases];
    const seen = new Set(releases.map((r) => r.slug));
    for (const album of albums) {
        for (const slug of [
            album.releaseSlug,
            ...(album.tracks ?? []).map(([, v]) => v),
        ]) {
            if (!slug || seen.has(slug)) continue;
            seen.add(slug);
            const onDisk = releasesOnDisk.find((r) => r.slug === slug);
            const name = album.albumString.replace(
                /^Destiny(\s+\d+)?\s*:\s*/i,
                "",
            );
            releases.push(
                onDisk ?? {
                    slug,
                    name: name || album.albumString,
                    year: Number.isFinite(album.year) ? album.year : 1970,
                    shorthand: guessShorthand(name || album.albumString),
                },
            );
        }
    }
    for (const release of releases) {
        release.onDisk = releasesOnDisk.some((r) => r.slug === release.slug);
    }

    writeFileSync(
        mapPath,
        scaffoldSource(albums, releases, { albumsOnDisk, releasesOnDisk }),
    );

    const unresolved = albums.filter((a) => a.releaseSlug === null);
    console.log(`wrote ${rel(mapPath)}`);
    console.log(
        `  ${albums.length} albums, ${releases.filter((r) => !r.onDisk).length} releases proposed`,
    );
    if (unresolved.length) {
        console.log(
            `  ${unresolved.length} album(s) awaiting per-track resolution:`,
        );
        for (const a of unresolved) {
            console.log(
                `    ${a.albumString} — ${a.tracks.filter(([, v]) => v === null).length} unresolved`,
            );
        }
    }
    console.log("\nedit the release slugs, then re-run without --scaffold.");
};

// --- import -----------------------------------------------------------------

const resolve = (rows, map, knownReleaseSlugs) => {
    const resolved = [];
    const problems = [];

    for (const row of rows) {
        const entry = map.albums[row.album];
        if (!entry) {
            problems.push({
                row,
                why: `album ${q(row.album)} is not in dma-map.mjs — re-scaffold`,
            });
            continue;
        }

        const baseSlug = kebab(row.title);
        const releaseSlug =
            entry.tracks?.[baseSlug] ?? entry.releaseSlug ?? null;
        if (!releaseSlug) {
            problems.push({
                row,
                why: `no release mapped for ${q(row.album)}`,
            });
            continue;
        }
        if (!knownReleaseSlugs.has(releaseSlug)) {
            problems.push({
                row,
                why: `release ${q(releaseSlug)} is in neither /data/releases.yaml nor the map's releases[]`,
            });
            continue;
        }

        const composers = row.artist
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
        if (!composers.length) {
            problems.push({
                row,
                why: "no artist — Track.composers requires at least one",
            });
            continue;
        }

        const order = Number.parseInt(row.track.split("/")[0], 10);
        if (!Number.isInteger(order) || order < 1) {
            problems.push({
                row,
                why: `unreadable track number ${q(row.track)}`,
            });
            continue;
        }

        resolved.push({
            row,
            baseSlug,
            releaseSlug,
            albumSlug: entry.albumSlug,
            composers,
            order,
            year: Number(row.year) || 0,
        });
    }

    return { resolved, problems };
};

/**
 * Two tracks can share a title — `Season of the Splicer` re-recorded five D1
 * cues. They need distinct filenames, because `tracksMap` in `/src/lib/load.ts`
 * is keyed on the bare filename across every release directory, so a duplicate
 * silently shadows the other and one becomes unreachable at `/track/<slug>`.
 */
const assignSlugs = (resolved, alreadyInData) => {
    const skipped = [];
    const renamed = [];

    const fresh = resolved.filter((r) => {
        if (!alreadyInData.has(r.baseSlug)) return true;
        skipped.push({ ...r, at: alreadyInData.get(r.baseSlug) });
        return false;
    });

    const groups = new Map();
    for (const r of fresh) {
        if (!groups.has(r.baseSlug)) groups.set(r.baseSlug, []);
        groups.get(r.baseSlug).push(r);
    }

    const taken = new Set(alreadyInData.keys());
    for (const [baseSlug, group] of groups) {
        group.sort(
            (a, b) => a.year - b.year || a.row.album.localeCompare(b.row.album),
        );
        group.forEach((r, i) => {
            if (i === 0 && !taken.has(baseSlug)) {
                r.slug = baseSlug;
            } else {
                let candidate = `${baseSlug}-${withoutOrdinal(r.releaseSlug)}`;
                for (let n = 2; taken.has(candidate); n++)
                    candidate = `${baseSlug}-${n}`;
                r.slug = candidate;
                renamed.push(r);
            }
            taken.add(r.slug);
        });
    }

    return { written: fresh, skipped, renamed };
};

const report = ({
    rows,
    written,
    skipped,
    renamed,
    problems,
    albumStubs,
    dupOrders,
    outDir,
}) => {
    const lines = [`# DMA import report`, ""];
    lines.push(`- ${rows.length} rows in the export`);
    lines.push(`- **${written.length} written** to \`${rel(outDir)}/tracks\``);
    lines.push(`- ${albumStubs.length} album stub(s) written`);
    lines.push(
        `- ${skipped.length} skipped — already hand-written in \`/data/tracks\``,
    );
    lines.push(`- ${renamed.length} renamed to avoid a slug collision`);
    lines.push(`- ${problems.length} unresolved`);
    lines.push("");

    const section = (title, items, render) => {
        if (!items.length) return;
        lines.push(`## ${title}`, "");
        for (const item of items) lines.push(`- ${render(item)}`);
        lines.push("");
    };

    section(
        "Unresolved — not imported",
        problems,
        (p) => `\`${p.row.title}\` (${p.row.album}) — ${p.why}`,
    );
    section(
        "Already in /data — left alone",
        skipped,
        (s) =>
            `\`${s.baseSlug}\` from ${s.row.album} — existing file \`${s.at}\``,
    );
    section(
        "Renamed — same title, different recording",
        renamed,
        (r) => `\`${r.baseSlug}\` → \`${r.slug}\` (${r.row.album}, ${r.year})`,
    );
    section(
        "Placeholder album dates — only a Year was in the export",
        albumStubs.filter((a) => a.releasedAtNote),
        (a) =>
            `\`${a.slug}\` — \`${a.releasedAt}\` needs the real release date`,
    );
    section(
        "Duplicate order values — two rows will render the same row number",
        dupOrders,
        (d) => `\`${d.releaseSlug}\` order ${d.order}: ${d.titles.join(", ")}`,
    );

    lines.push("---", "", "Promote a directory once it looks right:", "");
    lines.push("```bash");
    lines.push(`cp -rn ${rel(outDir)}/albums/. data/albums/`);
    lines.push(`cp -rn ${rel(outDir)}/tracks/. data/tracks/`);
    lines.push("pnpm dev   # every file goes through Zod at startup");
    lines.push("```");
    lines.push("");
    lines.push(
        `\`${rel(outDir)}/releases.yaml\` is a *proposal* — reconcile it into \`data/releases.yaml\` by hand.`,
    );

    return `${lines.join("\n")}\n`;
};

const write = (path, contents) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, contents);
};

const runImport = async (rows, outDir) => {
    const map = await loadMap();
    if (!Object.keys(map.albums).length) {
        throw new Error(
            `${rel(mapPath)} has no albums. Run with --scaffold first, then fill in the release slugs.`,
        );
    }

    const releasesOnDisk = existingReleases();
    const knownReleaseSlugs = new Set([
        ...releasesOnDisk.map((r) => r.slug),
        ...map.releases.map((r) => r.slug),
    ]);

    const { resolved, problems } = resolve(rows, map, knownReleaseSlugs);
    const { written, skipped, renamed } = assignSlugs(
        resolved,
        existingTracks(),
    );

    rmSync(outDir, { recursive: true, force: true });

    for (const r of written) {
        write(
            join(outDir, "tracks", r.releaseSlug, `${r.slug}.yaml`),
            trackToYaml(
                {
                    title: r.row.title,
                    composers: r.composers,
                    order: r.order,
                    albums: [{ albumSlug: r.albumSlug, track: r.order }],
                },
                { banner: BANNER },
            ),
        );
    }

    // Only stub albums that something actually landed in, and only when they
    // aren't already hand-written.
    const albumsOnDisk = existingAlbums();
    const usedAlbums = new Set(written.map((r) => r.albumSlug));
    const albumStubs = [];
    for (const [albumString, entry] of Object.entries(map.albums)) {
        if (
            !usedAlbums.has(entry.albumSlug) ||
            albumsOnDisk.has(entry.albumSlug)
        )
            continue;
        if (albumStubs.some((a) => a.slug === entry.albumSlug)) continue;
        albumStubs.push({
            slug: entry.albumSlug,
            title: albumString,
            releasedAt: entry.releasedAt ?? "1970-01-01",
            releasedAtNote: "TODO: real date, export only gives Year",
        });
    }
    for (const album of albumStubs) {
        write(
            join(outDir, "albums", `${album.slug}.yaml`),
            albumToYaml(album, { banner: BANNER }),
        );
    }

    const proposed = map.releases.filter(
        (r) => !releasesOnDisk.some((d) => d.slug === r.slug),
    );
    write(
        join(outDir, "releases.yaml"),
        releasesToYaml([...releasesOnDisk, ...proposed], {
            banner: `proposal — reconcile into data/releases.yaml by hand (${proposed.length} new)`,
        }),
    );

    // Duplicate orders are legal (order is display-only, TrackRow.tsx) but they
    // render as two identically numbered rows, so they're worth flagging.
    const orders = new Map();
    for (const r of written) {
        const key = `${r.releaseSlug} ${r.order}`;
        if (!orders.has(key)) orders.set(key, []);
        orders.get(key).push(r.row.title);
    }
    const dupOrders = [...orders]
        .filter(([, titles]) => titles.length > 1)
        .map(([key, titles]) => ({
            releaseSlug: key.split(" ")[0],
            order: Number(key.split(" ")[1]),
            titles,
        }))
        .sort(
            (a, b) =>
                a.releaseSlug.localeCompare(b.releaseSlug) || a.order - b.order,
        );

    write(
        join(outDir, "REPORT.md"),
        report({
            rows,
            written,
            skipped,
            renamed,
            problems,
            albumStubs,
            dupOrders,
            outDir,
        }),
    );

    console.log(`wrote ${rel(outDir)}/`);
    console.log(`  ${written.length} tracks, ${albumStubs.length} album stubs`);
    console.log(
        `  ${skipped.length} already in /data, ${renamed.length} renamed, ${problems.length} unresolved`,
    );
    console.log(`\nread ${rel(outDir)}/REPORT.md before promoting anything.`);
};

// --- cli --------------------------------------------------------------------

const main = async () => {
    const args = process.argv.slice(2);
    const flag = (name) => {
        const i = args.indexOf(name);
        if (i === -1) return undefined;
        return args.splice(i, 2)[1];
    };

    const outDir = join(root, flag("--out") ?? ".import");
    const wantsScaffold = args.includes("--scaffold");
    const source = args.find((a) => !a.startsWith("--"));

    if (!source) {
        console.error(
            "usage: pnpm data:import <export.html> [--scaffold] [--out DIR]",
        );
        process.exitCode = 1;
        return;
    }
    if (!existsSync(source)) {
        console.error(`no such file: ${source}`);
        process.exitCode = 1;
        return;
    }

    const rows = parseExport(readFileSync(source, "utf8"));
    console.log(`parsed ${rows.length} rows from ${source}\n`);

    if (wantsScaffold) await scaffold(rows);
    else await runImport(rows, outDir);
};

await main();
