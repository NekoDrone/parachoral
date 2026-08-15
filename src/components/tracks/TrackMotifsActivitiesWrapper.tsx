import { TrackActivities } from "#/components/tracks/TrackActivities";
import { TrackMotifs } from "#/components/tracks/TrackMotifs";

export const TrackMotifActivitiesWrapper = () => {
    return (
        <section className="px-0 pt-16 pb-8 grid grid-cols-[2fr_1fr] gap-8 justify-center">
            <TrackMotifs />
            <TrackActivities />
        </section>
    );
};
