# Getting started

## Requirements

- **Node.js 24 LTS**. The version is pinned in `.nvmrc`. With [nvm](https://github.com/nvm-sh/nvm), run `nvm use` in the project root.
- **Yarn 4** through Corepack (the `packageManager` field in `package.json`). Enable it once per machine:

```bash
corepack enable
```

This repository is Yarn-only. Do not add `package-lock.json`.

## Setup

From the project root:

```bash
yarn install
```

`yarn install` is immutable when `CI` is set. The first install that creates or migrates `yarn.lock` must run without `CI`. In CI, use `yarn install --immutable`.

Yarn refuses package versions published less than 3 days ago (`.yarnrc.yml` `npmMinimalAgeGate`). A quarantined release reports `YN0016`. Wait until the version is old enough, or choose a slightly older release that already satisfies the range.

## Development

To run Storybook locally:

```bash
yarn storybook
```

Storybook starts at **http://localhost:6006/**.

## Checks

```bash
yarn typecheck
yarn lint
yarn verify
```

`yarn typecheck` runs `tsc --noEmit`. `yarn lint` runs ESLint (existing issues are warnings). `yarn verify` runs typecheck, lint, `yarn build` (library), and `yarn build-storybook`.

## Build

### Library (`@jppinedo/lienzo`)

```bash
yarn build
```

Produces `dist/` with ESM JavaScript, rolled-up type declarations (`index.d.ts`), and component CSS (`lienzo.css`). See the README section **Using Lienzo in your app** for consuming the package locally via Yarn `portal:`.

### Storybook (static site)

```bash
yarn build-storybook
```

Output is written to the `storybook-static/` folder.

## Deploy (GitHub Actions → Hostgator FTP)

On every push to `main`, [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) runs `yarn verify`, then uploads `storybook-static/` to Hostgator via FTP.

Required repository secrets:

| Secret | Purpose |
|--------|---------|
| `FTP_URL` | FTP host (e.g. `ftp.example.com` or `ftp://ftp.example.com`) |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |

Remote path is `server-dir: ./` (change in the workflow if the Hostgator folder differs). Only the built Storybook is uploaded (`local-dir: ./storybook-static/`); source, `node_modules`, `.git`, `.github`, and `.cursor` are not deployed.

## Troubleshooting

### "Too many open files" on macOS

If you see `EMFILE: too many open files` from the file watcher, raise the open-file limit:

```bash
ulimit -n 10240
```

Then run `yarn storybook` again. You can add this command to your shell profile (e.g. `~/.zshrc`) if you need it every time.

### Wrong Yarn version

If `yarn -v` prints `1.x`, Corepack is not active for this Node install. Run `corepack enable`, then `yarn -v` again from the project root. It should print `4.18.1`.
