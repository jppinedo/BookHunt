import React from 'react';
import { type WeekCalendarEvent } from './WeekCalendarTypes';
export type AgendaViewProps = {
    days: Date[];
    today: Date;
    eventsByDay: Map<string, WeekCalendarEvent[]>;
    hideEmptyDays?: boolean;
    emptyDayLabel?: React.ReactNode;
    renderEvent?: (event: WeekCalendarEvent) => React.ReactNode;
};
export declare function WeekCalendarAgendaView({ days, today, eventsByDay, hideEmptyDays, emptyDayLabel, renderEvent, }: AgendaViewProps): React.JSX.Element;
