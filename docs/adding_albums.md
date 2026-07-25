# Adding Albums

Before adding an album, please be reminded that in Parachoral, we tag tracks according to their in-game release, not their album release. This is because the game serves as the canonical basis from which tracks are heard. If there is a track that is in an album, but not officially released in game, it is considered unreleased.

Album data is used as a purely logical organiser for tracks that happen to have an album release. For a good portion of the catalogue, there will not be an associated album. As such, we tag the origin source of truth as game/expansion/season releases.

To add an album to Parachoral, open the `/data` directory located at the project root.

Then, open the `/albums` directory. You are now in `/data/albums`. This directory is organised as a loose collection of albums, and will be initially sorted in alphabetical order on the `/albums` route in the application.

You may optionally copy the template YAML file located at `/docs/templates/album.yaml` to the appropriate location and name.

Fill in the required fields. The template YAML file is upkept at best-effort. For the true source of truth for the schema of a Track's YAML file, please see `/src/lib/types/data/album.ts`.

Once done, you may launch the dev server (`pnpm dev`), which will attempt to load the newly created file into the site. If there are any fields missing or incorrect in the YAML file, it will appear in the output of the dev server.
