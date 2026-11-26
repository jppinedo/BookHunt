import React from 'react';
import { titleStyles } from './TitleStyles';
import type SizesTypes from '../../../interfaces/sizes';
import './Title.css';

export interface TitleProps {
  size?: SizesTypes;
  children: React.ReactNode;
  thikness?: keyof typeof titleStyles.thikness;
  fontFamily?: keyof typeof titleStyles.fontFamily;
  className?: string;
  uppercase?: boolean;
  dot?: boolean;
  dotTone?: keyof typeof titleStyles.dot;
  /** Named gradient text fill. Overrides `color` and default text color when set. */
  gradient?: keyof typeof titleStyles.gradient;
  /** Pio accent text color. Ignored when `gradient` is set. */
  color?: keyof typeof titleStyles.color;
}

declare const TitleTags: Readonly<{
  h1: 'h1';
  h2: 'h2';
  h3: 'h3';
  h4: 'h4';
  h5: 'h5';
}>;

const Title: React.FC<TitleProps> = ({
  size = 'md',
  children,
  thikness = 'regular',
  fontFamily = 'poppins',
  className,
  uppercase = false,
  dot = false,
  dotTone = 'coral',
  gradient,
  color,
}) => {
  const sizeToTag: Record<SizesTypes, keyof typeof TitleTags> = {
    sm: 'h5',
    md: 'h4',
    lg: 'h3',
    xl: 'h2',
    xxl: 'h1',
    xxxl: 'h1',
    xxxxl: 'h1',
  };

  const Tag = sizeToTag[size];

  const colorClass = gradient
    ? titleStyles.gradient[gradient]
    : color
      ? titleStyles.color[color]
      : uppercase
        ? titleStyles.colorMuted
        : fontFamily === 'playfair'
          ? titleStyles.colorDisplay
          : titleStyles.base;

  const classes = [
    'm-0',
    colorClass,
    titleStyles[size],
    titleStyles.thikness[thikness],
    titleStyles.fontFamily[fontFamily],
    uppercase ? titleStyles.uppercase : '',
    fontFamily === 'playfair' ? titleStyles.playfairTracking : '',
    dot ? titleStyles.withDot : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      className={classes}
      style={{
        fontFamily: titleStyles.fontFamilyCss[fontFamily],
        fontWeight: titleStyles.thiknessCss[thikness],
      }}
    >
      {dot ? <span className={titleStyles.dot[dotTone]} aria-hidden="true" /> : null}
      {children}
    </Tag>
  );
};

export default Title;
