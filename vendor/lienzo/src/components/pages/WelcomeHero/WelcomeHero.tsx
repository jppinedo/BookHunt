import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Copy, Moon, Sun, Terminal } from 'react-feather';
import LienzoHorizontalLogo from '@assets/SVG/LienzoHorizontalLogo';
import Background from '@atoms/Background/Background';
import Button from '@atoms/Button/Button';
import Card from '@atoms/Card/Card';
import Label from '@atoms/Label/Label';
import Switch from '@atoms/Switch/Switch';
import Title from '@atoms/Title/Title';
import CanvasStudio from '@pages/CanvasStudio/CanvasStudio';
import { WELCOME_FOUNDATIONS_ID } from '@pages/WelcomeFoundations/WelcomeFoundations';
import {
  ctaRow,
  depChip,
  depRow,
  foundationBar,
  foundationDivider,
  foundationInner,
  foundationLabel,
  foundationLeft,
  heroContent,
  heroGrid,
  heroLeft,
  heroMeshLayer,
  heroRight,
  heroRoot,
  heroStatLabel,
  heroStatRow,
  heroTagline,
  installCode,
  installCopy,
  installIconWrap,
  installPill,
  modeChrome,
  modeChromeLabel,
  phoneFront,
  phoneStage,
  pillButtonWrap,
  stackPill,
} from './WelcomeHeroStyles';

export interface WelcomeHeroProps {
  /** Reflects Storybook global theme (`dark` when true). */
  isDark?: boolean;
  /** Story wrappers should call `updateGlobals({ theme })` here. */
  onThemeChange?: (active: boolean) => void;
  /** Opens a component Docs page with its live playground (stories use `linkTo`). */
  onOpenPlayground?: () => void;
}

type CopyKey = 'clone' | 'install';

const CLONE_CMD = 'git clone https://github.com/jppinedo/lienzo.git';
const INSTALL_CMD = 'yarn install';
const COPY_RESET_MS = 2200;

/** Real counts: 20 components (13 atoms, 6 molecules, 1 template), 60+ Storybook stories, light + dark themes. */
const HERO_STATS = [
  { value: '20', label: 'Components' },
  { value: '60+', label: 'Live stories' },
  { value: '2', label: 'Themes' },
];

const ReactMark: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    aria-hidden
  >
    <circle cx="12" cy="12" r="2.5" />
    <ellipse cx="12" cy="12" rx="9" ry="3.8" />
    <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
  </svg>
);

const TailwindMark = () => (
  <svg className="w-4 h-4 text-pio-teal-light" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
  </svg>
);

