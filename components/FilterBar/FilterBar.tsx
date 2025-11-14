import { Filter } from "lucide-react";
import type { FilterBarProps } from "./FilterBar.types";

const FilterBar = ({
    filters,
    icon: Icon = Filter,
    className = "",
}: FilterBarProps) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 ${className}`}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                {Icon && (
                    <div className="flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                )}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-1">
                    {filters.map((filter) => (
                        <div key={filter.id} className="flex-shrink-0">
                            <select
                                value={filter.value}
                                onChange={(e) =>
                                    filter.onChange(e.target.value)
                                }
                                className={`
                  px-3 sm:px-4 py-2 
                  border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  outline-none transition-colors
                  text-sm sm:text-base
                  bg-white
                  min-w-[140px] sm:min-w-[160px]
                  ${filter.className || ""}
                `}
                                aria-label={filter.label || filter.id}
                            >
                                {filter.options.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
