import React from 'react';
interface SelectOption {
    value: string;
    label: string;
}
interface SelectProps {
    options: SelectOption[];
    placeholder?: string;
}
declare const Select: React.FC<SelectProps>;
export default Select;
