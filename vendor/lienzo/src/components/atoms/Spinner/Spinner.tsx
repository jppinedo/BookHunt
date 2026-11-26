import React from 'react';
import './Spinner.css';

export interface SpinnerProps {
  colorClass?: string;
  size?: string;
  thickness?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  colorClass = 'border-pio-coral', 
  size = '60px', 
  thickness = '16px' 
}) => (
  <div className={`spinner ${colorClass}`} style={{ 
    borderWidth: thickness,
    width: size,
    height: size
  }}/>
);

export default Spinner;