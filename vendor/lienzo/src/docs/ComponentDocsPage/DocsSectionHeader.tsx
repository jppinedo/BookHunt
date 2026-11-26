import React from 'react';
import Title from '@atoms/Title/Title';

export interface DocsSectionHeaderProps {
  eyebrow: string;
  title: string;
  dotTone?: 'coral' | 'teal' | 'amber';
  lead?: React.ReactNode;
}

/** Section header: color dot + uppercase eyebrow + Playfair h2. */
const DocsSectionHeader: React.FC<DocsSectionHeaderProps> = ({
  eyebrow,
  title,
  dotTone = 'coral',
  lead,
}) => (
  <div className="space-y-1">
    <Title
      size="sm"
      className="text-xs!"
      uppercase
      dot
      dotTone={dotTone}
      fontFamily="jakarta"
      thikness="bold"
    >
      {eyebrow}
    </Title>
    <Title size="xl" className="sm:text-3xl" fontFamily="playfair" thikness="bold">
      {title}
    </Title>
    {lead ? (
      <p className="text-sm font-jakarta text-pio-text-muted mt-1 dark:text-blue-200/80">{lead}</p>
    ) : null}
  </div>
);

export default DocsSectionHeader;
