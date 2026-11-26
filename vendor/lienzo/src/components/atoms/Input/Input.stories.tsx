import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import { DownloadCloud, CheckCircle, AlertCircle } from 'react-feather';
import Input, { InputProps } from './Input';
import Box from '@atoms/Box/Box';
import Title from '@atoms/Title/Title';

type InputColor = 'default' | 'red' | 'green';

const colors: InputColor[] = ['default', 'red', 'green'];
const fills: NonNullable<InputProps['fill']>[] = ['solid', 'outline', 'ghost'];
const roundedSizes: NonNullable<InputProps['rounded']>[] = [
  'none',
  'default',
  'sm',
  'md',
  'lg',
  'full',
];

const colorIcons: Record<InputColor, React.ReactElement> = {
  default: <DownloadCloud />,
  green: <CheckCircle />,
  red: <AlertCircle />,
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default {
  title: 'Atoms/Input',
  component: Input,
  argTypes: {
    type: {
      control: { type: 'select', options: ['default', 'red', 'green'] },
    },
    fill: {
      control: { type: 'select', options: ['solid', 'outline', 'ghost'] },
    },
    rounded: {
      control: { type: 'select', options: ['none', 'default', 'sm', 'md', 'lg', 'full'] },
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    iconPosition: {
      control: { type: 'select', options: ['left', 'right'] },
    },
    hint: { control: 'text' },
    initialValue: { control: 'text' },
    icon: { control: false, table: { disable: true } },
    value: { control: false, table: { disable: true } },
    onChange: { control: false, table: { disable: true } },
  },
} as Meta;

const Template: StoryFn<InputProps> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: 'default',
  fill: 'solid',
  rounded: 'lg',
  label: 'Username',
  placeholder: 'Enter your username',
  iconPosition: 'left',
  hint: 'This is a hint for the username input',
  initialValue: 'JohnDoe',
};
Default.tags = ['!dev'];

const VariantRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-2">{children}</div>
);

export const AllTypes = () => (
  <div className="px-4 py-4 md:px-24 md:py-12 flex flex-col gap-4">
    <Title size="xxl">
      <span className="ml-4 text-5xl">
        Input <i className="text-gray-300 text-2xl">All Types</i>
   
      </span>
    </Title>
    <Box header={
      <Title size="lg"><span className="ml-4">Color Variants</span></Title>
      } headerOutside>
      <div className="p-4">
        <VariantRow>
          <Input
            type="default"
            label="Default"
            placeholder="This is a default input"
            icon={colorIcons.default}
            iconPosition="left"
            hint="This is a hint for the default input"
          />
          <Input
            type="green"
            label="Green"
            placeholder="This is a green input"
            icon={colorIcons.green}
            iconPosition="right"
            hint="This Input was successfully validated"
          />
          <Input
            type="red"
            label="Red"
            placeholder="This is a red input"
            icon={colorIcons.red}
            iconPosition="right"
            hint="This Input has an error"
          />
        </VariantRow>
      </div>
    </Box>

    <Box header={
      <Title size="lg"><span className="ml-4">Fill Types</span></Title>
    } headerOutside>
      <div className="flex flex-col gap-4 p-4">
        {fills.map((fill) => (
          <div key={fill}>
            <Title size="sm" className="mt-6 mb-4">{capitalize(fill)}</Title>
            <VariantRow>
              {colors.map((type) => (
                <Input
                  key={`${fill}-${type}`}
                  type={type}
                  fill={fill}
                  placeholder={`${fill} ${type}`}
                  icon={colorIcons[type]}
                  iconPosition="left"
                />
              ))}
            </VariantRow>
          </div>
        ))}
      </div>
    </Box>

    <Box header={
      <Title size="lg"><span className="ml-4">Rounded Corners</span></Title>
      } headerOutside>
      <div className="flex flex-col gap-4 p-4">
        {roundedSizes.map((rounded) => (
          <div key={rounded}>
            <Title size="sm" className="mt-6 mb-4">{capitalize(rounded)}</Title>
            <VariantRow>
              {colors.map((type) => (
                <Input
                  key={`${rounded}-${type}`}
                  type={type}
                  fill="outline"
                  rounded={rounded}
                  placeholder={`${rounded} ${type}`}
                  icon={colorIcons[type]}
                  iconPosition="left"
                />
              ))}
            </VariantRow>
          </div>
        ))}
      </div>
    </Box>
  </div>
);

AllTypes.parameters = { controls: { disable: true } };
