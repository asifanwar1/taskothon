"use client";

import { useEffect } from "react";

export const ServiceWorker = (): null => {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js", {
                    scope: "/",
                    updateViaCache: "none",
                })
                .then((registration) => {
                    console.log("Service Worker registered:", registration);

                    // Check for updates
                    registration.addEventListener("updatefound", () => {
                        console.log("Service Worker update found");
                    });
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        }
    }, []);

    return null;
};
