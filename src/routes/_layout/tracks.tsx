import { DropdownModal } from "#/components/dropdown/DropdownModal";
import { Diamond } from "#/components/misc/Diamond";
import { PageWrapper } from "#/components/page/PageWrapper";
import { tracksParsed } from "#/lib/load";
import type { Enumify } from "#/lib/utils";
import { CaretDownIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_layout/tracks")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <PageWrapper variant="half">
            <section className="pb-24 pt-16 max-w-[1080px]">
                <p className="font-light font-sans text-accent uppercase tracking-[0.42em] text-[11px] m-0">
                    Arranged by
                </p>
                <h1 className="font-medium text-[42px] tracking-wide">
                    Tracks
                </h1>
                <p className="text-[18px] text-subtext-1  max-w-xl">
                    There are {tracksParsed.length} tracks across Destiny's
                    history. Here's every one of them.
                </p>
                <Toolbar />
            </section>
        </PageWrapper>
    );
}

const Toolbar = () => {
    const SortStrategy = {
        RELEASE: "Release",
        TITLE: "Title",
        COMPOSER: "Composer",
        DATE: "Date",
    } as const;
    type SortStrategy = Enumify<typeof SortStrategy>;
    const [query, setQuery] = useState("");
    const [originsOnly, setOriginsOnly] = useState(false);
    const [sortStrategy, setSortStrategy] = useState<SortStrategy>(
        SortStrategy.RELEASE,
    );
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    return (
        <div className="flex items-center flex-wrap mt-8 gap-4">
            <label className="flex items-center border border-text/13 bg-surface0/50 px-[14px] py-[11px] transition-colors duration-200 ease-[ease] focus-within:border-accent/40">
                <input
                    className="bg-transparent border-0 outline-0 text-text font-mono font-light text-[12.5px] w-[330px] max-w-[60vw] placeholder:text-text/50"
                    type="search"
                    placeholder="Search by title, composer, motif, or activity"
                    aria-label="Search tracks"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </label>
            <button
                className={
                    "appearance-none bg-transparent border border-text/13 text-text/70 font-sans font-normal text-[11px] tracking-[0.24em] uppercase px-[18px] py-[12px] inline-flex items-center gap-[10px] transition-colors duration-200 ease-[ease] hover:border-accent/40 hover:text-text" +
                    (originsOnly ? "border-accent text-accent" : "")
                }
                aria-pressed={originsOnly}
                onClick={() => setOriginsOnly(!originsOnly)}
            >
                <Diamond filled={originsOnly} size={7} /> Origins only
            </button>
            <DropdownModal
                buttonComponent={
                    <div
                        role="button"
                        className="appearance-none bg-transparent border border-text/13 text-text/70 font-sans font-normal text-[11px] tracking-[0.24em] uppercase px-[18px] py-[12px] inline-flex items-center gap-[10px] transition-colors duration-200 ease-[ease] hover:border-accent/40 hover:text-text"
                    >
                        Sorted by {sortStrategy} <CaretDownIcon />
                    </div>
                }
                className="flex flex-col gap-3 bg-base border-overlay-1 border p-3 mt-2 ml-1 items-start"
                showDropdownState={showSortDropdown}
                setShowDropdownState={setShowSortDropdown}
            >
                {Object.values(SortStrategy).map((strategy) => (
                    <div
                        role="button"
                        className="font-sans text-[11px] font-light uppercase tracking-[0.28em] text-subtext-1 transition-colors duration-200 hover:text-accent"
                        onClick={() => {
                            setSortStrategy(strategy);
                            console.log("Setting!!");
                            setShowSortDropdown(false);
                        }}
                        key={strategy}
                    >
                        {strategy}
                    </div>
                ))}
            </DropdownModal>
            <button
                className={
                    "transition-colors " +
                    (query !== "" ||
                        originsOnly ||
                        sortStrategy !== SortStrategy.RELEASE
                        ? "text-subtext-1  hover:text-accent"
                        : "text-subtext-0")
                }
                onClick={() => {
                    setQuery("");
                    setOriginsOnly(false);
                    setSortStrategy(SortStrategy.RELEASE);
                }}
            >
                reset
            </button>
        </div>
    );
};
