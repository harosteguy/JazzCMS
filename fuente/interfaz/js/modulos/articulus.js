import { setIdiomas } from './comun';

export default function articulus( url, idioma = setIdiomas[0] ) {
	return new Promise( ( resuelve, rechaza ) => {
		if ( !url ) rechaza('Error requiriendo contenidos. Falta URL');
		//
		fetch( url, { method: 'get', headers: { 'Accept-Language': idioma } } )
		.then( res => res.text() )
		.then( resTexto => {
			try {
				const respuesta = JSON.parse( resTexto );
				return respuesta;
			} catch ( e ) {
				throw new Error('Error obteniendo contenidos.');
			}
		})
		.then( contenidos => {
			if ( contenidos.error ) throw new Error( contenidos.error );
			resuelve( contenidos );
		}).catch( error => { rechaza( error.message ) } );
	});
}
