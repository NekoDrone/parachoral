import { TrackActivities } from "#/components/tracks/TrackActivities";
import { TrackMotifs } from "#/components/tracks/TrackMotifs";

export const TrackMotifActivitiesWrapper = () => {
    return (
        <div className="px-0 pt-16 pb-[8px] grid grid-cols-[2fr_1fr] gap-8 items-center justify-center">
            <TrackMotifs />
            <TrackActivities />
        </div>
    );
};
