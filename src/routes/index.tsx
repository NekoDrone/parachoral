import { Emblem } from "#/components/misc/Emblem";
import { RuleMark } from "#/components/misc/RuleMark";
import { Header } from "#/components/nav/Header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
    return (
        <>
            {/* Atmosphere — consider moving to __root.tsx once more pages exist */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_480px_at_50%_-8%,rgba(97,126,180,0.13),transparent_65%)]"
            />

            <Header />

            <main className="relative max-w-full px-7">
                <section className="pb-24 pt-16 text-center">
                    <Emblem />

                    <h1 className="mt-7 font-serif text-[clamp(46px,7.5vw,84px)] font-medium uppercase leading-[1.05] tracking-[0.13em] indent-[0.13em]">
                        Parachoral
                    </h1>

                    <RuleMark />

                    <p className="mt-5 font-sans text-[11px] font-light uppercase tracking-[0.42em] indent-[0.42em] text-gold">
                        A songbook of the Destiny universe
                    </p>
                    <p className="mx-auto mt-6 max-w-[560px] text-[19px] leading-relaxed">
                        A celebration and extolment of the music in the best
                        game ever made, Destiny. Every track is painstakingly
                        tagged, noted, and catalogued with all of its
                        marginalia. Each motif and idea found and brought into
                        the light from the dark. An archive of over a decade's
                        worth of joy, grief, sorrow, anger, fear, knowledge, and
                        hope.
                    </p>
                    <p className="mt-5 text-[17px] uppercase tracking-widest indent-[0.42em] text-gold">
                        Per Audacia ad Astra.
                    </p>
                </section>
            </main>
        </>
    );
}
