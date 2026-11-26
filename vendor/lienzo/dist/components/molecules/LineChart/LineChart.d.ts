import React from 'react';
export interface LineChartDataItem {
    [key: string]: string | number;
}
export type LineChartCurveType = 'monotone' | 'linear' | 'step';
export interface LineChartSeriesConfig {
    dataKey: string;
    stroke?: string;
    dotStroke?: string;
    dotFill?: string;
    name?: string;
    /** Curve interpolation. Defaults to chart-level `curveType`, then `monotone`. */
    type?: LineChartCurveType;
    strokeWidth?: number;
    /** SVG stroke-dasharray, e.g. `"5 5"` for a dashed forecast line. */
    strokeDasharray?: string;
    /** Per-series override for dots. Defaults to chart-level `showDots`. */
    showDots?: boolean;
}
export interface LineChartReferenceLine {
    y: number;
    label?: string;
    stroke?: string;
    strokeDasharray?: string;
}
export interface LineChartProps {
    data: LineChartDataItem[];
    series: LineChartSeriesConfig[];
    xAxisKey: string;
    width?: number | `${number}%`;
    height?: number | `${number}%`;
    showGrid?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    showDots?: boolean;
    curveType?: LineChartCurveType;
    yAxisDomain?: [number | 'auto', number | 'auto'];
    referenceLines?: LineChartReferenceLine[];
}
declare const LineChart: React.FC<LineChartProps>;
export default LineChart;
