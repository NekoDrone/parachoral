import { FinalBarline } from "#/components/misc/FinalBarline";
import { toRomanYear } from "#/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const BOOK_LINKS = [
    { label: "Tracks", to: "/tracks" },
    { label: "Motifs", to: "/motifs" },
    { label: "Releases", to: "/releases" },
    { label: "Albums", to: "/albums" },
    { label: "About", to: "/about" },
] as const;

const ELSEWHERE_LINKS = [
    {
        label: "Destiny Music Archive (Unaffiliated)",
        href: "https://www.youtube.com/@destiny_music_archive",
    },
    { label: "Bungie", href: "https://www.bungie.net" },
    // TODO: point at the real repository
    {
        label: "Source on GitHub",
        href: "https://github.com/NekoDrone/parachoral",
    },
] as const;

export const Footer = () => {
    return (
        <footer className="px-7 pb-12 text-text">
            <div className="mx-auto max-w-[1080px]">
                <FinalBarline />

                <div className="grid gap-x-12 gap-y-12 py-14 md:grid-cols-[1.6fr_1fr_1fr]">
                    {/* Bookplate */}
                    <div>
                        <Link
                            to="/"
                            className="font-sans text-[13px] tracking-[0.34em] transition-colors duration-200 hover:text-accent-alt"
                        >
                            PARACHORAL
                            <span className="tracking-[0.2em] text-accent">
                                .FM
                            </span>
                        </Link>
                        <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-subtext-1">
                            A songbook of the Destiny universe; an archive of
                            every track, motif, and note built to remember our
                            joy, grief, sorrow, anger, fear, knowledge, and
                            hope.
                        </p>
                        <p className="mt-3 text-sm italic text-subtext-0">
                            Inspired by the{" "}
                            <a
                                target="_blank"
                                rel="noreferrer"
                                className="group text-subtext-0 transition-colors duration-200 hover:text-accent cursor-pointer underline"
                            >
                                Eorzea Songbook
                            </a>
                            .
                        </p>
                    </div>

                    {/* Contents */}
                    <nav aria-label="The book">
                        <ColumnLabel>The Book</ColumnLabel>
                        <ul className="mt-5 space-y-3">
                            {BOOK_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-subtext-1 transition-colors duration-200 hover:text-accent"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Elsewhere */}
                    <nav aria-label="Elsewhere">
                        <ColumnLabel>Elsewhere</ColumnLabel>
                        <ul className="mt-5 space-y-3">
                            {ELSEWHERE_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group text-subtext-1 transition-colors duration-200 hover:text-accent"
                                    >
                                        {link.label}
                                        <span
                                            aria-hidden="true"
                                            className="ml-1.5 inline-block font-sans text-[10px] text-subtext-0 transition-colors duration-200 group-hover:text-accent"
                                        >
                                            ↗
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Imprint */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-5 border-t border-overlay-0 pt-8">
                    <div className="max-w-[56ch] space-y-2.5">
                        <p className="text-sm leading-relaxed text-subtext-1">
                            All music © Bungie, Inc. Parachoral is an unofficial
                            fan work: entries link to official releases and the
                            Destiny Music Archive, and no full recordings are
                            hosted here.
                        </p>
                        <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-subtext-0">
                            Per Audacia ad Astra
                        </p>
                    </div>
                    <p className="font-mono text-[10px] font-light tracking-[0.5em] text-subtext-0">
                        {toRomanYear(new Date())}
                    </p>
                </div>
            </div>
        </footer>
    );
};

const ColumnLabel = ({ children }: { children: ReactNode }) => {
    return (
        <div className="font-sans text-[10.5px] uppercase tracking-[0.3em] text-subtext-0">
            {children}
        </div>
    );
};
