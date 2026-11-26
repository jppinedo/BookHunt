import React from 'react';
import {
  agendaCardStack,
  agendaCardStackToday,
  agendaDayHeader,
  agendaDayHeaderCount,
  agendaDayHeaderLabel,
  agendaDayHeaderLabelToday,
  agendaDayHeaderToday,
  agendaDaySection,
  agendaDaySectionToday,
  agendaEmptyDay,
  agendaEmptyRule,
  agendaRoot,
  agendaTodayBar,
} from './WeekCalendarStyles';
import { EventCard } from './WeekCalendarEventCard';
import {
  cx,
  type WeekCalendarEvent,
} from './WeekCalendarTypes';
import {
  accessibleDayLabel,
  dayKey,
  formatShortDayHeader,
  isSameDay,
} from './WeekCalendarUtils';

export type AgendaViewProps = {
  days: Date[];
  today: Date;
  eventsByDay: Map<string, WeekCalendarEvent[]>;
  hideEmptyDays?: boolean;
  emptyDayLabel?: React.ReactNode;
  renderEvent?: (event: WeekCalendarEvent) => React.ReactNode;
};

export function WeekCalendarAgendaView({
  days,
  today,
  eventsByDay,
  hideEmptyDays = false,
  emptyDayLabel = 'No events',
  renderEvent,
}: AgendaViewProps) {
  const sections = days
    .map((day) => {
      const events = eventsByDay.get(dayKey(day)) ?? [];
      return { day, events };
    })
    .filter(({ events }) => !hideEmptyDays || events.length > 0);

  return (
    <div className={agendaRoot} role="list">
      {sections.map(({ day, events }) => {
        const isToday = isSameDay(day, today);
        const key = dayKey(day);
        const labelId = `agenda-day-${key}`;

        if (events.length === 0) {
          return (
            <div
              key={key}
              role="listitem"
              className={agendaEmptyDay}
              aria-labelledby={labelId}
            >
              <span id={labelId}>
                {formatShortDayHeader(day)} · {emptyDayLabel}
              </span>
              <span className={agendaEmptyRule} aria-hidden="true" />
            </div>
          );
        }

        return (
          <section
            key={key}
            role="group"
            aria-labelledby={labelId}
            aria-current={isToday ? 'date' : undefined}
            className={cx(
              agendaDaySection,
              isToday && agendaDaySectionToday
            )}
          >
            <header
              className={cx(
                agendaDayHeader,
                isToday && agendaDayHeaderToday
              )}
            >
              {isToday && (
                <span className={agendaTodayBar} aria-hidden="true" />
              )}
              <h3
                id={labelId}
                className={cx(
                  agendaDayHeaderLabel,
                  isToday && agendaDayHeaderLabelToday,
                  isToday && 'pl-3'
                )}
              >
                {isToday
                  ? `${formatShortDayHeader(day)} · Today`
                  : formatShortDayHeader(day)}
              </h3>
              <span className={agendaDayHeaderCount}>
                {events.length === 1 ? '1 event' : `${events.length} events`}
              </span>
            </header>
            <div
              className={cx(
                agendaCardStack,
                isToday && agendaCardStackToday
              )}
              role="list"
              aria-label={accessibleDayLabel(day)}
            >
              {events.map((event) => {
                if (renderEvent) {
                  return (
                    <div key={event.id} role="listitem">
                      {renderEvent(event)}
                    </div>
                  );
                }
                return (
                  <div key={event.id} role="listitem">
                    <EventCard event={event} variant="agenda" />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
