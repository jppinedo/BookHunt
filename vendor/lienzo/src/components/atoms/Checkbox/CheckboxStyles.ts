export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxType = 'default' | 'red' | 'green' | 'yellow';

export const checkboxBase = [
  'flex',
  'inline-flex',
  'items-center',
  'justify-center',
  'cursor-pointer',
  'outline-hidden',
  'border',
  'transition-colors',
  'duration-150',
].join(' ');

export const checkboxSize: Record<CheckboxSize, string> = {
  sm: 'h-4 w-4 p-0.5 rounded-md',
  md: 'h-5 w-5 p-1 rounded-md',
  lg: 'h-6 w-6 p-1 rounded-lg',
};

/** Unchecked: cream fill + warm pio border (brand-aligned). */
export const checkboxUnchecked =
  'bg-pio-bg border-pio-grid dark:bg-gray-700 dark:border-gray-600';

export const checkboxChecked: Record<CheckboxType, string> = {
  default: 'bg-gray-600 border-gray-600 dark:bg-gray-500 dark:border-gray-500',
  green: 'bg-pio-teal-dark border-pio-teal-dark',
  red: 'bg-pio-coral border-pio-coral',
  yellow: 'bg-pio-amber border-pio-amber',
};

export const checkboxIcon: Record<CheckboxType, string> = {
  default: 'text-white',
  green: 'text-white',
  red: 'text-white',
  yellow: 'text-pio-amber-dark',
};
