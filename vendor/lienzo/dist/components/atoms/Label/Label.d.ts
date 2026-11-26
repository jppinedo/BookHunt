import React from 'react';
import './Label.css';
export interface LabelProps {
    className?: string;
    items?: number;
    icon?: React.ReactElement;
    type?: 'default' | 'red' | 'yellow' | 'green';
    text: string;
}
declare const Label: React.FC<LabelProps>;
export default Label;
