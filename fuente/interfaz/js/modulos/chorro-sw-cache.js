import { urlBaseApi, obtenerIdiomaUrl } from './comun';

export default function chorrear( callback ) {
	// Pone ids de contenido en un array sin repetir
	let i, idCon, idsCon = [];
	let datas = document.querySelectorAll('[data-contenido]');							// Obtiene contenedores
	for ( i = 0; i < datas.length; i++ ) {
		idCon = datas[i].getAttribute('data-contenido');								// obtiene id de contenido
		if ( idsCon.indexOf( idCon ) == -1 ) idsCon.push( idCon );						// Si el id no está repetido lo agrega al array
	}
	let arias = document.querySelectorAll('[aria-label]');								// repite con las etiquetas aria-label
	for ( i = 0; i < arias.length; i++ ) {
		idCon = arias[i].getAttribute('aria-label');
		if ( idsCon.indexOf( idCon ) == -1 ) idsCon.push( idCon );
	}
	//
	let chorroIds = idsCon.toString();													// Lista de ids separados por comas
	if ( chorroIds !== '' ) {															// Si hay algún id en la lista
		let url = `${urlBaseApi}/apis/chorro/v1/?chorro=${chorroIds}`;
		let datosDeRedRecibidos = false;
		let idioma = obtenerIdiomaUrl();
		// Pide datos en la red
		fetch( url, { method: 'get', headers: { 'Accept-Language': idioma } } )
		.then( respuesta => {
			if ( respuesta.status !== 200 ) throw new Error('Error descargando contenidos');
			return respuesta;
		})
		.then( respuesta => respuesta.json() )
		.then( contenidos => {
			mostrarContenidos( contenidos );

			if ( typeof callback === 'function' ) {
				callback();
			}

			datosDeRedRecibidos = true;
		}).catch( error => { console.error( error.message, error ) } );
		// Si el service worker tiene datos en cache, los muestra mientras se obtienen datos de la red
		if ( window.caches ) {
			caches.match( url ).then( resCache => {
				if ( resCache ) {
					return resCache.json();
				}
			}).then( contenidos => {
				if ( contenidos && !datosDeRedRecibidos ) {
					mostrarContenidos( contenidos );
					if ( typeof callback === 'function' ) {
						callback();
					}
				}
			}).catch( error => { /*console.log( error )*/ } );
		}
	}
	//
	function mostrarContenidos( contenidos ) {
		let i, j, idContenido, contenedores, ariaLabels;
		for ( idContenido in contenidos ) {											// Agrega cada contenido a la página
			contenedores = document.querySelectorAll('[data-contenido="' + idContenido + '"]');
			for ( i = 0; i < contenedores.length; i++ ) {							// todas las veces que se repita cada uno
				if ( contenedores[i].tagName == 'TITLE' ) {
					contenedores[i].innerText = contenidos[idContenido];			// agrega texto
				} else if ( contenedores[i].tagName == 'META' ) {
					contenedores[i].setAttribute('content', contenidos[idContenido] );
				} else if ( contenedores[i].tagName == 'INPUT' || contenedores[i].tagName == 'TEXTAREA' ) {
					contenedores[i].setAttribute('placeholder', contenidos[idContenido] );// agrega placeholder
				} else if ( contenedores[i].tagName == 'IMG' ) {
					contenedores[i].setAttribute('alt', contenidos[idContenido] );	// agrega texto alternativo de imagen
				} else {
					contenedores[i].innerHTML = contenidos[idContenido];			// agrega html
				}
			}
			// Reemplaza valor de las etiquetas aria por contenido bilingüe
			ariaLabels = document.querySelectorAll('[aria-label="' + idContenido + '"]');
			for ( j = 0; j < ariaLabels.length; j++ ) {
				ariaLabels[j].setAttribute('aria-label', contenidos[idContenido] );
			}
		}
	}
}