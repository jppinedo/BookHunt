# Component Docs

Every production **atom, molecule, and organism** has a Storybook **Docs** page: `ComponentName.mdx`, bound to that component’s CSF file (`ComponentName.stories.tsx`). Docs is the interactive reference for **prop-customizable** UI—Live Preview with style-only Controls, plus written guidance. Variant galleries remain sibling sidebar stories.

This document is the **source of truth** for Docs content, structure, and design. Use it when adding or enriching any atom / molecule / organism Docs page.

## Scope: who gets Docs + Live Preview

| Tier | Docs (`ComponentDocsPage` + Live Preview)? | Notes |
|------|--------------------------------------------|--------|
| **Atoms** | **Required** | Prop-driven; Controls in Live Preview |
| **Molecules** | **Required** | Same as atoms |
| **Organisms** | **Required** | Same as atoms (when added) |
| **Templates** | Optional | Layout shells; CSF stories. Existing Docs (e.g. Phone) may remain; do not treat as mandatory |
| **Pages** | **No** | Composed surfaces; CSF gallery stories only. Never add Docs / Live Preview / `ComponentDocsPage` for a page |
| **Introduction / Welcome** | **No** | Storybook landing (`title: 'Introduction'`, story `Welcome`). CSF + `useGlobals` only—no `ComponentDocsPage`. Do not add Docs MDX for this entry |

**Do not** create a Docs page or Docs/Live Preview Controls pair for pages or Introduction/Welcome. That pattern exists only so visitors can tweak props on reusable components.

## Mandatory template

Every `ComponentName.mdx` **must** use the shared page template:

| Piece | Location |
|-------|----------|
| **ComponentDocsPage** | [src/docs/ComponentDocsPage/ComponentDocsPage.tsx](../src/docs/ComponentDocsPage/ComponentDocsPage.tsx) |
| Import | `@docs/ComponentDocsPage` |
| Live Preview (embedded) | [src/docs/LivePreview/LivePreview.tsx](../src/docs/LivePreview/LivePreview.tsx) |

Do **not** hand-roll Canvas + Controls, custom section layouts, or alternate Docs chrome. The template owns section order, typography, surfaces, and spacing. MDX only supplies content through props.

## Required vs optional (summary)

| Section | Required? | Notes |
|---------|-----------|--------|
| Header: title | **Yes** | Component name |
| Header: version badge | **Yes** | Default `0.1.0` until a real version is set |
| Header: breadcrumb | No | Optional category path |
| Overview (description + common use cases) | **Yes** | May mention related components and link their Docs |
| Live Preview | **Yes** | Style-affecting Controls only |
| Variations gallery | **Yes** | May be temporarily empty until variant stories exist; required once stories exist |
| Props API | **Yes** | Types + descriptions for public props |
| Code example | **Yes** | Short, simple implementation snippet |
| Usage & best practices | No | Nice to have (`whenToUse` / `whenToAvoid`) |

Never invent props, variants, or behaviors. Prefer omitting Usage over filler copy. Do not leave empty cards for other sections except the temporary Variations allowance below.

## Page anatomy (section order)

`ComponentDocsPage` renders sections in this fixed order. Do not reorder or invent new top-level sections outside the template.

| Order | Section | Prop / source | Required? | `data-purpose` |
|------:|---------|---------------|-----------|----------------|
| 1 | Header (title + version badge; optional breadcrumb) | `title`, `badge`, `breadcrumb?` | Title + badge yes | `component-header` |
| 2 | Overview + common use cases | `description`, `useCases` | Yes | `component-overview` |
| 3 | Live Preview | `stories` → `stories.Default` | Yes | via Live Preview |
| 4 | Variations gallery | `variations` | Yes (may be temporarily empty) | `component-variations` |
| 5 | Props API | `props` | Yes | `props-table-container` (`#props-specification-section`) |
| 6 | Usage & best practices | `usage?` | No | `usage-and-props-specification` |
| 7 | Code example | `example` | Yes | (same section block as usage when both present) |

