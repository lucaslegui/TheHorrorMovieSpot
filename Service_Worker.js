// Asignar un nombre y versión al cache
const CACHE_NAME = 'TMHS',
    urlsToCache = [
        './',
        './index.html',
        './offline.html',
        './src/css/all.min.css',
        './src/css/bootstrap.min.css',
        './src/css/stylo.css',
        './src/assets/hero.webm',
        './src/assets/hero.webp',
        './src/js/app.js',
        './src/js/all.min.js',
        './src/js/bootstrap.min.js',
        './src/icons/icon-152x152.png',
        './src/icons/icon-144x144.png',
        './src/icons/icon-128x128.png',
        './src/icons/icon-512x512.png',
        './src/icons/icon-72x72.png'
    ];

self.addEventListener('install', (event) => {
    console.log('SW instalado');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(res => {
                if (res) {
                    return res;
                }
                return fetch(event.request).catch(() => {
                    // Notificacion de estar offline
                    self.registration.showNotification("Sin conexión", {
                        body: "Parece que estás offline. ¡Revisa tu conexión a internet!",
                        icon: './src/icons/icon-512x512.png'
                    });
                   return caches.match('./offline.html');
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('SW activado');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        }).then(() => {
            // Notificacion de nuevos contenidos
            self.registration.showNotification("Notificación local", {
                body: "¡Nuevos contenidos de terror disponibles!",
                icon: './src/icons/icon-512x512.png'
            });
        })
    );
});
