import React, { useRef } from 'react';
import type { BackgroundProps } from './Background.types';
import { nextBackgroundSvgId } from './nextBackgroundSvgId';

type GradientBackgroundProps = Omit<
  BackgroundProps,
  'type' | 'vignette' | 'vignetteColor' | 'darkColors' | 'darkVignetteColor'
>;

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors,
  isHexColors,
  children,
  className,
  rounded = false,
}) => {
  const gradientId = useRef(nextBackgroundSvgId('bg-gradient')).current;
  const turbulenceId = useRef(nextBackgroundSvgId('bg-turbulence')).current;

  const stops = colors.map((color, index) => (
    <stop
      key={index}
      offset={`${(index / (colors.length - 1 || 1)) * 100}%`}
      style={{ stopColor: isHexColors ? color : `var(--${color})` }}
    />
  ));

  return (
    <div
      style={{
        boxSizing: 'border-box',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
      className={`${className || ''} ${rounded ? 'rounded-3xl' : ''} overflow-hidden`.trim()}
    >
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1,
        }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {stops}
          </linearGradient>
          <filter id={turbulenceId} x="0" y="0">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.01"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              in2="turbulence"
              in="SourceGraphic"
              scale="50"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <rect
          x="-30"
          y="-30"
          width="130%"
          height="130%"
          fill={`url(#${gradientId})`}
          filter={`url(#${turbulenceId})`}
        />
      </svg>
      {children != null && (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default GradientBackground;
