export const cardRadius = {
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
} as const;

export const cardSurface = {
  white: 'bg-white dark:bg-gray-800',
  subtle: 'bg-pio-bg-light dark:bg-gray-900',
  transparent: 'bg-transparent dark:bg-transparent',
} as const;

export const cardShadow = {
  soft: 'shadow-pio-soft',
  card: 'shadow-pio-card',
  none: '',
} as const;

export const cardBase = [
  'border',
  'border-pio-grid',
  'overflow-hidden',
  'text-pio-text',
  'dark:border-gray-600',
  'dark:text-blue-200',
].join(' ');

export const cardPadding = 'p-6 sm:p-7';
