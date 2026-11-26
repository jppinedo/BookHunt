import React from 'react';
import { cardRadius, cardShadow, cardSurface } from './CardStyles';
export interface CardProps {
    children: React.ReactNode;
    className?: string;
    padded?: boolean;
    radius?: keyof typeof cardRadius;
    surface?: keyof typeof cardSurface;
    shadow?: keyof typeof cardShadow;
}
declare const Card: React.FC<CardProps>;
export default Card;
