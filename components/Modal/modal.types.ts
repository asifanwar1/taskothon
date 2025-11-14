import { ReactNode } from "react";

export type TModalButton = {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger" | "outline";
};

export type TModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    descriptionClass?: string;
    descriptionIcon?: string;
    descriptionIconClass?: string;
    icon?: ReactNode;
    children?: ReactNode;
    primaryButton?: TModalButton;
    secondaryButton?: TModalButton;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    showCloseButton?: boolean;
    primaryButtonClass?: string;
    secondaryButtonClass?: string;
    mainContainerClass?: string;
    childrenContainerClass?: string;
};
