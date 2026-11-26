import React from 'react';
import type { BackgroundProps } from './Background.types';
import './DottedBackground.css';
type DottedBackgroundProps = Omit<BackgroundProps, 'type'>;
declare const DottedBackground: React.FC<DottedBackgroundProps>;
export default DottedBackground;
