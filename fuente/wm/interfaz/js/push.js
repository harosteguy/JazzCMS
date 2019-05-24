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

import estilos from '../estilo/push.scss';
import chorrear from './modulos/chorro';
import * as comun from './modulos/comun';
import tostada from './widgets/tostada';

comun.setIdiomaPagina();
let idioma = comun.obtenerIdiomaUrl();
let idiomaUrl = idioma === comun.setIdiomas[0] ? '' : idioma + '/';

comun.mostrarUsuario().then( usr => {
	if ( usr.esAdmin === 1 ) {
		hacer();
	} else {
		window.location.href = `/${idiomaUrl}`;
	}
})
.catch( error => {
	window.location.href = `/${idiomaUrl}`;
});

//
function hacer() {
	chorrear( () => {
		comun.esperaAjax( false, 'cargapagina');
	});
	comun.menuLateral.iniciar();
	comun.setLinkIdioma();
	document.querySelector('.menu-lateral .push').classList.add('activo');

	let headerAuth = 'Basic ' + btoa( localStorage.getItem('uid') + ':' + localStorage.getItem('token') );
	let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma };

	cantidadUsuarios();
//	mostrarUsuarios();

	//
	document.querySelector('#frmMensaje .enviar').addEventListener('click', () => {
		const frmMensaje = document.getElementById('frmMensaje');
		const frmFiltros = document.getElementById('frmFiltros');
		let datos = {
			titulo: frmMensaje.elements['titulo'].value,
			mensaje: frmMensaje.elements['mensaje'].value,
			url: frmMensaje.elements['url'].value,
			icono: frmMensaje.elements['icono'].value,
			etiqueta: frmMensaje.elements['etiqueta'].value,
			filtros: {
				idioma: frmFiltros.elements['idioma'].value
			}
		};
		fetch( `${comun.urlBaseApi}/apis/wm-notificaciones/v1/mensajes/`, { method: 'post', headers: reqHeaders, body: JSON.stringify( datos ) } )
		.then( respuesta => respuesta.json() )
		.then( envio => {

			tostada('ok', 4, 'color-dos');

		})
		.catch( error => {
			tostada( error.message, 4, 'color-tres');
			console.error( error );
		});
	});

	function cantidadUsuarios() {
		fetch( `${comun.urlBaseApi}/apis/wm-notificaciones/v1/suscriptores/totales/`, { method: 'get', headers: reqHeaders } )
		.then( respuesta => {
			if ( respuesta.status !== 200 ) throw new Error('Error obteniendo usuarios');
			return respuesta;
		})
		.then( respuesta => respuesta.json() )
		.then( resUsrs => {
			let frmFiltros = document.getElementById('frmFiltros');
			frmFiltros.querySelector('.suscrisEs').textContent = resUsrs.idioma.es;
			frmFiltros.querySelector('.suscrisEn').textContent = resUsrs.idioma.en;
		})
		.catch( error => {
			tostada( error.message, 4, 'color-tres');
		});
	}

/*
	function mostrarUsuarios() {
		fetch( `${comun.urlBaseApi}/apis/wm-notificaciones/v1/suscriptores/`, { method: 'get', headers: reqHeaders } )
		.then( respuesta => {
			if ( respuesta.status !== 200 ) throw new Error('Error obteniendo usuarios');
			return respuesta;
		})
		.then( respuesta => respuesta.json() )
		.then( resUsrs => {
			resUsrs.usuarios.forEach( usr => {
				let usuario = document.querySelector('#suscriptores .plantilla').cloneNode( true );
				usuario.querySelector('.id').textContent = usr.id;
				usuario.querySelector('.idioma').textContent = usr.idioma;
				usuario.querySelector('.fecha').textContent = usr.fecha;
				usuario.querySelector('.ip').textContent = usr.ip;
				usuario.querySelector('.endpoint').textContent = usr.endpoint;
				document.querySelector('#suscriptores .lista').appendChild( usuario );
				usuario.classList.remove('plantilla');
			});
		})
		.catch( error => {
			tostada( error.message, 4 );
		});
	}
*/
}
