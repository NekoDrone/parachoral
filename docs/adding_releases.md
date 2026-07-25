# Adding Releases

A release is the specific game/expansion/season when the track was first heard in game. In Parachoral, we tag tracks according to their in-game release, not their album release. This is because the game serves as the canonical basis from which tracks are heard. If there is a track that is in an album, but not officially released in game, it is considered unreleased.

To add a release, open the releases file located at `/data/releases.yaml`. A release contains four fields, one of which is optional:

```yaml
# release schema
- slug: \#_kebab-cased-slug # e.g. 10a_season-of-the-undying
  name: Full Name of the Release # e.g. Season of the Undying
  year: 2019 # must be a number
  parentSlug: \#_kebab-cased-slug-of-parent # e.g. 10_shadowkeep, optional.
```

Add the release in chronological order. In the example above, we are listing Season of the Undying, which is in Shadowkeep, the 10th release in Destiny, and the first season tagged under Shadowkeep (hence `10a` as the cardinality).

As always, the above schema is provided as a best-effort example. For the accurate true source of truth for the schema of a Release, please see `/src/lib/types/data/releases.ts.`
