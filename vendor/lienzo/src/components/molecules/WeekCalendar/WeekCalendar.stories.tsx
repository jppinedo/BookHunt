import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Clock } from 'react-feather';
import face01 from '../../../assets/placeholders/faces/100/avatar-01.jpg';
import face02 from '../../../assets/placeholders/faces/100/avatar-02.jpg';
import face03 from '../../../assets/placeholders/faces/100/avatar-03.jpg';
import face04 from '../../../assets/placeholders/faces/100/avatar-04.jpg';
import face05 from '../../../assets/placeholders/faces/100/avatar-05.jpg';
import face06 from '../../../assets/placeholders/faces/100/avatar-06.jpg';
import face07 from '../../../assets/placeholders/faces/100/avatar-07.jpg';
import face08 from '../../../assets/placeholders/faces/100/avatar-08.jpg';
import face09 from '../../../assets/placeholders/faces/100/avatar-09.jpg';
import face10 from '../../../assets/placeholders/faces/100/avatar-10.jpg';
import WeekCalendar, {
  type WeekCalendarEvent,
  type WeekCalendarProps,
} from './WeekCalendar';
import { formatTimeLabel } from './WeekCalendarUtils';

/** Fixed Wednesday in the story week so current-day styling stays stable. */
const STORY_TODAY = new Date(2025, 9, 15, 10, 30, 0);
/** Any date in the Mon–Sun week that contains STORY_TODAY (weekStartsOn=1). */
const STORY_WEEK_START = new Date(2025, 9, 13);

const day = (offsetFromMonday: number, hours = 0, minutes = 0) =>
  new Date(2025, 9, 13 + offsetFromMonday, hours, minutes, 0);

const timedEvents: WeekCalendarEvent[] = [
  {
    id: 'mon-standup',
    date: day(0),
    start: '09:00',
    end: '09:30',
    title: 'Team standup',
    subtitle: 'Morning',
    tone: 'teal',
  },
  {
    id: 'mon-design',
    date: day(0),
    start: '11:00',
    end: '12:30',
    title: 'Design review',
    subtitle: 'Workshop',
    body: 'Review layout options',
    tone: 'coral',
  },
  {
    id: 'tue-focus',
    date: day(1),
    start: '10:00',
    end: '12:00',
    title: 'Focus block',
    subtitle: 'Deep work',
    tone: 'amber',
  },
  {
    id: 'tue-overlap-a',
    date: day(1),
    start: '14:00',
    end: '15:00',
    title: 'Sync A',
    tone: 'teal',
  },
  {
    id: 'tue-overlap-b',
    date: day(1),
    start: '14:30',
    end: '15:30',
    title: 'Sync B',
    tone: 'coral',
  },
  {
    id: 'wed-all-day',
    date: day(2),
    title: 'Office hours',
    subtitle: 'All day',
    tone: 'neutral',
  },
  {
    id: 'wed-demo',
    date: day(2),
    start: '10:00',
    end: '11:00',
    title: 'Product demo',
    subtitle: 'Live',
    body: 'Share progress with stakeholders',
    tone: 'coral',
    onClick: () => undefined,
  },
  {
    id: 'wed-lunch',
    date: day(2),
    start: '12:30',
    end: '13:30',
    title: 'Lunch & learn',
    tone: 'amber',
  },
  {
    id: 'thu-planning',
    date: day(3),
    start: '09:30',
    end: '11:00',
    title: 'Sprint planning',
    subtitle: 'Team',
    tone: 'teal',
  },
  {
    id: 'fri-retro',
    date: day(4),
    start: '15:00',
    end: '16:00',
    title: 'Retro',
    subtitle: 'Wrap-up',
    tone: 'neutral',
  },
  {
    id: 'sat-muted',
    date: day(5),
    start: '11:00',
    end: '12:00',
    title: 'Optional meetup',
    subtitle: 'Community',
    tone: 'muted',
    status: 'Tentative',
  },
  {
    id: 'sun-rest',
    date: day(6),
    title: 'Rest day',
    subtitle: 'Personal',
    tone: 'muted',
    status: 'Blocked',
  },
];

