import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Moon,
  Sun,
} from 'react-feather';
import Button from '@atoms/Button/Button';
import Card from '@atoms/Card/Card';
import Checkbox from '@atoms/Checkbox/Checkbox';
import Input from '@atoms/Input/Input';
import Label from '@atoms/Label/Label';
import Switch from '@atoms/Switch/Switch';
import Title from '@atoms/Title/Title';
import {
  bodyMuted,
  demoGrid,
  demoNote,
  docsLinkRow,
  docsLinkWrap,
  elevationGrid,
  elevationTile,
  familyBlock,
  familyDesc,
  familyHeader,
  familyName,
  footerCode,
  footerNote,
  footerRow,
  gradientBanner,
  gradientCard,
  gradientCardDark,
  gradientGrid,
  headerCopy,
  headerRow,
  sectionInner,
  sectionRoot,
  sectionSubtitle,
  sectionTitle,
  specimenCard,
  specimenWatermark,
  swatchCard,
  swatchColor,
  swatchCopyChip,
  swatchGrid,
  swatchGridFour,
  swatchHex,
  swatchLabel,
  swatchMeta,
  swatchToken,
  toastRoot,
  typeBentoGrid,
  typePill,
} from './WelcomeFoundationsStyles';
import './WelcomeFoundations.css';

export const WELCOME_FOUNDATIONS_ID = 'welcome-foundations';

export interface WelcomeFoundationsProps {
  /** Reflects Storybook global theme (`dark` when true). */
  isDark?: boolean;
  /** Story wrappers should call `updateGlobals({ theme })` here. */
  onThemeChange?: (active: boolean) => void;
  /** Opens Button Docs (stories use `linkTo`). */
  onOpenButtonDocs?: () => void;
  /** Opens Switch Docs (stories use `linkTo`). */
  onOpenSwitchDocs?: () => void;
  /** Opens Checkbox Docs (stories use `linkTo`). */
  onOpenCheckboxDocs?: () => void;
  /** Opens Title Docs (stories use `linkTo`). */
  onOpenTitleDocs?: () => void;
  /** Opens CodeBlock Docs (stories use `linkTo`). */
  onOpenCodeBlockDocs?: () => void;
}

type ComponentType = 'default' | 'red' | 'green' | 'yellow';

type Swatch = {
  label: string;
  token: string;
  hex: string;
  bgClass: string;
  tokenClass?: string;
  opacity?: boolean;
};

type ColorFamily = {
  name: string;
  badge: string;
  badgeClass: string;
  description: string;
  cols?: 4 | 5;
  swatches: Swatch[];
};

const COPY_RESET_MS = 2200;

