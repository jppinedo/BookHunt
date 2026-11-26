import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import CircleSpinner from './CircleSpinner';

export default {
  title: 'Atoms/CircleSpinner',
  component: CircleSpinner,
  argTypes: {
    colorClass: {
      options: ['bg-pio-coral', 'bg-pio-amber', 'bg-pio-teal-dark', 'bg-gray-700', 'bg-black'],
      control: {
        type: 'select',
        labels: {
          'bg-pio-coral': 'Coral',
          'bg-pio-amber': 'Amber',
          'bg-pio-teal-dark': 'Teal dark',
          'bg-gray-700': 'Gray',
          'bg-black': 'Black',
        },
      },
    },
    thickness: {
      control: { type: 'range', min: 0, max: 2.6, step: 0.1 }
    },
    size: {
      control: { type: 'number' },
    },
  },
} as Meta;

const Template: StoryFn<typeof CircleSpinner> = (args) => {
  const sizeInRem = `${args.size}rem`;
  return <CircleSpinner {...args} size={sizeInRem} />;
};

export const Default = Template.bind({});
Default.args = {
  colorClass: 'bg-pio-teal-dark',
  thickness: 1,
  size: 6,
};
Default.tags = ['!dev'];

export const MultipleSpinners = () => (
  <div className='flex p-5 gap-3'>
    <CircleSpinner colorClass='bg-pio-coral' thickness={0.5} size='4rem' />
    <CircleSpinner colorClass='bg-pio-teal-dark' thickness={0.5} size='4rem' />
    <CircleSpinner colorClass='bg-pio-amber' thickness={0.5} size='4rem' />
    <CircleSpinner colorClass='bg-gray-900 dark:bg-white' thickness={0.5} size='4rem' />
  </div>
);

MultipleSpinners.parameters = { controls: { disable: true } };
