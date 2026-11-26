import React from 'react';
import { Meta } from '@storybook/react-vite';
import { useGlobals } from 'storybook/preview-api';
import { linkTo } from '@storybook/addon-links';
import WelcomeFoundations from './WelcomeFoundations';

export default {
  title: 'Pages/WelcomeFoundations',
  component: WelcomeFoundations,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
} as Meta;

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

const docsLinks = {
  onOpenButtonDocs: openButtonDocs,
  onOpenSwitchDocs: openSwitchDocs,
  onOpenCheckboxDocs: openCheckboxDocs,
  onOpenTitleDocs: openTitleDocs,
  onOpenCodeBlockDocs: openCodeBlockDocs,
};

export const LivePreview = () => {
  const { isDark, onThemeChange } = useStorybookTheme();
  return (
    <WelcomeFoundations isDark={isDark} onThemeChange={onThemeChange} {...docsLinks} />
  );
};
LivePreview.parameters = { controls: { disable: true } };
