# Libraries

Overview of the main technologies and dependencies used in Lienzo. For full lists, see [package.json](../package.json).

## Core

| Library | Role |
|---------|------|
| **React 19** | UI library; component-based rendering |
| **TypeScript 6** | Typing and path aliases (`strict` is off) |
| **Tailwind CSS 4** | Utility-first styling; consumable theme in `src/theme.css` (`@theme`); Storybook entry in `src/tailwind.css` |

## Styling & build

- **Vite** — Library build (`vite.config.ts`, `yarn build` → `dist/` JS + CSS) and Storybook (`@storybook/react-vite`, `@tailwindcss/vite`). Type declarations via `tsc -p tsconfig.build.json`.
- **Peers** — `react`, `react-dom` (^19) and `tailwindcss` (^4) are `peerDependencies` (also listed as `devDependencies` for Storybook).
- **Google Fonts** — CSS `@import` in [.storybook/story-global.css](../.storybook/story-global.css) (not an npm package): Lexend and Poppins for Title, plus Playfair Display, Plus Jakarta Sans, and JetBrains Mono for Docs type. See [Design tokens & colors](design-tokens-colors.md).

## Storybook

- **Storybook 10** — Component development, documentation, and visual testing. Controls, actions, and viewports are part of Storybook.
- **Addons**: Docs, Links, Themes (light/dark via `data-mode`), a11y, Chromatic, and MCP. See [Storybook](storybook.md).

## Component & UI

| Library | Role |
|---------|------|
| **Recharts** | Charts; used by the **LineChart** molecule |
| **react-feather** | Icon set; used in components (e.g. Label, Button, Welcome pages) |
| **react-day-picker** (v10) | Calendar/date picker logic; used by the **Calendar** molecule (range and single selection) |
| **prism-react-renderer** | Token highlighting inside **CodeBlock**; custom theme uses pio coral/teal/amber on `dark-canvas` |

## Summary

Use **React** and **TypeScript** for components, **Tailwind** (and optional component CSS) for styling, **Storybook** for developing and documenting components, and **Recharts** / **react-feather** / **prism-react-renderer** where charts, icons, or code highlighting are needed.
