/* eslint-env serviceworker */

let cacheChorro = 'cmsApis0'
let cachePaginas = 'cmsPaginas0'

const recursos = [
  '/wm/interfaz/js/ckeditor5-translations/es.js',
  '/wm/interfaz/img/sin_foto.jpg',
  '/wm/interfaz/css/contenidos.css',
  '/wm/interfaz/js/contenidos.js',
  '/wm/interfaz/css/inicio.css',
  '/wm/interfaz/js/inicio.js',
  '/wm/interfaz/css/pagina-ejemplo.css',
  '/wm/interfaz/js/pagina-ejemplo.js',
  '/wm/interfaz/css/secciones-articulo.css',
  '/wm/interfaz/js/secciones-articulo.js',
  '/wm/interfaz/css/secciones-autores.css',
  '/wm/interfaz/js/secciones-autores.js',
  '/wm/interfaz/css/secciones-categorias.css',
  '/wm/interfaz/js/secciones-categorias.js',
  '/wm/interfaz/css/secciones-indice.css',
  '/wm/interfaz/js/secciones-indice.js',
  '/wm/interfaz/css/secciones-secciones.css',
  '/wm/interfaz/js/secciones-secciones.js',
  '/wm/interfaz/css/usuario-clave.css',
  '/wm/interfaz/js/usuario-clave.js',
  '/wm/interfaz/css/usuario-clave-nueva.css',
  '/wm/interfaz/js/usuario-clave-nueva.js',
  '/wm/interfaz/css/usuario-login.css',
  '/wm/interfaz/js/usuario-login.js',
  '/wm/interfaz/js/ckeditor5-translations/en.js',
  '/index.html',
  '/wm/usuario/login/index.html',
  '/wm/usuario/clave/index.html',
  '/wm/usuario/clave/nueva/index.html',
  '/wm/index.html',
  '/wm/secciones/indice/index.html',
  '/wm/secciones/articulo/index.html',
  '/wm/secciones/categorias/index.html',
  '/wm/secciones/secciones/index.html',
  '/wm/secciones/autores/index.html',
  '/wm/contenidos/index.html'
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cachePaginas).then(cache => {
      return cache.addAll(recursos)
    })
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cachePaginas && key !== cacheChorro) {
          return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', e => {
  // https://bugs.chromium.org/p/chromium/issues/detail?id=823392
  if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') {
    return
  }
  //
  if (e.request.method !== 'GET') {
    return
  }
  //
  if (e.request.url.indexOf('/apis/chorro/v1') > -1) {
    // Cache then network
    e.respondWith(
      caches.open(cacheChorro).then(cache => {
        return fetch(e.request).then(response => {
          cache.put(e.request.url, response.clone())
          return response
        })
      })
    )
  } else if (e.request.url.indexOf('/wm/') > -1) {
    // Stale-while-revalidate
    // If there's a cached version available, use it, but fetch an update for next time.
    e.respondWith(
      caches.open(cachePaginas).then(cache => {
        return cache.match(e.request).then(response => {
          let fetchPromise = fetch(e.request).then(networkResponse => {
            cache.put(e.request, networkResponse.clone())
            return networkResponse
          })
          return response || fetchPromise
        })
      })
    )
  }
})
