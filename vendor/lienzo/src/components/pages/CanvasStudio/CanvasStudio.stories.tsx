import React from 'react';
import { Meta } from '@storybook/react-vite';
import { useGlobals } from 'storybook/preview-api';
import { Moon, Sun } from 'react-feather';
import Switch from '@atoms/Switch/Switch';
import CanvasStudio from './CanvasStudio';

const CanvasStudioChrome: React.FC<{
  isDark: boolean;
  onThemeChange: (active: boolean) => void;
}> = ({ isDark, onThemeChange }) => (
  <div className="flex flex-col items-center gap-4">
    <div className="inline-flex items-center gap-4 rounded-full bg-white border border-pio-grid px-4 py-2 shadow-xs dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-pio-coral shrink-0" aria-hidden />
        <span className="text-[10px] font-bold uppercase tracking-wide text-pio-text font-jakarta dark:text-blue-200">
          Interactive Showcase
        </span>
      </div>
      <Switch
        size="md"
        isActive={isDark}
        onChange={onThemeChange}
        offLabel="Light"
        onLabel="Dark"
        offIcon={<Sun strokeWidth={2} className="text-pio-amber" />}
        onIcon={<Moon strokeWidth={2} />}
      />
    </div>

    <CanvasStudio />
  </div>
);

export default {
  title: 'Pages/CanvasStudio',
  component: CanvasStudio,
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
} as Meta;

export const LivePreview = () => {
  const [globals, updateGlobals] = useGlobals();
  const isDark = (globals.theme as string) === 'dark';

  return (
    <div className="py-8 px-4 flex justify-center bg-pio-bg-soft dark:bg-dark-canvas min-h-[640px]">
      <CanvasStudioChrome
        isDark={isDark}
        onThemeChange={(active) => updateGlobals({ theme: active ? 'dark' : 'light' })}
      />
    </div>
  );
};
LivePreview.parameters = { controls: { disable: true } };
