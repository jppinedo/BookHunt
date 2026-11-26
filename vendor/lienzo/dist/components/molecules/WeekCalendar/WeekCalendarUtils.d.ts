export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export declare function parseEventDate(value: Date | string): Date;
export declare function startOfWeek(date: Date, weekStartsOn: 0 | 1): Date;
export declare function addDays(date: Date, amount: number): Date;
export declare function isSameDay(a: Date, b: Date): boolean;
export declare function getWeekday(date: Date): Weekday;
export declare function shortWeekdayName(date: Date): string;
export declare function accessibleDayLabel(date: Date): string;
export declare function weekdayLetter(date: Date): string;
export declare function formatMonthYear(date: Date): string;
/** e.g. "Wednesday, Oct 15" */
export declare function formatLongDay(date: Date): string;
/** e.g. "Mon 19" */
export declare function formatShortDayHeader(date: Date): string;
export declare function dayKey(date: Date): string;
/** Visible day columns in week order set by `weekStartsOn`. */
export declare function getVisibleDates(weekStart: Date, weekStartsOn: 0 | 1, visibleDays: Weekday[]): Date[];
/** Parse "HH:mm" or "H:mm" into minutes from midnight. Returns null if invalid. */
export declare function parseTimeToMinutes(time?: string): number | null;
export declare function formatHourLabel(hour: number): string;
/** Format "HH:mm" / "H:mm" for display, e.g. "10:00 AM" (minutes always shown). */
export declare function formatTimeLabel(time?: string): string | null;
/**
 * Assign side-by-side columns for overlapping timed events.
 * Events are expected to already belong to one day.
 */
export declare function layoutTimedEvents(items: Array<{
    id: string;
    startMin: number;
    endMin: number;
}>): Map<string, {
    column: number;
    columnCount: number;
}>;
export declare function clampTimeToRange(minutes: number, rangeStartHour: number, rangeEndHour: number): number;
export declare function minutesToOffsetPx(minutes: number, rangeStartHour: number, hourHeightPx: number): number;
export declare function durationToHeightPx(startMin: number, endMin: number, hourHeightPx: number, minHeightPx: number): number;
