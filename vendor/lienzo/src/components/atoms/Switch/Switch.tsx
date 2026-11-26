import React, { useState, useEffect, KeyboardEvent } from 'react';
import {
  switchSize,
  switchOff,
  switchOn,
  switchThumb,
  segmentedTrackBase,
  segmentedTrackByType,
  segmentedThumb,
  segmentedOptionSize,
  segmentedOptionBase,
  segmentedOptionActiveByType,
  segmentedOptionInactive,
  segmentedIconInactive,
  segmentedIconActiveFollowType,
  type SwitchSize,
  type SwitchType,
} from './SwitchStyles';

export interface SwitchProps {
  size?: SwitchSize;
  /**
   * Accent for the on state (thumb track) and for segmented track / active text.
   * `default` uses gray / neutral; chromatic types use Pio accents.
   */
  type?: SwitchType;
  isActive?: boolean;
  onChange?: (active: boolean) => void;
  className?: string;
  /**
   * Label for the off (left) option. Passing any of `offLabel`, `onLabel`,
   * `offIcon`, or `onIcon` switches the control to the segmented layout.
   */
  offLabel?: string;
  /** Label for the on (right) option. */
  onLabel?: string;
  /** Icon for the off (left) option. With chromatic `type`, active icons follow the type color. */
  offIcon?: React.ReactNode;
  /** Icon for the on (right) option. */
  onIcon?: React.ReactNode;
}

const Switch: React.FC<SwitchProps> = ({
  size = 'md',
  type = 'default',
  isActive = false,
  onChange,
  className,
  offLabel,
  onLabel,
  offIcon,
  onIcon,
}) => {
  const [active, setActive] = useState(isActive);
  const isSegmented = Boolean(offLabel || onLabel || offIcon || onIcon);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  const setValue = (next: boolean) => {
    if (next === active) return;
    setActive(next);
    onChange?.(next);
  };

  const toggle = () => setValue(!active);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  };

  const propClass = className || '';

  if (isSegmented) {
    const optionSize = segmentedOptionSize[size];
    const followType = type !== 'default';

    const renderOption = (
      sideActive: boolean,
      label: string | undefined,
      icon: React.ReactNode | undefined,
      select: () => void,
    ) => (
      <div
        className={[
          segmentedOptionBase,
          optionSize.option,
          optionSize.icon,
          sideActive ? segmentedOptionActiveByType[type] : segmentedOptionInactive,
        ].join(' ')}
        onClick={(event) => {
          event.stopPropagation();
          select();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            select();
          }
        }}
        role="presentation"
      >
        {icon != null && (
          <span
            className={[
              'flex items-center justify-center',
              sideActive
                ? followType
                  ? segmentedIconActiveFollowType
                  : ''
                : `${segmentedIconInactive} [&_svg]:text-current`,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden
          >
            {icon}
          </span>
        )}
        {label != null && label !== '' && <span>{label}</span>}
      </div>
    );

    return (
      <div
        className={`${segmentedTrackBase} ${segmentedTrackByType[type]} ${propClass}`}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={active}
        tabIndex={0}
      >
        <div
          className={`${segmentedThumb} ${active ? 'translate-x-full' : 'translate-x-0'}`}
          aria-hidden
        />
        {renderOption(!active, offLabel, offIcon, () => setValue(false))}
        {renderOption(active, onLabel, onIcon, () => setValue(true))}
      </div>
    );
  }

  const sizes = switchSize[size];
  const trackClass = active ? switchOn[type] : switchOff;

  return (
    <div
      className={`relative ${sizes.container} rounded-full cursor-pointer ${trackClass} ${propClass}`}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={active}
      tabIndex={0}
    >
      <div
        className={`${switchThumb} ${sizes.thumb} ${
          active ? sizes.thumbOn : 'translate-x-0'
        }`}
      />
    </div>
  );
};

export default Switch;
