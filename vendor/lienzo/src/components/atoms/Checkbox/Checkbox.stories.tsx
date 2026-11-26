import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Checkbox, { CheckboxProps } from './Checkbox';
import Label from '@components/atoms/Label/Label';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['default', 'red', 'green', 'yellow'] },
    isChecked: { control: 'boolean' },
    className: { control: false, table: { disable: true } },
    onChange: { control: false, table: { disable: true } },
  },
};

export default meta;

const Template: StoryFn<CheckboxProps> = (args) => <Checkbox {...args}/>;

export const Default = Template.bind({});
Default.args = {
  size: 'md',
  type: 'default',
  isChecked: false,
};
Default.tags = ['!dev'];

const SizesTemplate: StoryFn = () => {
  const [activeChecks, setActiveChecks] = useState([false, false, false]);
  const toggleCheck = (index: number) => {
    const updatedChecks = activeChecks.map((_, i) =>
      i === index ? !activeChecks[i] : activeChecks[i],
    );
    setActiveChecks(updatedChecks);
  };

  return (
    <div className="w-full min-h-[360px] flex flex-col items-center justify-center gap-8 p-6">
      <div className="flex items-center justify-center gap-6">
        <Checkbox size="sm" type="green" isChecked />
        <Checkbox size="md" type="green" isChecked />
        <Checkbox size="lg" type="green" isChecked />
      </div>

      <div className="flex flex-col items-start gap-5">
        <span
          tabIndex={0}
          onClick={() => toggleCheck(0)}
          className="flex items-center cursor-pointer rounded-full hover:bg-gray-opacity-14 py-1 px-3"
        >
          <Checkbox size="sm" type="green" isChecked={activeChecks[0]} className="mr-2" />
          <Label text="Checkbox sm" />
        </span>
        <span
          tabIndex={0}
          onClick={() => toggleCheck(1)}
          className="flex items-center cursor-pointer rounded-full hover:bg-gray-opacity-14 py-1 px-3"
        >
          <Checkbox size="md" type="green" isChecked={activeChecks[1]} className="mr-2" />
          <Label text="Checkbox md" />
        </span>
        <span
          tabIndex={0}
          onClick={() => toggleCheck(2)}
          className="flex items-center cursor-pointer rounded-full hover:bg-gray-opacity-14 py-1 px-3"
        >
          <Checkbox size="lg" type="green" isChecked={activeChecks[2]} className="mr-2" />
          <Label text="Checkbox lg" />
        </span>
      </div>
    </div>
  );
};

export const Sizes = SizesTemplate.bind({});
Sizes.parameters = { controls: { disable: true } };

const TypesTemplate: StoryFn = () => {
  const types: Array<NonNullable<CheckboxProps['type']>> = [
    'default',
    'green',
    'red',
    'yellow',
  ];
  const [checked, setChecked] = useState([true, true, true, true]);

  return (
    <div className="w-full min-h-[360px] flex items-center justify-center p-6">
      <div className="flex flex-col gap-6">
        {types.map((type, index) => (
          <span
            key={type}
            tabIndex={0}
            onClick={() =>
              setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)))
            }
            className="flex items-center cursor-pointer gap-3"
          >
            <Checkbox type={type} isChecked={checked[index]} />
            <Label text={type} type={type} />
          </span>
        ))}
      </div>
    </div>
  );
};

export const Types = TypesTemplate.bind({});
Types.parameters = { controls: { disable: true } };
