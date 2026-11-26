import React from 'react';
import {
  eventCardAgendaInner,
  eventCardAgendaMeta,
  eventCardAgendaSubtitle,
  eventCardAgendaTime,
  eventCardAgendaTitleRow,
  eventCardBase,
  eventCardBody,
  eventCardInner,
  eventCardInteractive,
  eventCardStatus,
  eventCardSubtitle,
  eventCardTitle,
  eventCardTone,
  type WeekCalendarEventTone,
} from './WeekCalendarStyles';
import { cx, type WeekCalendarEvent } from './WeekCalendarTypes';
import { formatTimeLabel } from './WeekCalendarUtils';

export function EventCard({
  event,
  className,
  style,
  variant = 'default',
}: {
  event: WeekCalendarEvent;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'agenda';
}) {
  const tone: WeekCalendarEventTone = event.tone ?? 'neutral';
  const interactive = typeof event.onClick === 'function';
  const classes = cx(
    eventCardBase,
    eventCardTone[tone],
    interactive && eventCardInteractive,
    className
  );

  const content =
    variant === 'agenda' ? (
      <AgendaCardContent event={event} tone={tone} />
    ) : (
      <div className={eventCardInner}>
        {event.subtitle != null && (
          <div className={eventCardSubtitle}>{event.subtitle}</div>
        )}
        <div className={eventCardTitle}>{event.title}</div>
        {event.body != null && (
          <div className={eventCardBody}>{event.body}</div>
        )}
        {tone === 'muted' && event.status != null && (
          <div className={eventCardStatus}>{event.status}</div>
        )}
      </div>
    );

  if (interactive) {
    return (
      <button
        type="button"
        className={classes}
        style={style}
        onClick={event.onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={classes} style={style}>
      {content}
    </div>
  );
}

function AgendaCardContent({
  event,
  tone,
}: {
  event: WeekCalendarEvent;
  tone: WeekCalendarEventTone;
}) {
  const timeLabel = formatTimeLabel(event.start);
  const metaLabel = event.meta;
  const showTimeLine = timeLabel != null || metaLabel != null;

  return (
    <div className={eventCardAgendaInner}>
      <div className={eventCardAgendaTitleRow}>
        <div className={eventCardTitle}>{event.title}</div>
        {event.subtitle != null && (
          <div className={eventCardAgendaSubtitle}>{event.subtitle}</div>
        )}
      </div>
      {showTimeLine && (
        <div className={eventCardAgendaTime}>
          {timeLabel != null && <span>{timeLabel}</span>}
          {timeLabel != null && metaLabel != null && <span> · </span>}
          {metaLabel != null && (
            <span className={eventCardAgendaMeta}>{metaLabel}</span>
          )}
        </div>
      )}
      {event.body != null && (
        <div className={eventCardBody}>{event.body}</div>
      )}
      {tone === 'muted' && event.status != null && (
        <div className={eventCardStatus}>{event.status}</div>
      )}
    </div>
  );
}
