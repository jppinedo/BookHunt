export type TabsVariant = 'underline' | 'pills' | 'segmented';
export declare const tablistClass: Record<TabsVariant, string>;
export declare const tabItemClass: Record<TabsVariant, string>;
export declare const tabButtonClass: (variant: TabsVariant, active: boolean) => string;
export declare const tabUnderlineBar: (active: boolean) => string;
