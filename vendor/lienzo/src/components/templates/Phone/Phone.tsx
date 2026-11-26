import React from 'react';
import {
  phoneContent,
  phoneHomeIndicator,
  phoneIsland,
  phoneIslandDot,
  phoneIslandLens,
  phoneIslandLensInner,
  phoneOuter,
  phoneScreen,
  phoneStatusBar,
  phoneStatusIcons,
  phoneTime,
} from './PhoneStyles';

export interface PhoneProps {
  children: React.ReactNode;
  className?: string;
  time?: string;
}

const SignalIcon = () => (
  <svg
    aria-hidden="true"
    className="w-[13px] h-[13px]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="2" y="16" width="3" height="5" rx="0.5" />
    <rect x="7.5" y="12" width="3" height="9" rx="0.5" />
    <rect x="13" y="8" width="3" height="13" rx="0.5" />
    <rect x="18.5" y="4" width="3" height="17" rx="0.5" opacity="0.35" />
  </svg>
);

const BatteryIcon = () => (
  <svg
    aria-hidden="true"
    className="w-[15px] h-[15px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    viewBox="0 0 24 24"
  >
    <rect x="2" y="7" width="18" height="10" rx="2" />
    <path d="M22 11v2" strokeLinecap="round" />
    <path d="M8 12h4M10 10v4" strokeLinecap="round" />
  </svg>
);

const Phone: React.FC<PhoneProps> = ({
  children,
  className,
  time = '9:41',
}) => {
  const outerClasses = [phoneOuter, className].filter(Boolean).join(' ');

  return (
    <div className={outerClasses} data-purpose="phone-frame">
      <div className={phoneScreen} data-purpose="phone-screen">
        <div className={phoneStatusBar} data-purpose="phone-status-bar">
          <span className={phoneTime}>{time}</span>
          <div className={phoneIsland} aria-hidden="true">
            <div className={phoneIslandLens}>
              <div className={phoneIslandLensInner} />
            </div>
            <div className={phoneIslandDot} />
          </div>
          <div className={phoneStatusIcons}>
            <SignalIcon />
            <span className="text-[10px] font-semibold">5G</span>
            <BatteryIcon />
          </div>
        </div>

        <div className={phoneContent} data-purpose="phone-content">
          {children}
        </div>

        <div className={phoneHomeIndicator} aria-hidden="true" />
      </div>
    </div>
  );
};

export default Phone;
