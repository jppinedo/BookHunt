export const HOUR_HEIGHT_PX = 52;
/** Fits subtitle + title with vertical padding on short (e.g. 30-min) blocks. */
export const MIN_EVENT_HEIGHT_PX = 48;
export const COLUMN_MIN_WIDTH_PX = 132;
export const GUTTER_WIDTH_PX = 52;
export const DEFAULT_HOUR_RANGE: [number, number] = [6, 22];
export const DEFAULT_VISIBLE_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;
export const DEFAULT_AUTO_BREAKPOINT = 640;
export const SWIPE_THRESHOLD_PX = 48;

export const weekCalendarRoot = [
  'week-calendar',
  '@container',
  'w-full',
  'rounded-3xl',
  'bg-pio-bg-soft',
  'dark:bg-gray-900',
  'border',
  'border-pio-grid',
  'dark:border-gray-700',
  'shadow-pio-soft',
  'font-jakarta',
  'text-pio-text',
  'dark:text-blue-200',
].join(' ');

/** Clips horizontal week scroll to the rounded surface; omit for sticky agenda. */
export const weekCalendarRootClip = 'overflow-hidden';

export const weekCalendarScroll = [
  'week-calendar__scroll',
  'w-full',
  'overflow-x-auto',
].join(' ');

export const weekCalendarInner = [
  'week-calendar__inner',
  'min-w-full',
].join(' ');

export const weekCalendarHeader = [
  'week-calendar__header',
  'grid',
  'border-b',
  'border-pio-border-subtle',
  'dark:border-gray-700',
].join(' ');

export const weekCalendarGutterSpacer = [
  'week-calendar__gutter-spacer',
  'sticky',
  'left-0',
  'z-20',
  'bg-pio-bg-soft',
  'dark:bg-gray-900',
].join(' ');

export const weekCalendarDayHeader = [
  'week-calendar__day-header',
  'relative',
  'flex',
  'flex-col',
  'items-center',
  'justify-center',
  'gap-0.5',
  'px-2',
  'py-4',
  'text-center',
].join(' ');

export const weekCalendarDayHeaderLabel = [
  'week-calendar__day-header-label',
  'text-[11px]',
  'font-medium',
  'tracking-wide',
  'text-pio-text-muted',
  'dark:text-blue-200/70',
].join(' ');

export const weekCalendarDayHeaderLabelToday = [
  'text-pio-coral',
  'dark:text-pio-coral-hover',
  'font-bold',
].join(' ');

export const weekCalendarDayHeaderNumber = [
  'week-calendar__day-header-number',
  'text-xs',
  'font-medium',
  'text-pio-text',
  'dark:text-blue-200',
].join(' ');

export const weekCalendarDayHeaderNumberToday = [
  'text-pio-coral',
  'dark:text-pio-coral-hover',
  'font-bold',
].join(' ');

export const weekCalendarTodayAccentBar = [
  'week-calendar__today-bar',
  'absolute',
  'top-0',
  'left-3',
  'right-3',
  'h-1',
  'rounded-b-full',
  'bg-pio-coral',
].join(' ');

export const weekCalendarBody = [
  'week-calendar__body',
  'grid',
].join(' ');

export const weekCalendarGutter = [
  'week-calendar__gutter',
  'sticky',
  'left-0',
  'z-20',
  'bg-pio-bg-soft',
  'dark:bg-gray-900',
  'relative',
].join(' ');

export const weekCalendarHourLabel = [
  'week-calendar__hour-label',
  'absolute',
  'right-2',
  'text-[10px]',
  'leading-none',
  'font-regular',
  'text-pio-text-muted',
  'dark:text-blue-200/50',
  'select-none',
  'whitespace-nowrap',
].join(' ');

export const weekCalendarDayColumn = [
  'week-calendar__day-column',
  'relative',
  'min-w-0',
  'px-1.5',
].join(' ');

export const weekCalendarDayColumnToday = [
  'week-calendar__day-column--today',
  'bg-pio-coral-opacity-14',
].join(' ');

export const weekCalendarAllDayStack = [
  'week-calendar__all-day',
  'flex',
  'flex-col',
  'gap-1.5',
  'px-0.5',
  'pt-2',
  'pb-2',
  'min-h-2',
].join(' ');

export const weekCalendarHourGrid = [
  'week-calendar__hour-grid',
  'relative',
].join(' ');

