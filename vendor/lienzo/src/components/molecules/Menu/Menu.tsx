import React, {useRef, useEffect} from 'react';
import Label, { LabelProps } from '../../atoms/Label/Label';
import { MenuStyles } from './MenuStyles';
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

const Menu: React.FC<MenuProps> = ({ 
  label, 
  items, 
  pointer, 
  separator = false,
  onClickOutside
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClickOutside?.();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickOutside]);

  return (
    <div ref={menuRef} className={`${MenuStyles.container} lz-menu-container ${pointer}`}>
      {label && (
        <div className={MenuStyles.label}>{label}</div>
      )}
      <ul className={`${MenuStyles.items} ${separator ? MenuStyles.itemsSeparator : ''}`}>
        {items.map((item, index) => (
          <li 
            key={index} 
            className={MenuStyles.item} 
            tabIndex={0} 
            role='menuitem' 
            onClick={item.onClick}
          >
            <Label {...item.label} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;