const agendaEvents: WeekCalendarEvent[] = [
  {
    id: 'a-mon-1',
    date: day(0),
    start: '09:30',
    title: 'Earnings open',
    subtitle: 'Pre-market',
    meta: 'BMO',
    tone: 'teal',
  },
  {
    id: 'a-mon-2',
    date: day(0),
    start: '14:00',
    title: 'Analyst call',
    meta: 'AMC',
    tone: 'coral',
  },
  {
    id: 'a-wed-1',
    date: day(2),
    start: '10:00',
    title: 'Product demo',
    subtitle: 'Live',
    meta: 'BMO',
    tone: 'coral',
  },
  {
    id: 'a-wed-2',
    date: day(2),
    title: 'Office hours',
    subtitle: 'All day',
    tone: 'neutral',
  },
  {
    id: 'a-thu-1',
    date: day(3),
    start: '11:00',
    title: 'Sprint planning',
    meta: 'AMC',
    tone: 'teal',
  },
  {
    id: 'a-fri-1',
    date: day(4),
    start: '15:00',
    title: 'Weekly wrap',
    subtitle: 'Summary',
    tone: 'amber',
  },
];

const listEventsThreeDays: WeekCalendarEvent[] = [
  {
    id: 'l-mon-1',
    date: day(0),
    title: 'Morning brief',
    subtitle: 'Ops',
    tone: 'teal',
  },
  {
    id: 'l-mon-2',
    date: day(0),
    title: 'Inbox zero',
    subtitle: 'Admin',
    tone: 'neutral',
  },
  {
    id: 'l-tue-1',
    date: day(1),
    title: 'Client check-in',
    subtitle: 'Calls',
    body: '30 min',
    tone: 'coral',
  },
  {
    id: 'l-tue-2',
    date: day(1),
    title: 'Notes sync',
    tone: 'amber',
  },
  {
    id: 'l-wed-1',
    date: day(2),
    title: 'Ship checklist',
    subtitle: 'Release',
    tone: 'teal',
  },
  {
    id: 'l-wed-2',
    date: day(2),
    title: 'Draft update',
    tone: 'coral',
  },
  {
    id: 'l-wed-3',
    date: day(2),
    title: 'Waiting on review',
    tone: 'muted',
    status: 'Pending',
  },
];

function Facepile({
  faces,
  extra = 0,
}: {
  faces: string[];
  extra?: number;
}) {
  return (
    <div className="mt-2 flex items-center">
      <div className="flex items-center">
        {faces.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            className="h-7 w-7 rounded-full object-cover border-2 border-white dark:border-gray-900"
            style={{ marginLeft: index === 0 ? 0 : -8 }}
          />
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-1.5 text-xs font-medium text-pio-text-muted dark:text-blue-200/70">
          +{extra}
        </span>
      )}
    </div>
  );
}

function RichEventBody({
  start,
  end,
  faces,
  extra = 0,
}: {
  start: string;
  end: string;
  faces: string[];
  extra?: number;
}) {
  const startLabel = formatTimeLabel(start);
  const endLabel = formatTimeLabel(end);
  return (
    <div className="flex flex-col gap-0.5">
      <div className="inline-flex items-center gap-1.5 text-[11px] font-regular text-pio-text-muted dark:text-blue-200/70">
        <Clock size={12} aria-hidden="true" />
        <span>
          {startLabel} – {endLabel}
        </span>
      </div>
      <Facepile faces={faces} extra={extra} />
    </div>
  );
}

