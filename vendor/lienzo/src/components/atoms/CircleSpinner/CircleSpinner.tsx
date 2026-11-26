import React from 'react';
import './CircleSpinner.css';

interface CircleSpinnerProps {
  colorClass?: string;
  thickness?: number;
  size?: string;
}

const CircleSpinner: React.FC<CircleSpinnerProps> = ({ 
  colorClass = 'bg-pio-coral', 
  thickness = 1, 
  size = '6rem'
}) => (
  <div 
    className={`circle-spinner border-gray-opacity-30`} 
    style={{ 
      borderWidth: `${thickness}rem`,
      width: size, height: size
    }}
  >
    <div 
      className={`inner-circle ${colorClass}`}
      style={{
        width: `${thickness}rem`,
        height: `${thickness}rem`,
        transformOrigin: `-${parseInt(size)/2 - thickness}rem 0px`
      }}  
    />
  </div>
);

export default CircleSpinner;