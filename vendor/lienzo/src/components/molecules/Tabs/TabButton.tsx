import React from "react";
import {
  tabButtonClass,
  tabItemClass,
  tabUnderlineBar,
  TabsVariant,
} from './TabsStyles';

export interface TabButton {
    id: string;
    label: React.ReactNode;
    active: boolean;
    onClick: (id: string) => void;
    variant?: TabsVariant;
}

const TabButton: React.FC<TabButton> = ({ id, label, active, onClick, variant = 'underline' }) => {

  return (
    <li role="presentation" key={id} className={tabItemClass[variant]}>
      <button
        type="button"
        role="tab"
        id={`tab-${id}`}
        aria-controls={`tabpanel-${id}`}
        aria-selected={active}
        className={tabButtonClass(variant, active)}
        onClick={() => onClick(id)}
      >
        {label}
      </button>
      {variant === 'underline' && (
        <div className={tabUnderlineBar(active)}></div>
      )}
    </li>
  )
}

export default TabButton;
