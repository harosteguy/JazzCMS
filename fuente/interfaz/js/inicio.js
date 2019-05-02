import estilos from '../estilo/inicio.scss';
import * as comun from './modulos/comun';
import * as articulos from './modulos/articulos';

comun.registrarServiceWorker().catch( error => { console.error( error ) } );
comun.widgetUsuario();
comun.setIdiomaPagina();
comun.iniciarSelectorIdioma();
comun.widgetContacto();
let idioma = comun.obtenerIdiomaUrl();
//
comun.chorrear( () => {
	comun.iniciarMenu('mnuInicio');
	comun.widgetCompartir( document.location.href, document.title, document.querySelector('meta[name=\"description\"]').content );
});

let seccionBase = 'seccion-demo';

// Últimos artículos
let opArtisUlti = {
	idioma: idioma,
	cantidad: 4,
	seccion: seccionBase
};
articulos.iniciar( document.querySelector('.articulo.plantilla'), document.querySelector('.articulos'), opArtisUlti, () => {
	document.querySelector('.articulos').classList.add('visible');
});
//