Runtime design is implemented by the template + [.storybook/story-global.css](../.storybook/story-global.css). Build Docs pages with the template, not raw HTML.

## Mandatory sections

### 1. Header — title and version badge

- **`title`** — component name; Playfair hero H1.
- **`badge`** — component version chip (coral Badge). **Default every component to `0.1.0`** until the library assigns a real version. Pass as a string, e.g. `badge="0.1.0"`.
- **`breadcrumb`** — **not** required. Use only when a real category path helps (e.g. `['Molecules', 'Charts', 'LineChart']`).

### 2. Overview — description and common use cases

Pass **`description`** and **`useCases`**.

- **Left column** — component description (`description`, or `useCases.overviewBody` if you need a longer override).
- **Right column** — common use cases (`useCases.cases`): concrete scenarios where the component fits (typically 3–4 bullets).
- **Related components** — overview copy or use-case bullets may mention complementary components and link to their Storybook Docs (components that are usually used together, or natural alternatives). Keep links accurate; do not invent relationships.

Optional overrides: `overviewEyebrow`, `overviewTitle`, `casesEyebrow`, `casesTitle`, `footer`.

### 3. Live Preview

Always pass **`stories={Stories}`**. Live Preview binds `stories.Default` (Canvas + Controls).

**Controls must list every prop that changes style, look, or other visible appearance** (size, type, fill, colors, rounding, labels, booleans like `showGrid`, selects for visual enums, etc.).

**Do not expose in Controls:**

- Raw JSX / React nodes as free-form editors (complex `children`, slots)
- Functions / event handlers (`onClick`, `onChange`, …)
- Objects or data structures that are not user-friendly in the Controls panel (`data`, `series`, `options`, `items`, …)
- Generic `className` passthroughs that do not map to a predefined visual variant

