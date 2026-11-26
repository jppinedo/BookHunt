import React from 'react';
import {
  cardBase,
  cardPadding,
  cardRadius,
  cardShadow,
  cardSurface,
} from './CardStyles';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  radius?: keyof typeof cardRadius;
  surface?: keyof typeof cardSurface;
  shadow?: keyof typeof cardShadow;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padded = true,
  radius = '3xl',
  surface = 'white',
  shadow = 'soft',
}) => {
  const classes = [
    cardBase,
    cardRadius[radius],
    cardSurface[surface],
    cardShadow[shadow],
    padded ? cardPadding : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};

export default Card;
