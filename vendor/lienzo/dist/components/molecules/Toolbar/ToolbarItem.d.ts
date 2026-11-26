import React from 'react';
import { MenuProps } from '../Menu/Menu';
export interface ToolbarItemType {
    item: string | React.ReactElement;
    menu?: MenuProps;
    onClick: () => void;
    id?: string;
}
export interface ToolabarItemProps {
    item: ToolbarItemType;
    open: boolean;
    setOpen: (status: boolean) => void;
    menuPosition?: 'top' | 'bottom';
    type?: 'button' | 'label';
}
declare const ToolbarItem: React.FC<ToolabarItemProps>;
export default ToolbarItem;
