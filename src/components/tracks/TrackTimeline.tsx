import { SectionHead } from "#/components/misc/SectionHead";

const testStuff: Array<{
    label: string;
    timestamp: { start: number; end?: number };
}> = [
        { label: "The Dawning", timestamp: { start: 0, end: 16 } },
        { label: "The Guardian", timestamp: { start: 52 } },
        { label: "Be Brave", timestamp: { start: 84, end: 107 } },
        { label: "The Dawning", timestamp: { start: 132, end: 151 } },
    ];

export const TrackTimeline = () => {
    return (
        <section className="px-0 pt-[56px] pb-[8px] flex flex-col gap-2 items-center justify-center">
            <SectionHead label="The Score" num={1} />
            <div className="flex flex-col w-full items-center">
                {testStuff.map((m) => (
                    <div className="flex gap-2 justify-between w-[90%] h-12 items-center">
                        <span className="font-sans uppercase tracking-[0.15em] text-subtext-1 text-xs">
                        {m.label}
                        </span>
                        <div className=" w-[85%] flex items-center border-x border-overlay-0 h-full">
                            <span className="h-px w-full bg-overlay-0" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
