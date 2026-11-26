import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Card, { CardProps } from './Card';

export default {
  title: 'Atoms/Card',
  component: Card,
  argTypes: {
    children: { control: 'text' },
    padded: { control: 'boolean' },
    radius: { control: 'select', options: ['2xl', '3xl'] },
    surface: { control: 'select', options: ['white', 'subtle', 'transparent'] },
    shadow: { control: 'select', options: ['soft', 'card', 'none'] },
    className: { control: false, table: { disable: true } },
  },
} as Meta;

const Template: StoryFn<CardProps> = (args) => (
  <Card {...args}>{args.children}</Card>
);

export const Default = Template.bind({});
Default.args = {
  children: 'Elevated card with pio-grid border and soft shadow.',
  padded: true,
  radius: '3xl',
  surface: 'white',
  shadow: 'soft',
};
Default.tags = ['!dev'];

export const Surfaces = () => (
  <div className="flex flex-col gap-4 max-w-xl">
    <Card>White card, rounded-3xl, shadow-pio-soft.</Card>
    <Card surface="subtle" radius="2xl" shadow="card">
      Subtle nested panel (pio-bg-light), rounded-2xl, shadow-pio-card.
    </Card>
  </div>
);
Surfaces.parameters = { controls: { disable: true } };
