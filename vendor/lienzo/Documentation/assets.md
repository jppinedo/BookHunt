# Assets

## Location

All shared static assets and React asset components live under **[src/assets/](../src/assets/)**, with SVGs in **src/assets/SVG/**.

## Contents

| Asset | Description |
|-------|-------------|
| **LienzoLogo.tsx** | React component that renders the vertical Lienzo lockup (icon above wordmark; used in the Storybook intro/welcome) |
| **LienzoHorizontalLogo.tsx** | React component that renders the horizontal Lienzo lockup (icon left, wordmark right at half icon height, vertically centered, with a gap between mark and text). Supports `variant`: `default` (dark mark) or `onDark` (light mark for dark backgrounds) |
| **lienzo_logo.svg** | Static SVG file of the logo |
| **SquaresBackground.tsx** | React component that renders a squares-pattern background |
| **placeholders/faces/100/** | Square placeholder portrait JPGs (`avatar-01.jpg` …) for Storybook demos (e.g. WeekCalendar rich content facepiles) |

## Usage

Import assets via the **`@assets/`** path alias so paths stay short and consistent:

```ts
import LienzoLogo from '@assets/SVG/LienzoLogo';
import LienzoHorizontalLogo from '@assets/SVG/LienzoHorizontalLogo';
```

Add new assets (images, SVGs, or React wrappers) under `src/assets/` (and subfolders like `SVG/` if needed), and use `@assets/...` in imports.

The Storybook manager sidebar brand uses a static copy at [`.storybook/public/lienzo-horizontal-logo.svg`](../.storybook/public/lienzo-horizontal-logo.svg) (on-dark colors), not the React component — see [Storybook](storybook.md).
