import React from 'react';
import {
  boxStyles,
  boxShadow,
  boxContentArea,
  boxHeader,
  boxHeaderOutside,
  boxContent,
  boxFooter,
} from './BoxStyles';

export interface BoxProps {
  children: React.ReactNode;
  className?: string;
  type?: 'glass' | 'default';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  headerOutside?: boolean;
  shadow?: keyof typeof boxShadow;
}

const Box: React.FC<BoxProps> = ({
  children,
  className,
  type = 'default',
  header,
  footer,
  headerOutside = false,
  shadow = 'none',
}) => {
  const shadowClass = boxShadow[shadow];

  if (type === 'glass') {
    return (
      <div className={`${boxStyles.glass} ${shadowClass} ${className || ''}`}>
        {header != null && <div data-box-header>{header}</div>}
        {children}
        {footer != null && <div data-box-footer>{footer}</div>}
      </div>
    );
  }

  const headerEl =
    header != null ? (
      <div
        data-box-header
        className={headerOutside ? boxHeaderOutside : boxHeader}
      >
        {header}
      </div>
    ) : null;

  return (
    <div className={`${boxStyles.default} ${shadowClass} ${className || ''}`}>
      {headerOutside && headerEl}
      <div data-box-content-area className={boxContentArea}>
        {!headerOutside && headerEl}
        <div data-box-content className={boxContent}>
          {children}
        </div>
      </div>
      {footer != null && (
        <div data-box-footer className={boxFooter}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Box;
