import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { BarChartCardProps } from "./Charts.types";

const BarChartCard = ({
    title,
    data,
    barColor = "#3b82f6",
    dataKey = "count",
    xAxisKey = "date",
    height = 250,
    className = "",
}: BarChartCardProps) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 ${className}`}
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                {title}
            </h2>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisKey} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey={dataKey} fill={barColor} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartCard;