const COLOR_FAMILIES: ColorFamily[] = [
  {
    name: 'Coral',
    badge: 'type="red"',
    badgeClass: 'bg-pio-coral/10 text-pio-coral border-pio-coral/20',
    description: 'Errors, destructive actions, and high-intent calls to action',
    swatches: [
      { label: 'Base', token: 'pio-coral', hex: '#E05A5A', bgClass: 'bg-pio-coral', tokenClass: 'text-pio-coral' },
      { label: 'Hover', token: 'pio-coral-hover', hex: '#E87676', bgClass: 'bg-pio-coral-hover', tokenClass: 'text-pio-coral' },
      { label: 'Dark', token: 'pio-coral-dark', hex: '#B03434', bgClass: 'bg-pio-coral-dark', tokenClass: 'text-pio-coral' },
      { label: 'Muted', token: 'pio-coral-muted', hex: '#C47878', bgClass: 'bg-pio-coral-muted', tokenClass: 'text-pio-coral' },
      { label: 'Pale', token: 'pio-coral-pale', hex: '#FCE4E2', bgClass: 'bg-pio-coral-pale', tokenClass: 'text-pio-coral' },
      {
        label: '14%',
        token: 'pio-coral-opacity-14',
        hex: 'rgba(224,90,90,0.14)',
        bgClass: 'bg-pio-coral-opacity-14',
        tokenClass: 'text-pio-coral',
        opacity: true,
      },
      {
        label: '20%',
        token: 'pio-coral-opacity-20',
        hex: 'rgba(224,90,90,0.20)',
        bgClass: 'bg-pio-coral-opacity-20',
        tokenClass: 'text-pio-coral',
        opacity: true,
      },
    ],
  },
  {
    name: 'Teal',
    badge: 'type="green"',
    badgeClass:
      'bg-pio-teal-dark/10 text-pio-teal-dark dark:text-pio-teal-dark-pale border-pio-teal-dark/20',
    description: 'Success, positive feedback, and selected states',
    swatches: [
      { label: 'Base', token: 'pio-teal-dark', hex: '#2B665D', bgClass: 'bg-pio-teal-dark', tokenClass: 'text-pio-teal-dark dark:text-pio-teal-dark-pale' },
      { label: 'Hover', token: 'pio-teal-dark-hover', hex: '#3A7A70', bgClass: 'bg-pio-teal-dark-hover', tokenClass: 'text-pio-teal-dark dark:text-pio-teal-dark-pale' },
      { label: 'Muted', token: 'pio-teal-dark-muted', hex: '#5C8C84', bgClass: 'bg-pio-teal-dark-muted', tokenClass: 'text-pio-teal-dark dark:text-pio-teal-dark-pale' },
      { label: 'Pale', token: 'pio-teal-dark-pale', hex: '#D6E8E2', bgClass: 'bg-pio-teal-dark-pale', tokenClass: 'text-pio-teal-dark dark:text-pio-teal-dark-pale' },
      { label: 'Dark', token: 'pio-teal-black', hex: '#131B26', bgClass: 'bg-pio-teal-black', tokenClass: 'text-pio-teal-dark dark:text-pio-teal-dark-pale' },
      {
        label: '14%',
        token: 'pio-teal-dark-opacity-14',
        hex: 'rgba(43,102,93,0.14)',
        bgClass: 'bg-pio-teal-dark-opacity-14',
        tokenClass: 'text-pio-teal-dark dark:text-pio-teal-dark-pale',
        opacity: true,
      },
      {
        label: '20%',
        token: 'pio-teal-dark-opacity-20',
        hex: 'rgba(43,102,93,0.20)',
        bgClass: 'bg-pio-teal-dark-opacity-20',
        tokenClass: 'text-pio-teal-dark dark:text-pio-teal-dark-pale',
        opacity: true,
      },
    ],
  },
  {
    name: 'Amber',
    badge: 'type="yellow"',
    badgeClass: 'bg-pio-amber/15 text-pio-amber-dark dark:text-pio-amber border-pio-amber/30',
    description: 'Warnings, highlights, and attention cues',
    swatches: [
      { label: 'Base', token: 'pio-amber', hex: '#F4A460', bgClass: 'bg-pio-amber', tokenClass: 'text-pio-amber-dark dark:text-pio-amber' },
      { label: 'Hover', token: 'pio-amber-hover', hex: '#FAB876', bgClass: 'bg-pio-amber-hover', tokenClass: 'text-pio-amber-dark dark:text-pio-amber' },
      { label: 'Dark', token: 'pio-amber-dark', hex: '#9C5828', bgClass: 'bg-pio-amber-dark', tokenClass: 'text-pio-amber-dark dark:text-pio-amber' },
      { label: 'Muted', token: 'pio-amber-muted', hex: '#C89464', bgClass: 'bg-pio-amber-muted', tokenClass: 'text-pio-amber-dark dark:text-pio-amber' },
      { label: 'Pale', token: 'pio-amber-pale', hex: '#FCF0DC', bgClass: 'bg-pio-amber-pale', tokenClass: 'text-pio-amber-dark dark:text-pio-amber' },
      {
        label: '14%',
        token: 'pio-amber-opacity-14',
        hex: 'rgba(244,164,96,0.14)',
        bgClass: 'bg-pio-amber-opacity-14',
        tokenClass: 'text-pio-amber-dark dark:text-pio-amber',
        opacity: true,
      },
      {
        label: '20%',
        token: 'pio-amber-opacity-20',
        hex: 'rgba(244,164,96,0.20)',
        bgClass: 'bg-pio-amber-opacity-20',
        tokenClass: 'text-pio-amber-dark dark:text-pio-amber',
        opacity: true,
      },
    ],
  },
  {
    name: 'Stone',
    badge: 'charts',
    badgeClass: 'bg-pio-stone/10 text-pio-stone border-pio-stone/20',
    description: 'Data accents and chart series',
    swatches: [
      { label: 'Base', token: 'pio-stone', hex: '#6D4C41', bgClass: 'bg-pio-stone', tokenClass: 'text-pio-stone' },
      { label: 'Dark', token: 'pio-stone-dark', hex: '#52362E', bgClass: 'bg-pio-stone-dark', tokenClass: 'text-pio-stone' },
      { label: 'Pale', token: 'pio-stone-pale', hex: '#E6DCD6', bgClass: 'bg-pio-stone-pale', tokenClass: 'text-pio-stone' },
      {
        label: '14%',
        token: 'pio-stone-opacity-14',
        hex: 'rgba(109,76,65,0.14)',
        bgClass: 'bg-pio-stone-opacity-14',
        tokenClass: 'text-pio-stone',
        opacity: true,
      },
    ],
  },
  {
    name: 'Neutral grays',
    badge: 'type="default"',
    badgeClass: 'bg-gray-600/10 text-gray-700 dark:text-gray-300 border-gray-600/20',
    description: 'Chrome, secondary actions, and structural UI',
    swatches: [
      { label: '100', token: 'gray-100', hex: '#CDD9D7', bgClass: 'bg-gray-100', tokenClass: 'text-pio-text-muted' },
      { label: '300', token: 'gray-300', hex: '#969CA2', bgClass: 'bg-gray-300', tokenClass: 'text-pio-text-muted' },
      { label: '600', token: 'gray-600', hex: '#515365', bgClass: 'bg-gray-600', tokenClass: 'text-pio-text-muted' },
      { label: '700', token: 'gray-700', hex: '#343540', bgClass: 'bg-gray-700', tokenClass: 'text-pio-text-muted' },
      { label: '800', token: 'gray-800', hex: '#232433', bgClass: 'bg-gray-800', tokenClass: 'text-pio-text-muted' },
      { label: '900', token: 'gray-900', hex: '#1D1E2B', bgClass: 'bg-gray-900', tokenClass: 'text-pio-text-muted' },
      { label: 'White', token: 'white', hex: '#FFFFFF', bgClass: 'bg-white border-b border-pio-border-subtle', tokenClass: 'text-pio-text-muted' },
      { label: 'Black', token: 'black', hex: '#111111', bgClass: 'bg-black', tokenClass: 'text-pio-text-muted' },
    ],
  },
  {
    name: 'Surfaces & canvas',
    badge: 'surfaces',
    badgeClass: 'bg-pio-bg-light text-pio-text-muted border-pio-grid',
    description: 'Page canvases and soft panel fills',
    swatches: [
      { label: 'Canvas', token: 'pio-bg', hex: '#FAF8F5', bgClass: 'bg-pio-bg', tokenClass: 'text-pio-text-muted' },
      { label: 'Light', token: 'pio-bg-light', hex: '#F5F2EC', bgClass: 'bg-pio-bg-light', tokenClass: 'text-pio-text-muted' },
      { label: 'Soft', token: 'pio-bg-soft', hex: '#FDFCFA', bgClass: 'bg-pio-bg-soft', tokenClass: 'text-pio-text-muted' },
      { label: 'Light canvas', token: 'light-canvas', hex: '#FAFAF9', bgClass: 'bg-light-canvas', tokenClass: 'text-pio-text-muted' },
      { label: 'Dark canvas', token: 'dark-canvas', hex: '#16161A', bgClass: 'bg-dark-canvas', tokenClass: 'text-pio-text-muted' },
    ],
  },
  {
    name: 'Text & lines',
    badge: 'structure',
    badgeClass: 'bg-pio-text/10 text-pio-text dark:text-gray-300 border-pio-text/20',
    description: 'Copy, captions, borders, and dividers',
    cols: 4,
    swatches: [
      { label: 'Text', token: 'pio-text', hex: '#2D2D2F', bgClass: 'bg-pio-text', tokenClass: 'text-pio-text-muted' },
      { label: 'Muted', token: 'pio-text-muted', hex: '#6B7280', bgClass: 'bg-pio-text-muted', tokenClass: 'text-pio-text-muted' },
      { label: 'Grid / Border', token: 'pio-grid', hex: '#E5E0D8', bgClass: 'bg-pio-grid', tokenClass: 'text-pio-text-muted' },
      { label: 'Subtle Border', token: 'pio-border-subtle', hex: '#F2EFEB', bgClass: 'bg-pio-border-subtle', tokenClass: 'text-pio-text-muted' },
    ],
  },
];

