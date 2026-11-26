# Storybook

Storybook is used to develop and document components in isolation, and to run visual demos and regression checks.

## Running Storybook

From the project root:

```bash
yarn storybook
```

The app opens at **http://localhost:6006**. For install and troubleshooting, see [Getting started](getting-started.md).

## Story locations

Stories are picked up automatically from:

- **Introduction / Welcome** (first): [src/components/pages/Welcome/Welcome.stories.tsx](../src/components/pages/Welcome/Welcome.stories.tsx) — landing page (WelcomeHero + WelcomeFoundations). CSF story with `useGlobals` for theme; Docs disabled.
- **Component stories**: Any `*.stories.tsx` or `*.mdx` under `src/` (e.g. `src/components/atoms/Button/Button.stories.tsx`)

The exact globs are set in [.storybook/main.ts](../.storybook/main.ts):

```js
stories: [
  '../src/components/pages/Welcome/Welcome.stories.tsx',
  '../src/**/*.stories.tsx',
  '../src/**/*.mdx',
],
```

Listing Welcome stories first ensures Introduction opens when Storybook starts.

## Manager branding (sidebar logo)

The default Storybook mark in the left sidebar is replaced via theme config in [`.storybook/manager.ts`](../.storybook/manager.ts):

- `brandTitle`: `Lienzo`
- `brandImage`: `./lienzo-horizontal-logo.svg` (served from [`.storybook/public/`](../.storybook/public/) via `staticDirs` in [`.storybook/main.ts`](../.storybook/main.ts))
- Manager theme `base`: `dark` (matches a dark sidebar; the SVG uses light mark/wordmark)

Storybook’s manager only accepts an image URL for `brandImage` (not a React component). The React lockup for in-canvas use is `LienzoHorizontalLogo` (`variant="onDark"` matches the sidebar asset).

## Sidebar structure

Components appear under capitalized atomic-design folders. Set `title` on each stories file accordingly:

- `Atoms/ComponentName` — atoms (e.g. `Atoms/Button`)
- `Molecules/ComponentName` — molecules (e.g. `Molecules/Toolbar`)
- `Organisms/ComponentName` — reserved for future organism components
- `Templates/ComponentName` — layout shells (e.g. `Templates/Phone`)
- `Pages/ComponentName` — filled page compositions (e.g. `Pages/WelcomeHero`, `Pages/WelcomeFoundations`, `Pages/CanvasStudio`)

Pinned at the top: **Introduction** (CSF title `Introduction`, story `Welcome` → sidebar `Introduction / Welcome`). Then Atoms, Molecules, Organisms, Templates, Pages. Within each **atom / molecule / organism** that has Docs, **Docs** is listed first, then variant stories. Sort order is configured in [.storybook/preview.ts](../.storybook/preview.ts).

Prop-customizable components look like:

```
Atoms
  Button
    Docs
    Variants
    Tools
```

Landing and pages:

```
Introduction
  Welcome       ← CSF + useGlobals; no Docs / ComponentDocsPage
Atoms
  …
Pages
  WelcomeHero
    LivePreview ← CSF gallery only; no Docs
```

## Docs vs variant stories

**Docs** (`ComponentName.mdx` + Live Preview Controls) is the interactive reference for **atoms, molecules, and organisms** only—components visitors customize via props. The contract is documented in [Component Docs](component-docs.md).

