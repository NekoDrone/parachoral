import { toRomanNumeral } from "#/lib/utils";

export const SectionHead = ({ label, num }: { label: string; num: number }) => {
    return (
        <div className="flex items-center gap-[20px] mb-[34px] w-full">
            <span className="font-sans font-normal text-[11px] tracking-[0.36em] uppercase text-accent whitespace-nowrap">
                {label}
            </span>
            <span className="flex-1 h-px bg-overlay-0" aria-hidden="true" />
            <span className="font-serif text-[15px] text-subtext-0 italic">
                § {toRomanNumeral(num)}
            </span>
        </div>
    );
};
