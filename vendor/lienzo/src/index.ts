/**
 * Public API for @jppinedo/lienzo.
 *
 * Apps import components from this entry. In development (Vite), the package
 * `exports` `development` condition resolves here for HMR on source edits.
 * Production builds resolve to `dist/`.
 */

// Atoms
export { default as Background } from './components/atoms/Background/Background';
export type { BackgroundProps, BackgroundType } from './components/atoms/Background/Background';

export { default as Badge } from './components/atoms/Badge/Badge';
export type { BadgeProps } from './components/atoms/Badge/Badge';

export { default as Box } from './components/atoms/Box/Box';
export type { BoxProps } from './components/atoms/Box/Box';

export { default as Button } from './components/atoms/Button/Button';
export type { ButtonProps } from './components/atoms/Button/Button';
export type { ButtonSize } from './components/atoms/Button/ButtonStyles';

export { default as Card } from './components/atoms/Card/Card';
export type { CardProps } from './components/atoms/Card/Card';

export { default as Checkbox } from './components/atoms/Checkbox/Checkbox';
export type { CheckboxProps } from './components/atoms/Checkbox/Checkbox';
export type { CheckboxSize, CheckboxType } from './components/atoms/Checkbox/CheckboxStyles';

export { default as CircleSpinner } from './components/atoms/CircleSpinner/CircleSpinner';

export { default as Input } from './components/atoms/Input/Input';
export type { InputProps } from './components/atoms/Input/Input';

export { default as Label } from './components/atoms/Label/Label';
export type { LabelProps } from './components/atoms/Label/Label';

export { default as Select } from './components/atoms/Select/Select';

export { default as Spinner } from './components/atoms/Spinner/Spinner';
export type { SpinnerProps } from './components/atoms/Spinner/Spinner';

export { default as Switch } from './components/atoms/Switch/Switch';
export type { SwitchProps } from './components/atoms/Switch/Switch';
export type { SwitchSize, SwitchType } from './components/atoms/Switch/SwitchStyles';

export { default as Title } from './components/atoms/Title/Title';
export type { TitleProps } from './components/atoms/Title/Title';

// Molecules
export { default as Calendar } from './components/molecules/Calendar/Calendar';
export type { CalendarProps } from './components/molecules/Calendar/Calendar';

export { default as CodeBlock } from './components/molecules/CodeBlock/CodeBlock';
export type { CodeBlockProps } from './components/molecules/CodeBlock/CodeBlock';

export { default as LineChart } from './components/molecules/LineChart/LineChart';
export type {
  LineChartCurveType,
  LineChartDataItem,
  LineChartProps,
  LineChartReferenceLine,
  LineChartSeriesConfig,
} from './components/molecules/LineChart/LineChart';

export { default as Menu } from './components/molecules/Menu/Menu';
export type { MenuItem, MenuProps } from './components/molecules/Menu/Menu';

export { default as Tabs } from './components/molecules/Tabs/Tabs';
export type { TabSystemProps, TabsVariant, TabType } from './components/molecules/Tabs/Tabs';

export { default as Toolbar } from './components/molecules/Toolbar/Toolbar';
export type { ToolbarProps } from './components/molecules/Toolbar/Toolbar';
export type { ToolbarItemType } from './components/molecules/Toolbar/ToolbarItem';

export { default as WeekCalendar } from './components/molecules/WeekCalendar/WeekCalendar';
export type {
  CalendarLayout,
  WeekCalendarEvent,
  WeekCalendarEventTone,
  WeekCalendarProps,
  Weekday,
} from './components/molecules/WeekCalendar/WeekCalendar';

// Templates
export { default as Phone } from './components/templates/Phone/Phone';
export type { PhoneProps } from './components/templates/Phone/Phone';

// Hooks
export { useContainerWidth } from './hooks/useContainerWidth';
export { useControllableState } from './hooks/useControllableState';

// Shared types
export type { RoundedSizes } from './interfaces/sizes';
export type { default as SizesTypes } from './interfaces/sizes';
