# Architecture

## Repository layout

- **Root config**: `package.json`, `.yarnrc.yml`, `tsconfig.json`, `tsconfig.build.json` (library `.d.ts` emit), `vite.config.ts`, `eslint.config.mjs`, `.nvmrc`, `.gitignore`
- **`.storybook/`**: Storybook configuration (`main.ts`, `preview.ts`, `manager.ts`, global CSS)
- **`src/`**: Library source (see below). Public entry: [`src/index.ts`](../src/index.ts)
- **`dist/`**: Library build output (JS + `.d.ts` + component CSS); produced by `yarn build`
- **`Documentation/`**: Project documentation (this folder)

## `src/` folder structure

| Folder | Purpose |
|--------|---------|
| `components/` | React components under `atoms/`, `molecules/`, `templates/`, `pages/` (and future `organisms/`) |
| `assets/` | Static assets and React SVG components (e.g. logos, backgrounds) |
| `colors/` | JS color strings for tokens (see [src/colors/Colors.ts](../src/colors/Colors.ts)) |
| `css/` | Global styles: [tokens.css](../src/css/tokens.css), `fullHeightCanvas.css`. Consumable theme is [src/theme.css](../src/theme.css); Storybook Tailwind entry is [src/tailwind.css](../src/tailwind.css) |
| `docs/` | Storybook Docs infrastructure: [LivePreview](../src/docs/LivePreview/LivePreview.tsx), [ComponentDocsPage](../src/docs/ComponentDocsPage/ComponentDocsPage.tsx) (composable Docs page template) |
| `interfaces/` | Shared TypeScript types (e.g. [sizes.ts](../src/interfaces/sizes.ts)) |
| `hooks/` | Shared React hooks (e.g. [useContainerWidth](../src/hooks/useContainerWidth.ts), [useControllableState](../src/hooks/useControllableState.ts)) |

## TypeScript path aliases

Imports use path aliases so you can avoid long relative paths. Configured in `tsconfig.json` and mirrored in [.storybook/main.ts](../.storybook/main.ts) (`viteFinal` `resolve.alias`, including MDX):

| Alias | Resolves to |
|-------|-------------|
| `@interfaces/*` | `src/interfaces/*` |
| `@hooks/*` | `src/hooks/*` |
| `@components/*` | `src/components/*` |
| `@atoms/*` | `src/components/atoms/*` |
| `@molecules/*` | `src/components/molecules/*` |
| `@organisms/*` | `src/components/organisms/*` |
| `@templates/*` | `src/components/templates/*` |
| `@pages/*` | `src/components/pages/*` |
| `@colors/*` | `src/colors/*` |
| `@assets/*` | `src/assets/*` |
| `@css/*` | `src/css/*` |
| `@docs/*` | `src/docs/*` |

**Example**: instead of `import Box from '../../../components/atoms/Box/Box'`, use:

```ts
import Box from '@atoms/Box/Box';
```

Use these aliases consistently for components, assets, interfaces, colors, and Docs helpers.

Public library components under `atoms/`, `molecules/`, and `templates/` prefer relative imports so Yarn `portal:` consumers can resolve source without copying these aliases. Storybook pages and Docs helpers may still use aliases.
