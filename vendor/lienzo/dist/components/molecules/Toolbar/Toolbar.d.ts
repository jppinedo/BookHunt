import React from 'react';
import { ToolbarItemType } from './ToolbarItem';
import { RoundedSizes } from '../../../interfaces/sizes';
export interface ToolbarProps {
    items: ToolbarItemType[];
    menuPosition?: 'top' | 'bottom';
    type?: 'button' | 'label';
    rounded?: RoundedSizes;
}
declare const Toolbar: React.FC<ToolbarProps>;
export default Toolbar;
