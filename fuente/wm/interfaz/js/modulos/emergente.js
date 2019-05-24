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

import swipe from './swipe';

export let emergente = {
	mostrar: ( contenedor, cbDespuesDeAbrir, cbAntesDeCerrar, cbDespuesDeCerrar ) => {
		document.body.style.overflow = 'hidden';			// Fija el fondo quitando scrollbar al body
		window.setTimeout( () => {
			contenedor.classList.add('visible');			// Muestra
		}, 60 );
		// Escuchadores para ocultar
		let cancelar = evento => {
			if ( typeof evento !== 'undefined') evento.preventDefault();
			if ( typeof cbAntesDeCerrar == 'function') cbAntesDeCerrar();
			emergente.ocultar( contenedor, () => {
				document.body.style.overflow = 'auto';
				if ( typeof cbDespuesDeCerrar == 'function') cbDespuesDeCerrar();
			});
		};
		contenedor.querySelector('.fondo').removeEventListener('click', cancelar );
		contenedor.querySelector('.fondo').addEventListener('click', cancelar );
		contenedor.querySelector('.cerrar').removeEventListener('click', cancelar );
		contenedor.querySelector('.cerrar').addEventListener('click', cancelar );
		let btnCancelar = contenedor.querySelector('.cancelar');
		if ( btnCancelar ) {
			btnCancelar.removeEventListener('click', cancelar );
			btnCancelar.addEventListener('click', cancelar );
		}
////		swipe( contenedor, 'up', cancelar );
		//
		window.setTimeout( () => {
			if ( typeof cbDespuesDeAbrir == 'function') cbDespuesDeAbrir();
		}, 600 );
	},
	ocultar:  ( contenedor, cbDespuesDeCerrar ) => {
		contenedor.classList.remove('visible');
		document.body.style.overflow = 'auto';
		window.setTimeout( () => {
			if ( typeof cbDespuesDeCerrar == 'function') cbDespuesDeCerrar();
		}, 600 );
	}
}
