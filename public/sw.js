const CACHE_NAME = "taskothon-v2";
const urlsToCache = [
    "/",
    "/tasks",
    "/auth/signin",
    "/icon-192x192.png",
    "/icon-512x512.png",
];

const EXCLUDE_FROM_CACHE = [
    "/_next/",
    "/api/",
    "/sw.js",
    "/manifest.json",
    "webpack",
    "chunks",
];

const EXCLUDE_FROM_INTERCEPT = [
    "dexie.cloud",
    "/_next/",
    "webpack",
    "chunks",
    "/manifest.json",
];

const shouldCache = (url) => {
    return !EXCLUDE_FROM_CACHE.some((pattern) => url.includes(pattern));
};

const isDexieCloudRequest = (url) => {
    return url.includes("dexie.cloud");
};

const shouldIntercept = (requestUrl) => {
    return !EXCLUDE_FROM_INTERCEPT.some((pattern) =>
        requestUrl.includes(pattern)
    );
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
