export const boxStyles = {
  default: [
    'bg-pio-grid',
    'p-1',
    'rounded-3xl',
    'overflow-hidden',
    'text-black',
    'dark:bg-gray-800',
    'dark:text-blue-200',
  ].join(' '),
  glass: [
    'bg-white-opacity-14',
    'border',
    'border-gray-100',
    'dark:border-gray-600',
    'dark:bg-gray-opacity-14',
    'rounded-3xl',
    'p-5',
    'dark:text-white',
  ].join(' '),
};

export const boxShadow = {
  soft: 'shadow-pio-soft',
  card: 'shadow-pio-card',
  none: '',
} as const;

// Inner content area: lighter background; 1.3rem radius sits inside outer rounded-3xl (1.5rem) + p-1
export const boxContentArea = [
  'bg-pio-bg-light',
  'rounded-[1.3rem]',
  'overflow-hidden',
  'dark:bg-gray-900',
].join(' ');

export const boxHeader = 'px-5 pt-5 pb-2';
export const boxHeaderOutside = 'px-3 py-3';
export const boxContent = 'p-5';
// px-5 aligns footer with header/content (outer p-1 inset)
export const boxFooter = 'px-5 py-3';
