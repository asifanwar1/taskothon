import type { PieLabelRenderProps } from "recharts";
export type ChartDataPoint = {
    date: string;
    count: number;
};

export type PieChartDataPoint = {
    name: string;
    value: number;
};

export type ChartCardProps = {
    title: string;
    className?: string;
    height?: number;
};

export type BarChartCardProps = ChartCardProps & {
    data: ChartDataPoint[];
    barColor?: string;
    dataKey?: string;
    xAxisKey?: string;
};

export type LineChartCardProps = ChartCardProps & {
    data: ChartDataPoint[];
    lineColor?: string;
    dataKey?: string;
    xAxisKey?: string;
    strokeWidth?: number;
};

export type PieChartCardProps = ChartCardProps & {
    data: PieChartDataPoint[];
    colors?: string[];
    showLabel?: boolean;
    labelFormatter?: (entry: PieLabelRenderProps) => string;
    outerRadius?: number;
};
