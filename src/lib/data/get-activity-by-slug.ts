import { activitiesMap } from "#/lib/load";
import { err, ok } from "#/lib/result";
import type { Result } from "#/lib/result";
import type { Activity } from "#/lib/types/data/activity";

export const getActivityBySlug = (slug: string): Result<Activity, string> => {
    const activity = activitiesMap.get(slug);
    if (!activity)
        return err(`Could not find activity from given slug: ${slug}`);

    return ok(activity);
};
