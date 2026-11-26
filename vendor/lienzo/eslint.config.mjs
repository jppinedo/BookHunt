// ESLint flat config (ESLint 10). Run with: yarn lint
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['storybook-static/', 'dist/', 'node_modules/', '.yarn/']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintReact.configs['recommended-typescript'],
      reactHooks.configs.flat.recommended,
      jsxA11y.configs.recommended,
    ],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    files: ['*.{js,cjs,mjs}', '.storybook/**/*.{js,ts}'],
    languageOptions: { globals: { ...globals.node } },
  },
  storybook.configs['flat/recommended'],
  {
    // Temporary: existing code breaks these rules. They are warnings so `yarn lint`
    // passes today; each one is tracked as a good first issue. Remove this block when fixed.
    files: ['**/*.{ts,tsx}'],
    rules: {
      'jsx-a11y-x/click-events-have-key-events': 'warn',
      'jsx-a11y-x/no-static-element-interactions': 'warn',
      'jsx-a11y-x/no-noninteractive-tabindex': 'warn',
      'jsx-a11y-x/label-has-associated-control': 'warn',
      '@eslint-react/no-missing-key': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      '@eslint-react/static-components': 'warn',
      '@eslint-react/no-nested-component-definitions': 'warn',
    },
  },
]);