const TYPE_DEMOS: {
  type: ComponentType;
  family: string;
  pillClass: string;
  statusLabel: string;
  statusIcon: React.ReactElement;
  note?: string;
}[] = [
  {
    type: 'red',
    family: 'Coral Family',
    pillClass: 'bg-pio-coral/10 text-pio-coral border-pio-coral/20',
    statusLabel: 'Error',
    statusIcon: <AlertCircle size={14} />,
  },
  {
    type: 'green',
    family: 'Teal Family',
    pillClass:
      'bg-pio-teal-dark/10 text-pio-teal-dark dark:text-pio-teal-dark-pale border-pio-teal-dark/20',
    statusLabel: 'Saved',
    statusIcon: <CheckCircle size={14} />,
  },
  {
    type: 'yellow',
    family: 'Amber Family',
    pillClass: 'bg-pio-amber/15 text-pio-amber-dark dark:text-pio-amber border-pio-amber/30',
    statusLabel: 'Pending',
    statusIcon: <Clock size={14} />,
    note: 'Neutral fallback state for warnings',
  },
  {
    type: 'default',
    family: 'Grays Family',
    pillClass: 'bg-gray-600/10 text-gray-700 dark:text-gray-300 border-gray-600/20',
    statusLabel: 'Draft',
    statusIcon: <FileText size={14} />,
    note: 'Neutral chrome & secondary action',
  },
];

