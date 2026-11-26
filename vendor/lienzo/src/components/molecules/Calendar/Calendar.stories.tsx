import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { DateRange } from 'react-day-picker';
import { action } from 'storybook/actions';
import Box from '@atoms/Box/Box';
import Button from '@atoms/Button/Button';
import Calendar from './Calendar';

const submitButton = (
  <Button
    type="green"
    label="Submit"
    onClick={() => action('Submit')()}
    ariaLabel="Submit"
  />
);

const meta: Meta<typeof Calendar> = {
  title: 'Molecules/Calendar',
  component: Calendar,
  decorators: [
    (Story) => (
      <div className="p-3">
      <Box footer={submitButton} className='w-fit p-0'>
        <Story />
      </Box>
      </div>
    ),
  ],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'range'],
    },
    caption: { control: 'text' },
    showOutsideDays: { control: 'boolean' },
    animate: { control: 'boolean' },
    className: { control: false, table: { disable: true } },
    selected: { control: false, table: { disable: true } },
    onSelect: { control: false, table: { disable: true } },
    defaultMonth: { control: false, table: { disable: true } },
    disabled: { control: false, table: { disable: true } },
  },
};
export default meta;

export const Default: StoryObj<typeof Calendar> = {
  args: {
    caption: 'Calendar',
    mode: 'single',
    showOutsideDays: true,
    animate: true,
  },
  tags: ['!dev'],
};

export const Basic: StoryObj<typeof Calendar> = {
  args: {
    caption: 'Calendar',
    mode: 'single',
    showOutsideDays: true,
    animate: true,
  },
  parameters: { controls: { disable: true } },
};

export const SingleWithSelection: StoryObj<typeof Calendar> = {
  parameters: { controls: { disable: true } },
  render: function SingleWithSelection() {
    const [selected, setSelected] = useState<Date | undefined>(new Date(2025, 2, 8));
    return (
      <Calendar
        mode="single"
        caption="Calendar"
        selected={selected}
        onSelect={(value) => setSelected(value instanceof Date ? value : undefined)}
        defaultMonth={new Date(2025, 2)}
      />
    );
  },
};

export const Range: StoryObj<typeof Calendar> = {
  parameters: { controls: { disable: true } },
  render: function RangeStory() {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2025, 2, 8),
      to: new Date(2025, 2, 14),
    });
    return (
      <Calendar
        mode="range"
        caption="Calendar"
        selected={range}
        onSelect={(value) => setRange(value as DateRange | undefined)}
        defaultMonth={new Date(2025, 2)}
      />
    );
  },
};

export const RangeSingleDay: StoryObj<typeof Calendar> = {
  parameters: { controls: { disable: true } },
  render: function RangeSingleDayStory() {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2025, 2, 12),
      to: new Date(2025, 2, 12),
    });
    return (
      <Calendar
        mode="range"
        caption="Calendar"
        selected={range}
        onSelect={(value) => setRange(value as DateRange | undefined)}
        defaultMonth={new Date(2025, 2)}
      />
    );
  },
};

export const CustomMonth: StoryObj<typeof Calendar> = {
  parameters: { controls: { disable: true } },
  args: {
    caption: 'Calendar',
    mode: 'single',
    defaultMonth: new Date(2025, 5),
  },
};

export const CustomCaption: StoryObj<typeof Calendar> = {
  parameters: { controls: { disable: true } },
  args: {
    caption: 'Pick a date',
    mode: 'single',
  },
};
