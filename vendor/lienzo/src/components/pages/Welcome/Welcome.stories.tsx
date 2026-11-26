import React from 'react';
import { Meta } from '@storybook/react-vite';
import { useGlobals } from 'storybook/preview-api';
import { linkTo } from '@storybook/addon-links';
import WelcomePage from './Welcome';

export default {
  title: 'Introduction',
  component: WelcomePage,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { disable: true },
  },
  tags: ['!autodocs'],
} as Meta;

const openPlayground = linkTo('Molecules/LineChart', 'Docs');
const openButtonDocs = linkTo('Atoms/Button', 'Docs');
const openSwitchDocs = linkTo('Atoms/Switch', 'Docs');
const openCheckboxDocs = linkTo('Atoms/Checkbox', 'Docs');
const openTitleDocs = linkTo('Atoms/Title', 'Docs');
const openCodeBlockDocs = linkTo('Molecules/CodeBlock', 'Docs');

const useStorybookTheme = () => {
  const [globals, updateGlobals] = useGlobals();
  const isDark = (globals.theme as string) === 'dark';
  const onThemeChange = (active: boolean) => {
    updateGlobals({ theme: active ? 'dark' : 'light' });
  };
  return { isDark, onThemeChange };
};

/** Official Storybook landing: WelcomeHero + WelcomeFoundations. */
export const Welcome = () => {
  const { isDark, onThemeChange } = useStorybookTheme();

  return (
    <WelcomePage
      isDark={isDark}
      onThemeChange={onThemeChange}
      onOpenPlayground={openPlayground}
      onOpenButtonDocs={openButtonDocs}
      onOpenSwitchDocs={openSwitchDocs}
      onOpenCheckboxDocs={openCheckboxDocs}
      onOpenTitleDocs={openTitleDocs}
      onOpenCodeBlockDocs={openCodeBlockDocs}
    />
  );
};
Welcome.parameters = { controls: { disable: true } };
