import { toRomanNumeral } from "#/lib/utils";

export const SectionHead = ({
    label,
    num,
    className = "mb-8 w-full",
}: {
    label: string;
    num: number;
    className?: string;
}) => {
    return (
        <div className={`flex items-center gap-[20px] ${className}`}>
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
