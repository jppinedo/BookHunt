import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import Button, { ButtonProps } from './Button';
import { Copy, Crop, Codepen, Codesandbox, Command, Trash2, Bold, Italic, Share2, Airplay, Save, Loader } from 'react-feather';

/** Select keys for Live Preview; Storybook `mapping` turns them into icon elements. */
const iconControlMap: Record<string, React.ReactElement | null> = {
  None: null,
  Copy: <Copy />,
  Crop: <Crop />,
  Bold: <Bold />,
  Italic: <Italic />,
  Save: <Save />,
  Share: <Share2 />,
  Trash: <Trash2 />,
  Codepen: <Codepen />,
  Command: <Command />,
};

type IconControlKey = keyof typeof iconControlMap;

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    label: { control: 'text' },
    mode: { control: 'select', options: ['default', 'tool'] },
    type: { control: 'select', options: ['default', 'red', 'green', 'yellow'] },
    fill: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    icon: {
      name: 'Icon',
      control: 'select',
      options: Object.keys(iconControlMap) as IconControlKey[],
      mapping: iconControlMap,
    },
    iconPosition: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    onClick: { control: false, table: { disable: true } },
    ariaLabel: { control: false, table: { disable: true } },
  },
} as Meta;

const click = (name: string) => () => action(`${name} Button clicked!`)();

export const Variants = () => (
  <div className="p-6 w-full min-h-[360px]">
    <div className="grid grid-cols-2 gap-10 h-full min-h-[320px]">
      <div className="flex flex-col items-center justify-evenly gap-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button label="Red Solid" onClick={click('Red Solid')} ariaLabel="Red Solid Button" type="red" fill="solid" />
          <Button label="Green Solid" onClick={click('Green Solid')} ariaLabel="Green Solid Button" type="green" fill="solid" />
          <Button label="Yellow Solid" onClick={click('Yellow Solid')} ariaLabel="Yellow Solid Button" type="yellow" fill="solid" />
          <Button label="Default Solid" onClick={click('Default Solid')} ariaLabel="Default Solid Button" type="default" fill="solid" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button label="Red Outline" onClick={click('Red Outline')} ariaLabel="Red Outline Button" type="red" fill="outline" />
          <Button label="Green Outline" onClick={click('Green Outline')} ariaLabel="Green Outline Button" type="green" fill="outline" />
          <Button label="Yellow Outline" onClick={click('Yellow Outline')} ariaLabel="Yellow Outline Button" type="yellow" fill="outline" />
          <Button label="Default Outline" onClick={click('Default Outline')} ariaLabel="Default Outline Button" type="default" fill="outline" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-evenly gap-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button label="Red ghost" onClick={click('Red ghost')} ariaLabel="Red ghost Button" type="red" fill="ghost" />
          <Button label="Green ghost" onClick={click('Green ghost')} ariaLabel="Green ghost Button" type="green" fill="ghost" />
          <Button label="Yellow ghost" onClick={click('Yellow ghost')} ariaLabel="Yellow ghost Button" type="yellow" fill="ghost" />
          <Button label="Default ghost" onClick={click('Default ghost')} ariaLabel="Default ghost Button" type="default" fill="ghost" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button label="Red Icon" onClick={click('Red Icon')} ariaLabel="Red Icon Button" type="red" fill="outline" icon={<Codepen />} />
          <Button label="Green Icon" onClick={click('Green Icon')} ariaLabel="Green Icon Button" type="green" fill="solid" icon={<Codesandbox />} />
          <Button label="Yellow Icon" onClick={click('Yellow Icon')} ariaLabel="Yellow Icon Button" type="yellow" fill="outline" icon={<Command />} iconPosition="right" />
          <Button label="Default Icon" onClick={click('Default Icon')} ariaLabel="Default Icon Button" type="default" fill="ghost" icon={<Crop />} iconPosition="right" />
        </div>
      </div>
    </div>
  </div>
);

