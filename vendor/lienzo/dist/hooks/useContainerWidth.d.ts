import { type RefObject } from 'react';
/**
 * Observes an element's width and returns whether it is below `breakpoint`.
 * Stores only the boolean so resizes re-render only when crossing the threshold.
 * Returns `null` until the first measure (SSR / no element).
 */
export declare function useContainerWidth(ref: RefObject<HTMLElement | null>, breakpoint: number): boolean | null;
