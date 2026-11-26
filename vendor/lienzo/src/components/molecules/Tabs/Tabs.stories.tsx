import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Tabs from './Tabs';
import Label from '@atoms/Label/Label';
import { Download } from 'react-feather';

export default {
  title: 'Molecules/Tabs',
  component: Tabs,
  argTypes: {
    activeTab: { control: 'text' },
    variant: { control: 'select', options: ['underline', 'pills', 'segmented'] },
    tabs: { control: false, table: { disable: true } },
  },
} as Meta;

const Template: StoryFn<typeof Tabs> = (args) => <Tabs {...args} />;
const containerClass = 'flex justify-center items-center h-64 border border-gray-300 bg-gray-100 dark:border-none dark:bg-gray-900 dark:text-blue-200';

const panel = (label: string) => (
  <div className={containerClass}>{label}</div>
);

const defaultTabs = [
  {
    id: '1',
    label: <Label text="First tab" />,
    content: panel('Content for Tab 1'),
  },
  {
    id: '2',
    label: <Label text="This is the second tab" items={2} />,
    content: panel('Content for Tab 2'),
  },
  {
    id: '3',
    label: <Label text="Download" icon={<Download size={16} />}/>,
    content: panel('Content for Tab 3'),
  },
  {
    id: '4',
    label: <Label text="Tab as well" items={14}/>,
    content: panel('Content for Tab 4'),
  },
  {
    id: '5',
    label: 'Tab 5',
    content: panel('Content for Tab 5'),
  },
];

export const Default = Template.bind({});
Default.args = {
  variant: 'underline',
  tabs: defaultTabs,
};
Default.tags = ['!dev'];

export const Underline = () => <Tabs variant="underline" tabs={defaultTabs} />;
Underline.parameters = { controls: { disable: true } };

export const Pills = () => (
  <Tabs
    variant="pills"
    tabs={[
      { id: 'single', label: 'Single Series Chart', content: panel('Single series panel') },
      { id: 'stacked', label: 'Stacked Series Chart', content: panel('Stacked series panel') },
      { id: 'percentage', label: 'Percentage Stacked', content: panel('Percentage stacked panel') },
      { id: 'dual', label: 'Dual Axis Chart', content: panel('Dual axis panel') },
    ]}
  />
);
Pills.parameters = { controls: { disable: true } };

export const Segmented = () => (
  <div className="flex flex-col gap-10">
    <Tabs
      variant="segmented"
      tabs={[
        { id: 'smooth', label: 'Smooth', content: panel('Smooth line style') },
        { id: 'straight', label: 'Straight', content: panel('Straight line style') },
        { id: 'spline', label: 'Spline', content: panel('Spline line style') },
      ]}
    />
    <Tabs
      variant="segmented"
      tabs={[
        { id: 'weekly', label: 'Weekly', content: panel('Weekly range') },
        { id: 'monthly', label: 'Monthly', content: panel('Monthly range') },
        { id: 'quarterly', label: 'Quarterly', content: panel('Quarterly range') },
      ]}
    />
  </div>
);
Segmented.parameters = { controls: { disable: true } };
