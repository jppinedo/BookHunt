export const badgeBase = [
  'inline-flex',
  'items-center',
  'gap-1.5',
  'rounded-full',
  'px-2.5',
  'py-0.5',
  'text-xs',
  'font-semibold',
  'font-jakarta',
  'border',
].join(' ');

export const badgeTone = {
  coral: 'bg-pio-coral-pale text-pio-coral border-pio-coral-opacity-20',
  teal: 'bg-pio-teal-dark-opacity-14 text-pio-teal-dark border-pio-teal-dark-opacity-20 dark:text-pio-teal-dark-muted',
  amber: 'bg-pio-amber-pale text-pio-amber-dark border-pio-amber-opacity-20 dark:text-pio-amber',
} as const;

export const badgeDot = {
  coral: 'bg-pio-coral',
  teal: 'bg-pio-teal-dark',
  amber: 'bg-pio-amber',
} as const;

export const badgeDotSize = 'w-1.5 h-1.5 rounded-full shrink-0';
