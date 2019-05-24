/**
 * This file is part of JazzCMS
 *
 * JazzCMS - Webapp for managing content of applications.
 * Copyright (C) 2019 by Guillermo Harosteguy <harosteguy@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { setIdiomas } from './comun';

export function dispararEvento( elemento, evento ) {
	let evt;
	if ( document.createEventObject ) {			// IE
		evt = document.createEventObject();
		return elemento.fireEvent('on' + evento,evt );
	} else {									// Firefox...
		evt = document.createEvent('HTMLEvents');
		evt.initEvent( evento, true, true );	// Evento tipo, bubbling, cancelable
		return !elemento.dispatchEvent( evt );
	}
}

export function subirHasta( elemento, etiqueta ) {
	etiqueta = etiqueta.toLowerCase();
	while ( elemento && elemento.parentNode ) {
		elemento = elemento.parentNode;
		if ( elemento.tagName && elemento.tagName.toLowerCase() == etiqueta ) {
			return elemento;
		}
	}
	return null;
}
/*
export function copiarAlPortapapeles( text ) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text); 

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        let textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}
*/
export function padIzquierdo( cadenaOrigen, cadenaPadding ) {
	return String( cadenaPadding + cadenaOrigen ).slice( - cadenaPadding.length );
}

export function dbFecha( cadena ) {
	if ( cadena == '' ) return '';
	let anio = cadena.substr(0, 4);
	let mes = cadena.substr(5, 2);
	let dia = cadena.substr(8, 2);
	return dia + '/' + mes + '/' + anio;
};

export function fechaDb( cadena ) {
	if ( cadena == '' ) return '';
	let dia = cadena.substr(0, 2);
	let mes = cadena.substr(3, 2);
	let anio = cadena.substr(6, 4);
	return anio + '-' + mes + '-' + dia;
};

export function dbFechaHora( cadena ) {
	if ( cadena == '' ) return '';
	let fh = cadena.split(' ');
	return module.exports.dbFecha( fh[0] ) + ' ' + fh[1];
};

export function fechaHora2horaMinutos( cadena ) {
	let fh = cadena.split(' ');
	return fh[1].substr( 0, 5 );
};

export function fechaHoraDb( cadena ) {
	if ( cadena == '' ) return '';
	let fh = cadena.split(' ');
	return module.exports.fechaDb( fh[0] ) + ' ' + fh[1];
};

export let getMesPalabra = ( oDate, idioma ) => {
	let meses = {
		es: [ "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre" ],
		en: [ "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "dicember" ]
	}
	if ( idioma in meses ) {
		return meses[ idioma ][ oDate.getMonth() ];
	} else {
		return meses[ setIdiomas[0] ][ oDate.getMonth() ];	// Idioma por defecto
	}
};

export let getMesAbreviado = ( oDate, idioma ) => {
	let meses = {
		es: [ "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic" ],
		en: [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ]
	}
	if ( idioma in meses ) {
		return meses[ idioma ][ oDate.getMonth() ];
	} else {
		return meses[ setIdiomas[0] ][ oDate.getMonth() ];	// Idioma por defecto
	}
};

export let getFechaCorta = ( oDate, idioma ) => {
	return oDate.getDate().toString() + ' ' + getMesAbreviado( oDate, idioma ) + ', ' + oDate.getFullYear().toString();
};

export let getFechaHoraCorta = ( oDate, idioma ) => {
	return getFechaCorta( oDate, idioma ).toString() + ' ' + module.exports.padIzquierdo( oDate.getHours().toString(), "00" ) + ':' + module.exports.padIzquierdo( oDate.getMinutes().toString(), "00" );
};

export let getFechaLarga = ( oDate, idioma ) => {
	return oDate.getDate().toString() + ' ' + getMesPalabra( oDate, idioma ) + ', ' + oDate.getFullYear().toString();
};

export function desplegar( elem, callback ) {
	elem.style.display = 'block';			// Muestra,
	let height = elem.scrollHeight + 'px';	// obtiene alto y
	elem.style.display = '';				// oculta.
	elem.classList.add('desplegado');		// Muestra
	elem.style.height = height;				// Transition height
	elem.style.opacity = '1';				// y opacity 
	window.setTimeout(function () {
		elem.style.height = 'auto';
		if ( typeof callback == 'function') callback();
	}, 300 );
};

export function plegar( elem, callback ) {
	elem.style.height = elem.scrollHeight + 'px';	// Da al elemento el alto inicial de la transition
	window.setTimeout( () => {
		elem.style.height = '0';					// Transition height
		elem.style.opacity = '0';					// y opacity 
	}, 60 );
	window.setTimeout(function () {
		elem.classList.remove('desplegado');		// Oculta al terminar la transition
		if ( typeof callback == 'function') callback();
	}, 300 );
};

export function scrollIt( destination, duration = 200, easing = 'linear', callback ) {
	const easings = {
		linear(t) {
			return t;
		},
		easeInQuad(t) {
			return t * t;
		},
		easeOutQuad(t) {
			return t * (2 - t);
		},
		easeInOutQuad(t) {
			return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
		},
		easeInCubic(t) {
			return t * t * t;
		},
		easeOutCubic(t) {
			return (--t) * t * t + 1;
		},
		easeInOutCubic(t) {
			return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
		},
		easeInQuart(t) {
			return t * t * t * t;
		},
		easeOutQuart(t) {
			return 1 - (--t) * t * t * t;
		},
		easeInOutQuart(t) {
			return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
		},
		easeInQuint(t) {
			return t * t * t * t * t;
		},
		easeOutQuint(t) {
			return 1 + (--t) * t * t * t * t;
		},
		easeInOutQuint(t) {
			return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
		}
	};
	const start = window.pageYOffset;
	const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
	const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
	const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
	const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
	const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
	if ('requestAnimationFrame' in window === false) {
		window.scroll(0, destinationOffsetToScroll);
		if ( callback ) {
			callback();
		}
		return;
	}
	function scroll() {
		const now = 'now' in window.performance ? performance.now() : new Date().getTime();
		const time = Math.min(1, ((now - startTime) / duration));
		const timeFunction = easings[easing](time);
		window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
		if (window.pageYOffset === destinationOffsetToScroll) {
			if (callback) {
				callback();
			}
			return;
		}
		requestAnimationFrame(scroll);
	}
	scroll();
};
