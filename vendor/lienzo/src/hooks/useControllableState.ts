import { useCallback, useEffect, useRef, useState } from 'react';

type UseControllableStateParams<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
};

/**
 * Controlled / uncontrolled state (Radix `value` / `defaultValue` pattern).
 * In development, warns if the prop switches between controlled and uncontrolled.
 */
export function useControllableState<T>({
  value: valueProp,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T, (next: T) => void] {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? (valueProp as T) : uncontrolled;

  const wasControlledRef = useRef(isControlled);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (wasControlledRef.current !== isControlled) {
      console.warn(
        '[useControllableState] A component is changing from ' +
          `${wasControlledRef.current ? 'controlled' : 'uncontrolled'} to ` +
          `${isControlled ? 'controlled' : 'uncontrolled'}. ` +
          'This is likely a bug; decide between controlled and uncontrolled and stick with it.'
      );
      wasControlledRef.current = isControlled;
    }
  }, [isControlled]);

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [value, setValue];
}
