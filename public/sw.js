const CACHE_NAME = "taskothon-v1";
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

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    const requestUrl = event.request.url;

    if (
        !shouldCache(url.pathname) ||
        requestUrl.includes("/_next/") ||
        requestUrl.includes("webpack") ||
        requestUrl.includes("chunks") ||
        requestUrl.includes("/manifest.json")
    ) {
        event.respondWith(fetch(event.request));
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
