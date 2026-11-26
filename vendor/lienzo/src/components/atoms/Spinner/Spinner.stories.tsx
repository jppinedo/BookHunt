import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Spinner, { SpinnerProps } from './Spinner';

export default {
  title: 'Atoms/Spinner',
  component: Spinner,
  argTypes: {
    colorClass: {
      control: {
        type: 'select',
        labels: {
          'border-pio-coral': 'Coral',
          'border-pio-teal-dark': 'Teal dark',
          'border-pio-amber': 'Amber',
          'border-gray-700': 'Gray',
          'border-black': 'Black',
        },
      },
      options: ['border-pio-coral', 'border-pio-teal-dark', 'border-pio-amber', 'border-gray-700', 'border-black'],
    },
    size: { control: 'text' },
    thickness: { control: 'text' },
  },
} as Meta;

const Template: StoryFn<SpinnerProps> = (args) => <Spinner {...args} />;

export const Default = Template.bind({});
Default.args = {
  colorClass: 'border-pio-coral',
  size: '1rem',
  thickness: '0.2rem',
};
Default.tags = ['!dev'];

export const RedLarge = Template.bind({});
RedLarge.args = {
  colorClass: 'border-pio-teal-dark',
  size: '2rem',
  thickness: '0.4rem',
};
RedLarge.parameters = { controls: { disable: true } };
