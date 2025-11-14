import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type FilterOption = {
    value: string;
    label: string;
};

export type Filter = {
    id: string;
    label?: string;
    value: string;
    options: readonly FilterOption[];
    onChange: (value: string) => void;
    className?: string;
};

export type FilterBarProps = {
    filters: readonly Filter[];
    icon?: LucideIcon;
    className?: string;
};
