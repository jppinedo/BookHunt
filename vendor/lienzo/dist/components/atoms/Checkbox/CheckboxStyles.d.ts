export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxType = 'default' | 'red' | 'green' | 'yellow';
export declare const checkboxBase: string;
export declare const checkboxSize: Record<CheckboxSize, string>;
/** Unchecked: cream fill + warm pio border (brand-aligned). */
export declare const checkboxUnchecked = "bg-pio-bg border-pio-grid dark:bg-gray-700 dark:border-gray-600";
export declare const checkboxChecked: Record<CheckboxType, string>;
export declare const checkboxIcon: Record<CheckboxType, string>;
