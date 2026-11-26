// Toolbar.stories.tsx
import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Toolbar, { ToolbarProps } from './Toolbar';
import { Bell, Calendar, CheckCircle, FileText, User, Trash2 } from 'react-feather';
import Button from '@atoms/Button/Button';
import { MenuItem } from '../Menu/Menu';
import Label, { LabelProps } from '@components/atoms/Label/Label';

export default {
  title: 'Molecules/Toolbar',
  component: Toolbar,
  argTypes: {
    menuPosition: {
      control: {
        type: 'select',
        options: ['top', 'bottom'],
      },
    },
    type: { control: 'select', options: ['button', 'label'] },
    rounded: { control: 'select', options: ['none', 'default', 'sm', 'md', 'lg', 'full'] },
    items: { control: false, table: { disable: true } },
  },
} as Meta;

const Template: StoryFn<ToolbarProps> = (args) => (
  <div
    className={`flex w-full min-w-0 max-w-full ${args.menuPosition === 'top' ? 'items-center h-screen' : ''}`}
  >
    <Toolbar {...args} />
  </div>
);

const menuOne = [
  { label: {text: 'Menu item 1'},onClick: () => {} },
  { label: {text: 'Menu item 2', type: 'green', items: 4}, onClick: () => {} },
  { label: {text: 'Menu item 3'}, onClick: () => {} },
];

const menuTwo = [
  { label: {text: 'Menu item 4', icon: <Bell size={16}/>}, onClick: () => {} },
  { label: {text: 'Menu item 5', icon: <FileText size={16}/>}, onClick: () => {} },
  { label: {text: 'Menu item 6', icon: <CheckCircle size={16}/>}, onClick: () => {} },
  { label: {text: 'Menu item', icon: <Calendar size={16}/>, items: 7, type: 'green'}, onClick: () => {} },
  { label: {text: 'Menu item 8', icon: <User size={16}/>}, onClick: () => {} },
];

const buttonItems = [
  <Button 
    label='Notifications'
    onClick={() => {}}
    ariaLabel='Delete Tool Button'
    type='default'
    fill='ghost'
    icon={<Bell />}
    iconPosition='left'
  />,
  <Button 
    label='New Event'
    onClick={() => {}}
    ariaLabel='Delete Tool Button'
    type='default'
    fill='ghost'
    icon={<Calendar />}
    iconPosition='left'
  />,
  <Button 
    label='Profile'
    onClick={() => {}}
    ariaLabel='Delete Tool Button'
    type='default'
    fill='ghost'
    icon={<User />}
    iconPosition='left'
  />,
  <Button 
    label='Validate'
    onClick={() => {}}
    ariaLabel='Delete Tool Button'
    type='default'
    fill='ghost'
    icon={<CheckCircle />}
    iconPosition='left'
  />,
  <Button 
    label='New'
    onClick={() => {}}
    ariaLabel='Delete Tool Button'
    type='default'
    fill='ghost'
    icon={<FileText />}
    iconPosition='left'
  />,
  <Button 
    label='Delete'
    onClick={() => {}}
    ariaLabel='Delete Tool Button'
    type='default'
    fill='ghost'
    icon={<Trash2 />}
    iconPosition='left'
  />,
];

const defaultToolbarArgs = {
  menuPosition: 'bottom' as const,
  rounded: 'xl' as const,
  items: [
    { id: '1', item: buttonItems[0], onClick: () => {} },
    { id: '2', item: buttonItems[1], onClick: () => {} },
    { 
      id: '3',
      item: buttonItems[2],
      onClick: () => {}, 
      menu: { items: menuOne } 
    },
    { id: '4', item: buttonItems[3], onClick: () => {} },
    { 
      id: '5',
      item: buttonItems[4], 
      onClick: () => {}, 
      menu: { items: menuTwo } 
    },
    { id: '6', item: buttonItems[5], onClick: () => {} },
  ],
};

export const Default = Template.bind({});
Default.args = defaultToolbarArgs;
Default.tags = ['!dev'];

export const Basic = Template.bind({});
Basic.args = defaultToolbarArgs;
Basic.parameters = { controls: { disable: true } };

export const buttonToolbar = () => {
  const toolbarItems = [
    <Button 
      label='Notifications'
      onClick={() => {}}
      ariaLabel='Delete Tool Button'
      mode='tool'
      type='default'
      fill='ghost'
      icon={<Bell />}
      iconPosition='top'
    />,
    <Button 
      label='New Event'
      onClick={() => {}}
      ariaLabel='Delete Tool Button'
      mode='tool'
      type='default'
      fill='ghost'
      icon={<Calendar />}
      iconPosition='top'
    />,
    <Button 
      label='Profile'
      onClick={() => {}}
      ariaLabel='Delete Tool Button'
      mode='tool'
      type='default'
      fill='ghost'
      icon={<User />}
      iconPosition='top'
    />,
    <Button 
      label='Validate'
      onClick={() => {}}
      ariaLabel='Delete Tool Button'
      mode='tool'
      type='default'
      fill='ghost'
      icon={<CheckCircle />}
      iconPosition='top'
    />,
    <Button 
      label='New'
      onClick={() => {}}
      ariaLabel='Delete Tool Button'
      mode='tool'
      type='default'
      fill='ghost'
      icon={<FileText />}
      iconPosition='top'
    />,
    <Button 
      label='Delete'
      onClick={() => {}}
      ariaLabel='Delete Tool Button'
      mode='tool'
      type='default'
      fill='ghost'
      icon={<Trash2 />}
      iconPosition='top'
    />,
  ];

  const menuButtonsOne = [
      { label: {text: 'Menu item 1'}, onClick: () => {} },
      { label: {text: 'Menu item 2', type: 'green', items: 4}, onClick: () => {} },
      { label: {text: 'Menu item 3'}, onClick: () => {} },
    ];

  return (
    <div className="flex">
      <Toolbar 
        items={[
          { id: '1', item: toolbarItems[0], onClick: () => {} },
          { id: '2', item: toolbarItems[1], onClick: () => {} },
          { id: '3', item: toolbarItems[2], onClick: () => {}, menu: { items: menuButtonsOne as MenuItem[] }},
          { id: '4', item: toolbarItems[3], onClick: () => {} },
          { id: '5', item: toolbarItems[4], onClick: () => {} },
          { id: '6', item: toolbarItems[5], onClick: () => {} },
        ]}
        type="button"
        rounded='lg'
      />
    </div>
  );
};
buttonToolbar.parameters = { controls: { disable: true } };