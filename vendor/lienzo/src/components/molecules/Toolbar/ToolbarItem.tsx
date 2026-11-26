// ToolbarItem.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Menu, { MenuProps } from '../Menu/Menu';
import { ChevronDown } from 'react-feather';
import { toolbarItemStyles } from './ToolbarStyles';

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

const ToolbarItem: React.FC<ToolabarItemProps> = ({
  item,
  menuPosition = 'bottom',
  open,
  setOpen,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const styles = toolbarItemStyles(menuPosition);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const updateCoords = () => {
    const el = itemRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      top: menuPosition === 'bottom' ? rect.bottom : rect.top,
      left: rect.left + rect.width / 2,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateCoords();
  }, [open, menuPosition]);

  useEffect(() => {
    if (!open) return;

    const handleReposition = () => updateCoords();
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (itemRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('resize', handleReposition);
    // Capture scroll from nested overflow containers (e.g. toolbar scroller, docs).
    window.addEventListener('scroll', handleReposition, true);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, menuPosition, setOpen]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.menu) {
      setOpen(!open);
    }
    item.onClick();
  };

  const menuStyle: React.CSSProperties =
    menuPosition === 'bottom'
      ? { top: coords.top, left: coords.left, transform: 'translateX(-50%)' }
      : { top: coords.top, left: coords.left, transform: 'translate(-50%, -100%)' };

  return (
    <div className={styles.toolbarItem} onClick={handleClick}>
      <div className={styles.itemContainer} ref={itemRef}>
        {item.item}
        {item.menu && (
          <div className={styles.menuIcon}>
            <ChevronDown size={16} />
          </div>
        )}
      </div>
      {item.menu &&
        open &&
        createPortal(
          <div
            id="menu"
            className={styles.menuContainer}
            ref={menuRef}
            style={menuStyle}
          >
            <Menu
              {...item.menu}
              pointer={menuPosition === 'bottom' ? 'top' : 'bottom'}
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default ToolbarItem;
