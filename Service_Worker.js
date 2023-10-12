;
//asignar un nombre y versión al cache
const CACHE_NAME = 'TMHS',
  urlsToCache = [
    './',
    './index.html',
    './src/css/all.min.css',
    './src/css/bootstrap.min.css',
    './src/css/stylo.css',
    './src/assets/hero.webm',
    './src/assets/hero.webp',
    './src/webfonts/',
    './src/js/app.js',
    './src/js/all.min.js',
    './src/js/bootstrap.min.js',
    './src/icons/icon-512x512.png',
    './src/icons/icon-72x72.png'
  ]

  self.addEventListener('install', (event) => {
    console.log('sw instalado');
    caches.open(CACHE_NAME)
    .then(cache => {
        cache.addAll(urlsToCache)
    })
})

self.addEventListener('fetch', event => {
    console.log(event.request)
    event.respondWith(
        caches.match(event.request)
        .then(res => {
            if(res){
                return res;
            }
            let requestToCache = event.request.clone();
            return fetch(requestToCache)
            .then(res => {
                if(!res || res.status !== 200){
                    return res;
                }
                let responseToCache = res.clone();
                caches.open(CACHE_NAME)
                .then(cache => {
                    cache.put(requestToCache, responseToCache)
                })
                return res;
            })
        })
        .catch(() => {
            console.log("error en el match del cache")
        })
    )
})

self.addEventListener('activate', (event) => {
    console.log('sw activado')
})