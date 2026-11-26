export const livePreviewRoot = 'live-preview space-y-4';

export const livePreviewHeader = [
  'flex',
  'flex-col',
  'gap-2',
  'sm:flex-row',
  'sm:items-center',
  'sm:justify-between',
].join(' ');

export const livePreviewHeaderLead = 'flex flex-wrap items-center gap-3';

export const livePreviewHelper = [
  'text-xs',
  'font-jakarta',
  'text-pio-stone',
  'dark:text-blue-200/80',
].join(' ');

export const livePreviewGrid = [
  'live-preview__grid',
  'grid',
  'grid-cols-1',
  'lg:grid-cols-12',
  'items-stretch',
].join(' ');

/** Controls column — first in DOM so it stacks above Canvas on mobile.
 * Padding (`p-6 sm:p-7`); title + Controls share this inset. */
export const livePreviewControls = [
  'live-preview__controls',
  'lg:col-span-3',
  'min-w-0',
  'lg:h-full',
  'p-6',
  'sm:p-7',
  'border-b',
  'lg:border-b-0',
  'lg:border-r',
  'border-pio-grid',
  'bg-pio-bg-soft',
  'flex',
  'flex-col',
  'gap-6',
  'overflow-hidden',
  'dark:border-gray-600',
  'dark:bg-gray-900',
].join(' ');

export const livePreviewControlsEyebrow = [
  'flex',
  'items-center',
  'justify-between',
  'pb-3',
  'border-b',
  'border-pio-grid',
  'dark:border-gray-700',
].join(' ');

export const livePreviewControlsLabel = [
  'text-xs',
  'uppercase',
  'tracking-wider',
  'font-bold',
  'font-jakarta',
  'text-pio-stone',
  'dark:text-blue-200/80',
].join(' ');

/** Preview column — single padded surface; story content is vertically centered. */
export const livePreviewCanvas = [
  'live-preview__canvas',
  'lg:col-span-9',
  'min-w-0',
  'lg:h-full',
  'p-6',
  'sm:p-8',
  'flex',
  'flex-col',
  'justify-center',
  'gap-4',
  'bg-white',
  'relative',
  'dark:bg-gray-800',
].join(' ');

export const livePreviewCaption = [
  'pt-4',
  'mt-4',
  'border-t',
  'border-pio-border-subtle',
  'flex',
  'flex-wrap',
  'items-center',
  'gap-2',
  'text-xs',
  'font-jakarta',
  'text-pio-stone',
  'dark:border-gray-700',
  'dark:text-blue-200/80',
].join(' ');
