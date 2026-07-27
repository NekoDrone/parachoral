import { DropdownModal } from "#/components/dropdown/DropdownModal";
import { Diamond } from "#/components/misc/Diamond";
import type { Enumify } from "#/lib/utils";
import { CaretDownIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export const SortStrategy = {
    RELEASE: "Release",
    TITLE: "Title",
    COMPOSER: "Composer",
    DATE: "Date",
} as const;
export type SortStrategy = Enumify<typeof SortStrategy>;

export const Toolbar = ({
    query,
    setQuery,
    showOriginsToggle = false,
    originsOnly,
    setOriginsOnly,
    sortStrategy,
    setSortStrategy,
    placeholder,
}: {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    showOriginsToggle?: boolean;
    originsOnly: boolean;
    setOriginsOnly: Dispatch<SetStateAction<boolean>>;
    sortStrategy: SortStrategy;
    setSortStrategy: Dispatch<SetStateAction<SortStrategy>>;
    placeholder?: string;
}) => {
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    return (
        <div className="flex items-center flex-wrap mt-8 gap-4 justify-between">
            <div className="flex items-center flex-wrap gap-4">
                <label className="flex items-center border border-text/13 bg-surface0/50 px-[14px] py-[11px] transition-colors duration-200 ease-[ease] focus-within:border-accent/40">
                    <input
                        className="bg-transparent border-0 outline-0 text-text font-mono font-light text-[12.5px] w-[330px] max-w-[60vw] placeholder:text-text/50"
                        type="search"
                        placeholder={placeholder}
                        aria-label="Search tracks"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>
                {showOriginsToggle && (
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
                )}
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
            </div>{" "}
            <div className="flex gap-2 items-center">
                <AnimatePresence initial={false}>
                    {(query !== "" || originsOnly) && (
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 24 }}
                            transition={{ duration: 0.1, ease: "easeOut" }}
                        >
                            <p className="text-subtext-1 italic">
                                37 tracks found.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Diamond filled={query !== "" || originsOnly} />
            </div>
        </div>
    );
};
