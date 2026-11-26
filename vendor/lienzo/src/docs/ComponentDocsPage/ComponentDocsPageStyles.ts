export const pageRoot = [
  'component-docs-page',
  /* Prevent Storybook Docs heading chrome (e.g. h2 underlines) from leaking in */
  'sb-unstyled',
  'w-full',
  'max-w-7xl',
  'mx-auto',
  'space-y-14',
].join(' ');

export const headerRoot = 'space-y-4';

export const breadcrumbNav = [
  'inline-flex',
  'items-center',
  'gap-2',
  'px-3.5',
  'py-1.5',
  'rounded-full',
  'bg-white',
  'border',
  'border-pio-grid',
  'shadow-xs',
  'text-xs',
  'font-medium',
  'font-jakarta',
  'text-pio-text-muted',
  'dark:bg-gray-800',
  'dark:border-gray-600',
  'dark:text-blue-200/80',
].join(' ');

export const breadcrumbSep = 'text-pio-stone opacity-60 dark:text-blue-200/50';

export const breadcrumbCurrent = 'text-pio-coral font-semibold';

export const titleRow = [
  'flex',
  'flex-wrap',
  'items-baseline',
  'gap-4',
  'pt-1',
].join(' ');

export const titleHero = [
  'm-0',
  'font-playfair',
  'font-bold',
  'tracking-tight',
  'text-pio-text',
  'text-4xl',
  'sm:text-5xl',
  'lg:text-6xl',
  'leading-tight',
  'dark:text-white',
].join(' ');

export const descriptionText = [
  'text-sm',
  'sm:text-base',
  'font-jakarta',
  'text-pio-text-muted',
  'leading-relaxed',
  'max-w-3xl',
  'dark:text-blue-200/80',
].join(' ');

export const overviewSection = [
  'border-t',
  'border-b',
  'border-pio-grid',
  'py-8',
  'sm:py-10',
  'dark:border-gray-600',
].join(' ');

export const overviewGrid = [
  'grid',
  'grid-cols-1',
  'lg:grid-cols-12',
  'gap-8',
  'lg:gap-12',
  'items-stretch',
].join(' ');

export const overviewLeft = [
  'lg:col-span-6',
  'lg:pr-10',
  'lg:border-r',
  'lg:border-pio-grid',
  'lg:h-full',
  'space-y-4',
  'dark:lg:border-gray-600',
].join(' ');

export const overviewRight = 'lg:col-span-6 lg:h-full space-y-4';

export const useCaseList = 'space-y-3.5 text-sm sm:text-base font-jakarta text-pio-text dark:text-blue-200';

export const useCaseItem = 'flex items-start gap-3';

export const useCaseIcon = [
  'mt-0.5',
  'shrink-0',
  'w-5',
  'h-5',
  'rounded-full',
  'bg-pio-coral-pale',
  'text-pio-coral',
  'flex',
  'items-center',
  'justify-center',
].join(' ');

export const useCaseIconAlt = [
  'mt-0.5',
  'shrink-0',
  'w-5',
  'h-5',
  'rounded-full',
  'bg-pio-teal-dark-opacity-14',
  'text-pio-teal-dark',
  'flex',
  'items-center',
  'justify-center',
].join(' ');

export const sectionBlock = 'space-y-6';

export const variationsHeader = [
  'flex',
  'flex-col',
  'sm:flex-row',
  'sm:items-end',
  'sm:justify-between',
  'gap-4',
].join(' ');

export const variationPanel = [
  'grid',
  'grid-cols-1',
  'lg:grid-cols-12',
  'gap-8',
  'items-start',
  'p-6',
  'sm:p-8',
  'lg:p-10',
].join(' ');

export const variationCanvas = [
  'component-docs-variation-canvas',
  'lg:col-span-7',
  'w-full',
  'min-w-0',
  'bg-pio-bg-light',
  'rounded-2xl',
  'p-4',
  'sm:p-5',
  'border',
  'border-pio-border-subtle',
  'overflow-hidden',
  'dark:bg-gray-900',
  'dark:border-gray-700',
].join(' ');

