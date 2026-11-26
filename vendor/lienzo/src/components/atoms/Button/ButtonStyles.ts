export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const buttonStyles = {
  default: {
    solid: 'bg-gray-100 hover:bg-gray-opacity-30 text-gray-700',
    outline: 'text-gray-700 border-gray-300 border-2 bg-transparent hover:bg-gray-opacity-14 dark:text-blue-200',
    ghost: 'text-gray-700 bg-transparent hover:bg-gray-opacity-14 dark:text-blue-200',
  },
  green: {
    solid: 'bg-pio-teal-dark hover:bg-pio-teal-dark-hover text-white',
    outline: 'text-pio-teal-dark border-pio-teal-dark border-2 bg-transparent hover:bg-pio-teal-dark-opacity-14',
    ghost: 'text-pio-teal-dark bg-transparent hover:bg-pio-teal-dark-opacity-14',
  },
  yellow: {
    solid: 'bg-pio-amber hover:bg-pio-amber-hover text-pio-amber-dark',
    outline: 'text-pio-amber-dark border-pio-amber hover:bg-pio-amber-opacity-14 border-2 bg-transparent dark:text-pio-amber',
    ghost: 'text-pio-amber-dark bg-transparent hover:bg-pio-amber-opacity-14',
  },
  red: {
    solid: 'bg-pio-coral hover:bg-pio-coral-hover text-white',
    outline: 'text-pio-coral border-pio-coral border-2 bg-transparent hover:bg-pio-coral-opacity-14',
    ghost: 'text-pio-coral bg-transparent hover:bg-pio-coral-opacity-14',
  },
  mode: {
    default: 'flex items-center justify-center',
    tool: 'items-center flex flex-col',
  },
  size: {
    default: {
      xs: 'px-2 py-0.5 text-xs rounded-lg',
      sm: 'px-2.5 py-1 text-sm rounded-lg',
      md: 'px-3 py-1 text-sm rounded-xl',
      lg: 'px-4 py-1.5 text-base rounded-xl',
      xl: 'px-5 py-2 text-lg rounded-2xl',
    },
    tool: {
      xs: 'text-[10px] py-1 px-1.5 rounded-sm',
      sm: 'text-xs py-1.5 px-2 rounded-sm',
      md: 'text-xs py-2 px-3 rounded-md',
      lg: 'text-sm py-2.5 px-4 rounded-md',
      xl: 'text-base py-3 px-5 rounded-lg',
    },
  },
};

export const iconSizeByButtonSize: Record<
  'default' | 'tool',
  Record<ButtonSize, string>
> = {
  default: { xs: '14', sm: '16', md: '18', lg: '20', xl: '22' },
  tool: { xs: '20', sm: '24', md: '32', lg: '36', xl: '40' },
};

export const iconStyles = {
  default: {
    solid: 'text-gray-300',
    outline: 'text-gray-300',
    ghost: 'text-gray-300',
  },
  green: {
    solid: 'text-white',
    outline: 'text-pio-teal-dark',
    ghost: 'text-pio-teal-dark',
  },
  yellow: {
    solid: 'text-pio-amber-dark',
    outline: 'text-pio-amber-dark dark:text-pio-amber',
    ghost: 'text-pio-amber-dark dark:text-pio-amber',
  },
  red: {
    solid: 'text-white',
    outline: 'text-pio-coral',
    ghost: 'text-pio-coral',
  }
}
