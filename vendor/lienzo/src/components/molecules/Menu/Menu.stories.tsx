import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Menu, { MenuProps } from './Menu';
import { LabelProps } from '@components/atoms/Label/Label';
import { Home, Inbox, MessageSquare, Settings, User } from 'react-feather';

export default {
  title: 'Molecules/Menu',
  component: Menu,
  argTypes: {
    label: { control: 'text' },
    pointer: { control: 'select', options: ['bottom', 'top'] },
    separator: { control: 'boolean' },
    items: { control: false, table: { disable: true } },
    onClickOutside: { control: false, table: { disable: true } },
  },
} as Meta;

const Template: StoryFn<MenuProps> = (args) => <Menu {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Menu',
  pointer: 'bottom',
  separator: false,
  items: [
    {
      label: { text: 'Home', type: 'default', icon: <Home size={16} />, items: 10 } as LabelProps,
      onClick: () => {},
    },
    {
      label: { text: 'Inbox', type: 'red', icon: <Inbox size={16} />, items: 5 } as LabelProps,
      onClick: () => {},
    },
    {
      label: { text: 'Messages', type: 'yellow', icon: <MessageSquare size={16} /> } as LabelProps,
      onClick: () => {},
    },
    {
      label: { text: 'Settings', type: 'default', icon: <Settings size={16} /> } as LabelProps,
      onClick: () => {},
    },
    {
      label: { text: 'Profile', type: 'default', icon: <User size={16} /> } as LabelProps,
      onClick: () => {},
    },
  ],
};
Default.tags = ['!dev'];
