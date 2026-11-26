/** Resolve a Background color prop to a CSS color value. */
export function resolveBackgroundColor(
  color: string,
  isHexColors: boolean,
): string {
  if (isHexColors) return color;
  return `rgb(var(--lz-${color}) / 1)`;
}
