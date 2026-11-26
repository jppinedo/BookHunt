import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import LineChart, { LineChartProps, LineChartDataItem } from './LineChart';

/** Pio chart series colors as CSS variables (tokens.css). */
const PIO_COLORS = {
  tealDark: 'rgb(var(--lz-pio-teal-dark))',
  amber: 'rgb(var(--lz-pio-amber))',
  coral: 'rgb(var(--lz-pio-coral))',
  stone: 'rgb(var(--lz-pio-stone))',
} as const;

export default {
  title: 'Molecules/LineChart',
  component: LineChart,
  argTypes: {
    height: { name: 'Height', control: 'number' },
    showGrid: { name: 'Show grid', control: 'boolean' },
    showTooltip: { name: 'Show tooltip', control: 'boolean' },
    showLegend: { name: 'Show legend', control: 'boolean' },
    showDots: { name: 'Show dots', control: 'boolean' },
    curveType: {
      name: 'Curve type',
      control: 'select',
      options: ['monotone', 'linear', 'step'],
    },
    data: { control: false, table: { disable: true } },
    series: { control: false, table: { disable: true } },
    xAxisKey: { control: false, table: { disable: true } },
    width: { control: false, table: { disable: true } },
    yAxisDomain: { control: false, table: { disable: true } },
    referenceLines: { control: false, table: { disable: true } },
  },
} as Meta;

const sampleData: LineChartDataItem[] = [
  { day: 'Mon', series1: 0.6, series2: 2.1 },
  { day: 'Tue', series1: 1.2, series2: 2.3 },
  { day: 'Wed', series1: 2.9, series2: 1.5 },
  { day: 'Thu', series1: 2.0, series2: 2.4 },
  { day: 'Fri', series1: 0.9, series2: 3.7 },
  { day: 'Sat', series1: 2.5, series2: 1.4 },
  { day: 'Sun', series1: 2.2, series2: 1.5 },
];

const comparisonData: LineChartDataItem[] = [
  { day: 'Mon', revenue: 1.2, costs: 0.8, margin: 0.4 },
  { day: 'Tue', revenue: 1.8, costs: 1.0, margin: 0.8 },
  { day: 'Wed', revenue: 1.5, costs: 1.1, margin: 0.4 },
  { day: 'Thu', revenue: 2.4, costs: 1.3, margin: 1.1 },
  { day: 'Fri', revenue: 2.1, costs: 1.5, margin: 0.6 },
  { day: 'Sat', revenue: 2.8, costs: 1.4, margin: 1.4 },
  { day: 'Sun', revenue: 2.2, costs: 1.2, margin: 1.0 },
];

const forecastData: LineChartDataItem[] = [
  { day: 'Mon', actual: 1.1, forecast: 1.0 },
  { day: 'Tue', actual: 1.4, forecast: 1.3 },
  { day: 'Wed', actual: 1.8, forecast: 1.7 },
  { day: 'Thu', actual: 1.6, forecast: 2.0 },
  { day: 'Fri', actual: 2.2, forecast: 2.3 },
  { day: 'Sat', actual: 2.5, forecast: 2.6 },
  { day: 'Sun', actual: 2.3, forecast: 2.8 },
];

const thresholdData: LineChartDataItem[] = [
  { day: 'Mon', value: 1.4 },
  { day: 'Tue', value: 1.9 },
  { day: 'Wed', value: 2.6 },
  { day: 'Thu', value: 2.1 },
  { day: 'Fri', value: 3.2 },
  { day: 'Sat', value: 2.4 },
  { day: 'Sun', value: 2.8 },
];

const defaultSeries = [
  {
    dataKey: 'series1',
    name: 'Series 1',
    stroke: PIO_COLORS.tealDark,
    dotFill: PIO_COLORS.tealDark,
    dotStroke: PIO_COLORS.tealDark,
  },
  {
    dataKey: 'series2',
    name: 'Series 2',
    stroke: PIO_COLORS.amber,
    dotFill: PIO_COLORS.amber,
    dotStroke: PIO_COLORS.amber,
  },
];

const Template: StoryFn<LineChartProps> = (args) => (
  <LineChart {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: sampleData,
  series: defaultSeries,
  xAxisKey: 'day',
  height: 280,
  showGrid: false,
  showTooltip: true,
  showLegend: false,
  showDots: true,
  curveType: 'monotone',
  yAxisDomain: [0, 4],
};
Default.tags = ['!dev'];

export const Comparison = Template.bind({});
Comparison.args = {
  data: comparisonData,
  series: [
    {
      dataKey: 'revenue',
      name: 'Revenue',
      stroke: PIO_COLORS.tealDark,
    },
    {
      dataKey: 'costs',
      name: 'Costs',
      stroke: PIO_COLORS.amber,
    },
    {
      dataKey: 'margin',
      name: 'Margin',
      stroke: PIO_COLORS.coral,
    },
  ],
  xAxisKey: 'day',
  height: 280,
  showGrid: true,
  showTooltip: true,
  showLegend: true,
  showDots: true,
  yAxisDomain: [0, 3.5],
};
Comparison.parameters = { controls: { disable: true }, layout: 'fullscreen' };

export const ActualVsForecast = Template.bind({});
ActualVsForecast.args = {
  data: forecastData,
  series: [
    {
      dataKey: 'actual',
      name: 'Actual',
      stroke: PIO_COLORS.tealDark,
    },
    {
      dataKey: 'forecast',
      name: 'Forecast',
      stroke: PIO_COLORS.amber,
      strokeDasharray: '6 4',
      showDots: false,
    },
  ],
  xAxisKey: 'day',
  height: 280,
  showGrid: true,
  showTooltip: true,
  showLegend: true,
  showDots: true,
  yAxisDomain: [0, 3.5],
};
ActualVsForecast.parameters = { controls: { disable: true }, layout: 'fullscreen' };

export const WithThreshold = Template.bind({});
WithThreshold.args = {
  data: thresholdData,
  series: [
    {
      dataKey: 'value',
      name: 'Value',
      stroke: PIO_COLORS.tealDark,
    },
  ],
  xAxisKey: 'day',
  height: 280,
  showGrid: true,
  showTooltip: true,
  showLegend: false,
  showDots: true,
  yAxisDomain: [0, 4],
  referenceLines: [
    {
      y: 2.5,
      label: 'Target',
      stroke: PIO_COLORS.stone,
      strokeDasharray: '4 4',
    },
  ],
};
WithThreshold.parameters = { controls: { disable: true }, layout: 'fullscreen' };
