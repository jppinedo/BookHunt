import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * Observes an element's width and returns whether it is below `breakpoint`.
 * Stores only the boolean so resizes re-render only when crossing the threshold.
 * Returns `null` until the first measure (SSR / no element).
 */
export function useContainerWidth(
  ref: RefObject<HTMLElement | null>,
  breakpoint: number
): boolean | null {
  const [isNarrow, setIsNarrow] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const update = (width: number) => {
      const next = width < breakpoint;
      setIsNarrow((prev) => (prev === next ? prev : next));
    };

    update(el.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      update(entry.contentRect.width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, breakpoint]);

  return isNarrow;
}