**Pages and Introduction/Welcome are exempt:** do not add `ComponentDocsPage` or Docs MDX for them. Pages ship CSF gallery stories under `Pages/…`. The landing is [Welcome.stories.tsx](../src/components/pages/Welcome/Welcome.stories.tsx) (`title: 'Introduction'`, export `Welcome`) with theme via `useGlobals` / `updateGlobals` so `withThemeByDataAttribute` sets `data-mode`. See [Component Docs — Scope](component-docs.md#scope-who-gets-docs--live-preview).

Every production Docs page **must** use **ComponentDocsPage** ([src/docs/ComponentDocsPage/ComponentDocsPage.tsx](../src/docs/ComponentDocsPage/ComponentDocsPage.tsx)). **Mandatory:** `title`, version `badge` (default `0.1.0`), `description`, `stories` (Live Preview on `stories.Default`), `useCases`, `props`, and `example`. **Variations** are required once distinct stories exist (may be temporarily empty). **Optional:** `breadcrumb`, `usage` (nice to have). Import via `@docs/ComponentDocsPage`. Do not hand-roll Docs layout. **[LineChart.mdx](../src/components/molecules/LineChart/LineChart.mdx)** is the content-quality reference. Full contract: [Component Docs](component-docs.md).

Docs pages use the brand canvas: `pio-bg` in light mode (`dark-canvas` in dark mode), coral/teal ambient glows behind the article, Plus Jakarta Sans for body copy, and Playfair Display for **article** H1/H2 (direct children of `.sbdocs-content`, not headings inside a Canvas preview). Selection uses `pio-coral-pale` / `pio-coral`. This applies only inside `#storybook-docs`; variant **Canvas** stories keep `light-canvas` / `dark-canvas` and are not restyled to the marketing page. The live `.docs-story` frame keeps those canvas colors so the component is not sitting on the Docs article fill.

**Live Preview** ([src/docs/LivePreview/LivePreview.tsx](../src/docs/LivePreview/LivePreview.tsx)) wraps Storybook `<Canvas>` and `<Controls>` for the dual-column card layout (Controls left ~3/12, Canvas right ~9/12 on wide viewports; Controls stack **above** Canvas on small screens). Card height is content-driven (no fixed min-height on the grid or canvas); both columns use `items-stretch` so the control panel fill and divider match the taller canvas. It uses Card, Badge (“Interactive”), and Title. Pass the hidden `Default` story via `of={Stories.Default}` so args stay connected. Optional `helperText` and decorative `caption` are supported. Canvas uses `sourceState="none"` (also set globally in [.storybook/preview.ts](../.storybook/preview.ts)) and `layout="fullscreen"` so the Docs “Show code” toggle is not rendered and Storybook’s padded preview chrome is skipped. The right column (`live-preview__canvas`) is the only padded surface and vertically centers the rendered story (`justify-center`); Storybook’s `.docs-story` fill is cleared inside Live Preview so a second nested box does not appear. ComponentDocsPage embeds Live Preview; do not hand-roll Canvas + Controls in new MDX.

**Controls restyle (best-effort):** scoped under `.live-preview` in [LivePreview.css](../src/docs/LivePreview/LivePreview.css). Selectors target Storybook Docs classes (`.docblock-argstable`, `.docblock-argstable-head`, `.docblock-argstable-body`, `.sbdocs-preview`, `.docs-story`, `.docblock-code-toggle`). The controls column uses Docs padding (`p-6 sm:p-7`); Storybook table/cell horizontal padding is zeroed so the “Control Panel” eyebrow and arg rows share the same inset. Labels are sentence-case (`text-xs` / medium weight)—set friendly display names via `argTypes.name` (e.g. `Show grid`) when camelCase prop keys would look awkward. The args table uses `table-layout: fixed` and constrains control inputs to the panel width so widgets (e.g. number spinners) are not clipped by the card’s `overflow-hidden`. **Widget chrome:** inputs, selects, textareas, and boolean True/False labels are restyled toward the Docs control panel using pio tokens (`pio-grid` borders, `pio-border-subtle` tracks, rounded corners, teal focus rings, coral range thumbs) and Storybook drop shadows are cleared. Structure stays Storybook’s (True/False pills, not the design-system Switch). These class names and Emotion DOM shapes can change between Storybook versions. **Fallback:** if restyles break, the card still stacks Controls above Canvas and Controls remain usable—do not replace Controls with a custom form.

**Default** is a CSF export used only by Docs. It is hidden from the sidebar (`tags: ['!dev']` plus a sidebar filter in [.storybook/manager.ts](../.storybook/manager.ts)). Changing Docs controls does not surface a separate Default page.

**Variant stories** (e.g. `Sizes`, `AllTypes`) are visible galleries. Set `parameters: { controls: { disable: true } }` on them. Optional Docs Variations tabs preview the same stories without Controls; they do not replace the sidebar. The bottom addon panel is hidden by default via `showPanel: false` in [.storybook/manager.ts](../.storybook/manager.ts).

Pattern per **atom / molecule / organism**:

| File | Purpose |
|------|---------|
| `ComponentName.stories.tsx` | Hidden `Default` + visible variant stories; `title` uses `Atoms/` / `Molecules/` / `Organisms/` |
| `ComponentName.mdx` | Docs page via `ComponentDocsPage` (see [Component Docs](component-docs.md)) |

**Templates:** `ComponentName.stories.tsx` (`title` `Templates/…`). Docs MDX optional.

**Pages:** `ComponentName.stories.tsx` only (`title` `Pages/…`). No Docs MDX.

**Introduction / Welcome:** [Welcome.stories.tsx](../src/components/pages/Welcome/Welcome.stories.tsx) + [Welcome.tsx](../src/components/pages/Welcome/Welcome.tsx). No Docs MDX / `ComponentDocsPage`. Theme via `useGlobals` in the story function (same pattern as `Pages/WelcomeHero`).

Example MDX (mandatory sections — see [Component Docs](component-docs.md) and [LineChart.mdx](../src/components/molecules/LineChart/LineChart.mdx)):

```mdx
import { Meta, Canvas } from '@storybook/addon-docs/blocks';
import * as Stories from './LineChart.stories';
import { ComponentDocsPage } from '@docs/ComponentDocsPage';

<Meta of={Stories} />

export const exampleCode = `import LineChart from '@molecules/LineChart/LineChart';

<LineChart data={data} series={series} xAxisKey="day" height={280} showTooltip />`;

<ComponentDocsPage
  title="LineChart"
  badge="0.1.0"
  description="Line chart built with Recharts. Configurable series, axes, grid, and tooltip."
  stories={Stories}
  useCases={{ cases: ['Show trends over continuous periods.'] }}
  variations={[
    {
      id: 'comparison',
      label: 'Comparison',
      canvas: <Canvas of={Stories.Comparison} layout="fullscreen" />,
      badge: 'Pattern: Multi-series comparison',
      description: 'Three series with grid and legend.',
      meta: [
        {
          label: 'Component Props',
          value: 'showLegend · showGrid',
          valueTone: 'prop',
        },
        { label: 'Best For', value: 'Weekly KPIs, multi-metric trends' },
      ],
    },
  ]}
  props={{
    interfaceName: 'LineChartProps',
    rows: [
      {
        name: 'showGrid',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Renders a horizontal Cartesian grid.',
      },
    ],
  }}
  example={{
    code: exampleCode,
    filename: 'LineChart.example.tsx',
    language: 'tsx',
  }}
/>
```

`usage` and `breadcrumb` are optional. Variations may be temporarily empty until distinct stories exist. Sibling variant stories stay in the sidebar. The baseline demo belongs in Live Preview (`Default`), not in the Variations gallery. Variation canvases sit on a single `pio-bg-light` frame; Storybook’s `.docs-story` fill is cleared inside that frame so a second padded box does not shrink the chart. Full contract: [Component Docs](component-docs.md).

`@docs/LivePreview/LivePreview` and `@docs/ComponentDocsPage` resolve via the alias map in [.storybook/main.ts](../.storybook/main.ts) (`viteFinal`). MDX is outside `tsconfig` `include`, so the aliases are set explicitly instead of relying on Vite’s tsconfig path plugin.

## Style-only Controls

Docs Controls **must** expose every prop that affects visual appearance (size, type, fill, colors, rounded, labels, booleans like `isChecked`). Hide everything else with `control: false` and `table: { disable: true }`:

- Event handlers (`onClick`, `onChange`, …)
- Raw JSX / React nodes as free-form Controls (`children` slots, arbitrary node editors)
- Functions and objects that are not user-friendly in Controls (`options`, `items`, chart `data` / `series`)
- Generic `className` passthroughs that do not drive a predefined visual variant

When a class-like prop **does** change appearance (for example Spinner `colorClass`), use a **select** with labeled options (`Red`, `Green`) instead of a free-text class name.

For optional icon (or similar node) props, use a **select** of sample names plus Storybook **`mapping`** to real elements (include a `None` → `null` option). Default.args stores the select key; the story receives the mapped node. Do not build a custom icon picker unless product needs demand it.

Prefer readable Control labels via `argTypes.name` (e.g. `showGrid: { name: 'Show grid', control: 'boolean' }`) so Live Preview does not show raw camelCase.

Stub handlers can still be passed in `Default.args` so the component renders; they must not appear in Controls.

## Addons

| Addon | Purpose |
|-------|---------|
| **Docs** | MDX blocks and documentation pages |
| **Links** | Navigate between stories via links |
| **Themes** | Switch between light and dark (`data-mode`) in the toolbar |
| **a11y** | Accessibility checks in the addon panel |
| **Chromatic** | Visual testing and regression (when configured) |
| **MCP** | Storybook MCP tools for agents |

Controls, actions, and the viewport toolbar ship with Storybook. Tailwind is applied by `@tailwindcss/vite` in `main.ts`.

They appear in the Storybook UI toolbar. The bottom addon panel is hidden by default so variant stories stay as galleries; prop editing happens on **Docs**. Use the theme switcher to verify `dark:` styles.

## Building for deploy

To generate a static export:

```bash
yarn build-storybook
```

Output is written to **`storybook-static/`**. You can serve that folder with any static host or CDN.

Pushes to `main` run [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): `yarn verify` (includes this build), then FTP upload of `storybook-static/` to Hostgator. Secrets and path details are in [Getting started — Deploy](getting-started.md#deploy-github-actions--hostgator-ftp).
