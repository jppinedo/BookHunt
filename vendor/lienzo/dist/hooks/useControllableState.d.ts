type UseControllableStateParams<T> = {
    value?: T;
    defaultValue: T;
    onChange?: (value: T) => void;
};
/**
 * Controlled / uncontrolled state (Radix `value` / `defaultValue` pattern).
 * In development, warns if the prop switches between controlled and uncontrolled.
 */
export declare function useControllableState<T>({ value: valueProp, defaultValue, onChange, }: UseControllableStateParams<T>): [T, (next: T) => void];
export {};
