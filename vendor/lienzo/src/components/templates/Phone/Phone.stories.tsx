import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Phone, { PhoneProps } from './Phone';

export default {
  title: 'Templates/Phone',
  component: Phone,
  argTypes: {
    time: { control: 'text', name: 'Time' },
    children: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta;

export const Default: StoryFn<PhoneProps> = (args) => (
  <Phone {...args}>
    <div className="flex flex-1 items-center justify-center min-h-[480px] text-sm text-pio-text-muted">
      Content slot
    </div>
  </Phone>
);
Default.args = {
  time: '9:41',
};
Default.tags = ['!dev'];

export const EmptyShell = () => (
  <Phone>
    <div className="flex flex-1 items-center justify-center min-h-[480px] rounded-2xl border border-dashed border-pio-grid text-sm text-pio-text-muted">
      children
    </div>
  </Phone>
);
EmptyShell.parameters = { controls: { disable: true } };
