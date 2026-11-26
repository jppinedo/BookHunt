import React, { useState } from 'react';
import TabButton from './TabButton';
import { tablistClass, TabsVariant } from './TabsStyles';

export type { TabsVariant };

export interface TabType {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

export interface TabSystemProps {
  activeTab?: string;
  tabs: TabType[];
  variant?: TabsVariant;
}

const TabSystem: React.FC<TabSystemProps> = ({
  activeTab,
  tabs,
  variant = 'underline',
}) => {
  const [active, setActive] = useState(activeTab || tabs[0].id);

  const handleActiveTab = (tabId: string) => {
    setActive(tabId);
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      <nav className="min-w-0 max-w-full">
        <ul role="tablist" className={tablistClass[variant]}>
          {tabs.map((tab: TabType) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              active={active === tab.id}
              onClick={handleActiveTab}
              variant={variant}
            />
          ))}
        </ul>
      </nav>
      {tabs.map((tab: TabType) => {
        if (active !== tab.id) return null;
        return (
          <div
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className="py-5"
            key={tab.id}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}

export default TabSystem;
