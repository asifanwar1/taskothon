import type { InputHTMLAttributes } from "react";

export type InputProps = {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
    wrapperClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;
