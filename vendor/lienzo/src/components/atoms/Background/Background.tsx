import React from 'react';
import type { BackgroundProps } from './Background.types';
import GradientBackground from './GradientBackground';
import DottedBackground from './DottedBackground';

export type { BackgroundProps, BackgroundType } from './Background.types';

/**
 * Full-bleed background surface. Dispatches to a type-specific renderer
 * (`gradient` | `dotted`) so each recipe stays isolated and extensible.
 */
const Background: React.FC<BackgroundProps> = (props) => {
  const type = props.type ?? 'gradient';

  switch (type) {
    case 'dotted':
      return <DottedBackground key="dotted" {...props} />;
    case 'gradient':
    default:
      return <GradientBackground key="gradient" {...props} />;
  }
};

export default Background;
