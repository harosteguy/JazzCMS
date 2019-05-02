import estilos from '../estilo/busqueda.scss';
import * as comun from './modulos/comun';
import tostada from './widgets/tostada';
import * as articulos from './modulos/articulos';

comun.registrarServiceWorker().catch( error => { console.error( error ) } );
comun.widgetUsuario();
comun.setIdiomaPagina();
comun.iniciarSelectorIdioma();
comun.widgetContacto();
let idioma = comun.obtenerIdiomaUrl();
//
comun.chorrear( () => {
	comun.iniciarMenu();
	comun.widgetCompartir( document.location.href, document.title, document.querySelector('meta[name=\"description\"]').content );
});

let seccionBase = 'seccion-demo';

let params = ( new URL( document.location ) ).searchParams;
let busca = params.get('busca');
busca = busca || '';

let plantilla = document.querySelector('.articulo.plantilla');
let contenedor = document.querySelector('.articulos');
let verMas = document.getElementById('verMas');
verMas.dataset.pagina = 2;
let opArtis = {
	idioma: idioma,
	pagina: 1,
	cantidad: 8,
	seccion: seccionBase,
	busqueda: busca
};

articulos.iniciar( plantilla, contenedor, opArtis, artis => {
	if ( opArtis.busqueda && artis.articulos.length === 0 ) {	// No hay resultados
		tostada( document.querySelector('.noResulBusca').textContent, 4, 'color-tres' );
	} else if ( opArtis.pagina != artis.paginacion.total ) {	// Si no es la única página de resultados
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

// Últimos artículos
let opArtisUlti = {
	idioma: idioma,
	cantidad: 4,
	seccion: seccionBase
};
articulos.iniciar( document.querySelector('.articulo.plantilla'), document.querySelector('.ultimos .articulos'), opArtisUlti, () => {
	document.querySelector('.ultimos .articulos').classList.add('visible');
});
