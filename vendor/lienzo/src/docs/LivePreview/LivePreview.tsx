import React from 'react';
import { Canvas, Controls } from '@storybook/addon-docs/blocks';
import Badge from '@atoms/Badge/Badge';
import Card from '@atoms/Card/Card';
import Title from '@atoms/Title/Title';
import {
  livePreviewCanvas,
  livePreviewCaption,
  livePreviewControls,
  livePreviewControlsEyebrow,
  livePreviewControlsLabel,
  livePreviewGrid,
  livePreviewHeader,
  livePreviewHeaderLead,
  livePreviewHelper,
  livePreviewRoot,
} from './LivePreviewStyles';
import './LivePreview.css';

type StoryOf = NonNullable<React.ComponentProps<typeof Canvas>['of']>;

export interface LivePreviewProps {
  /** Hidden Default (or other) story export — binds Canvas and Controls together. */
  of: StoryOf;
  /** Section heading. Default “Live Preview”. */
  title?: string;
  /** Optional helper on the right of the header (desktop). */
  helperText?: string;
  /** Optional decorative caption under the canvas (not a functional claim). */
  caption?: React.ReactNode;
  className?: string;
}

/**
 * Dual-column Live Preview: Storybook Controls (left) + Canvas (right) in one card.
 * On small viewports, Controls stack above Canvas. Does not replace Controls with a custom form.
 */
const LivePreview: React.FC<LivePreviewProps> = ({
  of,
  title = 'Live Preview',
  helperText,
  caption,
  className,
}) => {
  const rootClass = [livePreviewRoot, className || ''].filter(Boolean).join(' ');

  return (
    <section className={rootClass} data-purpose="live-preview-section">
      <div className={livePreviewHeader}>
        <div className={livePreviewHeaderLead}>
          <Title size="xl" fontFamily="playfair" thikness="bold">
            {title}
          </Title>
          <Badge label="Interactive" tone="teal" dot />
        </div>
        {helperText ? <span className={livePreviewHelper}>{helperText}</span> : null}
      </div>

      <Card padded={false} radius="3xl" surface="white" shadow="card">
        <div className={livePreviewGrid}>
          <div className={livePreviewControls} data-purpose="customization-panel">
            <div className={livePreviewControlsEyebrow}>
              <span className={livePreviewControlsLabel}>Control Panel</span>
            </div>
            <Controls of={of} />
          </div>

          <div className={livePreviewCanvas} data-purpose="live-render-canvas">
            <Canvas of={of} sourceState="none" layout="fullscreen" />
            {caption ? <div className={livePreviewCaption}>{caption}</div> : null}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default LivePreview;
