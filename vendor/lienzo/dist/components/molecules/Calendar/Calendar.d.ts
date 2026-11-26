import React from 'react';
import { type DateRange, type DayPickerProps } from 'react-day-picker';
import 'react-day-picker/style.css';
import './Calendar.css';
export interface CalendarProps {
    /** Selection mode: single day or date range */
    mode?: 'single' | 'range';
    /** Selected date (single mode) or range (range mode) */
    selected?: Date | DateRange | undefined;
    /** Called when selection changes */
    onSelect?: (value: Date | DateRange | undefined) => void;
    /** Initial month to display */
    defaultMonth?: Date;
    /**
     * Optional small title shown above the month/year row.
     * Does not replace the visible month label (e.g. "June 2025").
     */
    caption?: string;
    /** Extra class name for the root element */
    className?: string;
    /** Disabled dates (passed to DayPicker) */
    disabled?: DayPickerProps['disabled'];
    /** Show days from adjacent months */
    showOutsideDays?: boolean;
    /** Animate month transitions */
    animate?: boolean;
}
declare const Calendar: React.FC<CalendarProps>;
export default Calendar;