const TITLE_SIZES = [
  { size: 'xxxxl' as const, px: '72px' },
  { size: 'xxxl' as const, px: '48px' },
  { size: 'xxl' as const, px: '30px' },
  { size: 'xl' as const, px: '24px' },
  { size: 'lg' as const, px: '20px' },
  { size: 'md' as const, px: '18px' },
  { size: 'sm' as const, px: '16px' },
];

const GRADIENTS: {
  name: string;
  subtitle: string;
  gradient: 'amber-dawn' | 'studio-teal' | 'charcoal-depth' | 'coral-ember' | 'teal-mist' | 'deep-coral';
  dots: string[];
  propClass: string;
  darkCard?: boolean;
}[] = [
  {
    name: 'Amber Dawn',
    subtitle: 'Warm Multi-stop',
    gradient: 'amber-dawn',
    dots: ['#8CC8BA', '#F5F5EB', '#F8B67A', '#F99280', '#E4ECE0'],
    propClass: 'text-gray-300',
    darkCard: true,
  },
  {
    name: 'Studio Teal',
    subtitle: 'Atmospheric',
    gradient: 'studio-teal',
    dots: ['#628E88', '#3A7D76', '#2F6D68'],
    propClass: 'text-pio-teal-dark dark:text-pio-teal-dark-pale',
  },
  {
    name: 'Charcoal Depth',
    subtitle: 'Deep Structured',
    gradient: 'charcoal-depth',
    dots: ['#1F2421', '#30312F', '#296863'],
    propClass: 'text-gray-700 dark:text-gray-300',
  },
  {
    name: 'Coral Ember',
    subtitle: 'Vibrant Warmth',
    gradient: 'coral-ember',
    dots: ['#E05A5A', '#C87840'],
    propClass: 'text-pio-coral',
  },
  {
    name: 'Teal Mist',
    subtitle: 'Soft Contrast',
    gradient: 'teal-mist',
    dots: ['#3A7A70', '#5C8C84'],
    propClass: 'text-pio-teal-dark dark:text-pio-teal-dark-pale',
  },
  {
    name: 'Deep Coral',
    subtitle: 'Intense Statement',
    gradient: 'deep-coral',
    dots: ['#B03434', '#E87676'],
    propClass: 'text-pio-coral-dark dark:text-pio-coral',
  },
];

const ELEVATION = [
  { shadow: 'shadow-pio-soft', label: 'shadow-pio-soft', hint: 'Subtle lift', labelClass: '' },
  { shadow: 'shadow-pio-card', label: 'shadow-pio-card', hint: 'Default container', labelClass: '' },
  { shadow: 'shadow-pio-float', label: 'shadow-pio-float', hint: 'Hover & modals', labelClass: '' },
  {
    shadow: 'shadow-pio-glow-coral',
    label: 'shadow-pio-glow-coral',
    hint: 'High intent',
    labelClass: 'text-pio-coral',
  },
  {
    shadow: 'shadow-pio-glow-teal',
    label: 'shadow-pio-glow-teal',
    hint: 'Positive glow',
    labelClass: 'text-pio-teal-dark dark:text-pio-teal-dark-pale',
  },
];

