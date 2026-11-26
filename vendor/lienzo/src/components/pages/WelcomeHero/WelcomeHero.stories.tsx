import React from 'react';
import { Meta } from '@storybook/react-vite';
import { useGlobals } from 'storybook/preview-api';
import { linkTo } from '@storybook/addon-links';
import WelcomeHero from './WelcomeHero';

export default {
  title: 'Pages/WelcomeHero',
  component: WelcomeHero,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
} as Meta;

const openPlayground = linkTo('Molecules/LineChart', 'Docs');

const useStorybookTheme = () => {
  const [globals, updateGlobals] = useGlobals();
  const isDark = (globals.theme as string) === 'dark';
  const onThemeChange = (active: boolean) => {
    updateGlobals({ theme: active ? 'dark' : 'light' });
  };
  return { isDark, onThemeChange };
};

export const LivePreview = () => {
  const { isDark, onThemeChange } = useStorybookTheme();
  return (
    <WelcomeHero
      isDark={isDark}
      onThemeChange={onThemeChange}
      onOpenPlayground={openPlayground}
    />
  );
};
LivePreview.parameters = { controls: { disable: true } };
