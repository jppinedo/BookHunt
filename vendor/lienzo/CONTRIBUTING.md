# Contributing to Lienzo

Thank you for wanting to help with Lienzo!

Lienzo is a React design system built with **React 19**, **TypeScript 6**, **Tailwind CSS 4**, and **Storybook 10** (Vite). It is a young project, so every contribution helps: a new component, a better story, a docs fix, an accessibility improvement, or a bug report.

**Is this your first open-source contribution?** You are very welcome here. Look for issues with the [`good first issue`](https://github.com/jppinedo/lienzo/labels/good%20first%20issue) label. They are small and have clear steps. If something is not clear, ask in the issue.

By taking part in this project, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Table of contents

1. [Ways to contribute](#ways-to-contribute)
2. [Set up the project](#set-up-the-project)
3. [Project structure](#project-structure)
4. [Workflow: fork, branch, commit, pull request](#workflow-fork-branch-commit-pull-request)
5. [Adding a new component](#adding-a-new-component)
6. [Storybook story rules](#storybook-story-rules)
7. [Docs page rules (MDX)](#docs-page-rules-mdx)
8. [Code style](#code-style)
9. [Keep the Documentation folder up to date](#keep-the-documentation-folder-up-to-date)
10. [Checklist before you open a pull request](#checklist-before-you-open-a-pull-request)
11. [Getting help](#getting-help)

---

## Ways to contribute

- **Report a bug.** Open an issue. Say which component, what happened, what you expected, and how to see the problem in Storybook. A screenshot helps a lot.
- **Suggest a component or feature.** Open an issue and describe it. For a big new component, please wait for a short discussion before you start coding.
- **Fix an issue.** Write a comment like "I'd like to work on this" on the issue. We will assign it to you, so two people do not do the same work.
- **Improve the docs.** Typos, unclear steps, missing examples. Small docs pull requests are very welcome.

---

## Set up the project

### Requirements

- **Node.js 24 (LTS).** The version is in `.nvmrc`. If you use [nvm](https://github.com/nvm-sh/nvm), run this in the project folder:

  ```bash
  nvm install   # first time only
  nvm use
  ```

- **Yarn 4.** You do not need to install Yarn yourself. Node 24 includes **Corepack**, which uses the exact Yarn version written in `package.json` (the `packageManager` field). Turn it on once:

  ```bash
  corepack enable
  ```

  Check it: `yarn -v` should print `4.18.1`. If it prints `1.x`, see [Troubleshooting](#troubleshooting).

> Please use **Yarn**, not npm or pnpm. The project has one lockfile (`yarn.lock`), and it must be the same for everyone. Do not commit a `package-lock.json` (it is in `.gitignore`).

### Install and run

```bash
# 1. Fork the repo on GitHub, then clone YOUR fork
git clone https://github.com/<your-username>/lienzo.git
cd lienzo

# 2. Install dependencies
yarn install

# 3. Start Storybook
yarn storybook
```

Storybook opens at **http://localhost:6006**. The first page is **Introduction / Welcome**.

### Available scripts

| Command | What it does |
|---------|--------------|
| `yarn storybook` | Starts Storybook in dev mode on port 6006 |
| `yarn build-storybook` | Builds a static Storybook into `storybook-static/` |
| `yarn typecheck` | Checks TypeScript types (`tsc --noEmit`) |
| `yarn lint` | Runs ESLint on the project |
| `yarn verify` | Runs `typecheck`, `lint`, and `build-storybook`. CI runs the same command on every push and pull request. |

> There are no unit tests yet, so `yarn test` does not exist. Adding Storybook interaction tests is a great contribution. See the open issues.

### Good to know about Yarn 4

- Packages are installed into a normal `node_modules` folder (set in `.yarnrc.yml`), so editors and tools work as usual.
- Yarn does not install package versions that are less than **3 days** old (`npmMinimalAgeGate` in `.yarnrc.yml`). This protects the project from brand-new, possibly unsafe releases. If Yarn says a version is *quarantined* (error `YN0016`), choose a slightly older version or wait a few days.

### Troubleshooting

- **`yarn -v` prints `1.x`.** An old global Yarn is used instead of the project's Yarn 4. Run `corepack enable`, then run `yarn -v` again in the project folder. If it still prints `1.x`, remove the global Yarn (`npm uninstall -g yarn`).
- **Strange install errors.** Check that you use Node 24 (`node -v`) and Yarn 4 (`yarn -v`). Delete `node_modules` and run `yarn install` again.
- **"The lockfile would have been modified by this install, which is explicitly forbidden".** You changed `package.json` but `yarn.lock` is not up to date. Run `yarn install` (without the `CI` environment variable) and commit the new `yarn.lock`.
- **macOS: `EMFILE: too many open files`.** Run `ulimit -n 10240`, then run `yarn storybook` again.
- More help: [Documentation/getting-started.md](Documentation/getting-started.md).

---

## Project structure

Lienzo follows **Atomic Design**:

| Tier | Folder | Examples |
|------|--------|----------|
| Atoms | `src/components/atoms/` | Button, Input, Badge, Checkbox, Switch, Title |
| Molecules | `src/components/molecules/` | Tabs, Toolbar, Menu, Calendar, LineChart, CodeBlock |
| Organisms | `src/components/organisms/` | None yet. The `@organisms/*` alias is reserved. |
| Templates | `src/components/templates/` | Phone |
| Pages | `src/components/pages/` | Welcome, WelcomeHero, WelcomeFoundations, CanvasStudio |

Other important folders and files:

| Path | Purpose |
|------|---------|
| `src/css/tokens.css` | Design tokens (colors as CSS variables). **Source of truth for colors.** |
| `src/tailwind.css` | Tailwind 4 setup. The `@theme inline` block maps Tailwind color names (`pio-*`, `gray-*`, …) to the tokens, and also defines fonts, shadows, and the `dark:` variant. There is no `tailwind.config.js`. |
| `src/docs/` | Storybook Docs infrastructure: `ComponentDocsPage`, `LivePreview` |
| `src/interfaces/` | Shared TypeScript types (for example `sizes.ts`) |
| `src/hooks/` | Shared React hooks (for example `useContainerWidth`, `useControllableState`) |
| `.storybook/` | Storybook config (`main.ts`, `preview.ts`, `manager.ts`, `story-global.css`) |
| `Documentation/` | Project documentation. Please read it! |
| `.cursor/` | Optional settings for the Cursor editor. You can ignore this folder. |

**Recommended reading order:** [Getting started](Documentation/getting-started.md) → [Architecture](Documentation/architecture.md) → [Component structure](Documentation/component-structure.md) → [Component Docs](Documentation/component-docs.md).

### Path aliases

Import with aliases, not long relative paths:

```ts
import Button from '@atoms/Button/Button';
import Tabs from '@molecules/Tabs/Tabs';
import { ComponentDocsPage } from '@docs/ComponentDocsPage';
import { RoundedSizes } from '@interfaces/sizes';
```

Full list: [Documentation/architecture.md](Documentation/architecture.md#typescript-path-aliases). Aliases are configured in **two places**: `tsconfig.json` (`paths`) and `.storybook/main.ts` (the `aliases` object used in `viteFinal`). If you add a new alias, update both.

---

## Workflow: fork, branch, commit, pull request

### 1. Fork and keep your fork updated

```bash
# one time: add the original repo as "upstream"
git remote add upstream https://github.com/jppinedo/lienzo.git

# before you start new work
git checkout main
git pull upstream main
```

### 2. Create a branch

Do not work directly on `main`. Use a short branch name with a prefix:

| Prefix | Use for | Example |
|--------|---------|---------|
| `feat/` | New component or feature | `feat/avatar-atom` |
| `fix/` | Bug fix | `fix/select-arrow-icon` |
| `docs/` | Documentation only | `docs/badge-variations` |
| `a11y/` | Accessibility improvement | `a11y/checkbox-keyboard` |
| `chore/` | Tooling, config, dependencies | `chore/fix-lint-warnings` |

```bash
git checkout -b feat/avatar-atom
```

### 3. Commit with Conventional Commits

The project uses [Conventional Commits](https://www.conventionalcommits.org/). Please use the same style:

```
<type>: <short description in present tense>
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

Examples:

```
feat: add Avatar atom with sizes and initials fallback
fix: toggle Checkbox with Space and Enter
docs: add Tones to Badge Variations gallery
chore: remove unused imports in Toolbar
```

Small, focused commits are easier to review than one big commit.

### 4. Open a pull request (PR)

```bash
git push origin feat/avatar-atom
```

Then open a PR on GitHub **into `jppinedo/lienzo` → `main`**.

In your PR:

- Link the issue: write `Closes #123` in the description.
- Add a **screenshot or short GIF** of the change in Storybook. Show light **and** dark mode if the component supports dark mode.
- Keep the PR small: one component or one fix per PR.
- Wait for the **CI** check (`verify`) to pass. If it fails, open the check details to see the error.

### 5. Review

A maintainer will review your PR. PRs are reviewed once a day, so you can usually expect a first response within about a day. It is normal to get comments and change requests. This is how we learn together, and it is not a criticism. Push new commits to the same branch and the PR updates automatically.

---

## Adding a new component

Please **open an issue first** for a new component, so we can agree on the name, tier (atom, molecule, …), and props before you write code.

### Folder and files

Each component has its own folder in the correct tier. Use **PascalCase** for the folder and file names.

```
src/components/atoms/Avatar/
├── Avatar.tsx            # Component + exported props interface (required)
├── AvatarStyles.ts       # Tailwind class strings as objects (optional, recommended)
├── Avatar.css            # Only if Tailwind can't do it, e.g. keyframes (optional)
├── Avatar.stories.tsx    # Storybook stories (required)
└── Avatar.mdx            # Docs page using ComponentDocsPage (required for atoms, molecules, organisms)
```

Which tiers need a Docs page (`.mdx`)?

| Tier | Docs page |
|------|-----------|
| Atoms, molecules, organisms | **Required** |
| Templates | Optional (Phone has one) |
| Pages, Introduction / Welcome | **Not allowed.** Stories only. |

Good examples to copy from:

- Atoms: [`Button`](src/components/atoms/Button/), [`Box`](src/components/atoms/Box/), [`Switch`](src/components/atoms/Switch/)
- Molecules: [`Tabs`](src/components/molecules/Tabs/), [`Toolbar`](src/components/molecules/Toolbar/)
- **Docs page reference (the quality bar):** [`LineChart.mdx`](src/components/molecules/LineChart/LineChart.mdx)

### Step by step

1. **Create the folder** under the correct tier, for example `src/components/atoms/Avatar/`.
2. **Write `Avatar.tsx`.** Export the props interface (`export interface AvatarProps`) and export the component as the default export.
3. **Put Tailwind classes in `AvatarStyles.ts`**, so they live in one place (see `ButtonStyles.ts`).
4. **Use design tokens, not raw colors.** Use the Tailwind theme (`bg-pio-bg`, `text-pio-text`, `border-pio-grid`, `bg-pio-coral`, …). Do not hard-code hex values. Only the colors in `src/tailwind.css` exist. Tailwind's default palette (for example `gray-200`, `red-500`) is turned off. See [Design tokens & colors](Documentation/design-tokens-colors.md).
5. **Use the semantic `type` prop** when your component has color variants: `default` (gray), `red` (coral), `yellow` (amber), `green` (teal).
6. **Support dark mode** with Tailwind `dark:` classes. Dark mode is on when an ancestor element has `data-mode="dark"`. Check it with the theme switcher in the Storybook toolbar.
7. **Write the stories** (`Avatar.stories.tsx`). See the rules below.
8. **Write the Docs page** (`Avatar.mdx`) with `ComponentDocsPage`. See the rules below.
9. **Update the docs:** add a row for your component in [Documentation/component-structure.md](Documentation/component-structure.md).

### Accessibility basics

Every component should work with a keyboard and a screen reader:

- Use native elements (`<button>`, `<input>`, `<select>`) when you can.
- If you use a `div` with a role (for example `role="checkbox"`), also handle the keyboard (`Enter` / `Space`) and add a visible focus style. `Switch.tsx` is a good example.
- Give icon-only controls an `aria-label`.
- Check color contrast in light and dark mode. The **Accessibility** panel in Storybook (addon-a11y) helps with this.

---

## Storybook story rules

Stories live next to the component in `ComponentName.stories.tsx`.

1. **`title`** must match the tier: `Atoms/Avatar`, `Molecules/Avatar`, `Organisms/…`, `Templates/…`, or `Pages/…`.
2. **Import types from the framework package:** `import type { Meta, StoryObj } from '@storybook/react-vite';` (not `@storybook/react`). For actions, use `import { fn } from 'storybook/test';`.
3. **Atoms, molecules, and organisms need a hidden `Default` story.** It powers the Live Preview on the Docs page. Hide it from the sidebar with tags:

   ```tsx
   export const Default: StoryObj<typeof Avatar> = {
     args: { size: 'md', type: 'default' },
     tags: ['!dev'],
   };
   ```

   Many existing stories use `Template.bind({})` with `StoryFn`. That still works. For new stories, please use the object format above.

   Templates and pages do not need a hidden `Default`. They only have visible gallery stories.

4. **Controls are style-only.** Show every prop that changes how the component **looks** (size, type, fill, rounded, booleans, …). Hide everything else:

   ```tsx
   argTypes: {
     size: { name: 'Size', control: 'select', options: ['sm', 'md', 'lg'] },
     onClick: { control: false, table: { disable: true } },
     children: { control: false, table: { disable: true } },
   },
   ```

   Hide: event handlers (`onClick`, `onChange`), JSX / `children` slots, complex objects (`items`, `options`, `data`), and generic `className`. Use `argTypes.name` for friendly labels (`'Show grid'` instead of `showGrid`).

5. **Variant stories** (for example `Sizes`, `Types`) show the different looks. They are visible in the sidebar and have Controls turned off:

   ```tsx
   export const Sizes = () => ( /* ... */ );
   Sizes.parameters = { controls: { disable: true } };
   ```

6. **Name stories by what they show** (for example `Sizes`, `Tones`, `WithIcon`). Do not use a color name that is not in the story.

Full rules: [Documentation/storybook.md](Documentation/storybook.md#style-only-controls).

---

## Docs page rules (MDX)

Every atom, molecule, and organism needs a `ComponentName.mdx` Docs page that uses the shared **`ComponentDocsPage`** template. Import doc blocks (`Meta`, `Canvas`) from `@storybook/addon-docs/blocks`. Do **not** build your own layout or restyle the page. The template owns the design.

**Required props:** `title`, `badge` (use `"0.1.0"`), `description`, `stories`, `useCases`, `variations`, `props`, `example`.
**Optional props:** `breadcrumb`, `usage` (`whenToUse` / `whenToAvoid`).

Important rules:

- **Variations:** every visible variant story must appear in `variations`. Do not put `Default` there. `variations={[]}` is only OK until variant stories exist.
- **Props API:** list every public prop with its type and a description, including handlers and children.
- **Code example:** short and simple, with the real import path.
- **Never invent** props, variants, or behaviors that the component does not have.

Copy the skeleton from [Documentation/component-docs.md](Documentation/component-docs.md#skeleton-mandatory-props), and use [`LineChart.mdx`](src/components/molecules/LineChart/LineChart.mdx) as the example.

---

## Code style

- **TypeScript** for all components (`.tsx` / `.ts`). Export the props interface. Avoid `any` (`noImplicitAny` is on in `tsconfig.json`; `strict` is off for now).
- **Function components** typed with `React.FC<Props>` (the pattern used in the repo). In React 19, `ref` is a normal prop, so new components do not need `forwardRef`.
- **Tailwind first.** Put class strings in `*Styles.ts`. Use `.css` only when Tailwind can't do it.
- **Tailwind 4 class names.** Some names changed from v3. For example: `shadow-xs` is the smallest shadow, bare `rounded` is now `rounded-sm`, use `outline-hidden` instead of `outline-none`, `shrink-0` / `grow` instead of `flex-shrink-0` / `flex-grow`, and `!` goes at the **end** for important (`text-white!`). See the [Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide#renamed-utilities).
- **Tokens, not hex.** Colors come from `src/css/tokens.css` through Tailwind (`pio-*`, `gray-*`).
- **Path aliases** for imports (`@atoms/…`, `@molecules/…`).
- **Icons:** use [`react-feather`](https://feathericons.com/), which is already a dependency. Please ask in the issue before you add a new library.
- **New dependencies:** discuss them in the issue first, then update [Documentation/libraries.md](Documentation/libraries.md).
- **Linting:** run `yarn lint` before you push. The config is in `eslint.config.mjs` (ESLint 10, flat config). It includes rules for TypeScript, React, React Hooks, accessibility (`jsx-a11y-x`), and Storybook. Some rules are only warnings for now, because old code still breaks them. Please do not add new warnings.
- **Formatting:** there is no Prettier setup yet. Match the style of the code around your change (2-space indent, single quotes).

---

## Keep the Documentation folder up to date

The `Documentation/` folder describes the **current state** of the project. If your change affects one of these areas, update the matching file in the same PR:

| You changed… | Update |
|--------------|--------|
| A component (added or changed) | `Documentation/component-structure.md` |
| Colors / design tokens | `Documentation/design-tokens-colors.md` |
| A dependency | `Documentation/libraries.md` |
| Storybook config, addons, story locations | `Documentation/storybook.md` |
| `src/assets/` | `Documentation/assets.md` |
| Folder layout or path aliases | `Documentation/architecture.md` |
| Setup, scripts, troubleshooting | `Documentation/getting-started.md` |

Write docs as short reference text ("Button supports types: default, red, green, yellow"), not as a story of what you did.

---

## Checklist before you open a pull request

- [ ] I am on a branch, not `main`.
- [ ] `yarn storybook` runs with no errors in the terminal or the browser console.
- [ ] `yarn verify` passes (types, lint, and Storybook build).
- [ ] I did not commit a `package-lock.json`. If I changed dependencies, I committed `yarn.lock`.
- [ ] Atom / molecule / organism: it has `*.tsx`, `*.stories.tsx` (with a hidden `Default`), and `*.mdx` using `ComponentDocsPage`.
- [ ] All visible variant stories are listed in `variations`.
- [ ] I checked light **and** dark mode in Storybook.
- [ ] I can use the component with the keyboard only.
- [ ] I used design tokens and path aliases.
- [ ] I updated the matching file in `Documentation/`.
- [ ] My commits follow Conventional Commits.
- [ ] I added screenshots to the PR.

---

## Getting help

- **Questions about an issue:** write a comment on the issue.
- **Other questions or ideas:** open a new issue and describe your question.
- **Problems with setup:** open an issue with your operating system, the output of `node -v` and `yarn -v`, and the full error message.

Thank you for helping make Lienzo better!
