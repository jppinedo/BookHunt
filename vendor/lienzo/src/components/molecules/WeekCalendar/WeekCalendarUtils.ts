export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const FULL_WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export function parseEventDate(value: Date | string): Date {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date(NaN);
  }
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

export function startOfWeek(date: Date, weekStartsOn: 0 | 1): Date {
  const day = date.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getWeekday(date: Date): Weekday {
  return date.getDay() as Weekday;
}

export function shortWeekdayName(date: Date): string {
  return SHORT_WEEKDAYS[date.getDay()];
}

export function accessibleDayLabel(date: Date): string {
  return `${FULL_WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function weekdayLetter(date: Date): string {
  return SHORT_WEEKDAYS[date.getDay()].charAt(0);
}

export function formatMonthYear(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** e.g. "Wednesday, Oct 15" */
export function formatLongDay(date: Date): string {
  return `${FULL_WEEKDAYS[date.getDay()]}, ${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/** e.g. "Mon 19" */
export function formatShortDayHeader(date: Date): string {
  return `${shortWeekdayName(date)} ${date.getDate()}`;
}

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/** Visible day columns in week order set by `weekStartsOn`. */
export function getVisibleDates(
  weekStart: Date,
  weekStartsOn: 0 | 1,
  visibleDays: Weekday[]
): Date[] {
  const start = startOfWeek(parseEventDate(weekStart), weekStartsOn);
  const visible = new Set(visibleDays);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i += 1) {
    const date = addDays(start, i);
    if (visible.has(getWeekday(date))) {
      dates.push(date);
    }
  }
  return dates;
}

/** Parse "HH:mm" or "H:mm" into minutes from midnight. Returns null if invalid. */
export function parseTimeToMinutes(time?: string): number | null {
  if (!time) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }
  return hours * 60 + minutes;
}

export function formatHourLabel(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const suffix = h < 12 ? 'AM' : 'PM';
  const twelve = h % 12 === 0 ? 12 : h % 12;
  return `${twelve} ${suffix}`;
}

/** Format "HH:mm" / "H:mm" for display, e.g. "10:00 AM" (minutes always shown). */
export function formatTimeLabel(time?: string): string | null {
  const minutes = parseTimeToMinutes(time);
  if (minutes == null) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h < 12 ? 'AM' : 'PM';
  const twelve = h % 12 === 0 ? 12 : h % 12;
  return `${twelve}:${String(m).padStart(2, '0')} ${suffix}`;
}

/**
 * Assign side-by-side columns for overlapping timed events.
 * Events are expected to already belong to one day.
 */
export function layoutTimedEvents(
  items: Array<{ id: string; startMin: number; endMin: number }>
): Map<string, { column: number; columnCount: number }> {
  const sorted = [...items].sort((a, b) => {
    if (a.startMin !== b.startMin) return a.startMin - b.startMin;
    return a.endMin - b.endMin;
  });

  const result = new Map<string, { column: number; columnCount: number }>();
  if (sorted.length === 0) return result;

  type Placed = { id: string; startMin: number; endMin: number; column: number };
  const placed: Placed[] = [];
  let groupStart = 0;
  let nextColumn = 0;
  let groupMaxCol = 0;

  const assignGroup = (from: number, to: number, maxCols: number) => {
    for (let i = from; i < to; i += 1) {
      const item = placed[i];
      result.set(item.id, { column: item.column, columnCount: maxCols });
    }
  };

  for (const event of sorted) {
    const active = placed.filter(
      (item, idx) => idx >= groupStart && item.endMin > event.startMin
    );

    if (active.length === 0 && placed.length > groupStart) {
      assignGroup(groupStart, placed.length, groupMaxCol);
      groupStart = placed.length;
      nextColumn = 0;
      groupMaxCol = 0;
    }

    const used = new Set(
      placed
        .filter((item, idx) => idx >= groupStart && item.endMin > event.startMin)
        .map((item) => item.column)
    );
    let column = 0;
    while (used.has(column)) column += 1;
    if (column >= nextColumn) nextColumn = column + 1;

    placed.push({
      id: event.id,
      startMin: event.startMin,
      endMin: event.endMin,
      column,
    });
    groupMaxCol = Math.max(groupMaxCol, nextColumn);
  }

  if (placed.length > groupStart) {
    assignGroup(groupStart, placed.length, groupMaxCol);
  }

  return result;
}

export function clampTimeToRange(
  minutes: number,
  rangeStartHour: number,
  rangeEndHour: number
): number {
  const min = rangeStartHour * 60;
  const max = rangeEndHour * 60;
  return Math.min(max, Math.max(min, minutes));
}

export function minutesToOffsetPx(
  minutes: number,
  rangeStartHour: number,
  hourHeightPx: number
): number {
  return ((minutes - rangeStartHour * 60) / 60) * hourHeightPx;
}

export function durationToHeightPx(
  startMin: number,
  endMin: number,
  hourHeightPx: number,
  minHeightPx: number
): number {
  const duration = Math.max(0, endMin - startMin);
  return Math.max(minHeightPx, (duration / 60) * hourHeightPx);
}
