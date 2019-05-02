import estilos from '../../estilo/widgets/_categorias-aside.scss';
import articulus from '../modulos/articulus';
import { urlBaseApi, urlBaseApp } from '../modulos/comun';


export function widgetCategorias( seccionBase, idioma ) {

	console.log('widgetCategorias')

	let url = `${urlBaseApi}/apis/articulus/v1/blogs/${seccionBase}/categorias`;

	// Estrategia cache then network
	let datosDeRedRecibidos = false;

	articulus( url, idioma )
	.then( cats => {
		datosDeRedRecibidos = true;
		mostrarCategorias( cats );
	}).catch( error => { console.log( error ) } );
	//
	caches.match( url ).then( resCache => {
		if ( resCache ) {
			return resCache.json();
		}
	}).then( cats => {
		if ( cats && !datosDeRedRecibidos ) {
			mostrarCategorias( cats );
		}
	}).catch( error => {
		//console.error( error );
	});

	function mostrarCategorias( cats ) {
		if ( cats.categorias.length > 0 ) {
			let plantilla = document.querySelector('.categorias-aside .plantilla');
			cats.categorias.forEach( cat => {
				let categoria = plantilla.cloneNode( true );											// Clona plantilla
				categoria.querySelector('.nombre').textContent = cat.nombre;							// Agrega datos a la plantilla
				categoria.querySelector('.enlace.fondo').style.backgroundImage = `url('${cat.imgPrincipal}')`;
				categoria.querySelector('.enlace.fondo').href = `${urlBaseApp}/categoria/${cat.nombreBase}`;
				document.querySelector('.categorias-aside .categorias').appendChild( categoria );		// Agrega plantilla al contenedor
				categoria.classList.remove('plantilla');												// y la hace visible

			});
			document.querySelector('.categorias-aside .categorias').classList.add('visible');
		}
	}

}
