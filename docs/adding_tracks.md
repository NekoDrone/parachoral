# Adding Tracks

To add a track to Parachoral, open the `/data` directory located at the project root.

Then, open the `/tracks` directory. You are now in `/data/tracks`.

Next, identify the track's release. A release is the specific game/expansion/season when the track was first heard in game. If you are attempting to add a track with no proper in-game release (not sure where these might have been from, but just in case)[^1], skip ahead to the subsection titled "Unreleased Tracks".

Once you have identified the track's release, e.g. "Regicide" from Destiny 1: The Taken King, consult the releases file (`/data/releases.yaml`). Find the corresponding release (For Regicide, it will fall under `4_the-taken-king`)[^2]. Take note of the `slug` field for that release.

Under `/data/tracks`, locate the corresponding slug and create a YAML file there with the name of the song in `kebab-case`. In "Regicide"'s case, the file should be located at `/data/tracks/4_the-taken-king/regicide.yaml`.

You may optionally copy the template YAML file located at `/docs/templates/track.yaml` to the appropriate location and name.

Fill in the required fields. The template YAML file is upkept at best-effort. For the true source of truth for the schema of a Track's YAML file, please see `/src/lib/types/data/track.ts`.

Once done, you may launch the dev server (`pnpm dev`), which will attempt to load the newly created file into the site. If there are any fields missing or incorrect in the YAML file, it will appear in the output of the dev server.

[^1]: Music of the Spheres, or MotS for short, falls under release 0 (`0_music-of-the-spheres`) as it is a prequel release to Destiny. This is in spite of the actual release of MotS being in 2018.

[^2]: While The Taken King's soundtrack is the second album, we track releases in Parachoral as in-game releases. So, since The Taken King was the third expansion in Destiny, it is chronologically the fourth release (Destiny 1 is the first release; 1 + 3 = 4).
