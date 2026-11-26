import React, { cloneElement, useState } from 'react';
import { RoundedSizes } from '../../../interfaces/sizes';
import InputStyles, { inputRounded } from './InputStyles';

export interface InputProps {
  /** Visual variant (color family). For the HTML input type use `htmlType`. */
  type?: 'default' | 'red' | 'green';
  /**
   * The native input type: 'text' | 'email' | 'password' | 'search' | …
   * Added in the D1 DS fix — Input previously hardcoded type="text", which
   * forced consuming apps to hand-roll password fields whose padding and
   * box-sizing drifted from Input's, so mixed forms rendered fields at
   * visibly different heights.
   */
  htmlType?: string;
  fill?: 'solid' | 'outline' | 'ghost';
  rounded?: RoundedSizes;
  label?: string;
  placeholder?: string;
  icon?: React.ReactElement<{ size?: string | number }>;
  iconPosition?: 'left' | 'right';
  hint?: string;
  initialValue?: string;
  value?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({
  type = 'default',
  htmlType = 'text',
  fill = 'solid',
  rounded = 'lg',
  label,
  placeholder = 'Enter your text',
  icon,
  iconPosition = 'left',
  hint,
  initialValue,
  value: valueProp,
  id,
  name,
  disabled,
  readOnly,
  autoComplete,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(initialValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    onChange?.(event);
  };

  const variant = InputStyles[type][fill];
  const containerClasses = [
    InputStyles.container,
    inputRounded[rounded],
    variant.container,
    isFocused ? variant.focused : variant.unfocused,
  ].join(' ');

  const inputClasses = [InputStyles.input, variant.input].join(' ');

  const sizedIcon = icon && !icon.props.size
    ? cloneElement(icon, { size: 18 })
    : icon;

  const iconEl = sizedIcon && (
    <div className={variant.icon}>{sizedIcon}</div>
  );

  const field = (
    <>
      <div className={containerClasses}>
        {iconEl && iconPosition === 'left' && iconEl}
        <input
          className={inputClasses}
          type={htmlType}
          id={id}
          name={name}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
        />
        {iconEl && iconPosition === 'right' && iconEl}
      </div>
      {hint && <p className={`text-sm ${variant.hint}`}>{hint}</p>}
    </>
  );

  if (!label) {
    return <div className="input">{field}</div>;
  }

  return (
    <label className={`input ${InputStyles.label}`}>
      {label}
      {field}
    </label>
  );
};

export default Input;
