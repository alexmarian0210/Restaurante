const CACHE_NAME = "sischef-v1";
const APP_SHELL = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/js/app.js",
    "/manifest.json",
    "/icons/icon.svg",
    "/icons/icon-192.png",
    "/icons/icon-512.png"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(APP_SHELL);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys.filter(function (key) {
                    return key !== CACHE_NAME;
                }).map(function (key) {
                    return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", function (event) {
    const url = new URL(event.request.url);

    // API sempre tenta buscar dados atuais no servidor.
    if (url.pathname.startsWith("/api/")) {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(function (response) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, clone);
                });
                return response;
            })
            .catch(function () {
                return caches.match(event.request);
            })
    );
});
