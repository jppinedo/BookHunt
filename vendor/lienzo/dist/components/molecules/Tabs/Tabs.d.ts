import React from 'react';
import { TabsVariant } from './TabsStyles';
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
declare const TabSystem: React.FC<TabSystemProps>;
export default TabSystem;
