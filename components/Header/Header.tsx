"use client";

import { LogOut } from "lucide-react";
import type { HeaderProps } from "./Header.types";
import Button from "@/components/Button/Button";
import Image from "next/image";

const Header = ({
    title,
    description,
    icon,
    actions = [],
    className = "",
    isAuthenticated = false,
    handleLogout,
}: HeaderProps) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-lg p-4 sm:p-6  ${className}`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {icon && (
                        <div className="flex-shrink-0">
                            <Image
                                src={icon as string}
                                alt="Taskothon Logo"
                                width={32}
                                height={32}
                            />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {isAuthenticated && (
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
                        <Button
                            onClick={handleLogout}
                            icon={LogOut}
                            variant="secondary"
                        >
                            Logout
                        </Button>
                    </div>
                )}

                {actions.length > 0 && (
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
                        {actions.map((action, index) => (
                            <Button
                                key={`${action.label}-${index}`}
                                onClick={action.onClick}
                                icon={action.icon}
                                variant={action.variant}
                                showLabelOnMobile={false}
                                className={action.className}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
