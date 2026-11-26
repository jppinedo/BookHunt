import React from 'react';
import { type WeekCalendarProps } from './WeekCalendarTypes';
import './WeekCalendar.css';
export type { CalendarLayout, WeekCalendarEvent, WeekCalendarProps, } from './WeekCalendarTypes';
export type { Weekday } from './WeekCalendarUtils';
export type { WeekCalendarEventTone } from './WeekCalendarStyles';
declare const WeekCalendar: React.FC<WeekCalendarProps>;
export default WeekCalendar;
