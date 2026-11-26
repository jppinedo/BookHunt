import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Box, { BoxProps } from './Box';
import Title from '@atoms/Title/Title';
import Button from '../Button/Button';
import Background from '@atoms/Background/Background';

export default {
  title: 'Atoms/Box',
  component: Box,
  argTypes: {
    type: { control: 'select', options: ['default', 'glass'] },
    shadow: { control: 'select', options: ['none', 'soft', 'card'] },
    className: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
    header: { control: false, table: { disable: true } },
    footer: { control: false, table: { disable: true } },
    headerOutside: { control: 'boolean' },
  },
} as Meta;

const Template: StoryFn<BoxProps> = (args) => (
  <div className='p-3'><Box {...args} /></div>
);

export const Default = Template.bind({});
Default.args = {
  header: <Title size='lg'>Sample title</Title>,
  footer: <Button label='Click me' type='red' onClick={() => console.log('Button clicked')} />,
  children: (
    <p className='mt-2 mb-4 text-gray-600 dark:text-blue-200'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc at pellentesque aliquet nisl.
    </p>
  ),
  className: 'w-5/12',
  type: 'default',
  headerOutside: false,
  shadow: 'none',
};
Default.tags = ['!dev'];

export const HeaderOutside = Template.bind({});
HeaderOutside.args = {
  ...Default.args,
  headerOutside: true,
};
HeaderOutside.tags = ['!dev'];

export const ProductPanel = () => (
  <div className='w-full p-3'>
    <Box
      type='default'
      shadow='soft'
      className='w-full'
      header={
        <Title size='lg' fontFamily='playfair' thikness='bold'>
          Quarterly overview
        </Title>
      }
      footer={
        <Button
          label='View report'
          type='green'
          onClick={() => console.log('View report')}
        />
      }
    >
      <p className='mt-2 mb-4 text-gray-600 dark:text-blue-200'>
        Revenue and retention held steady this quarter. Open the full report for
        channel breakdowns and cohort trends.
      </p>
    </Box>
  </div>
);
ProductPanel.parameters = { controls: { disable: true } };

export const GlassPanel = () => (
  <Background
    type='dotted'
    colors={['pio-bg-light', 'pio-grid']}
    isHexColors={false}
    vignette
    className='w-full px-6 py-8'
  >
    <Box
      type='glass'
      shadow='card'
      className='w-full text-pio-text'
      header={
        <Title size='xl' fontFamily='jakarta' thikness='bold'>
          Focus mode
        </Title>
      }
      footer={
        <Button
          label='Start session'
          type='yellow'
          onClick={() => console.log('Start session')}
        />
      }
    >
      <p className='mt-2 mb-4 text-pio-text-muted'>
        Dim distractions and keep a single task in view. Sessions pause
        notifications until you finish or end early.
      </p>
    </Box>
  </Background>
);
GlassPanel.parameters = { controls: { disable: true } };
