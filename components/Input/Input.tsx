import type { InputProps } from "./Input.types";

const Input = ({
    label,
    error,
    icon,
    fullWidth = false,
    className = "",
    wrapperClassName = "",
    id,
    ...rest
}: InputProps) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
        <div className={`${fullWidth ? "w-full" : ""} ${wrapperClassName}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
            w-full
            px-3 sm:px-4 py-2.5
            ${icon ? "!pl-10" : ""}
            border rounded-lg
            text-sm sm:text-base
            text-gray-900
            placeholder:text-gray-400
            bg-white 
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${
                error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
            }
            ${className}
          `}
                    {...rest}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Input;
