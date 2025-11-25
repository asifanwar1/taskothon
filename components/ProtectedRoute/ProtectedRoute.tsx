"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { APP_ROUTES } from "@/constants/Routes";

type ProtectedRouteProps = {
    children: React.ReactNode;
};

const PUBLIC_ROUTES = [APP_ROUTES.SIGNIN, APP_ROUTES.SIGNUP];

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, isInitialized } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    useEffect(() => {
        if (isLoading || !isInitialized) {
            return;
        }
        if (
            !isAuthenticated &&
            !isPublicRoute &&
            pathname !== APP_ROUTES.SIGNIN
        ) {
            router.replace(APP_ROUTES.SIGNIN);
            return;
        }

        if (isAuthenticated && isPublicRoute && pathname !== APP_ROUTES.HOME) {
            router.replace(APP_ROUTES.HOME);
        }
    }, [
        isAuthenticated,
        isInitialized,
        isLoading,
        isPublicRoute,
        pathname,
        router,
    ]);

    if (isLoading || !isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated && !isPublicRoute && pathname !== APP_ROUTES.SIGNIN) {
        return null;
    }

    if (isAuthenticated && isPublicRoute && pathname !== APP_ROUTES.HOME) {
        return null;
    }

    return <>{children}</>;
};
