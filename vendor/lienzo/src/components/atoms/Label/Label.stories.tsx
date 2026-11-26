import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Label, { LabelProps } from './Label';
import { Archive, Camera, Clock, Gift } from 'react-feather';

export default {
  title: 'Atoms/Label',
  component: Label,
  argTypes: {
    className: { control: false, table: { disable: true } },
    items: { control: 'number' },
    type: { control: 'select', options: ['default', 'red', 'yellow', 'green'] },
    text: { control: 'text' },
    icon: { control: false, table: { disable: true } },
  },
} as Meta;

const Template: StoryFn<LabelProps> = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: 1,
  type: 'default',
  text: 'Label',
};
Default.tags = ['!dev'];

export const AllColors = () => (
  <>
  <div className='flex gap-6 mb-8'>
    <Label className="" text="Default text here" />
    <Label className="" type="red" text="Some of the red" />
    <Label className="" type="yellow" text="Why not yellow" />
    <Label className="" type="green" text="Green is life" />
  </div>
  <div className="flex gap-6 mb-8">
    <Label className="" items={3} text="Default text here" />
    <Label className="" items={7} type="red" text="Some of the red" />
    <Label className="" items={13} type="yellow" text="Why not yellow" />
    <Label className="" items={50} type="green" text="Green is life" />
  </div>
  <div className="flex gap-6 mb-8">
    <Label className="" icon={<Archive />} text="Default text here" />
    <Label className="" icon={<Camera />} type="red" text="Some of the red" />
    <Label className="" icon={<Clock />} type="yellow" text="Why not yellow" />
    <Label className="" icon={<Gift />} type="green" text="Green is life" />
  </div>
  <div className="flex gap-6 mb-8">
    <Label className="" icon={<Archive />} items={3} text="Default text here" />
    <Label className="" icon={<Camera />} items={7} type="red" text="Some of the red" />
    <Label className="" icon={<Clock />} items={13} type="yellow" text="Why not yellow" />
    <Label className="" icon={<Gift />} items={50} type="green" text="Green is life" />
  </div>
  </>
);

AllColors.parameters = { controls: { disable: true } };
