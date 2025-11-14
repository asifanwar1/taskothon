import type { ButtonProps, ButtonSize, ButtonVariant } from "./Button.types";

const Button = ({
    children,
    icon: Icon,
    iconPosition = "left",
    variant = "primary",
    size = "md",
    fullWidth = false,
    showLabelOnMobile = true,
    className = "",
    type = "button",
    disabled = false,
    ...rest
}: ButtonProps) => {
    const getVariantClasses = (): string => {
        const variants: Record<ButtonVariant, string> = {
            primary:
                "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer",
            secondary:
                "bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer",
            success:
                "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400 disabled:cursor-not-allowed cursor-pointer",
            danger: "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400 disabled:cursor-not-allowed cursor-pointer",
            light: "bg-white hover:bg-gray-100 text-blue-700 disabled:bg-blue-100 disabled:cursor-not-allowed cursor-pointer",
        };
        return variants[variant];
    };

    const getSizeClasses = (): string => {
        const sizes: Record<ButtonSize, string> = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        };
        return sizes[size];
    };

    const getIconSizeClasses = (): string => {
        const iconSizes: Record<ButtonSize, string> = {
            sm: "w-3 h-3",
            md: "w-4 h-4",
            lg: "w-5 h-5",
        };
        return iconSizes[size];
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={`
        flex items-center justify-center gap-2
        rounded-lg
        transition-colors
        whitespace-nowrap
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            {...rest}
        >
            {Icon && iconPosition === "left" && (
                <Icon className={getIconSizeClasses()} />
            )}
            <span className={showLabelOnMobile ? "" : "hidden sm:inline"}>
                {children}
            </span>
            {Icon && iconPosition === "right" && (
                <Icon className={getIconSizeClasses()} />
            )}
        </button>
    );
};

export default Button;
