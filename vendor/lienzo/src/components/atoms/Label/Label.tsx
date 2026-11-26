import React from 'react';
import LabelStyles from './LabelStyles';
import './Label.css';

export interface LabelProps {
  className?: string;
  items?: number;
  icon?: React.ReactElement;
  type?: 'default' | 'red' | 'yellow' | 'green';
  text: string;
}

const Label: React.FC<LabelProps> = ({ 
  className, 
  items, 
  icon, 
  type = 'default',
  text
}) => {
  return (
    <div className={`items-center ${LabelStyles.container} ${className}`}>
      {icon && (
        <span className={`${LabelStyles[type].icon} mr-2`}>{icon}</span>
      )}
      <span className={LabelStyles[type].label}>{text}</span>
      {items && (
        <span className={`${LabelStyles[type].items} ml-2 text-xs lz-label-badge rounded-md`}>
          {items}
        </span>
      )}
      
    </div>
  );
};

export default Label;