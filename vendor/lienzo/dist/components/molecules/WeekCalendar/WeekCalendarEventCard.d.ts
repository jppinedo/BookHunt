import React from 'react';
import { type WeekCalendarEvent } from './WeekCalendarTypes';
export declare function EventCard({ event, className, style, variant, }: {
    event: WeekCalendarEvent;
    className?: string;
    style?: React.CSSProperties;
    variant?: 'default' | 'agenda';
}): React.JSX.Element;
