import React from 'react';
import WelcomeFoundations from '@pages/WelcomeFoundations/WelcomeFoundations';
import WelcomeHero from '@pages/WelcomeHero/WelcomeHero';

export interface WelcomeProps {
  /** Reflects Storybook global theme (`dark` when true). */
  isDark?: boolean;
  /** Story wrappers should call `updateGlobals({ theme })` here. */
  onThemeChange?: (active: boolean) => void;
  /** Opens a component Docs page with its live playground (stories use `linkTo`). */
  onOpenPlayground?: () => void;
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

/**
 * Official Storybook landing page: WelcomeHero followed by WelcomeFoundations.
 */
const Welcome: React.FC<WelcomeProps> = ({
  isDark = false,
  onThemeChange,
  onOpenPlayground,
  onOpenButtonDocs,
  onOpenSwitchDocs,
  onOpenCheckboxDocs,
  onOpenTitleDocs,
  onOpenCodeBlockDocs,
}) => (
  <>
    <WelcomeHero
      isDark={isDark}
      onThemeChange={onThemeChange}
      onOpenPlayground={onOpenPlayground}
    />
    <WelcomeFoundations
      isDark={isDark}
      onThemeChange={onThemeChange}
      onOpenButtonDocs={onOpenButtonDocs}
      onOpenSwitchDocs={onOpenSwitchDocs}
      onOpenCheckboxDocs={onOpenCheckboxDocs}
      onOpenTitleDocs={onOpenTitleDocs}
      onOpenCodeBlockDocs={onOpenCodeBlockDocs}
    />
  </>
);

export default Welcome;
