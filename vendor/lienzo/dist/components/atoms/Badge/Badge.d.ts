import React from 'react';
import { badgeTone } from './BadgeStyles';
export interface BadgeProps {
    label: string;
    tone?: keyof typeof badgeTone;
    dot?: boolean;
    className?: string;
}
declare const Badge: React.FC<BadgeProps>;
export default Badge;