export const weekCalendarHourLine = [
  'week-calendar__hour-line',
  'absolute',
  'left-0',
  'right-0',
  'border-t',
  'border-pio-grid/60',
  'dark:border-gray-700/80',
  'pointer-events-none',
].join(' ');

export const weekCalendarListStack = [
  'week-calendar__list',
  'flex',
  'flex-col',
  'gap-1.5',
  'p-2',
  'pb-4',
].join(' ');

export const weekCalendarNowLine = [
  'week-calendar__now-line',
  'absolute',
  'left-0',
  'right-0',
  'z-10',
  'pointer-events-none',
  'h-px',
  'bg-pio-coral',
].join(' ');

export const weekCalendarNowMarker = [
  'week-calendar__now-marker',
  'absolute',
  'left-0',
  'top-1/2',
  '-translate-x-1/2',
  '-translate-y-1/2',
  'w-0',
  'h-0',
  'border-y-[5px]',
  'border-y-transparent',
  'border-l-[7px]',
  'border-l-pio-coral',
].join(' ');

export type WeekCalendarEventTone =
  | 'coral'
  | 'teal'
  | 'amber'
  | 'neutral'
  | 'muted';

export const eventCardBase = [
  'week-calendar-event',
  'relative',
  'box-border',
  'w-full',
  'overflow-hidden',
  'rounded-xl',
  'border-0',
  'p-0',
  'text-left',
  'shadow-pio-soft',
  'transition-opacity',
  'font-jakarta',
].join(' ');

/** Padding lives here so timed cards keep a visible inset when content is clipped. */
export const eventCardInner = [
  'week-calendar-event__inner',
  'box-border',
  'flex',
  'h-full',
  'min-h-0',
  'flex-col',
  'overflow-hidden',
  'px-2.5',
  'py-1.5',
].join(' ');

export const eventCardInteractive = [
  'cursor-pointer',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-pio-teal-dark',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-pio-bg-soft',
  'dark:focus-visible:ring-offset-gray-900',
].join(' ');

export const eventCardTone: Record<WeekCalendarEventTone, string> = {
  coral: [
    'bg-pio-coral-pale',
    'text-pio-coral-dark',
    'dark:bg-pio-coral/30',
    'dark:text-white',
  ].join(' '),
  teal: [
    'bg-pio-teal-dark-pale',
    'text-pio-teal-black',
    'dark:bg-pio-teal-dark/40',
    'dark:text-white',
  ].join(' '),
  amber: [
    'bg-pio-amber-pale',
    'text-pio-amber-dark',
    'dark:bg-pio-amber/30',
    'dark:text-pio-amber-pale',
  ].join(' '),
  neutral: [
    'bg-pio-bg-light',
    'text-pio-text',
    'dark:bg-gray-800',
    'dark:text-blue-200',
  ].join(' '),
  muted: [
    'week-calendar-event--muted',
    'bg-gray-100',
    'text-gray-700',
    'dark:bg-gray-800',
    'dark:text-blue-200',
  ].join(' '),
};

export const eventCardSubtitle = [
  'week-calendar-event__subtitle',
  'text-[9px]',
  'leading-tight',
  'font-regular',
  'opacity-80',
  'mb-0.5',
].join(' ');

export const eventCardTitle = [
  'week-calendar-event__title',
  'text-[11px]',
  'font-bold',
  'leading-snug',
].join(' ');

export const eventCardBody = [
  'week-calendar-event__body',
  'mt-0.5',
  'text-[10px]',
  'font-regular',
  'leading-snug',
  'opacity-90',
].join(' ');

export const eventCardStatus = [
  'week-calendar-event__status',
  'mt-auto',
  '-mx-2.5',
  '-mb-1.5',
  'px-2.5',
  'py-0.5',
  'text-[9px]',
  'font-semibold',
  'uppercase',
  'tracking-wide',
  'bg-gray-opacity-20',
  'dark:bg-black-opacity-20',
  'text-gray-700',
  'dark:text-blue-200',
].join(' ');

export const eventCardTimed = [
  'absolute',
  'overflow-hidden',
].join(' ');

/* —— Day view —— */

export const dayViewRoot = [
  'week-calendar-day',
  'flex',
  'flex-col',
  'gap-3',
  'p-3',
  '@md:p-4',
].join(' ');

export const dayViewHeader = [
  'week-calendar-day__header',
  'flex',
  'items-center',
  'justify-between',
  'gap-3',
].join(' ');

export const dayViewMonthTitle = [
  'week-calendar-day__month',
  'font-jakarta',
  'text-base',
  '@md:text-lg',
  'font-bold',
  'text-pio-text',
  'dark:text-blue-200',
].join(' ');

