import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type HeaderAction = {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: "primary" | "secondary" | "success" | "danger";
    className?: string;
};

export type HeaderProps = {
    title: string;
    description?: string;
    icon?: LucideIcon | string;
    actions?: readonly HeaderAction[];
    isAuthenticated?: boolean;
    handleLogout?: () => void;
    className?: string;
};
