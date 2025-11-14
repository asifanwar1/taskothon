"use client";

import { useEffect } from "react";

export const ServiceWorker = (): null => {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker
                .getRegistrations()
                .then((registrations) => {
                    return Promise.all(
                        registrations.map((registration) => {
                            if (
                                registration.active?.scriptURL.includes("sw.js")
                            ) {
                                return registration.unregister();
                            }
                            return Promise.resolve();
                        })
                    );
                })
                .then(() => {
                    return navigator.serviceWorker.register("/sw.js", {
                        scope: "/",
                        updateViaCache: "none",
                    });
                })
                .then((registration) => {
                    console.log("Service Worker registered:", registration);

                    registration.update();

                    registration.addEventListener("updatefound", () => {
                        console.log("Service Worker update found");
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener("statechange", () => {
                                if (
                                    newWorker.state === "installed" &&
                                    navigator.serviceWorker.controller
                                ) {
                                    console.log(
                                        "New service worker installed, reloading..."
                                    );
                                    window.location.reload();
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        }
    }, []);

    return null;
};