const noop = (): void => undefined;

const SwatchButton: React.FC<{
  swatch: Swatch;
  onCopy: (token: string) => void;
}> = ({ swatch, onCopy }) => (
  <button
    type="button"
    className={swatchCard}
    onClick={() => onCopy(swatch.token)}
    aria-label={`Copy token ${swatch.token}`}
  >
    <div
      className={`${swatchColor} ${swatch.opacity ? 'lz-foundations-checkerboard' : ''}`}
    >
      <div className={`absolute inset-0 ${swatch.bgClass}`} />
      <span className={swatchCopyChip}>Copy</span>
    </div>
    <div className={swatchMeta}>
      <div className="flex justify-between items-baseline mb-1 gap-2">
        <span className={swatchLabel}>{swatch.label}</span>
        <span className={swatchHex}>{swatch.hex}</span>
      </div>
      <span className={`${swatchToken} ${swatch.tokenClass || 'text-pio-text-muted'}`}>
        {swatch.token}
      </span>
    </div>
  </button>
);

const TypeDemoCard: React.FC<(typeof TYPE_DEMOS)[number]> = ({
  type,
  family,
  pillClass,
  statusLabel,
  statusIcon,
  note,
}) => {
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(true);
  const inputType = type === 'red' || type === 'green' ? type : 'default';

  return (
    <Card shadow="card" radius="3xl" surface="white" className="rounded-[24px]! flex flex-col justify-between">
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-pio-border-subtle dark:border-gray-800">
          <span className={`${typePill} ${pillClass}`}>{`type="${type}"`}</span>
          <span className="text-xs text-pio-text-muted font-jakarta">{family}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button label="Solid" type={type} fill="solid" size="sm" onClick={noop} />
          <Button label="Outline" type={type} fill="outline" size="sm" onClick={noop} />
          <Button label="Ghost" type={type} fill="ghost" size="sm" onClick={noop} />
        </div>
        <div>
          <Label text={statusLabel} type={type} icon={statusIcon} />
        </div>
        <div className="flex items-center gap-6 pt-1">
          <Switch type={type} size="md" isActive={switchOn} onChange={setSwitchOn} />
          <label className="flex items-center gap-2 text-xs font-medium text-pio-text dark:text-blue-200 cursor-pointer">
            <Checkbox type={type} isChecked={checked} onChange={setChecked} />
            <span>Checked</span>
          </label>
        </div>
      </div>
      <div className="pt-2 space-y-2">
        {note && <div className={demoNote}>{note}</div>}
        <Input type={inputType} fill="solid" placeholder="Enter text" rounded="lg" />
      </div>
    </Card>
  );
};

