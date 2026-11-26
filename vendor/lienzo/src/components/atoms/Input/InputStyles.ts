import { RoundedSizes } from '../../../interfaces/sizes';

export const inputRounded: Record<RoundedSizes, string> = {
  none: 'rounded-none',
  default: 'rounded-sm',
  sm: 'rounded-xs',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

const InputStyles = {
  default: {
    solid: {
      container: 'bg-gray-opacity-14 hover:bg-gray-opacity-20 border-2 px-3',
      // D1 accent unification: focus speaks in the single coral accent.
      focused: 'border-pio-coral',
      unfocused: 'border-transparent',
      icon: 'text-gray-300',
      hint: 'text-gray-300',
      input: 'placeholder:text-gray-300 text-gray-700 dark:text-blue-200',
    },
    outline: {
      container: 'bg-transparent border hover:bg-gray-opacity-14 px-3',
      focused: 'border-pio-coral',
      unfocused: 'border-gray-300',
      icon: 'text-gray-300',
      hint: 'text-gray-300',
      input: 'placeholder:text-gray-300 text-gray-700 dark:text-blue-200',
    },
    ghost: {
      container: 'bg-transparent hover:bg-gray-opacity-14 border-2 px-3',
      focused: 'border-pio-coral',
      unfocused: 'border-transparent',
      icon: 'text-gray-300',
      hint: 'text-gray-300',
      input: 'placeholder:text-gray-300 text-gray-700 dark:text-blue-200',
    },
  },
  red: {
    solid: {
      container: 'bg-pio-coral-opacity-14 hover:bg-pio-coral-opacity-20 border-2 px-2',
      focused: 'border-pio-coral',
      unfocused: 'border-transparent',
      icon: 'text-pio-coral-muted',
      hint: 'text-pio-coral-muted',
      input: 'placeholder:text-pio-coral-muted text-pio-coral-dark',
    },
    outline: {
      container: 'bg-transparent border hover:bg-pio-coral-opacity-14 px-3',
      focused: 'border-pio-coral',
      unfocused: 'border-pio-coral-muted',
      icon: 'text-pio-coral-muted',
      hint: 'text-pio-coral-muted',
      input: 'placeholder:text-pio-coral-muted text-pio-coral-dark',
    },
    ghost: {
      container: 'bg-transparent hover:bg-pio-coral-opacity-14 border-2 px-2',
      focused: 'border-pio-coral',
      unfocused: 'border-transparent',
      icon: 'text-pio-coral-muted',
      hint: 'text-pio-coral-muted',
      input: 'placeholder:text-pio-coral-muted text-pio-coral-dark',
    },
  },
  green: {
    solid: {
      container: 'bg-pio-teal-dark-opacity-14 hover:bg-pio-teal-dark-opacity-20 border-2 px-2',
      focused: 'border-pio-teal-dark',
      unfocused: 'border-transparent',
      icon: 'text-pio-teal-dark-muted',
      hint: 'text-pio-teal-dark-muted',
      input: 'placeholder:text-pio-teal-dark-muted text-pio-teal-dark',
    },
    outline: {
      container: 'bg-transparent border hover:bg-pio-teal-dark-opacity-14 px-3',
      focused: 'border-pio-teal-dark',
      unfocused: 'border-pio-teal-dark-muted',
      icon: 'text-pio-teal-dark-muted',
      hint: 'text-pio-teal-dark-muted',
      input: 'placeholder:text-pio-teal-dark-muted text-pio-teal-dark',
    },
    ghost: {
      container: 'bg-transparent hover:bg-pio-teal-dark-opacity-14 border-2 px-2',
      focused: 'border-pio-teal-dark',
      unfocused: 'border-transparent',
      icon: 'text-pio-teal-dark-muted',
      hint: 'text-pio-teal-dark-muted',
      input: 'placeholder:text-pio-teal-dark-muted text-pio-teal-dark',
    },
  },
  label: 'text-gray-700 dark:text-blue-200 font-jakarta text-sm font-medium',
  // D1 DS fix: one fixed 48px field height for every variant/fill, so a
  // form mixing text, email and password fields lines up exactly. The
  // height lives on the container; the input fills it (h-full, no
  // vertical padding of its own) in the app UI font at 15px.
  container: 'input-group flex items-center gap-2 h-12 min-h-12 box-border w-full',
  input: 'grow bg-transparent h-full outline-hidden min-w-0 font-jakarta text-[15px]',
};

export default InputStyles;
