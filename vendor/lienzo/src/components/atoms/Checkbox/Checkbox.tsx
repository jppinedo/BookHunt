import React, { useState, useEffect } from 'react';
import { Check } from 'react-feather';
import {
  checkboxBase,
  checkboxSize,
  checkboxUnchecked,
  checkboxChecked,
  checkboxIcon,
  type CheckboxSize,
  type CheckboxType,
} from './CheckboxStyles';

export interface CheckboxProps {
  size?: CheckboxSize;
  /** Accent when checked. `default` uses gray; chromatic types use Pio accents. */
  type?: CheckboxType;
  onChange?: (checked: boolean) => void;
  isChecked?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  size = 'md',
  type = 'default',
  onChange,
  isChecked = false,
  className,
}) => {
  const [checked, setChecked] = useState(isChecked);

  const handleOnChange = () => {
    setChecked(!checked);
    onChange && onChange(!checked);
  };

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const stateClass = checked ? checkboxChecked[type] : checkboxUnchecked;
  const propClass = className || '';

  return (
    <div
      className={`${checkboxBase} ${stateClass} ${checkboxSize[size]} ${propClass}`}
      onClick={handleOnChange}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
    >
      {checked && <Check className={checkboxIcon[type]} />}
    </div>
  );
};

export default Checkbox;
