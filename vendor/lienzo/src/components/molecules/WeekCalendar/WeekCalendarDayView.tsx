import React, { useCallback, useId, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import {
  HOUR_HEIGHT_PX,
  MIN_EVENT_HEIGHT_PX,
  SWIPE_THRESHOLD_PX,
  dayViewAllDayLabel,
  dayViewAllDayRow,
  dayViewAllDayStack,
  dayViewBody,
  dayViewGrid,
  dayViewGutter,
  dayViewHeader,
  dayViewListStack,
  dayViewMonthTitle,
  dayViewNav,
  dayViewNavButton,
  dayViewPill,
  dayViewPillDot,
  dayViewPillDotSelected,
  dayViewPillIdle,
  dayViewPillLetter,
  dayViewPillLetterSelected,
  dayViewPillLetterToday,
  dayViewPillNumber,
  dayViewPillNumberSelected,
  dayViewPillNumberToday,
  dayViewPillSelected,
  dayViewRoot,
  dayViewStrip,
  dayViewSummary,
  dayViewSummaryCount,
  dayViewSummaryDate,
  dayViewSwipeHint,
  eventCardTimed,
  weekCalendarHourGrid,
  weekCalendarHourLabel,
  weekCalendarHourLine,
  weekCalendarNowLine,
  weekCalendarNowMarker,
} from './WeekCalendarStyles';
import { EventCard } from './WeekCalendarEventCard';
import {
  cx,
  type DayBuckets,
  type WeekCalendarEvent,
} from './WeekCalendarTypes';
import {
  accessibleDayLabel,
  addDays,
  clampTimeToRange,
  dayKey,
  durationToHeightPx,
  formatHourLabel,
  formatLongDay,
  formatMonthYear,
  isSameDay,
  layoutTimedEvents,
  minutesToOffsetPx,
  weekdayLetter,
} from './WeekCalendarUtils';

export type DayViewProps = {
  days: Date[];
  weekStart: Date;
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
  onWeekStartChange?: (weekStart: Date) => void;
  today: Date;
  showHours: boolean;
  showSwipeHint: boolean;
  hours: number[];
  safeRangeStart: number;
  safeRangeEnd: number;
  gridHeight: number;
  showNowIndicator: boolean;
  nowOffset: number;
  eventsByDay: Map<string, WeekCalendarEvent[]>;
  bucketsByDay: Map<string, DayBuckets>;
  renderEvent?: (event: WeekCalendarEvent) => React.ReactNode;
};

export function WeekCalendarDayView({
  days,
  weekStart,
  selectedDate,
  onSelectedDateChange,
  onWeekStartChange,
  today,
  showHours,
  showSwipeHint,
  hours,
  safeRangeStart,
  safeRangeEnd,
  gridHeight,
  showNowIndicator,
  nowOffset,
  eventsByDay,
  bucketsByDay,
  renderEvent,
}: DayViewProps) {
  const baseId = useId();
  const selected =
    days.find((d) => isSameDay(d, selectedDate)) ?? days[0] ?? selectedDate;
  const selectedKey = dayKey(selected);
  const tabPanelId = `${baseId}-panel`;
  const selectedTabId = `${baseId}-tab-${selectedKey}`;

  const dayEvents = eventsByDay.get(selectedKey) ?? [];
  const buckets = bucketsByDay.get(selectedKey) ?? { allDay: [], timed: [] };
  const eventCount = dayEvents.length;
  const isSelectedToday = isSameDay(selected, today);

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const selectAdjacent = useCallback(
    (delta: number) => {
      const index = days.findIndex((d) => isSameDay(d, selected));
      if (index < 0) return;
      const next = days[index + delta];
      if (next) onSelectedDateChange(next);
    },
    [days, onSelectedDateChange, selected]
  );

  const renderCard = (
    event: WeekCalendarEvent,
    extraClassName?: string,
    style?: React.CSSProperties
  ) => {
    if (renderEvent) {
      return (
        <div key={event.id} className={extraClassName} style={style}>
          {renderEvent(event)}
        </div>
      );
    }
    return (
      <EventCard
        key={event.id}
        event={event}
        className={extraClassName}
        style={style}
      />
    );
  };

  const focusTabForDate = (date: Date) => {
    const el = document.getElementById(`${baseId}-tab-${dayKey(date)}`);
    el?.focus();
  };

  const onStripKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const index = days.findIndex((d) => isSameDay(d, selected));
      const next = days[index + 1];
      if (next) {
        onSelectedDateChange(next);
        requestAnimationFrame(() => focusTabForDate(next));
      }
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const index = days.findIndex((d) => isSameDay(d, selected));
      const prev = days[index - 1];
      if (prev) {
        onSelectedDateChange(prev);
        requestAnimationFrame(() => focusTabForDate(prev));
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      if (days[0]) {
        onSelectedDateChange(days[0]);
        requestAnimationFrame(() => focusTabForDate(days[0]));
      }
    } else if (event.key === 'End') {
      event.preventDefault();
      const last = days[days.length - 1];
      if (last) {
        onSelectedDateChange(last);
        requestAnimationFrame(() => focusTabForDate(last));
      }
    }
  };

  const onPointerDown = (event: React.PointerEvent) => {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    if (Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0) selectAdjacent(1);
    else selectAdjacent(-1);
  };

  const onPointerCancel = () => {
    pointerStartRef.current = null;
  };

  const layout = layoutTimedEvents(
    buckets.timed.map((t) => ({
      id: t.event.id,
      startMin: t.startMin,
      endMin: t.endMin,
    }))
  );

  return (
    <div className={dayViewRoot}>
      <div className={dayViewHeader}>
        <h2 className={dayViewMonthTitle}>{formatMonthYear(selected)}</h2>
        <div className={dayViewNav}>
          <button
            type="button"
            className={dayViewNavButton}
            aria-label="Previous week"
            onClick={() => onWeekStartChange?.(addDays(weekStart, -7))}
            disabled={!onWeekStartChange}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={dayViewNavButton}
            aria-label="Next week"
            onClick={() => onWeekStartChange?.(addDays(weekStart, 7))}
            disabled={!onWeekStartChange}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className={dayViewStrip}
        role="tablist"
        aria-label="Days of the week"
      >
        {days.map((day) => {
          const key = dayKey(day);
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, today);
          const hasEvents = (eventsByDay.get(key)?.length ?? 0) > 0;
          const tabId = `${baseId}-tab-${key}`;

          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={isSelected}
              aria-controls={tabPanelId}
              tabIndex={isSelected ? 0 : -1}
              aria-label={accessibleDayLabel(day)}
              className={cx(
                dayViewPill,
                isSelected ? dayViewPillSelected : dayViewPillIdle
              )}
              onClick={() => onSelectedDateChange(day)}
              onKeyDown={onStripKeyDown}
            >
              <span
                className={cx(
                  dayViewPillLetter,
                  isSelected && dayViewPillLetterSelected,
                  !isSelected && isToday && dayViewPillLetterToday
                )}
                aria-hidden="true"
              >
                {weekdayLetter(day)}
              </span>
              <span
                className={cx(
                  dayViewPillNumber,
                  isSelected && dayViewPillNumberSelected,
                  !isSelected && isToday && dayViewPillNumberToday
                )}
                aria-hidden="true"
              >
                {day.getDate()}
              </span>
              {hasEvents && (
                <span
                  className={cx(
                    dayViewPillDot,
                    isSelected && dayViewPillDotSelected
                  )}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className={dayViewSummary}>
        <span className={dayViewSummaryDate}>{formatLongDay(selected)}</span>
        <span className={dayViewSummaryCount}>
          {eventCount === 1 ? '1 event' : `${eventCount} events`}
        </span>
      </div>

      <div
        role="tabpanel"
        id={tabPanelId}
        aria-labelledby={selectedTabId}
      >
        {showHours ? (
          <>
            {buckets.allDay.length > 0 && (
              <div className={dayViewAllDayRow}>
                <span className={dayViewAllDayLabel}>All day</span>
                <div className={dayViewAllDayStack}>
                  {buckets.allDay.map((event) => renderCard(event))}
                </div>
              </div>
            )}
            <div className={dayViewBody}>
              <div className={dayViewGutter} aria-hidden="true">
                <div
                  className={weekCalendarHourGrid}
                  style={{ height: gridHeight }}
                >
                  {hours.map((hour) => {
                    const top = (hour - safeRangeStart) * HOUR_HEIGHT_PX;
                    return (
                      <span
                        key={hour}
                        className={weekCalendarHourLabel}
                        style={{
                          top: hour === safeRangeStart ? top + 2 : top,
                          transform:
                            hour === safeRangeStart
                              ? undefined
                              : 'translateY(-50%)',
                        }}
                      >
                        {formatHourLabel(hour)}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div
                className={cx(dayViewGrid, weekCalendarHourGrid)}
                style={{ height: gridHeight }}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={weekCalendarHourLine}
                    style={{ top: (hour - safeRangeStart) * HOUR_HEIGHT_PX }}
                    aria-hidden="true"
                  />
                ))}
                {buckets.timed.map(({ event, startMin, endMin }) => {
                  const clampedStart = clampTimeToRange(
                    startMin,
                    safeRangeStart,
                    safeRangeEnd
                  );
                  const clampedEnd = clampTimeToRange(
                    endMin,
                    safeRangeStart,
                    safeRangeEnd
                  );
                  if (
                    clampedEnd <= safeRangeStart * 60 ||
                    clampedStart >= safeRangeEnd * 60
                  ) {
                    return null;
                  }
                  const top = minutesToOffsetPx(
                    clampedStart,
                    safeRangeStart,
                    HOUR_HEIGHT_PX
                  );
                  const height = durationToHeightPx(
                    clampedStart,
                    clampedEnd,
                    HOUR_HEIGHT_PX,
                    MIN_EVENT_HEIGHT_PX
                  );
                  const slot = layout.get(event.id) ?? {
                    column: 0,
                    columnCount: 1,
                  };
                  const widthPct = 100 / slot.columnCount;
                  const leftPct = slot.column * widthPct;
                  const gapPx = 2;

                  return renderCard(event, eventCardTimed, {
                    top,
                    height,
                    left: `calc(${leftPct}% + ${gapPx}px)`,
                    width: `calc(${widthPct}% - ${gapPx * 2}px)`,
                  });
                })}
                {isSelectedToday && showNowIndicator && (
                  <div
                    className={weekCalendarNowLine}
                    style={{ top: nowOffset }}
                    aria-hidden="true"
                  >
                    <span className={weekCalendarNowMarker} />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div
            className={dayViewListStack}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            {dayEvents.map((event) => renderCard(event))}
          </div>
        )}
      </div>

      {showSwipeHint && days.length > 1 && (
        <div className={dayViewSwipeHint} aria-hidden="true">
          <ChevronLeft size={12} />
          <span>swipe for other days</span>
          <ChevronRight size={12} />
        </div>
      )}
    </div>
  );
}
