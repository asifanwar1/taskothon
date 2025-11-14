import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PieChartCardProps } from "./Charts.types";

const DEFAULT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const PieChartCard = ({
    title,
    data,
    colors = DEFAULT_COLORS,
    showLabel = true,
    labelFormatter = (entry) => `${entry.name}: ${entry.value}`,
    outerRadius = 80,
    height = 250,
    className = "",
}: PieChartCardProps) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 ${className}`}
        >
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                {title}
            </h2>
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={showLabel ? labelFormatter : false}
                        outerRadius={outerRadius}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((_entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartCard;
