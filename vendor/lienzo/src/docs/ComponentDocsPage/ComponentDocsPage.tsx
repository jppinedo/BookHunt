import React from 'react';
import type { Language } from 'prism-react-renderer';
import { Check, ChevronRight, X } from 'react-feather';
import Badge from '@atoms/Badge/Badge';
import Card from '@atoms/Card/Card';
import Title from '@atoms/Title/Title';
import CodeBlock from '@molecules/CodeBlock/CodeBlock';
import Tabs from '@molecules/Tabs/Tabs';
import LivePreview from '@docs/LivePreview/LivePreview';
import DocsSectionHeader from './DocsSectionHeader';
import './ComponentDocsPage.css';
import {
  breadcrumbCurrent,
  breadcrumbNav,
  breadcrumbSep,
  bulletDo,
  bulletDont,
  descriptionText,
  headerRoot,
  overviewGrid,
  overviewLeft,
  overviewRight,
  overviewSection,
  pageRoot,
  propsBody,
  propsCardHeader,
  propsDefault,
  propsDesc,
  propsInterfaceChip,
  propsName,
  propsTable,
  propsTableWrap,
  propsTd,
  propsTh,
  propsTheadRow,
  propsType,
  sectionBlock,
  titleHero,
  titleRow,
  usageDoIcon,
  usageDontIcon,
  usageGrid,
  usageHeadingDo,
  usageHeadingDont,
  usageItem,
  usageList,
  useCaseIcon,
  useCaseIconAlt,
  useCaseItem,
  useCaseList,
  variationCanvas,
  variationCopy,
  variationCopyFull,
  variationMetaLabel,
  variationMetaList,
  variationMetaRow,
  variationMetaValue,
  variationPanel,
  variationsHeader,
} from './ComponentDocsPageStyles';

type StoryOf = NonNullable<React.ComponentProps<typeof LivePreview>['of']>;

export interface ComponentDocsStories {
  Default: StoryOf;
  [key: string]: unknown;
}

export interface ComponentDocsUseCases {
  /** Eyebrow for the left column. Default “Overview”. */
  overviewEyebrow?: string;
  /** Serif heading for the left column. Default “Component Description”. */
  overviewTitle?: string;
  /** Optional body override; defaults to the page `description`. */
  overviewBody?: React.ReactNode;
  /** Eyebrow for the right column. Default “Scenarios”. */
  casesEyebrow?: string;
  /** Serif heading for the right column. Default “Common Use Cases”. */
  casesTitle?: string;
  cases: Array<string | React.ReactNode>;
  footer?: React.ReactNode;
}

export interface ComponentDocsVariationMeta {
  label: string;
  value: React.ReactNode;
  /** `prop` uses coral mono (highlight); `code` uses mono; `text` is default body. */
  valueTone?: keyof typeof variationMetaValue;
}

export interface ComponentDocsVariation {
  id: string;
  label: string;
  /** Typically `<Canvas of={Stories.Variant} />` — no Controls. */
  canvas: React.ReactNode;
  description?: React.ReactNode;
  badge?: string;
  /** Key/value rows (e.g. data signature, distinguishing props, best for). */
  meta?: ComponentDocsVariationMeta[];
}

export interface ComponentDocsPropRow {
  name: string;
  type: string;
  defaultValue?: string;
  description?: string;
}

export interface ComponentDocsPropsSlot {
  interfaceName?: string;
  lead?: React.ReactNode;
  rows?: ComponentDocsPropRow[];
  /** e.g. Storybook `<ArgTypes of={Stories} />` or a custom table. */
  children?: React.ReactNode;
}

export interface ComponentDocsUsage {
  whenToUse?: Array<string | React.ReactNode>;
  whenToAvoid?: Array<string | React.ReactNode>;
}

export interface ComponentDocsExample {
  code: string;
  filename?: string;
  language?: Language;
  codeMode?: 'dark' | 'light';
}

export interface ComponentDocsPageProps {
  title: string;
  description: string;
  /** CSF module; Live Preview binds `stories.Default`. */
  stories: ComponentDocsStories;
  breadcrumb?: string[] | React.ReactNode;
  badge?: string | React.ReactNode;
  useCases?: ComponentDocsUseCases;
  variations?: ComponentDocsVariation[];
  props?: ComponentDocsPropsSlot | React.ReactNode;
  usage?: ComponentDocsUsage;
  example?: ComponentDocsExample | React.ReactNode;
  livePreviewHelperText?: string;
  livePreviewCaption?: React.ReactNode;
  className?: string;
}

function isPropsSlot(
  value: ComponentDocsPropsSlot | React.ReactNode
): value is ComponentDocsPropsSlot {
  return (
    typeof value === 'object' &&
    value !== null &&
    !React.isValidElement(value) &&
    ('rows' in value || 'children' in value || 'interfaceName' in value || 'lead' in value)
  );
}

