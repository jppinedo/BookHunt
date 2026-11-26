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
declare const Title: React.FC<TitleProps>;
export default Title;
