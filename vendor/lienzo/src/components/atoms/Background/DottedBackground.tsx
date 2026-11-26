import React, { CSSProperties } from 'react';
import type { BackgroundProps } from './Background.types';
import { resolveBackgroundColor } from './resolveBackgroundColor';
import './DottedBackground.css';

type DottedBackgroundProps = Omit<BackgroundProps, 'type'>;

const DottedBackground: React.FC<DottedBackgroundProps> = ({
  colors,
  darkColors,
  isHexColors,
  children,
  className,
  rounded = false,
  vignette = false,
  vignetteColor,
  darkVignetteColor,
}) => {
  const fill = colors[0];
  const dot = colors[1] ?? colors[0];
  const vignetteSource = vignetteColor ?? fill;
  const themeable = Boolean(darkColors?.length);

  const darkFill = darkColors?.[0];
  const darkDot = darkColors?.[1] ?? darkFill;
  const darkVignetteSource = darkVignetteColor ?? darkFill;

  /**
   * When themeable, set light/dark channel vars only — never `--bg-dotted-fill`
   * inline, so the stylesheet can swap under `data-mode="dark"` (inline vars
   * would win over the dark override).
   */
  const cssVars = (
    themeable && darkFill
      ? {
          '--bg-dotted-fill-light': resolveBackgroundColor(fill, isHexColors),
          '--bg-dotted-dot-light': resolveBackgroundColor(dot, isHexColors),
          '--bg-dotted-vignette-light': resolveBackgroundColor(
            vignetteSource,
            isHexColors,
          ),
          '--bg-dotted-fill-dark': resolveBackgroundColor(darkFill, isHexColors),
          '--bg-dotted-dot-dark': resolveBackgroundColor(
            darkDot ?? darkFill,
            isHexColors,
          ),
          '--bg-dotted-vignette-dark': resolveBackgroundColor(
            darkVignetteSource ?? darkFill,
            isHexColors,
          ),
        }
      : {
          '--bg-dotted-fill': resolveBackgroundColor(fill, isHexColors),
          '--bg-dotted-dot': resolveBackgroundColor(dot, isHexColors),
          '--bg-dotted-vignette': resolveBackgroundColor(
            vignetteSource,
            isHexColors,
          ),
        }
  ) as unknown as CSSProperties;

  return (
    <div
      className={`bg-dotted ${themeable ? 'bg-dotted--themeable' : ''} ${rounded ? 'rounded-3xl' : ''} ${className || ''}`.trim()}
      style={cssVars}
    >
      <div className="bg-dotted__pattern" aria-hidden="true" />
      {vignette && (
        <div className="bg-dotted__vignette" aria-hidden="true" />
      )}
      {children != null && (
        <div className="bg-dotted__content">{children}</div>
      )}
    </div>
  );
};

export default DottedBackground;