const WelcomeFoundations: React.FC<WelcomeFoundationsProps> = ({
  isDark = false,
  onThemeChange,
  onOpenButtonDocs,
  onOpenSwitchDocs,
  onOpenCheckboxDocs,
  onOpenTitleDocs,
  onOpenCodeBlockDocs,
}) => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setToastVisible(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => {
        setToastVisible(false);
      }, COPY_RESET_MS);
    } catch {
      setCopiedToken(null);
      setToastVisible(false);
    }
  };

  return (
    <section
      id={WELCOME_FOUNDATIONS_ID}
      className={sectionRoot}
      data-purpose="welcome-foundations"
      aria-label="Colors and typography"
    >
      <div className={sectionInner}>
        {/* Header */}
        <div className={headerRow}>
          <div className={headerCopy}>
            <Title
              size="sm"
              fontFamily="jakarta"
              thikness="bold"
              uppercase
              dot
              dotTone="coral"
              color="coral"
              className="text-[11px]! tracking-[0.08em]!"
            >
              Foundations
            </Title>
            <Title
              size="xxxl"
              fontFamily="playfair"
              thikness="bold"
              className="text-3xl! sm:text-4xl! lg:text-[40px]! leading-tight! lg:leading-[48px]!"
            >
              Every color has a job.
            </Title>
            <p className={bodyMuted}>
              Lienzo&apos;s palette is a set of warm pigments, and each family maps straight to a
              component type: coral for red, teal for green, amber for yellow, gray for default.
              Every token is a CSS variable, so Tailwind classes and plain CSS always match.
            </p>
          </div>
          <Switch
            size="md"
            isActive={isDark}
            onChange={(active) => onThemeChange?.(active)}
            offLabel="Light"
            onLabel="Dark"
            offIcon={<Sun strokeWidth={2} className="text-pio-amber" />}
            onIcon={<Moon strokeWidth={2} />}
          />
        </div>

        {/* Color families */}
        <div className="space-y-12">
          {COLOR_FAMILIES.map((family) => (
            <div key={family.name} className={familyBlock}>
              <div className={familyHeader}>
                <div className="flex items-center gap-3">
                  <h3 className={familyName}>{family.name}</h3>
                  <span className={`${typePill} ${family.badgeClass}`}>{family.badge}</span>
                </div>
                <p className={familyDesc}>{family.description}</p>
              </div>
              <div className={family.cols === 4 ? swatchGridFour : swatchGrid}>
                {family.swatches.map((swatch) => (
                  <SwatchButton key={swatch.token} swatch={swatch} onCopy={handleCopy} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Same tokens, in action */}
        <div className="space-y-6 pt-4">
          <div className="space-y-1">
            <h3 className={sectionTitle}>Same tokens, in action</h3>
            <p className={sectionSubtitle}>Change one prop and the whole component follows.</p>
          </div>
          <div className={demoGrid}>
            {TYPE_DEMOS.map((demo) => (
              <TypeDemoCard key={demo.type} {...demo} />
            ))}
          </div>
          <div className={docsLinkRow}>
            <div className={docsLinkWrap}>
              <Button
                label="Button docs"
                type="default"
                fill="ghost"
                size="sm"
                icon={<ExternalLink strokeWidth={2} />}
                iconPosition="right"
                onClick={() => onOpenButtonDocs?.()}
              />
            </div>
            <div className={docsLinkWrap}>
              <Button
                label="Switch docs"
                type="default"
                fill="ghost"
                size="sm"
                icon={<ExternalLink strokeWidth={2} />}
                iconPosition="right"
                onClick={() => onOpenSwitchDocs?.()}
              />
            </div>
            <div className={docsLinkWrap}>
              <Button
                label="Checkbox docs"
                type="default"
                fill="ghost"
                size="sm"
                icon={<ExternalLink strokeWidth={2} />}
                iconPosition="right"
                onClick={() => onOpenCheckboxDocs?.()}
              />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-6 pt-6">
          <div className="space-y-1">
            <h3 className={sectionTitle}>Two voices, one system.</h3>
            <p className={sectionSubtitle}>
              A literary serif for moments that matter, and a crisp sans for everything you click.
            </p>
          </div>
          <div className={typeBentoGrid}>
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={specimenCard}>
                  <div className="flex justify-between items-start">
                    <span className="font-jakarta text-xs font-semibold uppercase tracking-wider text-pio-coral">
                      Display
                    </span>
                    <span className="font-jakarta text-xs text-pio-text-muted dark:text-blue-200/60 font-medium">
                      Playfair Display
                    </span>
                  </div>
                  <div className={`${specimenWatermark} font-playfair`} aria-hidden>
                    Aa
                  </div>
                  <div className="space-y-1 z-10 pt-8">
                    <p className="font-jakarta text-xs text-pio-text-muted dark:text-blue-200/70 m-0">
                      Headings and editorial moments
                    </p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-jakarta text-pio-text dark:text-white font-medium">
                        500 600 700 Italic
                      </span>
                      <span className="font-jetbrains text-pio-coral">font-playfair</span>
                    </div>
                  </div>
                </div>
                <div className={specimenCard}>
                  <div className="flex justify-between items-start">
                    <span className="font-jakarta text-xs font-semibold uppercase tracking-wider text-pio-teal-dark dark:text-pio-teal-dark-pale">
                      Interface
                    </span>
                    <span className="font-jakarta text-xs text-pio-text-muted dark:text-blue-200/60 font-medium">
                      Plus Jakarta Sans
                    </span>
                  </div>
                  <div className={`${specimenWatermark} font-jakarta font-semibold`} aria-hidden>
                    Aa
                  </div>
                  <div className="space-y-1 z-10 pt-8">
                    <p className="font-jakarta text-xs text-pio-text-muted dark:text-blue-200/70 m-0">
                      Body, labels, buttons, inputs
                    </p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-jakarta text-pio-text dark:text-white font-medium">
                        400 500 600 700
                      </span>
                      <span className="font-jetbrains text-pio-teal-dark dark:text-pio-teal-dark-pale">
                        font-jakarta
                      </span>
                    </div>
                  </div>
                </div>
                <div className={specimenCard}>
                  <div className="flex justify-between items-start">
                    <span className="font-jakarta text-xs font-semibold uppercase tracking-wider text-pio-amber-dark dark:text-pio-amber">
                      Code
                    </span>
                    <span className="font-jakarta text-xs text-pio-text-muted dark:text-blue-200/60 font-medium">
                      JetBrains Mono
                    </span>
                  </div>
                  <div
                    className={`${specimenWatermark} font-jetbrains font-normal text-[130px]!`}
                    aria-hidden
                  >
                    {'{ }'}
                  </div>
                  <div className="space-y-1 z-10 pt-8">
                    <p className="font-jakarta text-xs text-pio-text-muted dark:text-blue-200/70 m-0">
                      Snippets, tokens, props tables
                    </p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-jakarta text-pio-text dark:text-white font-medium">
                        400 500
                      </span>
                      <span className="font-jetbrains text-pio-amber-dark dark:text-pio-amber">
                        font-jetbrains
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Card shadow="soft" radius="3xl" surface="white" className="rounded-[24px]!">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-pio-border-subtle dark:border-gray-800">
                  <span className="font-jakarta text-xs font-semibold uppercase tracking-wider text-pio-text-muted dark:text-blue-200/70">
                    Alternate Title Families
                  </span>
                  <span className="font-jetbrains text-xs text-pio-text-muted">
                    font-lexend • font-poppins
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-pio-bg-light/60 dark:bg-gray-800">
                    <div>
                      <span className="font-jakarta text-sm font-semibold text-pio-text dark:text-white block">
                        Lexend
                      </span>
                      <span className="font-jetbrains text-[11px] text-pio-text-muted">
                        Weights 100, 400, 700
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <Title size="sm" fontFamily="lexend" thikness="thin">
                        Aa
                      </Title>
                      <Title size="md" fontFamily="lexend" thikness="regular">
                        Aa
                      </Title>
                      <Title size="xl" fontFamily="lexend" thikness="bold">
                        Aa
                      </Title>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-pio-bg-light/60 dark:bg-gray-800">
                    <div>
                      <span className="font-jakarta text-sm font-semibold text-pio-text dark:text-white block">
                        Poppins
                      </span>
                      <span className="font-jetbrains text-[11px] text-pio-text-muted">
                        Weights 100, 400, 700
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <Title size="sm" fontFamily="poppins" thikness="thin">
                        Aa
                      </Title>
                      <Title size="md" fontFamily="poppins" thikness="regular">
                        Aa
                      </Title>
                      <Title size="xl" fontFamily="poppins" thikness="bold">
                        Aa
                      </Title>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card
              shadow="soft"
              radius="3xl"
              surface="white"
              className="rounded-[28px]! flex flex-col justify-between"
            >
              <div className="flex justify-between items-center pb-3 border-b border-pio-border-subtle dark:border-gray-800">
                <span className="font-jakarta text-xs font-semibold uppercase tracking-wider text-pio-text-muted dark:text-blue-200/70">
                  Title Scale
                </span>
                <span className="font-jetbrains text-xs text-pio-coral">sm → xxxxl</span>
              </div>
              <div className="divide-y divide-pio-border-subtle dark:divide-gray-800 py-2">
                {TITLE_SIZES.map(({ size, px }) => (
                  <div key={size} className="py-2 flex items-baseline justify-between gap-3">
                    <span className="font-jetbrains text-xs text-pio-text-muted shrink-0">
                      {size}{' '}
                      <span className="text-[10px] text-gray-400">{px}</span>
                    </span>
                    <Title size={size} fontFamily="playfair" thikness="bold" className="leading-none!">
                      Canvas
                    </Title>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-[11px] text-pio-text-muted dark:text-blue-200/60 font-jakarta">
                Weights: thin 100, regular 400, bold 700
              </div>
            </Card>
          </div>
          <div className={docsLinkRow}>
            <div className={docsLinkWrap}>
              <Button
                label="Title docs"
                type="default"
                fill="ghost"
                size="sm"
                icon={<ExternalLink strokeWidth={2} />}
                iconPosition="right"
                onClick={() => onOpenTitleDocs?.()}
              />
            </div>
            <div className={docsLinkWrap}>
              <Button
                label="CodeBlock docs"
                type="default"
                fill="ghost"
                size="sm"
                icon={<ExternalLink strokeWidth={2} />}
                iconPosition="right"
                onClick={() => onOpenCodeBlockDocs?.()}
              />
            </div>
          </div>
        </div>

        {/* Gradient titles */}
        <div className="space-y-6 pt-6">
          <div className="space-y-1">
            <h3 className={sectionTitle}>Titles that glow.</h3>
            <p className={sectionSubtitle}>
              Six built-in gradient fills for the Title component. One prop, zero custom CSS.
            </p>
          </div>

          <div className={gradientBanner}>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="font-jetbrains text-xs text-pio-amber uppercase tracking-wider block mb-2">
                  Featured Specimen
                </span>
                <Title
                  size="xxxxl"
                  fontFamily="jakarta"
                  thikness="bold"
                  gradient="amber-dawn"
                  className="text-4xl! sm:text-5xl! lg:text-6xl! tracking-tight!"
                >
                  Built to dazzle.
                </Title>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-xs border border-gray-700 px-4 py-2.5 rounded-full flex items-center gap-3 self-start md:self-auto">
                <span className="font-jetbrains text-xs text-gray-300">gradient=&quot;amber-dawn&quot;</span>
                <div className="flex items-center gap-1.5">
                  {['#8CC8BA', '#F5F5EB', '#F8B67A', '#F99280', '#E4ECE0'].map((c) => (
                    <span
                      key={c}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: c }}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={gradientGrid}>
            {GRADIENTS.map((item) => (
              <div
                key={item.gradient}
                className={item.darkCard ? gradientCardDark : gradientCard}
              >
                <div>
                  <span
                    className={`font-jakarta text-xs block mb-1 ${
                      item.darkCard
                        ? 'text-gray-300'
                        : 'text-pio-text-muted dark:text-blue-200'
                    }`}
                  >
                    {item.subtitle}
                  </span>
                  <Title
                    size="xxxl"
                    fontFamily="jakarta"
                    thikness="bold"
                    gradient={item.gradient}
                    className="text-3xl! sm:text-[34px]! leading-snug!"
                  >
                    {item.name}
                  </Title>
                </div>
                <div
                  className={`flex items-center justify-between pt-4 border-t ${
                    item.darkCard
                      ? 'border-gray-800'
                      : 'border-pio-border-subtle dark:border-gray-800'
                  }`}
                >
                  <span className={`font-jetbrains text-xs ${item.propClass}`}>
                    gradient=&quot;{item.gradient}&quot;
                  </span>
                  <div className="flex items-center gap-1">
                    {item.dots.map((c) => (
                      <span
                        key={c}
                        className={
                          item.gradient === 'charcoal-depth'
                            ? 'w-2 h-2 rounded-full ring-1 ring-gray-300 dark:ring-white/40'
                            : 'w-2 h-2 rounded-full'
                        }
                        style={{ background: c }}
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elevation */}
        <div className="space-y-4 pt-4">
          <div className="space-y-0.5">
            <span className="font-jakarta text-xs font-semibold text-pio-text-muted dark:text-blue-200/70 uppercase tracking-wider block">
              Elevation System
            </span>
            <h4 className="font-jakarta text-lg font-semibold text-pio-text dark:text-white m-0">
              Soft depth, never harsh.
            </h4>
          </div>
          <div className={elevationGrid}>
            {ELEVATION.map((item) => (
              <div key={item.label} className={`${elevationTile} ${item.shadow}`}>
                <span
                  className={`font-jetbrains text-xs font-medium mb-1 ${
                    item.labelClass || 'text-pio-text dark:text-white'
                  }`}
                >
                  {item.label}
                </span>
                <span className="text-[11px] text-pio-text-muted">{item.hint}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={footerRow}>
          <p className={footerNote}>
            All tokens defined in <code className={footerCode}>src/css/tokens.css</code> and ready
            for production.
          </p>
        </div>
      </div>

      <div
        className={`${toastRoot}${toastVisible ? ' is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        <Check size={16} className="text-pio-teal-dark-pale shrink-0" aria-hidden />
        <span>
          Copied token:{' '}
          <span className="font-jetbrains text-pio-coral">{copiedToken}</span>
        </span>
      </div>
    </section>
  );
};

export default WelcomeFoundations;
