import articulus from './articulus';
import { getFechaCorta } from './utiles';
import { setIdiomas, urlBaseApi, urlBaseApp, obtenerSrcset } from './comun';

export function iniciar( plantilla, contenedor, opciones, cb ) {
	let op = {
		idioma: opciones.idioma && setIdiomas.includes( opciones.idioma ) ? opciones.idioma : setIdiomas[0],
		seccion: opciones.seccion || '',							// Nombre base
		orden: opciones.orden || 'crono',
		ordenDir: opciones.ordenDir || 'desc',
		cantidad: parseInt( opciones.cantidad, 10 ) || 6,
		pagina:  parseInt( opciones.pagina, 10 ) || 1,
		categoria: opciones.categoria || '',						// Nombre base
		busqueda: opciones.busqueda || '',
		excluir: opciones.excluir || ''								// Título base
	};

	if ( op.excluir ) op.cantidad ++;	// Se pide un artículo más por si se pudiera excluír alguno

	let idiomaUrl = op.idioma === setIdiomas[0] ? '' : op.idioma + '/';

	if ( op.seccion === '' ) {
		console.error( new Error('No se pudieron recuperar los artículos. Falta la sección.') );
		return;
	}

	let url = `${urlBaseApi}/apis/articulus/v1/blogs/${op.seccion}/articulos/?orden=${op.orden}&ordenDir=${op.ordenDir}&pag=${op.pagina}&porPag=${op.cantidad}&categoria=${op.categoria}&busqueda=${op.busqueda}`;

	// Estrategia cache then network
	let datosDeRedRecibidos = false;

	articulus( url, op.idioma )
	.then( artis => {
		datosDeRedRecibidos = true;
		mostrarArticulos( artis );
	}).catch( error => { console.log( error ) } );
	//
	caches.match( url ).then( resCache => {
		if ( resCache ) {
			return resCache.json();
		}
	}).then( artis => {
		if ( artis && !datosDeRedRecibidos ) {
			mostrarArticulos( artis );
		}
	}).catch( error => {
		//console.error( error );
	});

	function mostrarArticulos( artis ) {
		if ( artis.articulos.length > 0 ) {
			let agregados = 0;
			artis.articulos.forEach( arti => {
				if ( arti.tituloUrl !== op.excluir && agregados < op.cantidad ) {
					let articulo = plantilla.cloneNode( true );											// Clona plantilla
					articulo.querySelector('.titulo').textContent = arti.titulo;						// Agrega datos a la plantilla
					if ( articulo.querySelector('.fecha') ) {
						articulo.querySelector('.fecha').textContent = getFechaCorta( new Date( arti.fechaPublicado ), op.idioma );
					}
					if ( articulo.querySelector('.autor') ) {
						articulo.querySelector('.autor').textContent = arti.autor;
					}
					if ( articulo.querySelector('.imagen img') && arti.imgPrincipal ) {
						// Agrega propiedades src srcset y alt a la imagen
						articulo.querySelector('.imagen img').src = arti.imgPrincipal;
						articulo.querySelector('.imagen img').srcset = obtenerSrcset( arti.imgPrincipal );
						articulo.querySelector('.imagen img').alt = arti.titulo;
					}
					if ( articulo.querySelector('.entradilla') ) {
						articulo.querySelector('.entradilla').innerHTML = arti.entradilla;
					}
					let enlaces = articulo.querySelectorAll('.enlace');
					for ( let enlace of enlaces ) {
						enlace.href = `${urlBaseApp}/${idiomaUrl}articulo/${arti.tituloUrl}`;
					}
					contenedor.appendChild( articulo );													// Agrega plantilla al contenedor
					articulo.classList.remove('plantilla');												// y la hace visible
					agregados ++;
				}
			});
		}
		// Callback
		if ( typeof cb === 'function') cb( artis );
	}
}
