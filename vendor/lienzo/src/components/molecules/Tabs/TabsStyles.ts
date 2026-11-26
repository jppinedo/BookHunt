export type TabsVariant = 'underline' | 'pills' | 'segmented';

export const tablistClass: Record<TabsVariant, string> = {
  underline: [
    'border-b',
    'border-gray-300',
    'flex',
    'flex-nowrap',
    'max-w-full',
    'min-w-0',
    'overflow-x-auto',
    'dark:border-gray-700',
  ].join(' '),
  pills: [
    'inline-flex',
    'flex-nowrap',
    'p-1.5',
    'rounded-full',
    'bg-white',
    'border',
    'border-pio-grid',
    'shadow-xs',
    'gap-1',
    'max-w-full',
    'min-w-0',
    'overflow-x-auto',
    'list-none',
    'm-0',
    'dark:bg-gray-900',
    'dark:border-gray-700',
  ].join(' '),
  segmented: [
    'inline-flex',
    'flex-nowrap',
    'p-1',
    'rounded-full',
    'bg-pio-bg-light',
    'border',
    'border-pio-grid',
    'gap-1',
    'max-w-full',
    'min-w-0',
    'overflow-x-auto',
    'list-none',
    'm-0',
    'dark:bg-gray-800',
    'dark:border-gray-700',
  ].join(' '),
};

export const tabItemClass: Record<TabsVariant, string> = {
  underline: 'relative shrink-0',
  pills: 'shrink-0 list-none',
  segmented: 'shrink-0 list-none',
};

const underlineButton = {
  // D1 accent unification: the active tab speaks in the single coral
  // accent (text + weight, not color alone) instead of inheriting the
  // neutral text color with only a teal underline to mark it.
  active:
    'py-2 px-6 block outline-hidden whitespace-nowrap font-jakarta font-semibold text-pio-coral dark:text-pio-coral',
  inactive:
    'py-2 px-6 block outline-hidden opacity-80 hover:opacity-100 whitespace-nowrap font-jakarta text-pio-text-muted hover:text-pio-text dark:text-blue-200',
};

const pillsButton = {
  active:
    'px-4 py-2 rounded-full text-xs font-semibold font-jakarta whitespace-nowrap transition-all duration-200 bg-pio-coral text-white shadow-md',
  inactive: [
    'px-4',
    'py-2',
    'rounded-full',
    'text-xs',
    'font-semibold',
    'font-jakarta',
    'whitespace-nowrap',
    'text-pio-text-muted',
    'hover:text-pio-text',
    'hover:bg-pio-border-subtle',
    'transition-all',
    'duration-200',
    'dark:hover:text-white',
    'dark:hover:bg-gray-800',
  ].join(' '),
};

const segmentedButton = {
  active: [
    'px-2.5',
    'py-1.5',
    'rounded-full',
    'text-xs',
    'font-bold',
    'font-jakarta',
    'whitespace-nowrap',
    'bg-white',
    'shadow-xs',
    'text-pio-text',
    'text-center',
    'transition-all',
    'duration-200',
    'dark:bg-gray-900',
    'dark:text-white',
  ].join(' '),
  inactive: [
    'px-2.5',
    'py-1.5',
    'rounded-full',
    'text-xs',
    'font-medium',
    'font-jakarta',
    'whitespace-nowrap',
    'text-pio-stone',
    'hover:text-pio-text',
    'text-center',
    'transition-all',
    'duration-200',
    'dark:text-gray-300',
    'dark:hover:text-white',
  ].join(' '),
};

export const tabButtonClass = (variant: TabsVariant, active: boolean): string => {
  if (variant === 'pills') {
    return active ? pillsButton.active : pillsButton.inactive;
  }
  if (variant === 'segmented') {
    return active ? segmentedButton.active : segmentedButton.inactive;
  }
  return active ? underlineButton.active : underlineButton.inactive;
};

export const tabUnderlineBar = (active: boolean): string =>
  `absolute bottom-0 left-0 h-0.5 bg-pio-coral transition-all duration-200 ${active ? 'w-full' : 'w-0'}`;
