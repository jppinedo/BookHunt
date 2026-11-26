import React from 'react';
import './Spinner.css';
export interface SpinnerProps {
    colorClass?: string;
    size?: string;
    thickness?: string;
}
declare const Spinner: React.FC<SpinnerProps>;
export default Spinner;
