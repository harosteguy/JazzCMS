import { urlBaseApi } from './wm-comun';

export function autorizacion() {
	return new Promise( ( resuelve, rechaza ) => {
		if ( localStorage.getItem('uid') && localStorage.getItem('token') ) {
			let htmlLang = document.getElementsByTagName('html')[0].getAttribute('lang') == 'en' ? 'en' : 'es';
			let reqHeaders = {
				"Authorization": "Basic " + btoa( localStorage.getItem('uid') + ":" + localStorage.getItem('token') ),
				"Accept-Language": htmlLang
			};
			fetch(`${urlBaseApi}/apis/usuarios/v1/autorizacion`, { method: 'get', headers: reqHeaders } )
			.then( respuesta => {
				if ( respuesta.status !== 200 ) {
					rechaza( new Error('Usuario no autorizado') );
					return;
				}
				return respuesta.json();
			})
			.then( usuario => {
				resuelve( usuario );
			})
			.catch( error => {
				rechaza( new Error('Usuario no autorizado') );
			});
		} else {
			rechaza( new Error('Usuario no autorizado') );
		}
	});
}

export function login ( email, clave ) {



}