export const Tools = () => (
  <div className="p-6 flex flex-col items-center gap-8">
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button label="Copy" onClick={click('Copy Tool')} ariaLabel="Copy Tool Button" mode="tool" type="default" fill="ghost" icon={<Copy />} iconPosition="top" />
      <Button label="Bold" onClick={click('Bold Tool')} ariaLabel="Bold Tool Button" mode="tool" type="default" fill="ghost" icon={<Bold />} iconPosition="top" />
      <Button label="Italic" onClick={click('Italic Tool')} ariaLabel="Italic Tool Button" mode="tool" type="default" fill="ghost" icon={<Italic />} iconPosition="top" />
      <Button label="Crop" onClick={click('Crop Tool')} ariaLabel="Crop Tool Button" mode="tool" type="default" fill="ghost" icon={<Crop />} iconPosition="top" />
      <Button label="Delete" onClick={click('Delete Tool')} ariaLabel="Delete Tool Button" mode="tool" type="default" fill="ghost" icon={<Trash2 />} iconPosition="top" />
    </div>

    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button label="Share" onClick={click('Share Tool')} ariaLabel="Share Tool Button" mode="tool" type="green" fill="solid" icon={<Share2 />} iconPosition="top" />
      <Button label="Airplay" onClick={click('Airplay Tool')} ariaLabel="Airplay Tool Button" mode="tool" type="red" fill="solid" icon={<Airplay />} iconPosition="top" />
      <Button label="Save" onClick={click('Save Tool')} ariaLabel="Save Tool Button" mode="tool" type="yellow" fill="solid" icon={<Save />} iconPosition="top" />
      <Button label="Create" onClick={click('Create Tool')} ariaLabel="Create Tool Button" mode="tool" type="default" fill="solid" icon={<Loader />} iconPosition="top" />
    </div>

    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button label="Share" onClick={click('Share Outline Tool')} ariaLabel="Share Outline Tool Button" mode="tool" type="green" fill="outline" icon={<Share2 />} iconPosition="top" />
      <Button label="Airplay" onClick={click('Airplay Outline Tool')} ariaLabel="Airplay Outline Tool Button" mode="tool" type="red" fill="outline" icon={<Airplay />} iconPosition="top" />
      <Button label="Save" onClick={click('Save Outline Tool')} ariaLabel="Save Outline Tool Button" mode="tool" type="yellow" fill="outline" icon={<Save />} iconPosition="top" />
      <Button label="Create" onClick={click('Create Outline Tool')} ariaLabel="Create Outline Tool Button" mode="tool" type="default" fill="outline" icon={<Loader />} iconPosition="top" />
    </div>

    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button onClick={click('Airplay Icon Tool')} ariaLabel="Airplay Icon Tool Button" mode="tool" type="default" fill="ghost" icon={<Airplay size={18} />} iconPosition="top" />
      <Button onClick={click('Save Icon Tool')} ariaLabel="Save Icon Tool Button" mode="tool" type="default" fill="ghost" icon={<Save size={18} />} iconPosition="top" />
      <Button onClick={click('Create Icon Tool')} ariaLabel="Create Icon Tool Button" mode="tool" type="default" fill="ghost" icon={<Loader size={18} />} iconPosition="top" />
      <Button onClick={click('Copy Icon Tool')} ariaLabel="Copy Icon Tool Button" mode="tool" type="default" fill="ghost" icon={<Copy size={18} />} iconPosition="top" />
      <Button onClick={click('Bold Icon Tool')} ariaLabel="Bold Icon Tool Button" mode="tool" type="default" fill="ghost" icon={<Bold size={18} />} iconPosition="top" />
      <Button onClick={click('Italic Icon Tool')} ariaLabel="Italic Icon Tool Button" mode="tool" type="default" fill="ghost" icon={<Italic size={18} />} iconPosition="top" />
      <Button onClick={click('Crop Icon Tool')} ariaLabel="Crop Icon Tool Button" mode="tool" type="default" fill="ghost" icon={<Crop size={18} />} iconPosition="top" />
      <Button onClick={click('Delete Icon Tool')} ariaLabel="Delete Icon Tool Button" mode="tool" type="default" fill="ghost" icon={<Trash2 size={18} />} iconPosition="top" />
    </div>
  </div>
);

const Template: StoryFn<ButtonProps> = (args) => (
  <div className="p-3"><Button {...args} /></div>
);

export const Default = Template.bind({});
Default.args = {
  label: 'Red Solid',
  onClick: () => action('Red Solid Button clicked!')(),
  ariaLabel: 'Red Solid Button',
  type: 'red',
  fill: 'solid',
  size: 'lg',
  // Key into `iconControlMap` (mapped to a React node before render)
  icon: 'None' as unknown as ButtonProps['icon'],
};
Default.tags = ['!dev'];

const emptyControls = { controls: { disable: true } };
Variants.parameters = emptyControls;
Tools.parameters = emptyControls;
