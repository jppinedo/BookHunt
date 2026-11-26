export declare const toolbarStyles: (rounded?: string) => {
    itemBorder: (index: number) => "" | "border-l border-gray-300 dark:border-gray-700";
    /** Outer shell: overflow visible so portaled menus are not required for stacking context alone. */
    toolbar: string;
    /** Inner scroller: horizontal overflow only; menus must not be descendants of this node. */
    toolbarScroll: string;
};
export declare const toolbarItemStyles: (menuPosition: "top" | "bottom") => {
    toolbarItem: string;
    menuIcon: string;
    menuContainer: string;
    itemContainer: string;
};
