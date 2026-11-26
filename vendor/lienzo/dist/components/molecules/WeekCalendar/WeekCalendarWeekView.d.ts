import React from 'react';
import { type DayBuckets, type WeekCalendarEvent } from './WeekCalendarTypes';
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
export declare function WeekCalendarWeekView({ days, today, showHours, hours, safeRangeStart, safeRangeEnd, gridHeight, showNowIndicator, nowOffset, eventsByDay, bucketsByDay, renderEvent, }: WeekViewProps): React.JSX.Element;
