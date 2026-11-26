export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchType = 'default' | 'red' | 'green' | 'yellow';

/**
 * Thumb inset: `after:top-[2px] after:left-[2px] after:h-4 after:w-4` on an `h-5 w-9` track.
 * Same 2px gap is applied at every size so the white circle sits inside the track.
 */
export const switchSize: Record<
  SwitchSize,
  { container: string; thumb: string; thumbOn: string }
> = {
  sm: {
    container: 'h-3 w-6',
    thumb: 'top-0.5 left-0.5 h-2 w-2',
    thumbOn: 'translate-x-3',
  },
  md: {
    container: 'h-5 w-9',
    thumb: 'top-0.5 left-0.5 h-4 w-4',
    thumbOn: 'translate-x-full',
  },
  lg: {
    container: 'h-6 w-12',
    thumb: 'top-0.5 left-0.5 h-5 w-5',
    thumbOn: 'translate-x-6',
  },
};

/** Off track — warm structural border wash. */
export const switchOff = 'bg-pio-grid dark:bg-gray-600';

export const switchOn: Record<SwitchType, string> = {
  default: 'bg-gray-600 dark:bg-gray-500',
  green: 'bg-pio-teal-dark',
  red: 'bg-pio-coral',
  yellow: 'bg-pio-amber',
};

export const switchThumb =
  'absolute rounded-full bg-white border border-pio-grid dark:border-none transition-transform duration-200 ease-in-out';

/** Segmented (labeled / icon) track shell — layout only; fill comes from `segmentedTrackByType`. */
export const segmentedTrackBase = [
  'relative',
  'inline-grid',
  'grid-cols-2',
  'items-stretch',
  'rounded-full',
  'border',
  'p-0.5',
].join(' ');

/** Recessed track fill / border by `type`. */
export const segmentedTrackByType: Record<SwitchType, string> = {
  default:
    'bg-pio-bg-light border-pio-grid dark:bg-gray-800 dark:border-gray-700',
  green:
    'bg-pio-teal-dark-pale border-pio-teal-dark-opacity-20 dark:bg-pio-teal-dark-opacity-20 dark:border-pio-teal-dark',
  red:
    'bg-pio-coral-pale border-pio-coral-opacity-20 dark:bg-pio-coral-opacity-20 dark:border-pio-coral',
  yellow:
    'bg-pio-amber-pale border-pio-amber-opacity-20 dark:bg-pio-amber-opacity-20 dark:border-pio-amber',
};

export const segmentedThumb = [
  'absolute',
  'top-0.5',
  'bottom-0.5',
  'left-0.5',
  'w-[calc(50%-2px)]',
  'rounded-full',
  'bg-white',
  'shadow-xs',
  'border',
  'border-pio-grid/60',
  'transition-transform',
  'duration-200',
  'ease-in-out',
  'pointer-events-none',
  'dark:bg-gray-900',
  'dark:border-gray-600',
].join(' ');

export const segmentedOptionSize: Record<
  SwitchSize,
  { option: string; icon: string }
> = {
  sm: {
    option: 'gap-1 px-2 py-1 text-[10px] leading-none',
    icon: '[&_svg]:w-3 [&_svg]:h-3',
  },
  md: {
    option: 'gap-1.5 px-3 py-1.5 text-xs leading-none',
    icon: '[&_svg]:w-3.5 [&_svg]:h-3.5',
  },
  lg: {
    option: 'gap-1.5 px-3.5 py-2 text-sm leading-none',
    icon: '[&_svg]:w-4 [&_svg]:h-4',
  },
};

export const segmentedOptionBase = [
  'relative',
  'z-10',
  'flex',
  'items-center',
  'justify-center',
  'rounded-full',
  'font-jakarta',
  'select-none',
  'cursor-pointer',
  'transition-colors',
  'duration-200',
].join(' ');

/** Active option label / icon color by `type`. */
export const segmentedOptionActiveByType: Record<SwitchType, string> = {
  default: 'font-bold text-pio-text dark:text-white',
  green: 'font-bold text-pio-teal-dark dark:text-pio-teal-dark-pale',
  red: 'font-bold text-pio-coral dark:text-pio-coral-pale',
  yellow: 'font-bold text-pio-amber dark:text-pio-amber-pale',
};

export const segmentedOptionInactive =
  'font-medium text-pio-text-muted dark:text-gray-300';

export const segmentedIconInactive = 'text-pio-text-muted dark:text-gray-400';

/** When `type` is chromatic, force icons to follow the active option text color. */
export const segmentedIconActiveFollowType = '[&_svg]:text-current';
