import React from 'react';
import { RoundedSizes } from '../../../interfaces/sizes';
export interface InputProps {
    /** Visual variant (color family). For the HTML input type use `htmlType`. */
    type?: 'default' | 'red' | 'green';
    /**
     * The native input type: 'text' | 'email' | 'password' | 'search' | …
     * Added in the D1 DS fix — Input previously hardcoded type="text", which
     * forced consuming apps to hand-roll password fields whose padding and
     * box-sizing drifted from Input's, so mixed forms rendered fields at
     * visibly different heights.
     */
    htmlType?: string;
    fill?: 'solid' | 'outline' | 'ghost';
    rounded?: RoundedSizes;
    label?: string;
    placeholder?: string;
    icon?: React.ReactElement<{
        size?: string | number;
    }>;
    iconPosition?: 'left' | 'right';
    hint?: string;
    initialValue?: string;
    value?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    readOnly?: boolean;
    autoComplete?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
declare const Input: React.FC<InputProps>;
export default Input;
