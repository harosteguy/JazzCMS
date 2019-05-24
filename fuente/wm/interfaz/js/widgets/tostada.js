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

import estilos from '../../estilo/widgets/_tostada.scss';

export default function tostada( texto, segundos, claseColor ) {
	claseColor = claseColor || 'color-uno';
	// Crea tostada
	let tostada = document.createElement('div');
	tostada.classList.add('tostada', claseColor );
	// Crea y agrega botón cerrar
	let cerrar = document.createElement('a');
	cerrar.href = '#';
	cerrar.classList.add('cerrar');
	cerrar.innerHTML = '&#215;';
	tostada.appendChild( cerrar );
	cerrar.addEventListener('click', function( evento ) {
		evento.preventDefault();
		tostada.classList.remove('visible');
		window.setTimeout( () => {
			tostada.remove();		// Elimina después de la transición de .visible
		}, 600 );
	});
	// Crea y agrega párrafo
	let parrafo = document.createElement('p');
	let txt = document.createTextNode( texto );
	parrafo.appendChild( txt );
	tostada.appendChild( parrafo );
	// Crea u obtiene contenedor
	let tostador;
	if ( !document.getElementById('tostador') ) {
		tostador = document.createElement('div');
		tostador.id = 'tostador';
		document.getElementsByTagName('body')[0].appendChild( tostador );
	} else {
		tostador = document.getElementById('tostador');
	}
	// Agrega y muestra tostada durante el tiempo indicado
	tostador.insertBefore( tostada, tostador.firstChild );
	tostada.classList.add('visible');
	window.setTimeout( () => {
		tostada.classList.remove('visible');
		window.setTimeout( () => {
			tostada.remove();		// Elimina después de la transición de .visible
		}, 600 );
	}, segundos * 1000 );
}
