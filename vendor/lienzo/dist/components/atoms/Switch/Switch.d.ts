import React from 'react';
import { type SwitchSize, type SwitchType } from './SwitchStyles';
export interface SwitchProps {
    size?: SwitchSize;
    /**
     * Accent for the on state (thumb track) and for segmented track / active text.
     * `default` uses gray / neutral; chromatic types use Pio accents.
     */
    type?: SwitchType;
    isActive?: boolean;
    onChange?: (active: boolean) => void;
    className?: string;
    /**
     * Label for the off (left) option. Passing any of `offLabel`, `onLabel`,
     * `offIcon`, or `onIcon` switches the control to the segmented layout.
     */
    offLabel?: string;
    /** Label for the on (right) option. */
    onLabel?: string;
    /** Icon for the off (left) option. With chromatic `type`, active icons follow the type color. */
    offIcon?: React.ReactNode;
    /** Icon for the on (right) option. */
    onIcon?: React.ReactNode;
}
declare const Switch: React.FC<SwitchProps>;
export default Switch;
