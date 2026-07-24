const NAV_ITEMS = ["Tracks", "Motifs", "Activities", "Albums", "About"];

export const SiteHeader = () => {
    return (
        <header className="flex max-w-full items-center gap-9 border-b border-overlay-1 px-7 py-5">
            <a
                href="/"
                className="font-sans text-[13px] tracking-[0.34em] text-text"
            >
                PARACHORAL
                <span className="tracking-[0.2em] text-accent">.FM</span>
            </a>

            {/* Swap <a> for the router's typed <Link> as each route lands */}
            <nav aria-label="Primary" className="ml-auto hidden gap-6 md:flex">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item}
                        href="#"
                        className="font-sans text-[11px] font-light uppercase tracking-[0.28em] text-subtext-1 transition-colors duration-200 hover:text-accent"
                    >
                        {item}
                    </a>
                ))}
            </nav>

            <label className="hidden items-center gap-2.5 border border-overlay-1 px-3 py-2 transition-colors duration-200 focus-within:border-accent/40 md:flex">
                <input
                    type="search"
                    placeholder="Search the songbook"
                    aria-label="Search the songbook"
                    className="w-[168px] bg-transparent font-mono text-xs font-light text-text outline-none placeholder:text-subtext-0"
                />
                <kbd className="border border-overlay-1 px-1.5 font-mono text-[10px] text-subtext-0">
                    ⌘K
                </kbd>
            </label>
        </header>
    );
};
