import {
    activitiesMap,
    albumsMap,
    motifsMap,
    releasesMap,
    tracksMap,
} from "#/lib/load";
import { err, ok } from "#/lib/result";
import type { Result } from "#/lib/result";
import type {
    TrackActivityResolved,
    TrackAlbumResolved,
    TrackMotifResolved,
    TrackResolved,
} from "#/lib/types/data/track";

export const getTrackBySlug = (slug: string): Result<TrackResolved, string> => {
    const track = tracksMap.get(slug);
    if (!track) return err(`Could not find track from given slug: ${slug}`);

    const trackRelease = releasesMap.get(track.release.slug);
    if (!trackRelease)
        return err(
            `Could not find track ${track.title}'s release. Even in cases when tracks are stray, they should have automatically been tagged as Unreleased. This should not happen. Given release slug: ${track.release.slug}`,
        );

    const trackAlbums = track.albums.map((a) => ({
        album: albumsMap.get(a.albumSlug),
        track: a.track,
    }));
    if (trackAlbums.some((e) => e.album === undefined))
        return err(
            `Could not find track ${track.title}'s album(s), even though slug(s) were provided: \`[${track.albums.map((a) => a.albumSlug).join(", ")}]\`. Check to ensure that you have correctly linked a track's album(s) to an existing album in \`/data/albums/*.yaml\``,
        );

    const trackMotifs = track.motifs.map((m) => ({
        ...m,
        motif: motifsMap.get(m.motifSlug),
    }));
    if (trackMotifs.some((e) => e.motif === undefined))
        return err(
            `Could not find track ${track.title}'s motif(s), even though slug(s) were provided: \`[${track.motifs.map((a) => a.motifSlug).join(", ")}]\`. Check to ensure that you have correctly linked a track's motif(s) to an existing motif in \`/data/motifs/*.yaml\``,
        );

    const trackPlaysIns = track.playsIn.map((a) => ({
        ...a,
        activity: activitiesMap.get(a.activitySlug),
    }));
    if (trackPlaysIns.some((e) => e.activity === undefined))
        return err(
            `Could not find track ${track.title}'s activity(ies), even though slug(s) were provided: \`[${track.playsIn.map((a) => a.activitySlug).join(", ")}]\`. Check to ensure that you have correctly linked a track's activity(ies) to an existing activity in \`/data/activities/*.yaml\``,
        );

    // I am skill issuing hard here, I can't figure out how to narrow the type properly
    // so I'm just gonna guard and cast.
    return ok({
        ...track,
        release: trackRelease,
        albums: trackAlbums as Array<TrackAlbumResolved>,
        motifs: trackMotifs as Array<TrackMotifResolved>,
        playsIn: trackPlaysIns as Array<TrackActivityResolved>,
    });
};
