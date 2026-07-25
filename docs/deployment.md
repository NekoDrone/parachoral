# Deployment

To deploy the project, simply run `pnpm deploy`. Wrangler will then prompt you to authenticate via Cloudflare.

The build is done through Vite, and so will implicitly tree-shake unused modules.

The production instance of `parachoral` is hosted on Cloudflare at [https://parachoral.fm].

Additional assets will be served over Cloudflare R2.
