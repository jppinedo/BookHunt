import type React from 'react';
import type { WeekCalendarEventTone } from './WeekCalendarStyles';
import type { Weekday } from './WeekCalendarUtils';

export type { Weekday, WeekCalendarEventTone };

export type CalendarLayout = 'week' | 'day' | 'agenda';

export type WeekCalendarEvent = {
  id: string;
  date: Date | string;
  start?: string;
  end?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  body?: React.ReactNode;
  tone?: WeekCalendarEventTone;
  status?: React.ReactNode;
  /** Short label for the agenda badge slot (e.g. exchange code). */
  meta?: React.ReactNode;
  onClick?: () => void;
};

export type WeekCalendarProps = {
  weekStart: Date;
  visibleDays?: Weekday[];
  weekStartsOn?: 0 | 1;
  events: WeekCalendarEvent[];
  showHours?: boolean;
  hourRange?: [number, number];
  today?: Date;
  renderEvent?: (event: WeekCalendarEvent) => React.ReactNode;
  className?: string;

  layout?: CalendarLayout | 'auto';
  mobileLayout?: Exclude<CalendarLayout, 'week'>;
  autoBreakpoint?: number;
  initialLayout?: CalendarLayout;
  onLayoutChange?: (layout: CalendarLayout) => void;
  onWeekStartChange?: (weekStart: Date) => void;

  selectedDate?: Date;
  defaultSelectedDate?: Date;
  onSelectedDateChange?: (date: Date) => void;

  showSwipeHint?: boolean;
  hideEmptyDays?: boolean;
  emptyDayLabel?: React.ReactNode;
};

export type ResolvedTimedEvent = {
  event: WeekCalendarEvent;
  startMin: number;
  endMin: number;
};

export type DayBuckets = {
  allDay: WeekCalendarEvent[];
  timed: ResolvedTimedEvent[];
};

export function cx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ');
}
