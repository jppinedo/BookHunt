import {
  Animation,
  DayFlag,
  SelectionState,
  UI,
  getDefaultClassNames,
} from 'react-day-picker';

const defaults = getDefaultClassNames();

/**
 * Lienzo design tokens mapped to React DayPicker class names.
 * Extends defaults so structure (e.g. grid) is preserved; overrides for look and feel.
 */
export const calendarClassNames: Partial<
  Record<UI | SelectionState | DayFlag | Animation, string>
> = {
  ...defaults,

  [UI.Root]: [
    'rdp-root',
    'w-fit',
    'bg-pio-bg-light',
    'rounded-xl',
    'p-4',
    'font-lexend',
    'text-pio-text',
    'dark:bg-gray-800',
    'dark:text-blue-200',
  ].join(' '),

  [UI.MonthCaption]: [
    'rdp-month_caption',
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'pb-3',
    'min-w-0',
  ].join(' '),

  [UI.CaptionLabel]: [
    'rdp-caption_label',
    'text-pio-text',
    'font-lexend',
    'font-regular',
    'text-center',
    'dark:text-blue-200',
  ].join(' '),

  [UI.Nav]: [
    'rdp-nav',
    'flex',
    'items-center',
    'justify-between',
    'w-full',
    'gap-2',
  ].join(' '),

  [UI.PreviousMonthButton]: [
    'rdp-button_previous',
    'inline-flex',
    'items-center',
    'justify-center',
    'w-9',
    'h-9',
    'rounded-lg',
    'text-pio-text',
    'hover:bg-gray-opacity-14',
    'dark:text-blue-200',
    'dark:hover:bg-gray-opacity-14',
    'transition-colors',
    'focus-visible:ring-2',
    'focus-visible:ring-pio-teal-dark',
  ].join(' '),

  [UI.NextMonthButton]: [
    'rdp-button_next',
    'inline-flex',
    'items-center',
    'justify-center',
    'w-9',
    'h-9',
    'rounded-lg',
    'text-pio-text',
    'hover:bg-gray-opacity-14',
    'dark:text-blue-200',
    'dark:hover:bg-gray-opacity-14',
    'transition-colors',
    'focus-visible:ring-2',
    'focus-visible:ring-pio-teal-dark',
  ].join(' '),

  [UI.Chevron]: [
    'rdp-chevron',
    'w-4',
    'h-4',
    'text-pio-text',
    'dark:text-blue-200',
  ].join(' '),

  [UI.Weekdays]: [
    'rdp-weekdays',
    'grid',
    'grid-cols-7',
    'mb-1',
  ].join(' '),

  [UI.Weekday]: [
    'rdp-weekday',
    'text-pio-text',
    'text-center',
    'text-sm',
    'font-lexend',
    'py-1',
    'dark:text-gray-300',
  ].join(' '),

  [UI.MonthGrid]: ['rdp-month_grid', 'w-full', 'border-collapse'].join(' '),

  [UI.Weeks]: ['rdp-weeks', 'space-y-0'].join(' '),

  [UI.Week]: ['rdp-week', 'grid', 'grid-cols-7'].join(' '),

  [UI.Day]: [
    'rdp-day',
    'relative',
    'p-0',
    'text-center',
  ].join(' '),

  [UI.DayButton]: [
    'rdp-day_button',
    'w-9',
    'h-9',
    'rounded-full',
    'inline-flex',
    'items-center',
    'justify-center',
    'text-sm',
    'font-lexend',
    'text-pio-text',
    'hover:scale-105',
    'transition-all',
    'focus-visible:ring-2',
    'focus-visible:ring-pio-teal-dark',
    'dark:text-blue-200',
    'dark:hover:scale-105',
  ].join(' '),

  [DayFlag.outside]: [
    defaults[DayFlag.outside],
    'text-pio-text-muted',
    'opacity-60',
    'dark:opacity-50',
  ].join(' '),

  [DayFlag.today]: [defaults[DayFlag.today]].join(' '),

  [DayFlag.disabled]: [
    defaults[DayFlag.disabled],
    'opacity-40',
    'cursor-not-allowed',
  ].join(' '),

  [SelectionState.selected]: defaults[SelectionState.selected],

  [SelectionState.range_start]: [defaults[SelectionState.range_start]].join(' '),
  [SelectionState.range_middle]: [defaults[SelectionState.range_middle]].join(' '),
  [SelectionState.range_end]: [defaults[SelectionState.range_end]].join(' '),
};

