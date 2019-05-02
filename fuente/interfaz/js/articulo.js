import estilos from '../estilo/articulo.scss';
import articulus from './modulos/articulus';
import * as comun from './modulos/comun';
import { getFechaLarga } from './modulos/utiles';
import * as articulos from './modulos/articulos';
import * as comentarios from './widgets/comentarios';

comun.registrarServiceWorker().catch( error => { console.error( error ) } );
comun.setIdiomaPagina();
comun.iniciarSelectorIdioma();
comun.widgetContacto();
let idioma = comun.obtenerIdiomaUrl();
let idiomaUrl = idioma === comun.setIdiomas[0] ? '' : idioma + '/';
//
comun.chorrear( () => {
	comun.iniciarMenu();
});

let seccionBase = 'seccion-demo';

// Obtiene de la URL nombre base del artículo
let partes = document.location.pathname.split('/');
if ( partes[ partes.length -1 ] === '' ) {						// Si la URL temina en barra el último elemento del array estará vacío
	partes.pop();												// entonces lo elimina
}
let artiBase = partes[ partes.length - 1 ];

// Inicia widget de usuario y pasa info del usuario al widget de comentarios
comun.widgetUsuario( usr => {
	comentarios.iniciar( seccionBase, artiBase, idioma, usr );
});

// Petición del artículo cache then network
let datosDeRedRecibidos = false;
let url = `${comun.urlBaseApi}/apis/articulus/v1/blogs/${seccionBase}/articulos/${artiBase}`;
articulus( url, idioma )
.then( arti => {
	datosDeRedRecibidos = true;
	mostrarArticulo( arti );
}).catch( error => { console.log( error ) } );
//
caches.match( url ).then( resCache => {
	if ( resCache ) {
		return resCache.json();
	}
}).then( arti => {
	if ( arti && !datosDeRedRecibidos ) {
		mostrarArticulo( arti );
	}
}).catch( error => { /*console.log( error )*/ } );

function mostrarArticulo( arti ) {
	document.title = arti.titulo;
	if ( arti.categorias.length > 0 ) {
		arti.categorias.forEach( cat => {
			let categoria = document.createElement('h4');
			categoria.classList.add('categoria');
			let enlace = document.createElement('a');
			enlace.textContent = cat.nombre;
			enlace.href = `/categoria/${cat.nombreBase}`;
			categoria.appendChild( enlace );
			document.querySelector('.categorias').appendChild( categoria );
		});
	}
	document.querySelector('h1.titulo').textContent = arti.titulo;
	document.querySelector('.fecha').textContent = getFechaLarga( new Date( arti.fechaPublicado ), idioma );
	document.querySelector('.autor').textContent = arti.autor;
	// Agrega propiedades src srcset y alt a imagen principal
	document.querySelector('.imgPrincipal').src = arti.imgPrincipal;
	document.querySelector('.imgPrincipal').srcset = comun.obtenerSrcset( arti.imgPrincipal );
	document.querySelector('.imgPrincipal').alt = arti.titulo;
	//
	document.querySelector('.entradilla').innerHTML = arti.entradilla;
	// Agrega propiedades srcset y sizes a las etiquetas <img> en cuerpo de artículo
	let srcImgs = arti.texto.match( /src=[\'|\"]+([^'"]+)(jpg|png)[\'|\"]+/g );
	if ( srcImgs ) {
		srcImgs.forEach( srcImg => {
			let url = srcImg.substring( 5, srcImg.length - 1 );	// Quita cadena 'src="' de adelante y comilla final
			let imgProps = `sizes="(min-width: 540px) 960px, 480px" srcset="${comun.obtenerSrcset( url )}" ${srcImg}`;
			arti.texto = arti.texto.replace( srcImg, imgProps );
		});
	}
	document.querySelector('.cuerpo').innerHTML = arti.texto;
	//
	if ( arti.anterior.titulo != '' ) {
		let anterior = document.querySelector('.anterior');
		anterior.querySelector('.tit').textContent = arti.anterior.titulo;
		anterior.querySelector('a').href = `${comun.urlBaseApp}/${idiomaUrl}articulo/${arti.anterior.url.split('/').pop()}`;	// Usa título base de URL de la API para el enlace
		anterior.querySelector('a').classList.remove('oculto');
	}
	if ( arti.siguiente.titulo != '' ) {
		let siguiente = document.querySelector('.siguiente');
		siguiente.querySelector('.tit').textContent = arti.siguiente.titulo;
		siguiente.querySelector('a').href = `${comun.urlBaseApp}/${idiomaUrl}articulo/${arti.siguiente.url.split('/').pop()}`;
		siguiente.querySelector('a').classList.remove('oculto');
	}
	//
	if ( arti.categorias.length > 0 ) {
		// Relacionados (artículos de la misma categoría en el aside)
		document.querySelector('aside .artis-categoria').textContent = arti.categorias[0].nombre;
		let opArtisCat = {
			idioma: idioma,
			seccion: seccionBase,
			categoria: arti.categorias[0].nombreBase,
			excluir: artiBase
		};
		articulos.iniciar( document.querySelector('.categoria .articulo.plantilla'), document.querySelector('.categoria .articulos'), opArtisCat, () => {
			document.querySelector('.categoria .articulos').classList.add('visible');
		});
	}
	//
	comun.widgetCompartir( document.location.href, arti.titulo, arti.entradilla );		//// Limpiar html de entradilla
}
// Últimos artículos aside
let opArtisUlti = {
	idioma: idioma,
	seccion: seccionBase,
	excluir: artiBase
};
articulos.iniciar( document.querySelector('.ultimos .articulo.plantilla'), document.querySelector('.ultimos .articulos'), opArtisUlti, () => {
	document.querySelector('.ultimos .articulos').classList.add('visible');
});
