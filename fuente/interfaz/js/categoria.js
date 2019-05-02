import estilos from '../estilo/categoria.scss';
import * as comun from './modulos/comun';
import articulus from './modulos/articulus';
import * as articulos from './modulos/articulos';
import * as catAside from './widgets/categorias-aside';

comun.registrarServiceWorker().catch( error => { console.error( error ) } );
comun.widgetUsuario();
comun.setIdiomaPagina();
comun.iniciarSelectorIdioma();
comun.widgetContacto();
let idioma = comun.obtenerIdiomaUrl();
//
comun.chorrear( () => {
	comun.iniciarMenu();
});

let seccionBase = 'seccion-demo';

// Obtiene de la URL nombre base de la categoría
let catBase, partes = document.location.pathname.split('/');
if ( partes[ partes.length -1 ] === '' ) {						// Si la URL temina en barra el último elemento del array estará vacío
	catBase = partes[ partes.length - 2 ];						// entonces se usa el elemento anterior
} else {
	catBase = partes[ partes.length - 1 ];
}

// Obtiene datos de la categoría
articulus(`${comun.urlBaseApi}/apis/articulus/v1/blogs/${seccionBase}/categorias/${catBase}`, idioma ).then( cat => {
	document.title = cat.nombre;
	document.getElementById('titulo').textContent = cat.nombre;
	//document.querySelector('meta[name=\"description\"]').content = cat.descripcion; Usar solo si la descripción no contiene html
	document.querySelector('.caja.cabeza').style.backgroundImage = `url('${cat.imgPrincipal}')`;
	comun.widgetCompartir( document.location.href, document.title, document.querySelector('meta[name=\"description\"]').content );
});

// Obtiene artículos
let plantilla = document.querySelector('.articulo.plantilla');
let contenedor = document.querySelector('.articulos');
let verMas = document.getElementById('verMas');
verMas.dataset.pagina = 2;
let opArtis = {
	idioma: idioma,
	pagina: 1,
	cantidad: 8,
	seccion: seccionBase,
	categoria: catBase
};
articulos.iniciar( plantilla, contenedor, opArtis, artis => {
	if ( opArtis.pagina != artis.paginacion.total ) {			// Si no es la única página de resultados
		verMas.classList.remove('oculto');						// muestra botón ver más
	}
});

verMas.addEventListener('click', () => {
	opArtis.pagina = verMas.dataset.pagina;
	verMas.dataset.pagina ++;
	articulos.iniciar( plantilla, contenedor, opArtis, artis => {
		if ( opArtis.pagina == artis.paginacion.total ) {		// Si se muestra la última página
			verMas.classList.add('oculto');						// oculta el botón
		}
	});
});

catAside.widgetCategorias( seccionBase, idioma ); // Categorías aside

// Últimos artículos aside
let opArtisUlti = {
	idioma: idioma,
	seccion: seccionBase
};
articulos.iniciar( document.querySelector('.ultimos .articulos-aside .articulo.plantilla'), document.querySelector('.ultimos .articulos-aside .articulos'), opArtisUlti, () => {
	document.querySelector('.ultimos .articulos-aside .articulos').classList.add('visible');
});
