export const FinalBarline = () => {
    return (
        <div aria-hidden="true" className="relative pt-7">
            <span className="absolute top-0 right-0 font-serif text-sm italic text-subtext-0">
                Fine.
            </span>

            {/* the staff: 5 hairlines, 7px apart (33px tall in total) */}
            <div className="flex flex-col gap-[7px]">
                {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="h-px bg-overlay-0" />
                ))}
            </div>

            {/* the final barline: thin, a breath, then thick */}
            <span className="absolute right-[6px] bottom-0 h-[33px] w-px bg-overlay-2" />
            <span className="absolute right-0 bottom-0 h-[33px] w-[3px] bg-overlay-2" />
        </div>
    );
};
