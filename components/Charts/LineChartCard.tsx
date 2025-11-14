import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { LineChartCardProps } from "./Charts.types";

const LineChartCard = ({
    title,
    data,
    lineColor = "#10b981",
    dataKey = "count",
    xAxisKey = "date",
    strokeWidth = 2,
    height = 250,
    className = "",
}: LineChartCardProps) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 ${className}`}
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                {title}
            </h2>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisKey} />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={lineColor}
                        strokeWidth={strokeWidth}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartCard;
