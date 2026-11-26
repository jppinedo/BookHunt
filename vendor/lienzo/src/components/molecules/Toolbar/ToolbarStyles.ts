const getItemBorder = (index: number) =>
  index === 0 ? '' : 'border-l border-gray-300 dark:border-gray-700';

// Class names are the Tailwind v4 equivalents of the v3 radii for each public prop value.
const toolbarRoundedClass: Record<string, string> = {
  default: 'rounded-sm',
  sm: 'rounded-xs',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const toolbarStyles = (rounded?: string) => {
  const roundedStyle = !rounded || rounded === 'none' ? '' : (toolbarRoundedClass[rounded] ?? '');
  const shadow = 'shadow-xs dark:shadow-none dark:border dark:border-gray-700';

  const baseStyles = {
    itemBorder: getItemBorder,
    /** Outer shell: overflow visible so portaled menus are not required for stacking context alone. */
    toolbar: [
      'toolbar',
      'relative',
      'max-w-full',
      'min-w-0',
      'bg-white',
      'dark:bg-gray-900',
      'px-1',
      roundedStyle,
      shadow,
    ]
      .filter(Boolean)
      .join(' '),
    /** Inner scroller: horizontal overflow only; menus must not be descendants of this node. */
    toolbarScroll: [
      'toolbar__scroll',
      'flex',
      'flex-nowrap',
      'max-w-full',
      'min-w-0',
      'overflow-x-auto',
      'list-none',
      'm-0',
      'p-0',
    ].join(' '),
  };

  return baseStyles;
};

export const toolbarItemStyles = (menuPosition: 'top' | 'bottom') => {
  const paddingY = menuPosition === 'top' ? 'pb-2' : 'pt-2';

  const styles = {
    toolbarItem: 'text-gray-700 dark:text-blue-200 cursor-pointer shrink-0',
    menuIcon: 'ml-1 shrink-0',
    menuContainer: [
      'fixed',
      'z-50',
      'inline-block',
      'outline-hidden',
      paddingY,
    ].join(' '),
    itemContainer:
      'toolbar__item-inner py-2 px-1 flex items-center whitespace-nowrap',
  };

  return styles;
};
