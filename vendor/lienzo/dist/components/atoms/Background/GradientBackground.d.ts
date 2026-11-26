import React from 'react';
import type { BackgroundProps } from './Background.types';
type GradientBackgroundProps = Omit<BackgroundProps, 'type' | 'vignette' | 'vignetteColor' | 'darkColors' | 'darkVignetteColor'>;
declare const GradientBackground: React.FC<GradientBackgroundProps>;
export default GradientBackground;