const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  isDark = false,
  onThemeChange,
  onOpenPlayground,
}) => {
  const [copiedKey, setCopiedKey] = useState<CopyKey | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const handleCopy = async (key: CopyKey, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopiedKey(null), COPY_RESET_MS);
    } catch {
      setCopiedKey(null);
    }
  };

  const scrollToFoundations = () => {
    document.getElementById(WELCOME_FOUNDATIONS_ID)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={heroRoot} data-purpose="welcome-hero">
      <Background
        type="dotted"
        colors={['#FAF8F5', '#EDE9E3']}
        darkColors={['#16161a', '#1c1c22']}
        isHexColors
        vignette
        className="w-full h-auto! min-h-[720px] [&_.bg-dotted__content]:h-auto!"
      >
        <div className={heroMeshLayer} aria-hidden>
          <div
            className="absolute -top-32 -left-20 w-[600px] h-[500px] rounded-full blur-3xl opacity-70 dark:opacity-40"
            style={{
              background:
                'radial-gradient(circle at 40% 40%, rgba(255, 107, 87, 0.35) 0%, rgba(240, 106, 83, 0.18) 45%, transparent 75%)',
            }}
          />
          <div
            className="absolute top-1/4 right-0 w-[640px] h-[540px] rounded-full blur-3xl opacity-70 dark:opacity-35"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(47, 109, 104, 0.28) 0%, rgba(58, 125, 118, 0.16) 45%, transparent 75%)',
            }}
          />
          <div
            className="absolute -bottom-28 left-1/3 w-[550px] h-[360px] rounded-full blur-3xl opacity-60 dark:opacity-30"
            style={{
              background:
                'radial-gradient(circle, rgba(234, 168, 56, 0.28) 0%, rgba(255, 107, 87, 0.14) 50%, transparent 80%)',
            }}
          />
        </div>

        <div className={heroContent}>
          <div className={heroGrid}>
            {/* Left: brand + CTAs */}
            <div className={heroLeft}>
              <LienzoHorizontalLogo
                className="dark:hidden"
                width={340}
                height={83}
              />
              <LienzoHorizontalLogo
                className="hidden dark:block"
                variant="onDark"
                width={340}
                height={83}
              />

              <Title
                size="xxxl"
                thikness="regular"
                fontFamily="playfair"
                className="italic! leading-tight!"
              >
                Every interface starts on a canvas.
              </Title>

              <p className={heroTagline}>
                A React and TypeScript design system with editorial type, a warm
                palette, and motion built in. Every component comes with a live
                playground, so you can change its props, styles, and content and
                watch it update in real time.
              </p>

              <div className={heroStatRow}>
                {HERO_STATS.map(({ value, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Title
                      size="xxxl"
                      thikness="bold"
                      fontFamily="jakarta"
                      color="coral"
                      className="text-[52px]! leading-none! tracking-tight!"
                    >
                      {value}
                    </Title>
                    <span className={heroStatLabel}>{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex flex-col gap-2 w-full max-w-md">
                <Label
                  text="RUN IT LOCALLY"
                  type="red"
                  className="uppercase! tracking-wider! text-[11px]! font-bold!"
                />
                <Card padded={false} radius="2xl" surface="transparent" shadow="none" className={installPill}>
                  <div className={installIconWrap}>
                    <Terminal size={18} aria-hidden />
                  </div>
                  <code className={installCode}>{CLONE_CMD}</code>
                  <button
                    type="button"
                    className={installCopy}
                    onClick={() => handleCopy('clone', CLONE_CMD)}
                    title={copiedKey === 'clone' ? 'Copied' : 'Copy clone command'}
                    aria-label={copiedKey === 'clone' ? 'Copied' : 'Copy clone command'}
                  >
                    <Copy size={18} aria-hidden />
                  </button>
                </Card>
                <Card padded={false} radius="2xl" surface="transparent" shadow="none" className={installPill}>
                  <div className={installIconWrap}>
                    <ReactMark />
                  </div>
                  <code className={installCode}>{INSTALL_CMD}</code>
                  <button
                    type="button"
                    className={installCopy}
                    onClick={() => handleCopy('install', INSTALL_CMD)}
                    title={copiedKey === 'install' ? 'Copied' : 'Copy install command'}
                    aria-label={copiedKey === 'install' ? 'Copied' : 'Copy install command'}
                  >
                    <Copy size={18} aria-hidden />
                  </button>
                </Card>
              </div>

              <div className={ctaRow}>
                <div className={pillButtonWrap}>
                  <Button
                    label="Open the playground"
                    type="red"
                    fill="solid"
                    size="lg"
                    icon={<ArrowRight strokeWidth={2} />}
                    iconPosition="right"
                    onClick={() => onOpenPlayground?.()}
                  />
                </div>
                <div className={pillButtonWrap}>
                  <Button
                    label="See colors & type"
                    type="default"
                    fill="outline"
                    size="lg"
                    icon={<ArrowDown strokeWidth={2} />}
                    iconPosition="right"
                    onClick={scrollToFoundations}
                  />
                </div>
              </div>
            </div>

            {/* Right: interactive phone showcase */}
            <div className={heroRight}>
              <div className={modeChrome}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pio-coral shrink-0" aria-hidden />
                  <span className={modeChromeLabel}>Try it in dark</span>
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

              <div className={phoneStage}>
                <div className={phoneFront}>
                  <CanvasStudio />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Built with strip */}
        <div className={foundationBar}>
          <div className={foundationInner}>
            <div className={foundationLeft}>
              <span className={foundationLabel}>Built with</span>
              <div className={foundationDivider} aria-hidden />
              <span className={stackPill}>
                <span className="text-pio-teal-light flex items-center">
                  <ReactMark className="w-4 h-4" />
                </span>
                React 19
              </span>
              <span className={stackPill}>
                <span className="w-4 h-4 rounded-sm bg-[#3178C6] text-white flex items-center justify-center font-bold text-[9px] leading-none">
                  TS
                </span>
                TypeScript 6
              </span>
              <span className={stackPill}>
                <TailwindMark />
                Tailwind CSS 4
              </span>
              <span className={stackPill}>
                <span className="w-3.5 h-3.5 rounded-sm bg-pio-coral text-white font-bold flex items-center justify-center text-[10px]">
                  S
                </span>
                Storybook 10
              </span>
            </div>
            <div className={depRow}>
              <span className={depChip}>Recharts</span>
              <span aria-hidden>•</span>
              <span className={depChip}>react-feather</span>
              <span aria-hidden>•</span>
              <span className={depChip}>react-day-picker</span>
            </div>
          </div>
        </div>
      </Background>
    </section>
  );
};

export default WelcomeHero;
