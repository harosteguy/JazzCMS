import { autorizacion } from './usuario';

export let urlBaseApi = '';								// Dejar vacío si es igual a la URL de la aplicación
export let urlBaseApp = '';								// Dejar vacío si es igual a la URL de la API
export let setIdiomas = ['es', 'en'];					// El primero es el idioma por defecto
export let setIdiomaIsoNombre = [
	{ iso: 'es', nombre: 'Español' },
	{ iso: 'en', nombre: 'English' }
];
export let setDeImagenes = [ 480, 960, 1280 ];

// Re-exportaciones
export { default as chorrear } from './chorro-sw-cache';
export { iniciar as iniciarMenu } from './menu';
export { widgetUsuario } from '../widgets/usuario';
export { iniciar as iniciarSelectorIdioma } from '../widgets/selector-idioma';
export { widgetContacto } from '../widgets/contacto';
export { widgetCompartir } from '../widgets/compartir';
//

export function registrarServiceWorker() {
	return new Promise( ( resuelve, rechaza ) => {
		if ('serviceWorker' in navigator ) {
			navigator.serviceWorker.register('/sw.js')
			.then( swReg => {
				return resuelve( swReg );
			})
			.catch( error => {
				return rechaza( error );
			});
		} else {
			return rechaza( new Error('El navegador no soporta service worker') );
		}
	});
}

export function obtenerIdiomaUrl() {
	let partes = document.location.pathname.split('/');
	partes.shift();				// Quita el host
	return module.exports.setIdiomas.includes( partes[0] ) ? partes[0] : module.exports.setIdiomas[0];
}

export function setIdiomaPagina() {
	let idioma = module.exports.obtenerIdiomaUrl();
	// Setea html lang
	document.documentElement.lang = idioma;
	// Setea href y hreflang
	let hrefOrig;
	let enlaces = document.querySelectorAll('[href]');
	let idiomaUrl = idioma === module.exports.setIdiomas[0] ? '' : idioma + '/';
	enlaces.forEach( enlace => {
		hrefOrig = enlace.href;
		enlace.href = enlace.href.replace(/\[\[idiomaUrl\]\]/, idiomaUrl );
		if ( hrefOrig !== enlace.href ) {	// Si cambió href
			enlace.hreflang = idioma;		// set hreflang
		}
	});
}

export 	function obtenerSrcset( srcImg ) {
	let srcSinExt = srcImg.substr( 0, srcImg.length - 4 );
	let extArchivo = srcImg.substr( -3 );
	let srcset = '';
	module.exports.setDeImagenes.forEach( ancho => {
		srcset += `${srcSinExt}-${ancho}.${extArchivo} ${ancho}w, `;
	});
	return srcset.substr( 0, srcset.length - 2 );		// Retorna sin último espacio y coma
}

export function esperaAjax( mostrar, proceso ) {
	var capaEspera = document.getElementById('capaEspera');
	if ( mostrar ) {
		if ( !capaEspera ) {
			capaEspera = document.createElement('div');
			capaEspera.id = 'capaEspera';
//			let spinner = document.createElement('img');
//			spinner.src = '/interfaz/img/spinner.svg';
//			spinner.classList.add('spinner');
//			capaEspera.appendChild( spinner );
			document.body.appendChild( capaEspera );
		}
		//
		var jsonProcesos = capaEspera.getAttribute('data-procesos');
		var aProcesos = jsonProcesos ? JSON.parse( jsonProcesos ) : [];
		if ( aProcesos.indexOf( proceso ) === -1 ) {
			aProcesos.push( proceso );
			capaEspera.dataset.procesos = JSON.stringify( aProcesos );
		}
		//
		capaEspera.classList.add('visible');
	} else {
		if ( capaEspera = document.getElementById('capaEspera') ) {
			//
			var jsonProcesos = capaEspera.getAttribute('data-procesos');
			var aProcesos = jsonProcesos ? JSON.parse( jsonProcesos ) : [];
			var indice = aProcesos.indexOf( proceso );
			if ( indice > -1 ) {
				aProcesos.splice( indice, 1 );
				capaEspera.dataset.procesos = JSON.stringify( aProcesos );
			}
			//
			if ( aProcesos.length === 0 ) {
				capaEspera.classList.remove('visible');
			}
		}
	}
};

