import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const lienzoTheme = create({
  base: 'dark',
  brandTitle: 'Lienzo',
  brandUrl: './',
  brandImage: './lienzo-horizontal-logo.svg',
  brandTarget: '_self',
});

addons.setConfig({
  theme: lienzoTheme,
  showPanel: false,
  sidebar: {
    filters: {
      hideHiddenStories: (item) => {
        if (item.type && item.type !== 'story') return true;
        if (item.tags?.includes('!dev')) return false;
        const isAtomic =
          item.title?.startsWith('Atoms/') || item.title?.startsWith('Molecules/');
        if (isAtomic && item.name === 'Default') return false;
        return true;
      },
    },
  },
});
