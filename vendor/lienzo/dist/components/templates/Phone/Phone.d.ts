import React from 'react';
export interface PhoneProps {
    children: React.ReactNode;
    className?: string;
    time?: string;
}
declare const Phone: React.FC<PhoneProps>;
export default Phone;
