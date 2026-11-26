import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useContainerWidth } from '../../../hooks/useContainerWidth';
import { useControllableState } from '../../../hooks/useControllableState';
import { WeekCalendarAgendaView } from './WeekCalendarAgendaView';
import { WeekCalendarDayView } from './WeekCalendarDayView';
import { WeekCalendarWeekView } from './WeekCalendarWeekView';
import {
  DEFAULT_AUTO_BREAKPOINT,
  DEFAULT_HOUR_RANGE,
  DEFAULT_VISIBLE_DAYS,
  HOUR_HEIGHT_PX,
  weekCalendarRoot,
  weekCalendarRootClip,
} from './WeekCalendarStyles';
import {
  cx,
  type CalendarLayout,
  type DayBuckets,
  type ResolvedTimedEvent,
  type WeekCalendarEvent,
  type WeekCalendarProps,
} from './WeekCalendarTypes';
import {
  dayKey,
  getVisibleDates,
  isSameDay,
  minutesToOffsetPx,
  parseEventDate,
  parseTimeToMinutes,
} from './WeekCalendarUtils';
import './WeekCalendar.css';

export type {
  CalendarLayout,
  WeekCalendarEvent,
  WeekCalendarProps,
} from './WeekCalendarTypes';
export type { Weekday } from './WeekCalendarUtils';
export type { WeekCalendarEventTone } from './WeekCalendarStyles';

function resolveMobileLayout(
  mobileLayout: WeekCalendarProps['mobileLayout'],
  showHours: boolean
): Exclude<CalendarLayout, 'week'> {
  return mobileLayout ?? (showHours ? 'day' : 'agenda');
}

function resolveLayout(
  layoutProp: CalendarLayout | 'auto',
  isNarrow: boolean | null,
  mobile: Exclude<CalendarLayout, 'week'>,
  initialLayout: CalendarLayout
): CalendarLayout {
  if (layoutProp !== 'auto') return layoutProp;
  if (isNarrow === null) return initialLayout;
  return isNarrow ? mobile : 'week';
}

function defaultSelectedFromDays(days: Date[], today: Date): Date {
  const todayInView = days.find((d) => isSameDay(d, today));
  return todayInView ?? days[0] ?? today;
}