function isExampleSlot(
  value: ComponentDocsExample | React.ReactNode
): value is ComponentDocsExample {
  return (
    typeof value === 'object' &&
    value !== null &&
    !React.isValidElement(value) &&
    'code' in value &&
    typeof (value as ComponentDocsExample).code === 'string'
  );
}

const ComponentDocsPage: React.FC<ComponentDocsPageProps> = ({
  title,
  description,
  stories,
  breadcrumb,
  badge,
  useCases,
  variations,
  props: propsSlot,
  usage,
  example,
  livePreviewHelperText = 'Adjust live parameters to update the canvas',
  livePreviewCaption,
  className,
}) => {
  const rootClass = [pageRoot, className || ''].filter(Boolean).join(' ');
  const hasUseCases = Boolean(useCases && useCases.cases.length > 0);
  const hasVariations = Boolean(variations && variations.length > 0);

  const hasUsage =
    Boolean(usage?.whenToUse?.length) || Boolean(usage?.whenToAvoid?.length);

  const propsConfig = propsSlot && isPropsSlot(propsSlot) ? propsSlot : null;
  const propsNode =
    propsSlot && !isPropsSlot(propsSlot) ? (propsSlot as React.ReactNode) : null;
  const hasPropsTable = Boolean(
    propsConfig &&
      ((propsConfig.rows && propsConfig.rows.length > 0) || propsConfig.children)
  );
  const hasProps = hasPropsTable || Boolean(propsNode);

  const exampleConfig = example && isExampleSlot(example) ? example : null;
  const exampleNode =
    example && !isExampleSlot(example) ? (example as React.ReactNode) : null;
  const hasExample = Boolean(exampleConfig || exampleNode);

  const hasUsageSection = hasUsage || hasExample;

  return (
    <article className={rootClass} data-purpose="component-docs-page">
      <header className={headerRoot} data-purpose="component-header">
        {breadcrumb ? (
          Array.isArray(breadcrumb) ? (
            <nav aria-label="Breadcrumb" className={breadcrumbNav}>
              {breadcrumb.map((crumb, index) => {
                const isLast = index === breadcrumb.length - 1;
                return (
                  <React.Fragment key={`${crumb}-${index}`}>
                    {index > 0 ? (
                      <ChevronRight size={14} className={breadcrumbSep} aria-hidden="true" />
                    ) : null}
                    <span className={isLast ? breadcrumbCurrent : undefined}>{crumb}</span>
                  </React.Fragment>
                );
              })}
            </nav>
          ) : (
            breadcrumb
          )
        ) : null}

        <div className={titleRow}>
          <h1
            className={titleHero}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
            }}
          >
            {title}
          </h1>
          {badge ? (
            typeof badge === 'string' ? (
              <Badge label={badge} tone="coral" dot />
            ) : (
              badge
            )
          ) : null}
        </div>

        {!hasUseCases ? <p className={descriptionText}>{description}</p> : null}
      </header>

      {hasUseCases && useCases ? (
        <section className={overviewSection} data-purpose="component-overview">
          <div className={overviewGrid}>
            <div className={overviewLeft}>
              <DocsSectionHeader
                eyebrow={useCases.overviewEyebrow || 'Overview'}
                title={useCases.overviewTitle || 'Component Description'}
                dotTone="coral"
              />
              <div className={descriptionText}>
                {useCases.overviewBody ?? description}
              </div>
            </div>
            <div className={overviewRight}>
              <DocsSectionHeader
                eyebrow={useCases.casesEyebrow || 'Scenarios'}
                title={useCases.casesTitle || 'Common Use Cases'}
                dotTone="teal"
              />
              <ul className={useCaseList}>
                {useCases.cases.map((item, index) => (
                  <li key={index} className={useCaseItem}>
                    <span
                      className={index % 2 === 0 ? useCaseIcon : useCaseIconAlt}
                      aria-hidden="true"
                    >
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {useCases.footer ? <div className="pt-2">{useCases.footer}</div> : null}
            </div>
          </div>
        </section>
      ) : null}

      <LivePreview
        of={stories.Default}
        helperText={livePreviewHelperText}
        caption={livePreviewCaption}
      />

      {hasVariations && variations ? (
        <section className={sectionBlock} data-purpose="component-variations">
          <div className={variationsHeader}>
            <DocsSectionHeader
              eyebrow="Gallery"
              title="Variations"
              dotTone="amber"
              lead="Select a pattern to preview its layout and composition."
            />
          </div>
          <Tabs
            variant="pills"
            tabs={variations.map((variation) => {
              const hasCopy = Boolean(
                variation.description ||
                  variation.badge ||
                  (variation.meta && variation.meta.length > 0)
              );
              return {
                id: variation.id,
                label: variation.label,
                content: (
                  <Card padded={false} radius="3xl" surface="white" shadow="soft">
                    <div
                      className={hasCopy ? variationPanel : variationCopyFull}
                    >
                      <div
                        className={
                          hasCopy
                            ? variationCanvas
                            : 'component-docs-variation-canvas w-full min-w-0'
                        }
                      >
                        {variation.canvas}
                      </div>
                      {hasCopy ? (
                        <div className={variationCopy}>
                          {variation.badge ? (
                            <Badge label={variation.badge} tone="coral" dot />
                          ) : null}
                          <Title size="xl" fontFamily="playfair" thikness="bold">
                            {variation.label}
                          </Title>
                          {variation.description ? (
                            <div className={descriptionText}>
                              {variation.description}
                            </div>
                          ) : null}
                          {variation.meta && variation.meta.length > 0 ? (
                            <dl className={variationMetaList}>
                              {variation.meta.map((row) => {
                                const tone = row.valueTone ?? 'text';
                                return (
                                  <div
                                    key={row.label}
                                    className={variationMetaRow}
                                  >
                                    <dt className={variationMetaLabel}>
                                      {row.label}
                                    </dt>
                                    <dd className={variationMetaValue[tone]}>
                                      {row.value}
                                    </dd>
                                  </div>
                                );
                              })}
                            </dl>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </Card>
                ),
              };
            })}
          />
        </section>
      ) : null}

      {hasProps ? (
        <section
          className={sectionBlock}
          data-purpose="props-table-container"
          id="props-specification-section"
        >
          <DocsSectionHeader
            eyebrow="Technical Specs"
            title="Component Props API"
            dotTone="coral"
            lead={
              propsConfig?.lead ??
              `TypeScript interface reference for <${title} />.`
            }
          />
          {propsNode ? (
            propsNode
          ) : propsConfig ? (
            <Card padded={false} radius="3xl" surface="white" shadow="soft">
              {propsConfig.interfaceName && propsConfig.rows ? (
                <div className={propsCardHeader}>
                  <div>
                    <Title size="lg" fontFamily="playfair" thikness="bold">
                      Interface Reference
                    </Title>
                    <p className="text-xs font-jakarta text-pio-stone mt-0.5 dark:text-blue-200/60">
                      Runtime types and default arguments
                    </p>
                  </div>
                  <span className={propsInterfaceChip}>{propsConfig.interfaceName}</span>
                </div>
              ) : null}
              {propsConfig.children ? (
                <div className="p-4 sm:p-6">{propsConfig.children}</div>
              ) : null}
              {propsConfig.rows && propsConfig.rows.length > 0 ? (
                <div className={propsTableWrap}>
                  <table className={propsTable}>
                    <thead>
                      <tr className={propsTheadRow}>
                        <th className={propsTh} scope="col">
                          Prop
                        </th>
                        <th className={propsTh} scope="col">
                          Type
                        </th>
                        <th className={propsTh} scope="col">
                          Default
                        </th>
                        <th className={propsTh} scope="col">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className={propsBody}>
                      {propsConfig.rows.map((row) => (
                        <tr key={row.name}>
                          <td className={`${propsTd} ${propsName}`}>{row.name}</td>
                          <td className={`${propsTd} ${propsType}`}>{row.type}</td>
                          <td className={`${propsTd} ${propsDefault}`}>
                            {row.defaultValue ?? '—'}
                          </td>
                          <td className={`${propsTd} ${propsDesc}`}>
                            {row.description ?? ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Card>
          ) : null}
        </section>
      ) : null}

      {hasUsageSection ? (
        <section className={sectionBlock} data-purpose="usage-and-props-specification">
          <DocsSectionHeader
            eyebrow="Implementation Guide"
            title="Usage & Best Practices"
            dotTone="teal"
            lead="Design rules of engagement and ready-to-use source integration."
          />

          {hasUsage && usage ? (
            <div className={usageGrid}>
              {usage.whenToUse && usage.whenToUse.length > 0 ? (
                <Card radius="3xl" surface="white" shadow="soft">
                  <div className={usageHeadingDo}>
                    <span className={usageDoIcon} aria-hidden="true">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    When to Use
                  </div>
                  <ul className={usageList}>
                    {usage.whenToUse.map((item, index) => (
                      <li key={index} className={usageItem}>
                        <span className={bulletDo} aria-hidden="true">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}
              {usage.whenToAvoid && usage.whenToAvoid.length > 0 ? (
                <Card radius="3xl" surface="white" shadow="soft">
                  <div className={usageHeadingDont}>
                    <span className={usageDontIcon} aria-hidden="true">
                      <X size={14} strokeWidth={2.5} />
                    </span>
                    When to Avoid
                  </div>
                  <ul className={usageList}>
                    {usage.whenToAvoid.map((item, index) => (
                      <li key={index} className={usageItem}>
                        <span className={bulletDont} aria-hidden="true">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}
            </div>
          ) : null}

          {hasExample ? (
            exampleNode ? (
              exampleNode
            ) : exampleConfig ? (
              <div data-purpose="code-example-card">
                <CodeBlock
                  code={exampleConfig.code}
                  filename={exampleConfig.filename}
                  language={exampleConfig.language}
                  codeMode={exampleConfig.codeMode}
                />
              </div>
            ) : null
          ) : null}
        </section>
      ) : null}
    </article>
  );
};

export default ComponentDocsPage;
