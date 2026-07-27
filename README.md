# [parachoral.fm](https://parachoral.fm/)

parachoral.fm or Parachoral is a songbook for Destiny. For every track, snippet, moment, or any other piece of music in the franchise, Parachoral will have a listing of that piece, along with all of its relevant marginalia. From obvious ones like album and title, to quieter ones like motif and composer(s).

Parachoral is MIT Licensed. Do with it as you will.

You may access the project at [https://parachoral.fm]. If you'd like to contribute to the development of the project, continue reading.

_Ex una voce, chorus_

## Contributing

When contributing, be sure to follow the Contributor Covenant at [CODE_OF_CONDUCT.md](./docs/contrib/CODE_OF_CONDUCT.md).

For more detailed information on contributing, please check our [CONTRIBUTING.md](./docs/contrib/CONTRIBUTING.md)

There are two ways to contribute to Parachoral. As a developer helping with the development of the site and application, or as an archivist helping with the tagging and cataloguing of the information in the application.

If you are a software developer, you will likely be interested in the [For Developers](#for-developers) section of this README.

If you are not a software developer, then you'll likely be an archivist, and so you should see the [For Archivists](#for-archivists) section of this README.

## For Developers

This application is a TanStack Start application with full SSR enabled running on Cloudflare Workers. It is written in React with Tailwind and Motion. Data is not loaded through a database, but rather through YAML files in the `/data` directory.

This allows us to deliver all relevant information for the application as a single bundle. In future, we may expose an API to query music data.

### Getting Started

To get set up for development, please ensure you have the following requirements.

1. pnpm as your package manager. If you do use other package managers, please ensure that you do not commit their lockfiles. PRs with alternate package manager lockfiles will not be accepted.
2. Node 24 or higher.
3. Git, of course.

If you use Nix, there is a dev shell accessible by running `nix develop`. There is also an `.envrc` file for direnv users.

If you do not use Nix, [give it a shot](https://nixos.org/). Or ensure that your system packages are up to minimum version for the project on your own.

### Running the Development Server

1. Clone this repository. `git clone git@github.com:NekoDrone/parachoral.git`
2. Enter the project directory `cd parachoral`
3. Install dependencies `pnpm install`
4. Run the dev server `pnpm dev`

```bash
git clone git@github.com:NekoDrone/parachoral
cd parachoral
pnpm install
pnpm dev
```

### Deployment

This part is mostly for myself cause I forget sometimes.

This project is configured for deployment onto Cloudflare Workers with Wrangler.

To deploy, simply run `pnpm deploy`. If this is on a new machine, or if the credentials have expired, Wrangler will prompt you to log in with Cloudflare on a web page.

### Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
pnpm lint
pnpm format
pnpm check
```

### Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).

## For Archivists

Specific instructions on how to add different types of data can be found in the [`/docs`](./docs/) directory found in the project root.

All data is provided to the application through the use of YAML files. YAML is a type of markup language similar to JSON or TOML. The reason we use YAML instead of JSON or TOML (even though I personally dislike YAML) is because YAML files are very readable to non-technical people (like yourself, perhaps).

In order to write YAML files, you'll need an editor. If you are on Windows, Microsoft's default Notepad is a perfectly fine editor for YAML files. However, I recommend you pick up a proper code editor like [VSCode](https://code.visualstudio.com/Download) (or [Codium](https://vscodium.com/)), or at the very minimum, [Notepad++](https://notepad-plus-plus.org/downloads/).

When you have a program suitable for reading and writing text files, simply create the relevant files with the YAML extension (`*.yaml`) into the right directories.