export const dayViewNav = [
  'week-calendar-day__nav',
  'flex',
  'items-center',
  'gap-1.5',
].join(' ');

export const dayViewNavButton = [
  'week-calendar-day__nav-btn',
  'inline-flex',
  'h-8',
  'w-8',
  'items-center',
  'justify-center',
  'rounded-full',
  'border',
  'border-pio-grid',
  'dark:border-gray-700',
  'bg-pio-bg-light',
  'dark:bg-gray-800',
  'text-pio-text',
  'dark:text-blue-200',
  'transition-opacity',
  'hover:opacity-80',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-pio-teal-dark',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-pio-bg-soft',
  'dark:focus-visible:ring-offset-gray-900',
].join(' ');

export const dayViewStrip = [
  'week-calendar-day__strip',
  'flex',
  'items-stretch',
  'gap-1',
  'rounded-2xl',
  'bg-pio-bg-light',
  'dark:bg-gray-800/80',
  'p-1.5',
].join(' ');

export const dayViewPill = [
  'week-calendar-day__pill',
  'relative',
  'flex',
  'min-w-0',
  'flex-1',
  'flex-col',
  'items-center',
  'justify-center',
  'gap-0.5',
  'rounded-xl',
  'px-1',
  'py-2',
  'border-0',
  'cursor-pointer',
  'transition-colors',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-pio-teal-dark',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-pio-bg-soft',
  'dark:focus-visible:ring-offset-gray-900',
].join(' ');

/** Idle pill surface — applied only when not selected so it cannot override accent fill. */
export const dayViewPillIdle = 'bg-transparent';

export const dayViewPillSelected = [
  'bg-pio-coral',
  'dark:bg-pio-coral',
  'shadow-pio-soft',
].join(' ');

export const dayViewPillLetter = [
  'week-calendar-day__pill-letter',
  'text-[10px]',
  'font-medium',
  'leading-none',
  'text-pio-text-muted',
  'dark:text-blue-200/60',
].join(' ');

export const dayViewPillLetterSelected = [
  'text-white/90',
  'dark:text-white/90',
].join(' ');

export const dayViewPillLetterToday = [
  'text-pio-coral',
  'dark:text-pio-coral-hover',
  'font-bold',
].join(' ');

export const dayViewPillNumber = [
  'week-calendar-day__pill-number',
  'text-sm',
  'font-semibold',
  'leading-none',
  'text-pio-text',
  'dark:text-blue-200',
].join(' ');

export const dayViewPillNumberSelected = [
  'text-white',
  'dark:text-white',
].join(' ');

export const dayViewPillNumberToday = [
  'text-pio-coral',
  'dark:text-pio-coral-hover',
].join(' ');

export const dayViewPillDot = [
  'week-calendar-day__pill-dot',
  'mt-0.5',
  'h-1',
  'w-1',
  'rounded-full',
  'bg-pio-coral',
].join(' ');

export const dayViewPillDotSelected = [
  'bg-white',
].join(' ');

export const dayViewSummary = [
  'week-calendar-day__summary',
  'flex',
  'items-baseline',
  'justify-between',
  'gap-3',
  'px-0.5',
].join(' ');

export const dayViewSummaryDate = [
  'text-sm',
  'font-semibold',
  'text-pio-text',
  'dark:text-blue-200',
].join(' ');

export const dayViewSummaryCount = [
  'text-xs',
  'font-regular',
  'text-pio-text-muted',
  'dark:text-blue-200/60',
].join(' ');

export const dayViewAllDayRow = [
  'week-calendar-day__all-day',
  'flex',
  'items-start',
  'gap-2',
  'border-b',
  'border-pio-border-subtle',
  'dark:border-gray-700',
  'pb-2',
].join(' ');

export const dayViewAllDayLabel = [
  'shrink-0',
  'pt-1.5',
  'text-[10px]',
  'font-semibold',
  'uppercase',
  'tracking-wide',
  'text-pio-text-muted',
  'dark:text-blue-200/60',
  'w-14',
  '@md:w-[52px]',
].join(' ');

export const dayViewAllDayStack = [
  'flex',
  'min-w-0',
  'flex-1',
  'flex-col',
  'gap-1.5',
].join(' ');

export const dayViewBody = [
  'week-calendar-day__body',
  'relative',
  'flex',
  'gap-0',
].join(' ');

export const dayViewGutter = [
  'week-calendar-day__gutter',
  'relative',
  'shrink-0',
  'w-12',
  '@md:w-[52px]',
].join(' ');