function clampToVisibleDays(date: Date, days: Date[]): Date {
  if (days.length === 0) return date;
  const match = days.find((d) => isSameDay(d, date));
  return match ?? days[0];
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  weekStart,
  visibleDays = [...DEFAULT_VISIBLE_DAYS],
  weekStartsOn = 1,
  events,
  showHours = true,
  hourRange = DEFAULT_HOUR_RANGE,
  today: todayProp,
  renderEvent,
  className,
  layout: layoutProp = 'auto',
  mobileLayout: mobileLayoutProp,
  autoBreakpoint = DEFAULT_AUTO_BREAKPOINT,
  initialLayout: initialLayoutProp,
  onLayoutChange,
  onWeekStartChange,
  selectedDate: selectedDateProp,
  defaultSelectedDate,
  onSelectedDateChange,
  showSwipeHint = true,
  hideEmptyDays = false,
  emptyDayLabel,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isNarrow = useContainerWidth(rootRef, autoBreakpoint);

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (todayProp) return undefined;
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return () => window.clearInterval(id);
  }, [todayProp]);

  const today = useMemo(
    () => parseEventDate(todayProp ?? now),
    [todayProp, now]
  );

  const days = useMemo(
    () => getVisibleDates(weekStart, weekStartsOn, visibleDays),
    [weekStart, weekStartsOn, visibleDays]
  );

  const mobileLayout = resolveMobileLayout(mobileLayoutProp, showHours);
  const initialLayout = initialLayoutProp ?? mobileLayout;
  const resolvedLayout = resolveLayout(
    layoutProp,
    isNarrow,
    mobileLayout,
    initialLayout
  );

  const prevLayoutRef = useRef<CalendarLayout | null>(null);
  useEffect(() => {
    if (prevLayoutRef.current === resolvedLayout) return;
    prevLayoutRef.current = resolvedLayout;
    onLayoutChange?.(resolvedLayout);
  }, [resolvedLayout, onLayoutChange]);

  const selectedDefault = useMemo(() => {
    if (defaultSelectedDate != null) {
      return clampToVisibleDays(parseEventDate(defaultSelectedDate), days);
    }
    return defaultSelectedFromDays(days, today);
  }, [defaultSelectedDate, days, today]);

  const [selectedDate, setSelectedDate] = useControllableState<Date>({
    value:
      selectedDateProp != null
        ? clampToVisibleDays(parseEventDate(selectedDateProp), days)
        : undefined,
    defaultValue: selectedDefault,
    onChange: onSelectedDateChange,
  });

  // Keep selection inside the visible week when days change.
  useEffect(() => {
    const clamped = clampToVisibleDays(selectedDate, days);
    if (!isSameDay(clamped, selectedDate)) {
      setSelectedDate(clamped);
    }
  }, [days, selectedDate, setSelectedDate]);

  const [rangeStart, rangeEnd] = hourRange;
  const safeRangeStart = Math.min(Math.max(0, rangeStart), 23);
  const safeRangeEnd = Math.min(24, Math.max(safeRangeStart + 1, rangeEnd));
  const hourCount = safeRangeEnd - safeRangeStart;
  const gridHeight = hourCount * HOUR_HEIGHT_PX;

  const visibleDayKeys = useMemo(() => new Set(days.map(dayKey)), [days]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, WeekCalendarEvent[]>();
    for (const day of days) {
      map.set(dayKey(day), []);
    }

    for (const event of events) {
      const date = parseEventDate(event.date);
      if (Number.isNaN(date.getTime())) continue;
      const key = dayKey(date);
      if (!visibleDayKeys.has(key)) {
        if (import.meta.env.DEV) {
          console.warn(
            `[WeekCalendar] Event "${event.id}" falls on a hidden day and will not be shown.`,
            event
          );
        }
        continue;
      }
      map.get(key)?.push(event);
    }
    return map;
  }, [events, days, visibleDayKeys]);

  const bucketsByDay = useMemo(() => {
    const map = new Map<string, DayBuckets>();
    for (const day of days) {
      const dayEvents = eventsByDay.get(dayKey(day)) ?? [];
      const allDay: WeekCalendarEvent[] = [];
      const timed: ResolvedTimedEvent[] = [];
      for (const event of dayEvents) {
        const startMin = parseTimeToMinutes(event.start);
        if (startMin == null) {
          allDay.push(event);
          continue;
        }
        const parsedEnd = parseTimeToMinutes(event.end);
        const endMin =
          parsedEnd != null && parsedEnd > startMin ? parsedEnd : startMin + 60;
        timed.push({ event, startMin, endMin });
      }
      map.set(dayKey(day), { allDay, timed });
    }
    return map;
  }, [days, eventsByDay]);

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let h = safeRangeStart; h < safeRangeEnd; h += 1) {
      list.push(h);
    }
    return list;
  }, [safeRangeStart, safeRangeEnd]);

  const indicatorSource = todayProp ?? now;
  const indicatorMinutes =
    indicatorSource.getHours() * 60 + indicatorSource.getMinutes();

  const showNowIndicator =
    showHours &&
    indicatorMinutes >= safeRangeStart * 60 &&
    indicatorMinutes <= safeRangeEnd * 60;

  const nowOffset = minutesToOffsetPx(
    indicatorMinutes,
    safeRangeStart,
    HOUR_HEIGHT_PX
  );

  const weekShowNow =
    showNowIndicator && days.some((d) => isSameDay(d, today));

  return (
    <div
      ref={rootRef}
      className={cx(
        weekCalendarRoot,
        resolvedLayout === 'week' && weekCalendarRootClip,
        className
      )}
      data-layout={resolvedLayout}
    >
      {resolvedLayout === 'week' && (
        <WeekCalendarWeekView
          days={days}
          today={today}
          showHours={showHours}
          hours={hours}
          safeRangeStart={safeRangeStart}
          safeRangeEnd={safeRangeEnd}
          gridHeight={gridHeight}
          showNowIndicator={weekShowNow}
          nowOffset={nowOffset}
          eventsByDay={eventsByDay}
          bucketsByDay={bucketsByDay}
          renderEvent={renderEvent}
        />
      )}
      {resolvedLayout === 'day' && (
        <WeekCalendarDayView
          days={days}
          weekStart={weekStart}
          selectedDate={selectedDate}
          onSelectedDateChange={setSelectedDate}
          onWeekStartChange={onWeekStartChange}
          today={today}
          showHours={showHours}
          showSwipeHint={showSwipeHint}
          hours={hours}
          safeRangeStart={safeRangeStart}
          safeRangeEnd={safeRangeEnd}
          gridHeight={gridHeight}
          showNowIndicator={showNowIndicator}
          nowOffset={nowOffset}
          eventsByDay={eventsByDay}
          bucketsByDay={bucketsByDay}
          renderEvent={renderEvent}
        />
      )}
      {resolvedLayout === 'agenda' && (
        <WeekCalendarAgendaView
          days={days}
          today={today}
          eventsByDay={eventsByDay}
          hideEmptyDays={hideEmptyDays}
          emptyDayLabel={emptyDayLabel}
          renderEvent={renderEvent}
        />
      )}
    </div>
  );
};

export default WeekCalendar;
