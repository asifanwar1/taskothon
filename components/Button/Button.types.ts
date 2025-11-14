import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "light";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
    children: ReactNode;
    icon?: LucideIcon;
    iconPosition?: "left" | "right";
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    showLabelOnMobile?: boolean;
    className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
