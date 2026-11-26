import React from 'react';
import {
  ArrowUp,
  BarChart2,
  Bell,
  Folder,
  Grid,
  Home,
  Search,
  X,
} from 'react-feather';
import Button from '@atoms/Button/Button';
import Card from '@atoms/Card/Card';
import CircleSpinner from '@atoms/CircleSpinner/CircleSpinner';
import Input from '@atoms/Input/Input';
import Label from '@atoms/Label/Label';
import Title from '@atoms/Title/Title';
import LineChart from '@molecules/LineChart/LineChart';
import Phone from '@templates/Phone/Phone';

const chartData = [
  { day: 'Mon', coral: 2.8, teal: 1.8 },
  { day: 'Tue', coral: 1.2, teal: 3.2 },
  { day: 'Wed', coral: 2.4, teal: 1.4 },
  { day: 'Thu', coral: 1.6, teal: 2.6 },
  { day: 'Fri', coral: 0.9, teal: 3.4 },
  { day: 'Sat', coral: 2.2, teal: 1.1 },
];

const chartSeries = [
  {
    dataKey: 'coral',
    name: 'Coral',
    stroke: 'rgb(var(--lz-pio-coral))',
    strokeWidth: 2.5,
  },
  {
    dataKey: 'teal',
    name: 'Teal',
    stroke: 'rgb(var(--lz-pio-teal-dark))',
    strokeWidth: 2,
  },
];

const noop = (): void => {};

const navIconMuted =
  'text-pio-text-muted dark:text-blue-200 flex items-center justify-center p-0.5';

const CanvasStudio: React.FC = () => (
  <Phone>
    {/* In-app header */}
    <div className="flex items-center justify-between px-1 mt-0.5 shrink-0">
      <div className="flex flex-col gap-0.5">
        <Label text="UI Showcase" className="text-[11px]!" />
        <Title
          size="sm"
          thikness="bold"
          fontFamily="jakarta"
          className="text-[16px]! leading-tight! text-pio-text dark:text-blue-200"
        >
          Welcome, Developer!
        </Title>
      </div>
      <button
        type="button"
        aria-label="Notifications"
        className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-pio-grid dark:border-gray-600 shadow-xs flex items-center justify-center text-pio-text dark:text-blue-200"
        onClick={noop}
      >
        <Bell size={16} strokeWidth={2} />
      </button>
    </div>

    <div className="shrink-0 [&_.input]:w-full">
      <Input
        placeholder="Search"
        icon={<Search strokeWidth={2} />}
        iconPosition="left"
        rounded="full"
        fill="solid"
      />
    </div>

    {/* Pio Chart card */}
    <Card padded={false} radius="2xl" shadow="soft" className="p-3 flex flex-col gap-1 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-pio-text dark:text-blue-200">
          Line chart
        </span>
        <Label text="Active Spline" type="red" className="text-[10px]! font-mono font-bold" />
      </div>
      <LineChart
        data={chartData}
        series={chartSeries}
        xAxisKey="day"
        height={100}
        showGrid
        showDots
        showTooltip={false}
        showLegend={false}
        curveType="monotone"
        yAxisDomain={[0, 4]}
      />
    </Card>

    {/* Notification toast row */}
    <Card padded={false} radius="2xl" shadow="soft" className="p-2.5 flex items-center justify-between gap-2 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-pio-coral-pale dark:bg-pio-coral-opacity-20 text-pio-coral flex items-center justify-center shrink-0">
          <Bell size={15} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-pio-text dark:text-blue-200 leading-tight truncate">
            Notification Toast
          </span>
          <span className="text-[9px] text-pio-text-muted dark:text-blue-200/70 leading-tight truncate">
            Smooth spring micro-interaction
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        className="text-pio-text-muted dark:text-blue-200 shrink-0 p-0.5 flex items-center justify-center"
        onClick={noop}
      >
        <X size={14} strokeWidth={2} />
      </button>
    </Card>

    {/* Button color variants + CircleSpinners */}
    <div className="grid grid-cols-2 gap-2 shrink-0">
      <Card padded={false} radius="2xl" surface="subtle" shadow="none" className="flex flex-col gap-1.5 p-2">
        <span className="text-[9px] font-semibold text-pio-text-muted dark:text-blue-200/70 px-0.5">
          Button colors
        </span>
        <div className="flex gap-1">
          <div className="flex-1 [&_button]:w-full [&_button]:rounded-full!">
            <Button label="Coral" size="xs" type="red" fill="solid" onClick={noop} />
          </div>
          <div className="flex-1 [&_button]:w-full [&_button]:rounded-full!">
            <Button label="Teal" size="xs" type="green" fill="solid" onClick={noop} />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex-1 [&_button]:w-full [&_button]:rounded-full!">
            <Button label="Amber" size="xs" type="yellow" fill="solid" onClick={noop} />
          </div>
          <div className="flex-1 [&_button]:w-full [&_button]:rounded-full!">
            <Button label="Gray" size="xs" type="default" fill="solid" onClick={noop} />
          </div>
        </div>
      </Card>

      <Card padded={false} radius="2xl" shadow="soft" className="p-2 flex flex-col items-center justify-center gap-2 min-h-[88px]">
        <div className="flex items-center justify-center gap-2">
          <CircleSpinner colorClass="bg-pio-coral" thickness={0.35} size="2.25rem" />
          <CircleSpinner colorClass="bg-pio-teal-dark" thickness={0.35} size="2.25rem" />
          <CircleSpinner colorClass="bg-pio-amber" thickness={0.35} size="2.25rem" />
        </div>
      </Card>
    </div>

    {/* Floating bottom nav — Card surface so light/dark tokens apply */}
    <Card
      padded={false}
      radius="3xl"
      shadow="soft"
      surface="white"
      className="rounded-full! mt-auto shrink-0 py-2.5 px-5 flex items-center justify-between"
    >
      <nav aria-label="App navigation" className="w-full flex items-center justify-between">
        <button
          type="button"
          aria-label="Home"
          className="text-pio-coral flex items-center justify-center p-0.5"
          onClick={noop}
        >
          <Home size={20} strokeWidth={2} />
        </button>
        <button type="button" aria-label="Folder" className={navIconMuted} onClick={noop}>
          <Folder size={20} strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label="Upload"
          className="w-7 h-7 rounded-full bg-pio-text dark:bg-white text-white dark:text-pio-text flex items-center justify-center shadow-xs"
          onClick={noop}
        >
          <ArrowUp size={14} strokeWidth={2.5} />
        </button>
        <button type="button" aria-label="Charts" className={navIconMuted} onClick={noop}>
          <BarChart2 size={20} strokeWidth={2} />
        </button>
        <button type="button" aria-label="Apps" className={navIconMuted} onClick={noop}>
          <Grid size={20} strokeWidth={2} />
        </button>
      </nav>
    </Card>
  </Phone>
);

export default CanvasStudio;
