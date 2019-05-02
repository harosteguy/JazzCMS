let cacheApis = 'cmsApis0';
let cachePaginas = 'cmsPaginas0';
/*
let filesToCache = [
	'manifest.json'
];
*/
serviceWorkerOption.assets.push('manifest.json');
serviceWorkerOption.assets.push('site.webmanifest');

//importScripts('/interfaz/js/cache-polyfill.js');

self.addEventListener('install', function( e ) {
	e.waitUntil(
		caches.open( cachePaginas ).then( function( cache ) {
			//return cache.addAll( filesToCache );
			return cache.addAll( serviceWorkerOption.assets );		// Usando serviceworker-webpack-plugin
		})
	);
});

self.addEventListener('activate', function( e ) {
	e.waitUntil(
		caches.keys().then( function( keyList ) {
			return Promise.all( keyList.map( function( key ) {
				if ( key !== cachePaginas && key !== cacheApis ) {
					return caches.delete( key );
				}
			}));
		})
	);
	return self.clients.claim();
});

self.addEventListener('fetch', function( e ) {


	// https://bugs.chromium.org/p/chromium/issues/detail?id=823392
	if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') {
		return;
	}
	// 
	if ( e.request.method != 'GET' ) {
		return;
	}
	//
	let dataUrl = 'https://cms.local/apis';

	if ( e.request.url.indexOf( dataUrl ) > -1 ) {
		// Cache then network
		e.respondWith(
			caches.open( cacheApis ).then( function( cache ) {
				return fetch( e.request ).then( function( response ) {
					cache.put( e.request.url, response.clone() );
					return response;
				});
			})
		);
	} else {
/*
		// On network response
		// If a request doesn't match anything in the cache, get it from the network, send it to the page & add it to the cache at the same time.
		e.respondWith(
			caches.open( cachePaginas ).then( function ( cache ) {
				return cache.match( e.request ).then( function ( response ) {
					return response || fetch(e.request).then(function(response) {
						cache.put(e.request, response.clone());
						return response;
					});
				});
			})
		);
*/
		// Stale-while-revalidate
		// If there's a cached version available, use it, but fetch an update for next time.
		e.respondWith(
			caches.open( cachePaginas ).then( function( cache ) {
				return cache.match( e.request ).then( function( response ) {
					let fetchPromise = fetch( e.request ).then( function( networkResponse ) {
						cache.put( e.request, networkResponse.clone() );
						return networkResponse;
					});
					return response || fetchPromise;
				})
			})
		);
	}

});
