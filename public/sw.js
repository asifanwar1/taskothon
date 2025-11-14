// const CACHE_NAME = "taskothon-v1";
// const urlsToCache = [
//     "/",
//     "/tasks",
//     "/auth/signin",
//     "/icon-192x192.png",
//     "/icon-512x512.png",
// ];

// const shouldCache = (url) => {
//     if (
//         url.includes("/_next/") ||
//         url.includes("/api/") ||
//         url.includes("/sw.js") ||
//         url.includes("/manifest.json") ||
//         url.includes("webpack") ||
//         url.includes("chunks")
//     ) {
//         return false;
//     }
//     return true;
// };

// self.addEventListener("install", (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(urlsToCache);
//         })
//     );
// });

// self.addEventListener("activate", (event) => {
//     event.waitUntil(
//         caches.keys().then((cacheNames) => {
//             return Promise.all(
//                 cacheNames.map((cacheName) => {
//                     if (cacheName !== CACHE_NAME) {
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });

// self.addEventListener("fetch", (event) => {
//     const url = new URL(event.request.url);
//     const requestUrl = event.request.url;

//     if (
//         !shouldCache(url.pathname) ||
//         requestUrl.includes("/_next/") ||
//         requestUrl.includes("webpack") ||
//         requestUrl.includes("chunks") ||
//         requestUrl.includes("/manifest.json")
//     ) {
//         event.respondWith(fetch(event.request));
//         return;
//     }

//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             if (response) {
//                 return response;
//             }

//             return fetch(event.request).then((response) => {
//                 if (response.status === 200 && shouldCache(url.pathname)) {
//                     const responseToCache = response.clone();
//                     caches.open(CACHE_NAME).then((cache) => {
//                         cache.put(event.request, responseToCache);
//                     });
//                 }
//                 return response;
//             });
//         })
//     );
// });
// self.addEventListener("push", (event) => {
//     if (event.data) {
//         const data = event.data.json();
//         const options = {
//             body: data.body,
//             icon: data.icon || "/icon-192x192.png",
//             badge: "/icon-192x192.png",
//             vibrate: [100, 50, 100],
//             data: {
//                 dateOfArrival: Date.now(),
//                 primaryKey: "1",
//             },
//         };
//         event.waitUntil(
//             self.registration.showNotification(
//                 data.title || "Taskothon",
//                 options
//             )
//         );
//     }
// });

// self.addEventListener("notificationclick", (event) => {
//     event.notification.close();
//     event.waitUntil(clients.openWindow("/"));
// });

const CACHE_NAME = "taskothon-v2";
const urlsToCache = [
    "/",
    "/tasks",
    "/auth/signin",
    "/icon-192x192.png",
    "/icon-512x512.png",
];

const shouldCache = (url) => {
    if (url.includes("/_next/")) {
        return false;
    }
    if (url.includes("/api/")) {
        return false;
    }
    if (url.includes("/sw.js")) {
        return false;
    }
    if (url.includes("/manifest.json")) {
        return false;
    }
    if (url.includes("webpack") || url.includes("chunks")) {
        return false;
    }
    return true;
};

const isDexieCloudRequest = (url) => {
    return url.includes("dexie.cloud");
};

const shouldIntercept = (requestUrl) => {
    if (isDexieCloudRequest(requestUrl)) {
        return false;
    }
    if (requestUrl.includes("/_next/")) {
        return false;
    }
    if (requestUrl.includes("webpack")) {
        return false;
    }
    if (requestUrl.includes("chunks")) {
        return false;
    }
    if (requestUrl.includes("/manifest.json")) {
        return false;
    }
    return true;
};

self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        Promise.all([
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim(),
        ])
    );
});

self.addEventListener("fetch", (event) => {
    const requestUrl = event.request.url;

    if (!shouldIntercept(requestUrl)) {
        return;
    }

    const url = new URL(requestUrl);

    if (!shouldCache(url.pathname)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }

            return fetch(event.request).then((response) => {
                if (response.status === 200 && shouldCache(url.pathname)) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            });
        })
    );
});

self.addEventListener("push", (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: data.icon || "/icon-192x192.png",
            badge: "/icon-192x192.png",
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: "1",
            },
        };
        event.waitUntil(
            self.registration.showNotification(
                data.title || "Taskothon",
                options
            )
        );
    }
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
});
