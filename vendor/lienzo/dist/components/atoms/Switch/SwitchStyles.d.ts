export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchType = 'default' | 'red' | 'green' | 'yellow';
/**
 * Thumb inset: `after:top-[2px] after:left-[2px] after:h-4 after:w-4` on an `h-5 w-9` track.
 * Same 2px gap is applied at every size so the white circle sits inside the track.
 */
export declare const switchSize: Record<SwitchSize, {
    container: string;
    thumb: string;
    thumbOn: string;
}>;
/** Off track — warm structural border wash. */
export declare const switchOff = "bg-pio-grid dark:bg-gray-600";
export declare const switchOn: Record<SwitchType, string>;
export declare const switchThumb = "absolute rounded-full bg-white border border-pio-grid dark:border-none transition-transform duration-200 ease-in-out";
/** Segmented (labeled / icon) track shell — layout only; fill comes from `segmentedTrackByType`. */
export declare const segmentedTrackBase: string;
/** Recessed track fill / border by `type`. */
export declare const segmentedTrackByType: Record<SwitchType, string>;
export declare const segmentedThumb: string;
export declare const segmentedOptionSize: Record<SwitchSize, {
    option: string;
    icon: string;
}>;
export declare const segmentedOptionBase: string;
/** Active option label / icon color by `type`. */
export declare const segmentedOptionActiveByType: Record<SwitchType, string>;
export declare const segmentedOptionInactive = "font-medium text-pio-text-muted dark:text-gray-300";
export declare const segmentedIconInactive = "text-pio-text-muted dark:text-gray-400";
/** When `type` is chromatic, force icons to follow the active option text color. */
export declare const segmentedIconActiveFollowType = "[&_svg]:text-current";
