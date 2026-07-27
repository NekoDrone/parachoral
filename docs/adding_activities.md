# Adding Activities

Activities act as another way to look up a given track. Curious about what track plays in the last stand when fighting Taniks in Deep Stone Crypt? We've got you covered.

To add an activity to Parachoral, open the `/data` directory located at the project root.

Then, open the `/activities` directory. You are now in `/data/activities`. This directory is organised as a collection of activities by type. Each activity type will be separated and initially sorted in alphabetical order on the `/activities` route in the application.

Each activity has a type which must be sorted. Any loose activities in this directory (`/data/activities/*.yaml`) will cause validation to fail. If you are unable to sort an activity into its specified type (for some reason), you may fall back to using `/data/activities/others/*.yaml`.

You may optionally copy the template YAML file located at `/docs/templates/activity.yaml` to the appropriate location and name.

Fill in the required fields. The template YAML file is upkept at best-effort. For the true source of truth for the schema of a Track's YAML file, please see `/src/lib/types/data/activity.ts`.

Once done, you may launch the dev server (`pnpm dev`), which will attempt to load the newly created file into the site. If there are any fields missing or incorrect in the YAML file, it will appear in the output of the dev server.
