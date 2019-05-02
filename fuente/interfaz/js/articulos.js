import estilos from '../estilo/articulos.scss';
import * as comun from './modulos/comun';
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
	comun.iniciarMenu('mnuArticulos');
	comun.widgetCompartir( document.location.href, document.title, document.querySelector('meta[name=\"description\"]').content );
});

let seccionBase = 'seccion-demo';

let plantilla = document.querySelector('.section-main .articulo.plantilla');
let contenedor = document.querySelector('.section-main .articulos');
let verMas = document.getElementById('verMas');
verMas.dataset.pagina = 2;
let opArtis = {
	idioma: idioma,
	pagina: 1,
	cantidad: 8,
	seccion: seccionBase
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
