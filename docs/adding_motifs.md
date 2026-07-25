# Adding Motifs

A motif is a recurring musical idea. Leitmotifs specifically are motifs tied to a specific character or concept. For the vast majority of motifs in Destiny, they are leitmotifs, as they have some association with an idea. For example, the Darkness leitmotif whenever you see pyramid ships or the Black Fleet, or Savathun's Song, which is very commonly known as "I'm on the moon, I'm made of cheese" as sung by Shaxx.

Identifying motifs isn't particularly difficult, but it can be muddied when two motifs that sound similar to each other are played near one another. Most of the difficulty in adding motifs come from tedium, however. Parachoral is set up in a way that when listening to a track to identify the motifs within, you can quickly return to the dev page and search for any pre-existing motifs.

To add a motif to Parachoral, open the `/data` directory located at the project root.

Then, open the `/motifs` directory. You are now in `/data/motifs`. This directory is organised as a loose collection of motifs, and will be initially sorted in alphabetical order on the `/motifs` route in the application.

You may optionally copy the template YAML file located at `/docs/templates/motif.yaml` to the appropriate location and name.

Fill in the required fields. The template YAML file is upkept at best-effort. For the true source of truth for the schema of a Track's YAML file, please see `/src/lib/types/data/motif.ts`.

Once done, you may launch the dev server (`pnpm dev`), which will attempt to load the newly created file into the site. If there are any fields missing or incorrect in the YAML file, it will appear in the output of the dev server.

## About motif origins/names

When naming a motif, if it is a leitmotif (which again, is like 99% of Destiny's motifs or something), you should attempt to name it after what the leitmotif represents.

Do not assume that a motif's origin is the track in which it first plays in the game. This is because motifs are oftentimes teased before actually being released.

An example of this is the Tangled Shore motif. The origin of the motif is the track "Tangled Shore" from Destiny 2: Forsaken, and very clearly represents the Tangled Shore as it's heard whenever the Tangled Shore is involved. However, the first canonical release of the motif is in "Tree of Probabilities" from Destiny 2: Curse of Osiris, almost a full year before Forsaken was released. If we relied on chronology for the origin of a motif, then the motif would have been named the Tree of Probabilities motif, which would confuse users when they look up the motif and see it's often used in Forsaken and whenever the Tangled Shore is involved.

Chronology does not imply origin.
