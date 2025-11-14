// "use client";

// import { useEffect } from "react";

// export const ServiceWorker = (): null => {
//     useEffect(() => {
//         if (typeof window !== "undefined" && "serviceWorker" in navigator) {
//             navigator.serviceWorker
//                 .register("/sw.js", {
//                     scope: "/",
//                     updateViaCache: "none",
//                 })
//                 .then((registration) => {
//                     console.log("Service Worker registered:", registration);

//                     // Check for updates
//                     registration.addEventListener("updatefound", () => {
//                         console.log("Service Worker update found");
//                     });
//                 })
//                 .catch((error) => {
//                     console.error("Service Worker registration failed:", error);
//                 });
//         }
//     }, []);

//     return null;
// };

"use client";

import { useEffect } from "react";

export const ServiceWorker = (): null => {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            const registerServiceWorker = async (): Promise<void> => {
                try {
                    const registration = await navigator.serviceWorker.register(
                        "/sw.js",
                        {
                            scope: "/",
                            updateViaCache: "none",
                        }
                    );

                    console.log("Service Worker registered:", registration);

                    registration.addEventListener("updatefound", () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener("statechange", () => {
                                if (
                                    newWorker.state === "installed" &&
                                    navigator.serviceWorker.controller
                                ) {
                                    console.log(
                                        "New service worker available, reloading..."
                                    );
                                    window.location.reload();
                                }
                            });
                        }
                    });

                    setInterval(() => {
                        void registration.update();
                    }, 60000);
                } catch (error) {
                    console.error("Service Worker registration failed:", error);
                }
            };

            void registerServiceWorker();
        }
    }, []);

    return null;
};
