import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import CodeBlock, { CodeBlockProps } from './CodeBlock';

const sampleCode = `import React from 'react';
import LineChart from '@molecules/LineChart/LineChart';

export const UserGrowthDashboard = () => (
  <LineChart
    data={weeklyMetrics}
    xKey="day"
    height={360}
  />
);
`;

export default {
  title: 'Molecules/CodeBlock',
  component: CodeBlock,
  argTypes: {
    code: { control: 'text' },
    filename: { control: 'text' },
    language: { control: 'select', options: ['tsx', 'typescript', 'javascript', 'jsx', 'css'] },
    codeMode: { control: 'select', options: ['dark', 'light'] },
    className: { control: false, table: { disable: true } },
  },
} as Meta;

const Template: StoryFn<CodeBlockProps> = (args) => (
  <div className="max-w-3xl">
    <CodeBlock {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  code: sampleCode,
  filename: 'LineChartExample.tsx',
  language: 'tsx',
  codeMode: 'dark',
};
Default.tags = ['!dev'];

export const WithFilename = () => (
  <div className="max-w-3xl">
    <CodeBlock code={sampleCode} filename="LineChartExample.tsx" language="tsx" />
  </div>
);
WithFilename.parameters = { controls: { disable: true } };

export const WithoutFilename = () => (
  <div className="max-w-3xl">
    <CodeBlock code={sampleCode} language="tsx" />
  </div>
);
WithoutFilename.parameters = { controls: { disable: true } };

export const CodeModes = () => (
  <div className="flex flex-col gap-6 max-w-3xl">
    <CodeBlock
      code={sampleCode}
      filename="LineChartExample.tsx"
      language="tsx"
      codeMode="dark"
    />
    <CodeBlock
      code={sampleCode}
      filename="LineChartExample.tsx"
      language="tsx"
      codeMode="light"
    />
  </div>
);
CodeModes.parameters = { controls: { disable: true } };

export const Unhighlighted = () => (
  <div className="max-w-3xl">
    <CodeBlock code={sampleCode} filename="plain.txt" />
  </div>
);
Unhighlighted.parameters = { controls: { disable: true } };
