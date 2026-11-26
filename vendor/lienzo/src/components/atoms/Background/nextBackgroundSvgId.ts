/** Document-unique IDs for SVG paint servers (Storybook mounts multiple React roots). */
let seq = 0;

export function nextBackgroundSvgId(prefix: string): string {
  seq += 1;
  return `${prefix}-${seq}-${Math.random().toString(36).slice(2, 11)}`;
}
