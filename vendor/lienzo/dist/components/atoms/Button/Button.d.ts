import React from "react";
import { type ButtonSize } from "./ButtonStyles";
import './Button.css';
export interface ButtonProps {
    label?: string;
    onClick: () => void;
    ariaLabel?: string;
    mode?: 'default' | 'tool';
    type?: 'default' | 'red' | 'green' | 'yellow';
    fill?: 'solid' | 'outline' | 'ghost';
    size?: ButtonSize;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right' | 'top' | 'bottom';
}
declare const Button: React.FC<ButtonProps>;
export default Button;
