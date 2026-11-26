import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import { Moon, Sun } from 'react-feather';
import Switch, { SwitchProps } from './Switch';
import Label from '@atoms/Label/Label';

export default {
  title: 'Atoms/Switch',
  component: Switch,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
      },
    },
    type: { control: 'select', options: ['default', 'red', 'green', 'yellow'] },
    isActive: { control: 'boolean' },
    className: { control: false, table: { disable: true } },
    onChange: { control: false, table: { disable: true } },
    offLabel: { control: 'text' },
    onLabel: { control: 'text' },
    offIcon: { control: false, table: { disable: true } },
    onIcon: { control: false, table: { disable: true } },
  },
} as Meta;

const Template: StoryFn<SwitchProps> = (args) => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 'md',
  type: 'default',
  isActive: false,
};
Default.tags = ['!dev'];

export const Sizes = () => {
  const [activeSwitches, setActiveSwitches] = useState([false, false, false]);

  const toggleSwitch = (index: number) => {
    const updatedSwitches = activeSwitches.map((_, i) =>
      i === index ? !activeSwitches[i] : activeSwitches[i],
    );
    setActiveSwitches(updatedSwitches);
  };

  return (
    <div className="w-full min-h-[360px] flex flex-col items-center justify-center gap-8 p-6">
      <div className="flex items-center justify-center gap-6">
        <Switch size="sm" type="green" isActive />
        <Switch size="md" type="green" isActive />
        <Switch size="lg" type="green" isActive />
      </div>

      <div className="flex flex-col items-start gap-5">
        <span
          tabIndex={0}
          onClick={() => toggleSwitch(0)}
          className="flex items-center cursor-pointer rounded-full hover:bg-gray-opacity-14 py-1 px-3"
        >
          <Switch size="sm" type="green" isActive={activeSwitches[0]} className="mr-2" />
          <Label
            text="Some setting here"
            type={activeSwitches[0] ? 'green' : 'default'}
          />
        </span>
        <span
          tabIndex={0}
          onClick={() => toggleSwitch(1)}
          className="flex items-center cursor-pointer rounded-full hover:bg-gray-opacity-14 py-1 px-3"
        >
          <Switch size="md" type="green" isActive={activeSwitches[1]} className="mr-2" />
          <Label text="Some setting here" />
        </span>
        <span
          tabIndex={0}
          onClick={() => toggleSwitch(2)}
          className="flex items-center cursor-pointer rounded-full hover:bg-gray-opacity-14 py-1 px-3"
        >
          <Switch size="lg" type="green" isActive={activeSwitches[2]} className="mr-2" />
          <Label text="Some setting here" />
        </span>
      </div>
    </div>
  );
};
Sizes.parameters = { controls: { disable: true } };

export const Types = () => {
  const types: Array<NonNullable<SwitchProps['type']>> = [
    'default',
    'green',
    'red',
    'yellow',
  ];
  const [active, setActive] = useState([true, true, true, true]);

  return (
    <div className="w-full min-h-[360px] flex items-center justify-center p-6">
      <div className="flex flex-col gap-6">
        {types.map((type, index) => (
          <span
            key={type}
            tabIndex={0}
            onClick={() =>
              setActive((prev) => prev.map((v, i) => (i === index ? !v : v)))
            }
            className="flex items-center cursor-pointer gap-3"
          >
            <Switch type={type} isActive={active[index]} />
            <Label text={type} type={type} />
          </span>
        ))}
      </div>
    </div>
  );
};
Types.parameters = { controls: { disable: true } };

export const Segmented = () => {
  const types: Array<NonNullable<SwitchProps['type']>> = [
    'default',
    'green',
    'red',
    'yellow',
  ];
  const [activeByType, setActiveByType] = useState<Record<string, boolean>>({
    default: false,
    green: true,
    red: false,
    yellow: true,
  });
  const [showcaseActive, setShowcaseActive] = useState(false);

  return (
    <div className="w-full min-h-[360px] flex flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col items-start gap-4">
        {types.map((type) => (
          <div key={type} className="flex items-center gap-3">
            <Switch
              size="md"
              type={type}
              isActive={activeByType[type]}
              onChange={(next) =>
                setActiveByType((prev) => ({ ...prev, [type]: next }))
              }
              offLabel="Light"
              onLabel="Dark"
              offIcon={<Sun strokeWidth={2} className="text-pio-amber" />}
              onIcon={<Moon strokeWidth={2} />}
            />
            <Label text={type} type={type} />
          </div>
        ))}
      </div>

      <div className="inline-flex items-center gap-4 rounded-full bg-white border border-pio-grid px-4 py-2 shadow-xs dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pio-coral shrink-0" aria-hidden />
          <span className="text-[10px] font-bold uppercase tracking-wide text-pio-text font-jakarta dark:text-blue-200">
            Interactive Showcase
          </span>
        </div>
        <Switch
          size="md"
          type="default"
          isActive={showcaseActive}
          onChange={setShowcaseActive}
          offLabel="Light"
          onLabel="Dark"
          offIcon={<Sun strokeWidth={2} className="text-pio-amber" />}
          onIcon={<Moon strokeWidth={2} />}
        />
      </div>
    </div>
  );
};
Segmented.parameters = { controls: { disable: true } };
