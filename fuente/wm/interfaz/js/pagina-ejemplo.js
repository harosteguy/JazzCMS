import estilos from '../estilo/pagina-ejemplo.scss';
import chorrear from './modulos/chorro';

let setIdiomas = ['es', 'en'];

chorrear();

// Obtiene idioma de URL
let partes = document.location.pathname.split('/');
partes.shift();				// Quita el host
let idioma = setIdiomas.includes( partes[0] ) ? partes[0] : setIdiomas[0];

// Setea idioma en la página
document.documentElement.lang = idioma;	// html lang
// Setea href y hreflang
let hrefOrig;
let enlaces = document.querySelectorAll('[href]');
let idiomaUrl = idioma === setIdiomas[0] ? '' : idioma + '/';
enlaces.forEach( enlace => {
	hrefOrig = enlace.href;
	enlace.href = enlace.href.replace(/\[\[idiomaUrl\]\]/, idiomaUrl );
	if ( hrefOrig !== enlace.href ) {	// Si cambió href
		enlace.hreflang = idioma;		// set hreflang
	}
});

// Selector de idiomas
document.querySelector('a.idioma').innerText = idioma === setIdiomas[0] ? 'inglés' : 'spanish';
document.querySelector('a.idioma').href = idioma === setIdiomas[0] ? '/' + setIdiomas[1] + '/' : '/';
