import React from 'react';
import { boxShadow } from './BoxStyles';
export interface BoxProps {
    children: React.ReactNode;
    className?: string;
    type?: 'glass' | 'default';
    header?: React.ReactNode;
    footer?: React.ReactNode;
    headerOutside?: boolean;
    shadow?: keyof typeof boxShadow;
}
declare const Box: React.FC<BoxProps>;
export default Box;