export const dayViewGrid = [
  'week-calendar-day__grid',
  'relative',
  'min-w-0',
  'flex-1',
  'touch-pan-y',
].join(' ');

export const dayViewListStack = [
  'flex',
  'flex-col',
  'gap-1.5',
  'py-1',
].join(' ');

export const dayViewSwipeHint = [
  'week-calendar-day__swipe-hint',
  'mx-auto',
  'mt-2',
  'inline-flex',
  'items-center',
  'gap-1.5',
  'rounded-full',
  'bg-pio-bg-light',
  'dark:bg-gray-800',
  'px-3',
  'py-1',
  'text-[10px]',
  'font-medium',
  'text-pio-text-muted',
  'dark:text-blue-200/60',
].join(' ');

/* —— Agenda view —— */

export const agendaRoot = [
  'week-calendar-agenda',
  'flex',
  'flex-col',
  'gap-0',
  'p-3',
  '@md:p-4',
].join(' ');

export const agendaDaySection = [
  'week-calendar-agenda__day',
  'relative',
  'pb-4',
].join(' ');

/** Today block: wash + rounded shell; header owns the top corners (no overflow-hidden so sticky works). */
export const agendaDaySectionToday = [
  'week-calendar-agenda__day--today',
  'rounded-2xl',
  'bg-pio-coral-opacity-14',
  'pb-3',
  '-mx-1',
].join(' ');

export const agendaDayHeader = [
  'week-calendar-agenda__day-header',
  'sticky',
  'top-0',
  'z-10',
  'flex',
  'items-center',
  'justify-between',
  'gap-3',
  'bg-pio-bg-soft',
  'dark:bg-gray-900',
  'py-2',
  'px-1',
].join(' ');

/** Flushes to the today shell top and shares its top radii; slightly stronger wash than the body. */
export const agendaDayHeaderToday = [
  'relative',
  'rounded-t-2xl',
  'bg-pio-coral/25',
  'dark:bg-pio-coral/35',
  'px-3',
  'py-2.5',
].join(' ');

export const agendaTodayBar = [
  'absolute',
  'left-0',
  'top-2',
  'bottom-2',
  'w-1',
  'rounded-full',
  'bg-pio-coral',
].join(' ');

export const agendaDayHeaderLabel = [
  'text-sm',
  'font-semibold',
  'text-pio-text',
  'dark:text-blue-200',
].join(' ');

export const agendaDayHeaderLabelToday = [
  'text-pio-coral',
  'dark:text-pio-coral-hover',
].join(' ');

export const agendaDayHeaderCount = [
  'text-xs',
  'font-regular',
  'text-pio-text-muted',
  'dark:text-blue-200/60',
].join(' ');

export const agendaCardStack = [
  'week-calendar-agenda__cards',
  'flex',
  'flex-col',
  'gap-2',
  'pl-1',
].join(' ');

export const agendaCardStackToday = [
  'px-2',
  'pt-3',
].join(' ');

export const agendaEmptyDay = [
  'week-calendar-agenda__empty',
  'flex',
  'items-center',
  'gap-3',
  'py-2',
  'px-1',
  'text-xs',
  'font-regular',
  'text-pio-text-muted',
  'dark:text-blue-200/50',
].join(' ');

export const agendaEmptyRule = [
  'flex-1',
  'border-t',
  'border-dashed',
  'border-pio-grid',
  'dark:border-gray-700',
].join(' ');

export const eventCardAgendaInner = [
  'week-calendar-event__inner--agenda',
  'box-border',
  'flex',
  'flex-col',
  'gap-1',
  'px-2.5',
  'py-2',
].join(' ');

export const eventCardAgendaTitleRow = [
  'flex',
  'items-baseline',
  'justify-between',
  'gap-2',
  'min-w-0',
].join(' ');

export const eventCardAgendaSubtitle = [
  'week-calendar-event__subtitle--agenda',
  'shrink-0',
  'text-[10px]',
  'font-regular',
  'text-pio-text-muted',
  'dark:text-blue-200/60',
  'text-right',
].join(' ');

export const eventCardAgendaTime = [
  'week-calendar-event__time',
  'text-[11px]',
  'font-regular',
  'leading-snug',
  'text-pio-text-muted',
  'dark:text-blue-200/70',
].join(' ');

export const eventCardAgendaMeta = [
  'uppercase',
  'tracking-wider',
  'text-[10px]',
].join(' ');