const meta: Meta<typeof WeekCalendar> = {
  title: 'Molecules/WeekCalendar',
  component: WeekCalendar,
  decorators: [
    (Story) => (
      <div className="p-4 max-w-6xl mx-auto">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    showHours: { name: 'Show hours', control: 'boolean' },
    weekStartsOn: {
      name: 'Week starts on',
      control: 'radio',
      options: [0, 1],
    },
    layout: {
      name: 'Layout',
      control: 'select',
      options: ['auto', 'week', 'day', 'agenda'],
    },
    weekStart: { control: false, table: { disable: true } },
    events: { control: false, table: { disable: true } },
    visibleDays: { control: false, table: { disable: true } },
    hourRange: { control: false, table: { disable: true } },
    today: { control: false, table: { disable: true } },
    renderEvent: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
    selectedDate: { control: false, table: { disable: true } },
    defaultSelectedDate: { control: false, table: { disable: true } },
    onSelectedDateChange: { control: false, table: { disable: true } },
    onWeekStartChange: { control: false, table: { disable: true } },
    onLayoutChange: { control: false, table: { disable: true } },
    mobileLayout: { control: false, table: { disable: true } },
    autoBreakpoint: { control: false, table: { disable: true } },
    initialLayout: { control: false, table: { disable: true } },
    showSwipeHint: { control: false, table: { disable: true } },
    hideEmptyDays: { control: false, table: { disable: true } },
    emptyDayLabel: { control: false, table: { disable: true } },
  },
};
export default meta;

type Story = StoryObj<typeof WeekCalendar>;

const baseArgs: WeekCalendarProps = {
  weekStart: STORY_WEEK_START,
  today: STORY_TODAY,
  events: timedEvents,
  showHours: true,
  weekStartsOn: 1,
  hourRange: [6, 22],
  layout: 'week',
};

export const Default: Story = {
  args: { ...baseArgs },
  tags: ['!dev'],
};

function DayViewDemo() {
  const [weekStart, setWeekStart] = useState(STORY_WEEK_START);
  return (
    <div className="max-w-md mx-auto">
      <WeekCalendar
        weekStart={weekStart}
        onWeekStartChange={setWeekStart}
        today={STORY_TODAY}
        events={timedEvents}
        showHours
        hourRange={[6, 22]}
        layout="day"
        defaultSelectedDate={STORY_TODAY}
      />
    </div>
  );
}

export const DayView: Story = {
  parameters: { controls: { disable: true } },
  render: () => <DayViewDemo />,
};

export const AgendaView: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="max-w-md mx-auto">
      <WeekCalendar
        weekStart={STORY_WEEK_START}
        today={STORY_TODAY}
        events={agendaEvents}
        showHours={false}
        layout="agenda"
      />
    </div>
  ),
};

export const WithoutHours: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <WeekCalendar
      weekStart={STORY_WEEK_START}
      today={STORY_TODAY}
      events={listEventsThreeDays}
      visibleDays={[1, 2, 3]}
      showHours={false}
      layout="week"
    />
  ),
};

export const RichContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const events: WeekCalendarEvent[] = [
      {
        id: 'rich-1',
        date: day(0),
        start: '09:45',
        end: '10:45',
        title: 'Standup Meeting – NovaBoard Team',
        tone: 'coral',
        body: (
          <RichEventBody
            start="09:45"
            end="10:45"
            faces={[face01, face02, face03, face04, face05]}
            extra={5}
          />
        ),
      },
      {
        id: 'rich-2',
        date: day(1),
        start: '11:00',
        end: '12:30',
        title: 'Design critique',
        tone: 'teal',
        body: (
          <RichEventBody
            start="11:00"
            end="12:30"
            faces={[face06, face07, face08, face09]}
            extra={2}
          />
        ),
      },
      {
        id: 'rich-3',
        date: day(2),
        start: '14:00',
        end: '15:00',
        title: 'Launch prep workshop',
        tone: 'amber',
        body: (
          <RichEventBody
            start="14:00"
            end="15:00"
            faces={[face10, face01, face03]}
            extra={8}
          />
        ),
      },
    ];

    return (
      <WeekCalendar
        weekStart={STORY_WEEK_START}
        today={STORY_TODAY}
        events={events}
        visibleDays={[1, 2, 3]}
        showHours={false}
        layout="week"
      />
    );
  },
};
