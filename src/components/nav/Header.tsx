import { DropdownModal } from "#/components/dropdown/DropdownModal";
import { Link } from "@tanstack/react-router";

interface NavItemBase {
    label: string;
    type: "link" | "dropdown";
}

interface NavItemLink extends NavItemBase {
    type: "link";
    href: string;
}

interface NavItemDropdown extends NavItemBase {
    type: "dropdown";
    dropdownItems: Array<NavItemLink>;
}

type NavItem = NavItemLink | NavItemDropdown;

const BROWSE_BY_NAV_ITEMS: Array<NavItemLink> = [
    { label: "Track", href: "/tracks", type: "link" },
    { label: "Motif", href: "/motifs", type: "link" },
    { label: "Activity", href: "/activities", type: "link" },
    { label: "Release", href: "/releases", type: "link" },
    { label: "Album", href: "albums", type: "link" },
];

const NAV_ITEMS: Array<NavItem> = [
    {
        label: "Browse By",
        type: "dropdown",
        dropdownItems: BROWSE_BY_NAV_ITEMS,
    },
    {
        label: "About",
        href: "/about",
        type: "link",
    },
];

export const Header = () => {
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
            <nav
                aria-label="Primary"
                className="ml-auto gap-6 md:flex flex items-center"
            >
                {NAV_ITEMS.map((item) =>
                    item.type === "link" ? (
                        <div className="inline-block" key={item.label}>
                            <Link
                                to={item.href}
                                preload="intent"
                                preloadIntentProximity={30}
                                className="font-sans text-[11px] font-light uppercase tracking-[0.28em] text-subtext-1 transition-colors duration-200 hover:text-accent"
                            >
                                {item.label}
                            </Link>
                        </div>
                    ) : (
                        <DropdownModal
                            buttonComponent={
                                <div className="font-sans text-[11px] font-light uppercase tracking-[0.28em] text-subtext-1 transition-colors duration-200 hover:text-accent">
                                    {item.label}
                                </div>
                            }
                            className="flex flex-col gap-3 bg-surface0 border-overlay-1 border p-3 mt-2 ml-1"
                            key={item.label}
                        >
                            {item.dropdownItems.map((dropdownItem) => (
                                <a
                                    key={dropdownItem.label}
                                    href={dropdownItem.href}
                                    className="font-sans text-[11px] font-light uppercase tracking-[0.28em] text-subtext-1 transition-colors duration-200 hover:text-accent"
                                >
                                    {dropdownItem.label}
                                </a>
                            ))}
                        </DropdownModal>
                    ),
                )}
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
