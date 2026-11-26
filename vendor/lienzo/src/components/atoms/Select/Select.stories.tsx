import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Select from './Select';

export default {
  title: 'Atoms/Select',
  component: Select,
  argTypes: {
    placeholder: { control: 'text' },
    options: { control: false, table: { disable: true } },
  },
} as Meta<typeof Select>;

const Template: StoryFn<typeof Select> = (args) => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  placeholder: 'Select an option',
};
Default.tags = ['!dev'];
