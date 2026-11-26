import React from 'react';
import { type CheckboxSize, type CheckboxType } from './CheckboxStyles';
export interface CheckboxProps {
    size?: CheckboxSize;
    /** Accent when checked. `default` uses gray; chromatic types use Pio accents. */
    type?: CheckboxType;
    onChange?: (checked: boolean) => void;
    isChecked?: boolean;
    className?: string;
}
declare const Checkbox: React.FC<CheckboxProps>;
export default Checkbox;
