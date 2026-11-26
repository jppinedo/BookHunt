import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Badge, { BadgeProps } from './Badge';

export default {
  title: 'Atoms/Badge',
  component: Badge,
  argTypes: {
    label: { control: 'text' },
    tone: { control: 'select', options: ['coral', 'teal', 'amber'] },
    dot: { control: 'boolean' },
    className: { control: false, table: { disable: true } },
  },
} as Meta;

const Template: StoryFn<BadgeProps> = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'v1.2.0 • Interactive React Component',
  tone: 'coral',
  dot: true,
};
Default.tags = ['!dev'];

export const Tones = () => (
  <div className="flex flex-wrap gap-2 items-center">
    <Badge label="Pattern: Single Series Flow" tone="coral" dot />
    <Badge label="Interactive" tone="teal" dot />
    <Badge label="Warning" tone="amber" dot />
    <Badge label="No dot" tone="coral" />
  </div>
);
Tones.parameters = { controls: { disable: true } };
