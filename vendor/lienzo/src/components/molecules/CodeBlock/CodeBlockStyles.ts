import type { PrismTheme } from 'prism-react-renderer';

export const codeBlockBar = [
  'px-6',
  'py-4',
  'bg-pio-bg-light',
  'border-b',
  'border-pio-grid',
  'flex',
  'items-center',
  'justify-between',
  'gap-3',
  'dark:bg-gray-800',
  'dark:border-gray-600',
].join(' ');

export const codeBlockBarMeta = 'flex items-center min-w-0';

export const codeBlockFilename = [
  'text-xs',
  'font-jetbrains',
  'text-pio-text-muted',
  'truncate',
  'dark:text-blue-200',
].join(' ');

export const codeBlockCopy = [
  'inline-flex',
  'items-center',
  'gap-1.5',
  'text-xs',
  'font-semibold',
  'font-jakarta',
  'px-3',
  'py-1.5',
  'rounded-full',
  'border',
  'border-pio-grid',
  'bg-white',
  'text-pio-text',
  'hover:bg-pio-coral-pale',
  'hover:text-pio-coral',
  'hover:border-pio-coral-opacity-20',
  'transition-all',
  'shrink-0',
  'dark:bg-gray-700',
  'dark:text-blue-200',
  'dark:border-gray-600',
].join(' ');

export const codeBlockCopyCopied = [
  'bg-pio-teal-dark-opacity-14',
  'text-pio-teal-dark',
  'border-pio-teal-dark-opacity-20',
  'hover:bg-pio-teal-dark-opacity-14',
  'hover:text-pio-teal-dark',
  'hover:border-pio-teal-dark-opacity-20',
].join(' ');

export const codeBlockBodyBase = [
  'p-6',
  'overflow-x-auto',
  'text-xs',
  'sm:text-sm',
  'font-jetbrains',
  'leading-relaxed',
  'm-0',
].join(' ');

export const codeBlockBodyMode = {
  dark: 'text-pio-teal-dark-pale',
  light: 'text-pio-text',
} as const;

export const codeBlockPaneFill = {
  dark: 'rgb(var(--lz-dark-canvas))',
  light: 'rgb(var(--lz-white))',
} as const;

export const codeBlockPre =
  'm-0 p-0 overflow-visible font-jetbrains text-xs sm:text-sm leading-relaxed';

const prismSharedStyles: PrismTheme['styles'] = [
  {
    types: ['comment', 'prolog', 'doctype', 'cdata'],
    style: { color: 'rgb(var(--lz-pio-text-muted))', fontStyle: 'italic' },
  },
  {
    types: ['keyword', 'operator', 'boolean'],
    style: { color: 'rgb(var(--lz-pio-coral))', fontWeight: '600' },
  },
  {
    types: ['string', 'attr-value', 'char', 'inserted'],
    style: { color: 'rgb(var(--lz-pio-teal-dark-muted))' },
  },
  {
    types: ['tag', 'function', 'class-name', 'maybe-class-name'],
    style: { color: 'rgb(var(--lz-pio-coral-hover))' },
  },
  {
    types: ['number', 'constant', 'symbol', 'builtin', 'attr-name'],
    style: { color: 'rgb(var(--lz-pio-amber))' },
  },
];

/** Token colors on dark-canvas; contrast-first syntax theme. */
export const codeBlockPrismThemeDark: PrismTheme = {
  plain: {
    color: 'rgb(var(--lz-pio-teal-dark-pale))',
    backgroundColor: 'transparent',
  },
  styles: [
    ...prismSharedStyles,
    {
      types: ['punctuation', 'plain'],
      style: { color: 'rgb(var(--lz-pio-teal-dark-pale))' },
    },
  ],
};

export const codeBlockPrismThemeLight: PrismTheme = {
  plain: {
    color: 'rgb(var(--lz-pio-text))',
    backgroundColor: 'transparent',
  },
  styles: [
    ...prismSharedStyles,
    {
      types: ['punctuation', 'plain'],
      style: { color: 'rgb(var(--lz-pio-text))' },
    },
  ],
};
