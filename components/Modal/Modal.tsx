"use client";
import React from "react";
import { TModalProps } from "./modal.types";
import { X } from "lucide-react";
import Image from "next/image";

const Modal: React.FC<TModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    mainContainerClass = "",
    descriptionClass = "",
    descriptionIcon,
    descriptionIconClass = "",
    childrenContainerClass = "",
    icon,
    children,
    primaryButton,
    primaryButtonClass = "",
    secondaryButton,
    secondaryButtonClass = "",
    size = "md",
    showCloseButton = true,
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-7xl",
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 transition-opacity" />

            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-white border border-gray-200 shadow-xl transition-all ${mainContainerClass}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-6 py-4 ">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {icon && (
                                    <div className="flex-shrink-0">{icon}</div>
                                )}
                                <div>
                                    {title && (
                                        <h3 className="text-lg font-semibold text-black">
                                            {title}
                                        </h3>
                                    )}
                                </div>
                            </div>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <X className="h-6 w-6 text-black" />
                                </button>
                            )}
                        </div>
                    </div>

                    {descriptionIcon && (
                        <div className={descriptionIconClass}>
                            <Image
                                src={descriptionIcon}
                                alt="description icon"
                            />
                        </div>
                    )}

                    {description && (
                        <div
                            className={`p-2 text-center text-white ${descriptionClass}`}
                        >
                            {description}
                        </div>
                    )}

                    <div className={`px-6 py-4 ${childrenContainerClass}`}>
                        {children}
                    </div>

                    {(primaryButton || secondaryButton) && (
                        <div className="flex justify-center align-center gap-2 p-2">
                            {secondaryButton && (
                                <button
                                    onClick={secondaryButton.onClick}
                                    className={`px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer hover:scale-105 ${secondaryButtonClass} `}
                                >
                                    {secondaryButton.label}
                                </button>
                            )}
                            {primaryButton && (
                                <button
                                    onClick={primaryButton.onClick}
                                    className={`px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400 disabled:cursor-not-allowed cursor-pointer hover:scale-105  ${primaryButtonClass} `}
                                >
                                    {primaryButton.label}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
