import React from 'react';
import {
  COLUMN_MIN_WIDTH_PX,
  GUTTER_WIDTH_PX,
  HOUR_HEIGHT_PX,
  MIN_EVENT_HEIGHT_PX,
  eventCardTimed,
  weekCalendarAllDayStack,
  weekCalendarBody,
  weekCalendarDayColumn,
  weekCalendarDayColumnToday,
  weekCalendarDayHeader,
  weekCalendarDayHeaderLabel,
  weekCalendarDayHeaderLabelToday,
  weekCalendarDayHeaderNumber,
  weekCalendarDayHeaderNumberToday,
  weekCalendarGutter,
  weekCalendarGutterSpacer,
  weekCalendarHeader,
  weekCalendarHourGrid,
  weekCalendarHourLabel,
  weekCalendarHourLine,
  weekCalendarInner,
  weekCalendarListStack,
  weekCalendarNowLine,
  weekCalendarNowMarker,
  weekCalendarScroll,
  weekCalendarTodayAccentBar,
} from './WeekCalendarStyles';
import { EventCard } from './WeekCalendarEventCard';
import {
  cx,
  type DayBuckets,
  type WeekCalendarEvent,
} from './WeekCalendarTypes';
import {
  accessibleDayLabel,
  clampTimeToRange,
  dayKey,
  durationToHeightPx,
  formatHourLabel,
  isSameDay,
  layoutTimedEvents,
  minutesToOffsetPx,
  shortWeekdayName,
} from './WeekCalendarUtils';

export type WeekViewProps = {
  days: Date[];
  today: Date;
  showHours: boolean;
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

export function WeekCalendarWeekView({
  days,
  today,
  showHours,
  hours,
  safeRangeStart,
  safeRangeEnd,
  gridHeight,
  showNowIndicator,
  nowOffset,
  eventsByDay,
  bucketsByDay,
  renderEvent,
}: WeekViewProps) {
  const columnTemplate = showHours
    ? `${GUTTER_WIDTH_PX}px repeat(${days.length}, minmax(${COLUMN_MIN_WIDTH_PX}px, 1fr))`
    : `repeat(${days.length}, minmax(${COLUMN_MIN_WIDTH_PX}px, 1fr))`;

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

  const renderTimedGrid = (day: Date) => {
    const buckets = bucketsByDay.get(dayKey(day)) ?? { allDay: [], timed: [] };
    const layout = layoutTimedEvents(
      buckets.timed.map((t) => ({
        id: t.event.id,
        startMin: t.startMin,
        endMin: t.endMin,
      }))
    );
    const isToday = isSameDay(day, today);

    return (
      <div className={weekCalendarHourGrid} style={{ height: gridHeight }}>
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
          const slot = layout.get(event.id) ?? { column: 0, columnCount: 1 };
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
        {isToday && showNowIndicator && (
          <div
            className={weekCalendarNowLine}
            style={{ top: nowOffset }}
            aria-hidden="true"
          >
            <span className={weekCalendarNowMarker} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={weekCalendarScroll}>
      <div
        className={weekCalendarInner}
        style={{
          minWidth: showHours
            ? GUTTER_WIDTH_PX + days.length * COLUMN_MIN_WIDTH_PX
            : days.length * COLUMN_MIN_WIDTH_PX,
        }}
      >
        <div
          className={weekCalendarHeader}
          style={{ gridTemplateColumns: columnTemplate }}
        >
          {showHours && (
            <div className={weekCalendarGutterSpacer} aria-hidden="true" />
          )}
          {days.map((day) => {
            const isToday = isSameDay(day, today);
            return (
              <div
                key={`header-${dayKey(day)}`}
                className={cx(
                  weekCalendarDayHeader,
                  isToday && weekCalendarDayColumnToday
                )}
              >
                {isToday && (
                  <span
                    className={weekCalendarTodayAccentBar}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cx(
                    weekCalendarDayHeaderLabel,
                    isToday && weekCalendarDayHeaderLabelToday
                  )}
                >
                  {shortWeekdayName(day)}
                </span>
                <span
                  className={cx(
                    weekCalendarDayHeaderNumber,
                    isToday && weekCalendarDayHeaderNumberToday
                  )}
                >
                  {day.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {showHours ? (
          <>
            <div
              className={weekCalendarBody}
              style={{ gridTemplateColumns: columnTemplate }}
            >
              <div className={weekCalendarGutter} aria-hidden="true" />
              {days.map((day) => {
                const isToday = isSameDay(day, today);
                const allDay = bucketsByDay.get(dayKey(day))?.allDay ?? [];
                return (
                  <section
                    key={`allday-${dayKey(day)}`}
                    className={cx(
                      weekCalendarDayColumn,
                      isToday && weekCalendarDayColumnToday
                    )}
                    aria-label={`${accessibleDayLabel(day)} all-day`}
                  >
                    <div className={weekCalendarAllDayStack}>
                      {allDay.map((event) => renderCard(event))}
                    </div>
                  </section>
                );
              })}
            </div>

            <div
              className={weekCalendarBody}
              style={{ gridTemplateColumns: columnTemplate }}
            >
              <div className={weekCalendarGutter} aria-hidden="true">
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
              {days.map((day) => {
                const isToday = isSameDay(day, today);
                return (
                  <section
                    key={`hours-${dayKey(day)}`}
                    className={cx(
                      weekCalendarDayColumn,
                      isToday && weekCalendarDayColumnToday
                    )}
                    aria-label={accessibleDayLabel(day)}
                    aria-current={isToday ? 'date' : undefined}
                  >
                    {renderTimedGrid(day)}
                  </section>
                );
              })}
            </div>
          </>
        ) : (
          <div
            className={weekCalendarBody}
            style={{ gridTemplateColumns: columnTemplate }}
          >
            {days.map((day) => {
              const isToday = isSameDay(day, today);
              const dayEvents = eventsByDay.get(dayKey(day)) ?? [];
              return (
                <section
                  key={dayKey(day)}
                  className={cx(
                    weekCalendarDayColumn,
                    isToday && weekCalendarDayColumnToday
                  )}
                  aria-label={accessibleDayLabel(day)}
                  aria-current={isToday ? 'date' : undefined}
                >
                  <div className={weekCalendarListStack}>
                    {dayEvents.map((event) => renderCard(event))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
