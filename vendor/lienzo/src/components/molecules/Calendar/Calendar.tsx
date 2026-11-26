import React, { useCallback } from 'react';
import {
  DayPicker,
  UI,
  type DateRange,
  type DayPickerProps,
} from 'react-day-picker';
import 'react-day-picker/style.css';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { calendarClassNames } from './CalendarStyles';
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

function LienzoChevron(
  props: React.ComponentPropsWithoutRef<'svg'> & {
    orientation?: 'left' | 'right' | 'up' | 'down';
    disabled?: boolean;
    size?: number;
    className?: string;
  }
) {
  const { orientation = 'left', disabled, size = 24, className, ...rest } = props;
  const iconProps = { size, className, ...rest };
  if (orientation === 'left') {
    return <ChevronLeft {...iconProps} aria-hidden />;
  }
  if (orientation === 'right') {
    return <ChevronRight {...iconProps} aria-hidden />;
  }
  return null;
}

type MonthCaptionProps = React.ComponentPropsWithoutRef<'div'> & {
  calendarMonth: { date: Date };
  displayIndex: number;
};

const Calendar: React.FC<CalendarProps> = ({
  mode = 'single',
  selected,
  onSelect,
  defaultMonth,
  caption,
  className,
  disabled,
  showOutsideDays = true,
  animate = true,
}) => {
  const handleSelectSingle = useCallback(
    (value: Date | undefined) => {
      onSelect?.(value);
    },
    [onSelect]
  );

  const handleSelectRange = useCallback(
    (value: DateRange | undefined) => {
      onSelect?.(value);
    },
    [onSelect]
  );

  const MonthCaption = useCallback(
    ({ children, calendarMonth: _calendarMonth, displayIndex: _displayIndex, className: captionClassName, ...divProps }: MonthCaptionProps) => (
      <div className={captionClassName} {...divProps}>
        {caption ? (
          <span className="rdp-caption_title block w-full text-center text-xs font-lexend font-regular text-pio-text-muted dark:text-blue-200/70 mb-1">
            {caption}
          </span>
        ) : null}
        {children}
      </div>
    ),
    [caption]
  );

  const components = {
    Chevron: LienzoChevron,
    MonthCaption,
  };

  const classNames = {
    ...calendarClassNames,
    [UI.MonthCaption]: [
      calendarClassNames[UI.MonthCaption],
      caption ? 'flex-col gap-0' : '',
    ]
      .filter(Boolean)
      .join(' '),
  };

  if (mode === 'range') {
    return (
      <DayPicker
        mode="range"
        selected={selected as DateRange | undefined}
        onSelect={handleSelectRange}
        defaultMonth={defaultMonth}
        classNames={classNames}
        components={components}
        showOutsideDays={showOutsideDays}
        animate={animate}
        disabled={disabled}
        className={className}
        navLayout="around"
        captionLayout="label"
      />
    );
  }

  return (
    <DayPicker
      mode="single"
      selected={selected as Date | undefined}
      onSelect={handleSelectSingle}
      defaultMonth={defaultMonth}
      classNames={classNames}
      components={components}
      showOutsideDays={showOutsideDays}
      animate={animate}
      disabled={disabled}
      className={className}
      navLayout="around"
      captionLayout="label"
    />
  );
};

export default Calendar;
