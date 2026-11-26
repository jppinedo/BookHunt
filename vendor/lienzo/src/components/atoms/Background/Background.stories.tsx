import React from 'react';
import { StoryFn, Meta } from '@storybook/react-vite';
import Background, { BackgroundProps } from './Background';
import Title from '@atoms/Title/Title';
import { Sun, Feather, Triangle, Grid } from 'react-feather';
import Button from '@atoms/Button/Button';

/**
 * Hex mirrors of pio brand stops used in gradient demos.
 * Values track the intended palette (pio-bg, pio-amber, pio-coral, teals, charcoal).
 */
const PIO = {
  bg: '#FAF8F5',
  bgLight: '#F5F2EC',
  amber: '#EAA838',
  coral: '#FF6B57',
  tealLight: '#3A7D76',
  tealDark: '#2F6D68',
  text: '#1F2421',
  inverseSurface: '#30312F',
  secondary: '#296863',
  accent1: '#8cc8ba',
  accent2: '#f5f5eb',
  accent3: '#f8b67a',
  accent4: '#f99280',
  accent5: '#e4ece0',
} as const;

/** Amber Dawn — five-stop warm field. Live Preview default. */
const GRADIENT_AMBER_DAWN = [PIO.accent1, PIO.accent2, PIO.accent3, PIO.accent4, PIO.accent5];

/** Studio Canvas to Teal — earthy & calming: pio-bg-light → teal-light → teal-dark (45°). */
const GRADIENT_STUDIO_TEAL = [PIO.bgLight, PIO.tealLight, PIO.tealDark];

/** Charcoal Depth — dark mode elegance: pio-text → inverse-surface → secondary teal (45°). */
const GRADIENT_CHARCOAL_DEPTH = [PIO.text, PIO.inverseSurface, PIO.secondary];

export default {
  title: 'Atoms/Background',
  component: Background,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['gradient', 'dotted'],
    },
    color1: { control: 'color' },
    color2: { control: 'color' },
    color3: { control: 'color' },
    color4: { control: 'color' },
    color5: { control: 'color' },
    isHexColors: { control: 'boolean' },
    rounded: { control: 'boolean' },
    vignette: { control: 'boolean' },
    vignetteColor: { control: 'color' },
    className: { control: false, table: { disable: true } },
    colors: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
  },
} as Meta<ExtendedBackgroundProps>;

type ExtendedBackgroundProps = BackgroundProps & {
  color1: string;
  color2: string;
  color3: string;
  color4?: string;
  color5?: string;
};

const previewBody =
  'py-14 px-6 sm:px-8 flex flex-col justify-center items-center w-full h-full';
const previewCopy = 'text-base max-w-sm w-full text-center mt-2 mb-3 font-jakarta';

/** Amber Dawn overlay — also the Live Preview default content. */
const AmberDawnContent = () => (
  <div className={previewBody}>
    <div className="text-pio-coral mb-2">
      <Sun size={40} />
    </div>
    <Title size="xl" fontFamily="playfair" thikness="bold">
      Atmospheric Coral Warmth
    </Title>
    <p className={`${previewCopy} text-pio-text`}>
      Soft pio-bg into amber and coral. Dark typography stays crisp on the light
      top-left; coral CTAs anchor the warm lower half.
    </p>
    <Button
      label="Explore Theme"
      type="red"
      onClick={() => console.log('click')}
    />
  </div>
);

const DottedPreviewContent = () => (
  <div className={previewBody}>
    <div className="text-pio-coral mb-2">
      <Grid size={40} />
    </div>
    <Title size="xl" fontFamily="jakarta" thikness="bold">
      Dotted field
    </Title>
    <p className={`${previewCopy} text-pio-text-muted`}>
      Fill and dots use pio tokens; vignette fades with the fill color by
      default.
    </p>
    <Button
      label="Learn more"
      type="default"
      onClick={() => console.log('click')}
    />
  </div>
);

const Template: StoryFn<ExtendedBackgroundProps> = ({
  color1,
  color2,
  color3,
  color4,
  color5,
  type = 'gradient',
  isHexColors,
  rounded,
  vignette,
  vignetteColor,
  className,
}) => {
  const colors = [color1, color2, color3, color4, color5].filter(
    (color): color is string => Boolean(color)
  );
  const isDotted = type === 'dotted';

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-md min-h-[440px]">
        <Background
          type={type}
          colors={colors}
          isHexColors={isHexColors}
          rounded={rounded}
          vignette={vignette}
          vignetteColor={vignetteColor}
          className={`min-h-[440px] ${className || ''}`.trim()}
        >
          {isDotted ? <DottedPreviewContent /> : <AmberDawnContent />}
        </Background>
      </div>
    </div>
  );
};

/** Live Preview baseline — Amber Dawn gradient. */
export const Default = Template.bind({});
Default.args = {
  type: 'gradient',
  color1: GRADIENT_AMBER_DAWN[0],
  color2: GRADIENT_AMBER_DAWN[1],
  color3: GRADIENT_AMBER_DAWN[2],
  color4: GRADIENT_AMBER_DAWN[3],
  color5: GRADIENT_AMBER_DAWN[4],
  isHexColors: true,
  rounded: true,
  vignette: false,
};
Default.tags = ['!dev'];

export const ExampleBackgroundTwo = () => (
  <div className="w-full p-2">
    <Background
      type="gradient"
      colors={[...GRADIENT_STUDIO_TEAL]}
      isHexColors
      rounded
    >
      <div className={previewBody}>
        <div className="text-white mb-2">
          <Feather size={40} />
        </div>
        <Title
          size="xl"
          fontFamily="playfair"
          thikness="bold"
          className="text-white!"
        >
          Editorial Teal Serenity
        </Title>
        <p className={`${previewCopy} text-white`}>
          Studio canvas cream blends into teal-light and teal-dark. White type
          and a coral button pop against the earthy field.
        </p>
        <Button
          label="Customize"
          type="red"
          onClick={() => console.log('click')}
        />
      </div>
    </Background>
  </div>
);
ExampleBackgroundTwo.parameters = { controls: { disable: true } };

export const ExampleBackgroundThree = () => (
  <div className="w-full p-2">
    <Background
      type="gradient"
      colors={[...GRADIENT_CHARCOAL_DEPTH]}
      isHexColors
      rounded
    >
      <div className={previewBody}>
        <div className="text-pio-bg mb-2">
          <Triangle size={40} />
        </div>
        <Title
          size="xl"
          fontFamily="playfair"
          thikness="bold"
          className="text-pio-bg!"
        >
          Deep Studio Focus
        </Title>
        <p className={`${previewCopy} text-white`}>
          Charcoal through inverse-surface into a dark teal anchor. Off-white
          titles stay ultra-legible; coral marks the high-intent action.
        </p>
        <Button
          label="Deploy"
          type="red"
          onClick={() => console.log('click')}
        />
      </div>
    </Background>
  </div>
);
ExampleBackgroundThree.parameters = { controls: { disable: true } };

export const Dotted = () => (
  <div className="w-full p-2">
    <Background
      type="dotted"
      colors={['pio-bg-light', 'pio-grid']}
      isHexColors={false}
      vignette
      rounded
    >
      <DottedPreviewContent />
    </Background>
  </div>
);
Dotted.parameters = { controls: { disable: true } };
