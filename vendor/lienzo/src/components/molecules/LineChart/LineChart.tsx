import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import {
  chartRoot,
  legendDot,
  legendItem,
  legendLabel,
  legendList,
} from './LineChartStyles';

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

const DEFAULT_SERIES_COLOR = 'rgb(var(--lz-pio-teal-dark))';
const DEFAULT_REFERENCE_STROKE = 'rgb(var(--lz-pio-stone))';
const MUTED_TICK = 'rgb(var(--lz-pio-text-muted))';
const GRID_STROKE = 'rgb(var(--lz-pio-grid))';
const TOOLTIP_BG = 'rgb(var(--lz-pio-bg-light))';
const TOOLTIP_TEXT = 'rgb(var(--lz-pio-text))';

const LineChart: React.FC<LineChartProps> = ({
  data,
  series,
  xAxisKey,
  width = '100%',
  height = 280,
  showGrid = false,
  showTooltip = true,
  showLegend = false,
  showDots = true,
  curveType = 'monotone',
  yAxisDomain = [0, 'auto'],
  referenceLines = [],
}) => {
  return (
    <div className={chartRoot} data-purpose="line-chart">
      {showLegend ? (
        <ul className={legendList} data-purpose="line-chart-legend">
          {series.map((s) => {
            const color = s.stroke ?? DEFAULT_SERIES_COLOR;
            return (
              <li key={s.dataKey} className={legendItem}>
                <span
                  className={legendDot}
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className={legendLabel}>{s.name ?? s.dataKey}</span>
              </li>
            );
          })}
        </ul>
      ) : null}

      <ResponsiveContainer width={width} height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={GRID_STROKE}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: MUTED_TICK, fontSize: 12 }}
            tickMargin={14}
          />
          <YAxis
            domain={yAxisDomain}
            axisLine={false}
            tickLine={false}
            tick={{ fill: MUTED_TICK, fontSize: 12 }}
            tickMargin={32}
            width={48}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: TOOLTIP_BG,
                border: `1px solid ${GRID_STROKE}`,
                borderRadius: 8,
              }}
              labelStyle={{ color: TOOLTIP_TEXT }}
            />
          )}
          {referenceLines.map((ref) => (
            <ReferenceLine
              key={`ref-y-${ref.y}-${ref.label ?? ''}`}
              y={ref.y}
              stroke={ref.stroke ?? DEFAULT_REFERENCE_STROKE}
              strokeDasharray={ref.strokeDasharray ?? '4 4'}
              label={
                ref.label
                  ? {
                      value: ref.label,
                      fill: MUTED_TICK,
                      fontSize: 12,
                      position: 'insideTopRight',
                    }
                  : undefined
              }
            />
          ))}
          {series.map((s) => {
            const color = s.stroke ?? DEFAULT_SERIES_COLOR;
            const dotsEnabled = s.showDots ?? showDots;
            const lineType = s.type ?? curveType;

            return (
              <Line
                key={s.dataKey}
                type={lineType}
                dataKey={s.dataKey}
                name={s.name ?? s.dataKey}
                stroke={color}
                strokeWidth={s.strokeWidth ?? 2}
                strokeDasharray={s.strokeDasharray}
                dot={
                  dotsEnabled
                    ? {
                        r: 4,
                        fill: s.dotFill ?? color,
                        stroke: s.dotStroke ?? color,
                        strokeWidth: 2,
                      }
                    : false
                }
                activeDot={
                  dotsEnabled
                    ? {
                        r: 5,
                        fill: s.dotFill ?? color,
                        stroke: s.dotStroke ?? color,
                        strokeWidth: 2,
                      }
                    : false
                }
                isAnimationActive={true}
              />
            );
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
