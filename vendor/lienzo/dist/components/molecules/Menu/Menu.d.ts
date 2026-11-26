import React from 'react';
import { LabelProps } from '../../atoms/Label/Label';
import './Menu.css';
export interface MenuItem {
    label: LabelProps;
    onClick: () => void;
}
export interface MenuProps {
    label?: string;
    items: MenuItem[];
    pointer?: 'bottom' | 'top';
    separator?: boolean;
    onClickOutside?: () => void;
}
declare const Menu: React.FC<MenuProps>;
export default Menu;
