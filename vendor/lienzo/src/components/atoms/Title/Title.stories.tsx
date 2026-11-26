import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Title, { TitleProps } from './Title';

export default {
  title: 'Atoms/Title',
  component: Title,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'xxl', 'xxxl', 'xxxxl'],
    },
    fontFamily: {
      control: 'select',
      options: ['lexend', 'poppins', 'playfair', 'jakarta'],
    },
    thikness: { control: 'select', options: ['thin', 'regular', 'bold'] },
    children: { control: 'text' },
    className: { control: false, table: { disable: true } },
    uppercase: { control: 'boolean' },
    dot: { control: 'boolean' },
    dotTone: { control: 'select', options: ['coral', 'teal', 'amber'] },
    gradient: {
      control: 'select',
      options: [
        'amber-dawn',
        'studio-teal',
        'charcoal-depth',
        'coral-ember',
        'teal-mist',
        'deep-coral',
      ],
    },
    color: {
      control: 'select',
      options: ['coral', 'teal', 'amber', 'stone'],
    },
  },
} as Meta;

const Template: StoryFn<TitleProps> = (args) => <Title {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 'xxxl',
  fontFamily: 'jakarta',
  thikness: 'bold',
  gradient: 'amber-dawn',
  uppercase: false,
  dot: false,
  children: 'Built to dazzle.',
};
Default.tags = ['!dev'];

export const Sizes = () => (
  <div className="flex flex-col gap-4">
    <Title size="sm" fontFamily="jakarta" thikness="bold">
      sm — Section label
    </Title>
    <Title size="md" fontFamily="jakarta" thikness="bold">
      md — Body heading
    </Title>
    <Title size="lg" fontFamily="jakarta" thikness="bold">
      lg — Subsection
    </Title>
    <Title size="xl" fontFamily="playfair" thikness="bold">
      xl — Page title
    </Title>
    <Title size="xxl" fontFamily="playfair" thikness="bold">
      xxl — Hero line
    </Title>
    <Title size="xxxl" fontFamily="jakarta" thikness="bold">
      xxxl — Display
    </Title>
    <Title size="xxxxl" fontFamily="jakarta" thikness="bold">
      xxxxl — Billboard
    </Title>
  </div>
);
Sizes.parameters = { controls: { disable: true } };

export const Gradients = () => (
  <div className="flex flex-col gap-6">
    <Title size="xxxl" fontFamily="jakarta" thikness="bold" gradient="amber-dawn">
      Amber Dawn
    </Title>
    <Title size="xxxl" fontFamily="jakarta" thikness="bold" gradient="studio-teal">
      Studio Teal
    </Title>
    <Title size="xxxl" fontFamily="jakarta" thikness="bold" gradient="charcoal-depth">
      Charcoal Depth
    </Title>
    <Title size="xxxl" fontFamily="jakarta" thikness="bold" gradient="coral-ember">
      Coral Ember
    </Title>
    <Title size="xxxl" fontFamily="jakarta" thikness="bold" gradient="teal-mist">
      Teal Mist
    </Title>
    <Title size="xxxl" fontFamily="jakarta" thikness="bold" gradient="deep-coral">
      Deep Coral
    </Title>
  </div>
);
Gradients.parameters = { controls: { disable: true } };

export const Colors = () => (
  <div className="flex flex-col gap-4">
    <Title size="xxxl" fontFamily="jakarta" thikness="bold" color="coral">
      Coral
    </Title>
    <Title size="xxxl" fontFamily="jakarta" thikness="bold" color="teal">
      Teal
    </Title>
    <Title size="xxxl" fontFamily="jakarta" thikness="bold" color="amber">
      Amber
    </Title>
    <Title size="xxxl" fontFamily="jakarta" thikness="bold" color="stone">
      Stone
    </Title>
  </div>
);
Colors.parameters = { controls: { disable: true } };

export const Fonts = () => (
  <div className="flex flex-col gap-3">
    <Title size="xxl" fontFamily="lexend" thikness="bold">
      Lexend
    </Title>
    <Title size="xxl" fontFamily="poppins" thikness="bold">
      Poppins
    </Title>
    <Title size="xxl" fontFamily="playfair" thikness="bold">
      Playfair Display
    </Title>
    <Title size="xxl" fontFamily="jakarta" thikness="bold">
      Plus Jakarta Sans
    </Title>
  </div>
);
Fonts.parameters = { controls: { disable: true } };

export const UppercaseWithDot = () => (
  <div className="flex flex-col gap-3">
    <Title uppercase dot dotTone="coral" size="sm" fontFamily="jakarta" thikness="bold">
      Overview
    </Title>
    <Title uppercase dot dotTone="teal" size="sm" fontFamily="jakarta" thikness="bold">
      Scenarios
    </Title>
    <Title uppercase dot dotTone="amber" size="sm" fontFamily="jakarta" thikness="bold">
      Implementation
    </Title>
  </div>
);
UppercaseWithDot.parameters = { controls: { disable: true } };

export const SectionPair = () => (
  <div className="flex flex-col gap-6">
    <div>
      <Title uppercase dot dotTone="coral" size="sm" fontFamily="jakarta" thikness="bold">
        Overview
      </Title>
      <Title fontFamily="playfair" size="xxl" thikness="bold">
        Component Description
      </Title>
    </div>
    <div>
      <Title uppercase dot dotTone="teal" size="sm" fontFamily="jakarta" thikness="bold">
        Scenarios
      </Title>
      <Title fontFamily="playfair" size="xxl" thikness="bold">
        Common Use Cases
      </Title>
    </div>
  </div>
);
SectionPair.parameters = { controls: { disable: true } };
