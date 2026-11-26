/** Outer wrapper: legend above plot when enabled. */
export const chartRoot = 'flex w-full flex-col gap-4';

/** Series legend: top-left row of colored dots + bold labels. */
export const legendList = [
  'm-0',
  'flex',
  'list-none',
  'flex-wrap',
  'items-center',
  'gap-6',
  'p-0',
].join(' ');

export const legendItem = 'flex items-center gap-2';

export const legendDot = [
  'h-3',
  'w-3',
  'shrink-0',
  'rounded-full',
  'shadow-xs',
].join(' ');

export const legendLabel = [
  'text-xs',
  'font-bold',
  'font-jakarta',
  'text-pio-text',
  'dark:text-blue-200',
].join(' ');
