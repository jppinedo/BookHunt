import React from 'react';
import type { BackgroundProps } from './Background.types';
export type { BackgroundProps, BackgroundType } from './Background.types';
/**
 * Full-bleed background surface. Dispatches to a type-specific renderer
 * (`gradient` | `dotted`) so each recipe stays isolated and extensible.
 */
declare const Background: React.FC<BackgroundProps>;
export default Background;