**Exception:** optional `icon`-like props may use a **select** of sample names with Storybook **`mapping`** to elements (and a `None` option). See [Storybook — Style-only Controls](storybook.md#style-only-controls).

Hide non-visual props with `control: false` and `table: { disable: true }` in CSF. Stub them in `Default.args` so the story still renders. Prefer readable labels via `argTypes.name` (e.g. `Show grid`). Full rules: [Storybook — Style-only Controls](storybook.md#style-only-controls).

### 4. Variations gallery

**Required.** Showcase **all available variant stories that are visually different** from each other (not the hidden `Default` / Live Preview baseline).

For each variation:

- `id`, `label`, `canvas` — typically `<Canvas of={Stories.Variant} layout="fullscreen" />`
- Highlight **which props were changed** (or how to obtain that look)—use `description`, pattern `badge`, and especially **`meta`** rows (e.g. Component Props with `valueTone: 'prop'`)
- Optional: data signature / Best For rows when helpful

**Temporary empty:** if variant stories do not exist yet, Variations may be empty for a short time. Once distinct stories exist, they **must** appear here. Do not invent fake variations. Sidebar variant stories stay; Variations does not replace them. Do not put `Default` in the gallery.

Preferred meta rows when documenting a pattern:

| Label | Purpose | `valueTone` |
|-------|---------|-------------|
| Data Signature / structure | Shape of inputs when relevant | `code` |
| Component Props | Props that produce this look | `prop` |
| Best For | When to pick this pattern | `text` (default) |

### 5. Props API

**Required.** Document the public props interface: **name, type, description** (and `defaultValue` when useful).

- Include props that are not interactive in Live Preview (JSX, functions, objects)—they belong in the API table.
- Prefer hand `rows` + `interfaceName` + `lead`. Optional custom node / `ArgTypes` via `children`.
- Do not list internal-only implementation details.
- Describe what each prop does; do not note whether it appears in Live Preview Controls.

### 6. Code example

**Required.** A **short, simple** implementation of the component via `example={{ code, filename?, language? }}` (CodeBlock).

- Real import path and realistic props.
- Keep the snippet small—enough to copy and run the common case, not a full app or every prop.
- Prefer a few lines of setup plus one JSX usage over long sample data unless the component cannot render without it (charts may need a minimal `data` array).

## Optional section

### Usage & best practices

**Optional (nice to have).** Pass `usage` with `whenToUse` and/or `whenToAvoid` when you have clear guidance.

- **When to Use** — when this component is the right choice.
- **When to Avoid** — misuses or better alternatives in the library (name them when they exist).

Omit the whole slot rather than writing generic filler.

## Skeleton (mandatory props)

```mdx
import { Meta, Canvas } from '@storybook/addon-docs/blocks';
import * as Stories from './ComponentName.stories';
import { ComponentDocsPage } from '@docs/ComponentDocsPage';

<Meta of={Stories} />

export const exampleCode = `import ComponentName from '@atoms/ComponentName/ComponentName';

<ComponentName prop="value" />`;

<ComponentDocsPage
  title="ComponentName"
  badge="0.1.0"
  description="One short paragraph describing what the component is and does."
  stories={Stories}
  useCases={{
    cases: [
      'Primary scenario where this component fits.',
      'Another concrete use case.',
      'Optional mention of a related Docs page / complementary component.',
    ],
  }}
  variations={[
    // Required once variant stories exist; may be [] temporarily
  ]}
  props={{
    interfaceName: 'ComponentNameProps',
    lead: 'Runtime props for ComponentName.',
    rows: [
      {
        name: 'prop',
        type: 'string',
        defaultValue: "'value'",
        description: 'What this prop does.',
      },
    ],
  }}
  example={{
    code: exampleCode,
    filename: 'ComponentName.example.tsx',
    language: 'tsx',
  }}
/>
```

Add `breadcrumb`, `usage`, and variation entries when applicable.

## Design (must follow the template)

Docs design is not optional per page. Using `ComponentDocsPage` + Live Preview applies the brand Docs look. Do not override fonts, page background, or section chrome in component MDX.

### Canvas & page shell

- Scoped to `#storybook-docs` in [story-global.css](../.storybook/story-global.css).
- Light Docs: `pio-bg` page fill; coral/teal ambient glows behind the article.
- Dark Docs: `dark-canvas`; glows toned for dark mode.
- Article content: `max-w-7xl`, vertical section rhythm (`space-y-14`).
- Variant **Canvas** stories (sidebar) keep `light-canvas` / `dark-canvas` and are **not** restyled as the marketing Docs page.
- Live Preview and variation frames clear nested `.docs-story` fills so the component is not double-boxed.

### Typography

| Role | Font | Notes |
|------|------|-------|
| Page H1 / section H2 | **Playfair Display** | Hero title; section titles via `DocsSectionHeader` |
| Body, eyebrows, lists, Controls labels | **Plus Jakarta Sans** | Eyebrows: uppercase + colored dot (`coral` / `teal` / `amber`) |
| Code / prop names / mono chips | **JetBrains Mono** | Props table, CodeBlock, meta `code` / `prop` tones |

### Surfaces & chrome

- Cards: white surface, soft shadow, `rounded-3xl`, `pio-grid` borders (Card atom).
- Section headers: `DocsSectionHeader` (eyebrow + Playfair title + optional lead)—do not invent alternate headers.
- Overview: two-column grid with vertical rule on large screens.
- Variations: Tabs `variant="pills"`; pattern badge coral with dot; meta list under copy.
- Usage: “When to Use” / “When to Avoid” paired cards (check / X icons).
- Example: **CodeBlock** molecule (`codeMode` dark by default).
- Version badge: coral Badge with dot next to the title.
- Selection highlight: `pio-coral-pale` / `pio-coral`.
- Tokens: [Design tokens & colors](design-tokens-colors.md).

### Live Preview card

- Controls left (~3/12), Canvas right (~9/12) on wide viewports; Controls stack above Canvas on small screens.
- Style-affecting Controls only (see above). Prefer readable labels via `argTypes.name`.
- Canvas: `sourceState="none"`, `layout="fullscreen"`; no Docs “Show code” toggle.
- Optional `livePreviewHelperText` / `livePreviewCaption` on `ComponentDocsPage`.

Full Live Preview / Controls restyle notes: [Storybook](storybook.md).

## Reference implementation: LineChart

**[LineChart.mdx](../src/components/molecules/LineChart/LineChart.mdx)** is the canonical example of content depth and section quality. Align new pages to this contract (including **`badge="0.1.0"`** and a short code example). Where LineChart already exceeds the minimum (Usage, rich Variations meta), treat that as the quality bar.

| Section | How LineChart demonstrates it |
|---------|-------------------------------|
| Title + badge | Title `LineChart`; Docs pages should pass version badge `0.1.0` by default. |
| Overview | Description + four use cases (trends, comparison, forecast, threshold). Related-component links can be added where useful. |
| Live Preview | Style Controls: height, grid, tooltip, legend, dots, curve type—not `data` / `series` / handlers. |
| Variations | All distinct gallery stories with props called out in meta. Baseline stays in Live Preview only. |
| Props API | Full `LineChartProps` table for the public surface. |
| Usage | Optional here; LineChart includes strong when-to-use / avoid (nice to have). |
| Example | Implementation snippet—keep new pages **shorter** when possible; charts may need minimal sample data. |

## CSF companion rules

| Rule | Detail |
|------|--------|
| Hidden `Default` | Export used only by Docs; hide with `tags: ['!dev']` (plus manager filter). |
| Style-only Controls | Every appearance-changing prop in Controls; hide JSX, functions, and unfriendly objects. |
| Variant stories | Visible sidebar galleries; `parameters: { controls: { disable: true } }`. All distinct ones go into Variations. |
| Title | `Atoms/Name`, `Molecules/Name`, `Organisms/Name`, `Templates/Name`, or `Pages/Name`. |
| Sidebar | For tiers with Docs: **Docs** first, then variants (configured in preview/manager). Pages have stories only. |

## Authoring checklist (per component)

Skip this checklist for **Pages**, **Introduction/Welcome**, and optional template Docs (see [Scope](#scope-who-gets-docs--live-preview)). For atoms, molecules, and organisms:

1. CSF: hidden `Default` with style-only `argTypes`; variant stories for distinct looks.
2. MDX wraps only `ComponentDocsPage` (+ `Meta`, and `Canvas` if Variations have entries).
3. **Mandatory:** `title`, `badge` (default `"0.1.0"`), `description`, `stories`, `useCases`, `props`, `example`.
4. **Variations:** list every distinct variant story with props/look called out; `[]` only until those stories exist.
5. **Optional:** `breadcrumb`, `usage`.
6. Code example stays short and simple.
7. No invented API; no hand-rolled Docs chrome.

## Must not

- For atoms / molecules / organisms: skip `ComponentDocsPage` or bypass Live Preview with raw Canvas + Controls.
- Build a Docs page for a **Page** or **Introduction/Welcome** (those tiers are exempt; landing uses CSF + `useGlobals` only).
- Omit the version badge, Overview, Props API, or code example (when Docs is required).
- Expose JSX, functions, or unfriendly objects in Live Preview Controls.
- Invent variations, props, or related-component links.
- Put the baseline/`Default` story into the Variations gallery.
- Remove or hide sibling variant stories from the sidebar as part of Docs work.
- Restyle Docs outside the shared template / `story-global.css` for a single component.
- Ship long, noisy code examples when a short snippet is enough.

## Related

- Running Storybook, addons, Live Preview, Controls conventions: [Storybook](storybook.md)
- Component folders and file conventions: [Component structure](component-structure.md)
- Tokens and fonts: [Design tokens & colors](design-tokens-colors.md)
- Docs infrastructure paths: [Architecture](architecture.md)
