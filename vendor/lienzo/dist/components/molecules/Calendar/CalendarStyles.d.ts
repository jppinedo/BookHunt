import { Animation, DayFlag, SelectionState, UI } from 'react-day-picker';
/**
 * Lienzo design tokens mapped to React DayPicker class names.
 * Extends defaults so structure (e.g. grid) is preserved; overrides for look and feel.
 */
export declare const calendarClassNames: Partial<Record<UI | SelectionState | DayFlag | Animation, string>>;
