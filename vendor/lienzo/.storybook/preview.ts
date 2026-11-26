import type { Preview } from "@storybook/react-vite";

import { withThemeByDataAttribute } from "@storybook/addon-themes";

import '../src/tailwind.css';
import './story-global.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      canvas: {
        // Hide “Show code” on Docs Canvas (Live Preview + Variations). Runtime supports 'none'.
        sourceState: 'none' as 'hidden',
      },
    },
    options: {
      storySort: (a, b) => {
        const PINNED = ['Introduction'];
        const TIERS = ['Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'];

        const aRoot = a.title?.split('/')[0] ?? '';
        const bRoot = b.title?.split('/')[0] ?? '';

        const aPinned = PINNED.indexOf(aRoot);
        const bPinned = PINNED.indexOf(bRoot);
        if (aPinned !== -1 || bPinned !== -1) {
          if (aPinned === -1) return 1;
          if (bPinned === -1) return -1;
          return aPinned - bPinned;
        }

        const aTier = TIERS.indexOf(aRoot);
        const bTier = TIERS.indexOf(bRoot);
        if (aTier !== bTier) {
          if (aTier === -1) return 1;
          if (bTier === -1) return -1;
          return aTier - bTier;
        }

        const aTitle = a.title ?? '';
        const bTitle = b.title ?? '';
        if (aTitle === bTitle) {
          const aIsDocs = a.type === 'docs' || a.name === 'Docs';
          const bIsDocs = b.type === 'docs' || b.name === 'Docs';
          if (aIsDocs && !bIsDocs) return -1;
          if (bIsDocs && !aIsDocs) return 1;
          return (a.name ?? '').localeCompare(b.name ?? '', undefined, { numeric: true });
        }

        return aTitle.localeCompare(bTitle, undefined, { numeric: true });
      },
    },
  }
};

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    attributeName: 'data-mode',
  }),
];

// export const parameters = {
//   backgrounds: {
//     default: 'light',
//     values: [
//       {
//         name: 'light',
//         value: '#ffffff',
//       },
//       {
//         name: 'dark',
//         value: '#000000',
//       },
//     ],
//   },
// };

export default preview;
