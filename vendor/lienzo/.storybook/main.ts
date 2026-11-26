import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const src = (p: string) => fileURLToPath(new URL(`../src/${p}`, import.meta.url));

// Path aliases (mirrors tsconfig.json "paths"). Explicit aliases are used instead of
// Vite's resolve.tsconfigPaths because MDX files are not matched by tsconfig "include".
const aliases = {
  '@interfaces': src('interfaces'),
  '@hooks': src('hooks'),
  '@components': src('components'),
  '@atoms': src('components/atoms'),
  '@molecules': src('components/molecules'),
  '@organisms': src('components/organisms'),
  '@templates': src('components/templates'),
  '@pages': src('components/pages'),
  '@colors': src('colors'),
  '@assets': src('assets'),
  '@css': src('css'),
  '@docs': src('docs'),
};

const config: StorybookConfig = {
  stories: [
    '../src/components/pages/Welcome/Welcome.stories.tsx',
    '../src/**/*.stories.tsx',
    '../src/**/*.mdx',
  ],
  staticDirs: ['./public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
    '@storybook/addon-mcp',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      resolve: { alias: aliases },
    });
  },
};

export default config;
