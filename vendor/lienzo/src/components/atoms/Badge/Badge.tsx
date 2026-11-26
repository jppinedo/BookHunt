import React from 'react';
import { badgeBase, badgeDot, badgeDotSize, badgeTone } from './BadgeStyles';

export interface BadgeProps {
  label: string;
  tone?: keyof typeof badgeTone;
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  tone = 'coral',
  dot = false,
  className,
}) => {
  return (
    <span className={`${badgeBase} ${badgeTone[tone]} ${className || ''}`.trim()}>
      {dot && (
        <span className={`${badgeDotSize} ${badgeDot[tone]}`} aria-hidden="true" />
      )}
      {label}
    </span>
  );
};

export default Badge;
