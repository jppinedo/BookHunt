import React from "react";
import { TabsVariant } from './TabsStyles';
export interface TabButton {
    id: string;
    label: React.ReactNode;
    active: boolean;
    onClick: (id: string) => void;
    variant?: TabsVariant;
}
declare const TabButton: React.FC<TabButton>;
export default TabButton;