export const variationCopy = 'lg:col-span-5 space-y-4';

export const variationCopyFull = 'space-y-5 p-6 sm:p-8';

export const variationMetaList = 'space-y-0 pt-2 text-xs font-jakarta';

export const variationMetaRow = [
  'flex',
  'items-start',
  'justify-between',
  'gap-4',
  'py-2',
  'border-b',
  'border-pio-border-subtle',
  'last:border-b-0',
  'dark:border-gray-700',
].join(' ');

export const variationMetaLabel = 'text-pio-stone shrink-0 dark:text-blue-200/60';

export const variationMetaValue = {
  text: 'text-pio-text font-medium text-right dark:text-blue-200',
  code: 'font-jetbrains text-pio-text font-medium text-right dark:text-blue-200',
  prop: 'font-jetbrains text-pio-coral font-semibold text-right',
} as const;

export const propsCardHeader = [
  'p-6',
  'border-b',
  'border-pio-border-subtle',
  'flex',
  'flex-wrap',
  'items-center',
  'justify-between',
  'gap-3',
  'dark:border-gray-700',
].join(' ');

export const propsInterfaceChip = [
  'font-jetbrains',
  'text-xs',
  'text-pio-teal-dark',
  'bg-pio-teal-dark-opacity-14',
  'px-2.5',
  'py-1',
  'rounded-full',
  'font-semibold',
].join(' ');

export const propsTableWrap = 'overflow-x-auto';

export const propsTable = 'w-full text-left border-collapse';

export const propsTheadRow = [
  'bg-pio-bg-soft',
  'text-xs',
  'font-bold',
  'uppercase',
  'tracking-wider',
  'text-pio-stone',
  'border-b',
  'border-pio-grid',
  'dark:bg-gray-900',
  'dark:border-gray-600',
  'dark:text-blue-200/70',
].join(' ');

export const propsTh = 'py-3.5 px-6';

export const propsBody = 'divide-y divide-pio-border-subtle text-xs sm:text-sm dark:divide-gray-700';

export const propsTd = 'py-4 px-6';

export const propsName = 'font-jetbrains font-bold text-pio-coral';

export const propsType = 'font-jetbrains text-pio-teal-dark dark:text-pio-teal-dark-muted';

export const propsDefault = 'font-jetbrains text-pio-stone dark:text-blue-200/60';

export const propsDesc = 'font-jakarta text-pio-text-muted dark:text-blue-200/80';

export const usageGrid = 'grid grid-cols-1 md:grid-cols-2 gap-6';

export const usageList = 'space-y-2.5 text-sm font-jakarta text-pio-text-muted dark:text-blue-200/80';

export const usageItem = 'flex items-start gap-2.5';

export const usageDoIcon = [
  'mt-0.5',
  'shrink-0',
  'w-6',
  'h-6',
  'rounded-full',
  'bg-pio-teal-dark-opacity-14',
  'text-pio-teal-dark',
  'flex',
  'items-center',
  'justify-center',
].join(' ');

export const usageDontIcon = [
  'mt-0.5',
  'shrink-0',
  'w-6',
  'h-6',
  'rounded-full',
  'bg-pio-coral-pale',
  'text-pio-coral',
  'flex',
  'items-center',
  'justify-center',
].join(' ');

export const usageHeadingDo = [
  'flex',
  'items-center',
  'gap-2.5',
  'text-pio-teal-dark',
  'mb-3',
  'font-bold',
  'text-sm',
  'tracking-wide',
  'uppercase',
  'font-jakarta',
].join(' ');

export const usageHeadingDont = [
  'flex',
  'items-center',
  'gap-2.5',
  'text-pio-coral',
  'mb-3',
  'font-bold',
  'text-sm',
  'tracking-wide',
  'uppercase',
  'font-jakarta',
].join(' ');

export const bulletDo = 'text-pio-teal-dark font-bold mt-0.5';

export const bulletDont = 'text-pio-coral font-bold mt-0.5';
