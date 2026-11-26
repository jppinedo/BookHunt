import type { PrismTheme } from 'prism-react-renderer';
export declare const codeBlockBar: string;
export declare const codeBlockBarMeta = "flex items-center min-w-0";
export declare const codeBlockFilename: string;
export declare const codeBlockCopy: string;
export declare const codeBlockCopyCopied: string;
export declare const codeBlockBodyBase: string;
export declare const codeBlockBodyMode: {
    readonly dark: "text-pio-teal-dark-pale";
    readonly light: "text-pio-text";
};
export declare const codeBlockPaneFill: {
    readonly dark: "rgb(var(--lz-dark-canvas))";
    readonly light: "rgb(var(--lz-white))";
};
export declare const codeBlockPre = "m-0 p-0 overflow-visible font-jetbrains text-xs sm:text-sm leading-relaxed";
/** Token colors on dark-canvas; contrast-first syntax theme. */
export declare const codeBlockPrismThemeDark: PrismTheme;
export declare const codeBlockPrismThemeLight: PrismTheme;
