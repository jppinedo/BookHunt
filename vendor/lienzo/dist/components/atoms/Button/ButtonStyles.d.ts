export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export declare const buttonStyles: {
    default: {
        solid: string;
        outline: string;
        ghost: string;
    };
    green: {
        solid: string;
        outline: string;
        ghost: string;
    };
    yellow: {
        solid: string;
        outline: string;
        ghost: string;
    };
    red: {
        solid: string;
        outline: string;
        ghost: string;
    };
    mode: {
        default: string;
        tool: string;
    };
    size: {
        default: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
        tool: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
    };
};
export declare const iconSizeByButtonSize: Record<'default' | 'tool', Record<ButtonSize, string>>;
export declare const iconStyles: {
    default: {
        solid: string;
        outline: string;
        ghost: string;
    };
    green: {
        solid: string;
        outline: string;
        ghost: string;
    };
    yellow: {
        solid: string;
        outline: string;
        ghost: string;
    };
    red: {
        solid: string;
        outline: string;
        ghost: string;
    };
};
