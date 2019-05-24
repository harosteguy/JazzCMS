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

import estilos from '../estilo/contenidos.scss';
import chorrear from './modulos/chorro';
import * as comun from './modulos/comun';
import { scrollIt } from './modulos/utiles';
import { emergente } from './modulos/emergente';
import { ListaSelect } from './modulos/formularios';
import tostada from './widgets/tostada';
import * as wmCkEditor from './modulos/ckeditor';
//
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
	console.error(error);
	window.location.href = `/${idiomaUrl}`;
});

//
function hacer() {
	let dataOriginal;		// Variable para verificar si se modificaron datos al abandonar la página
	chorrear( () => {
		comun.esperaAjax( false, 'cargapagina');
	});
	comun.menuLateral.iniciar();
	comun.setLinkIdioma();
	document.querySelector('.menu-lateral .contenidos').classList.add('activo');

	let ckEditores = []; // Variable para todos los editores de lapágina

	// Crea un editor y lo guarda con su nombre en ckEditores[]
	function crearEditor( nombre ) {
		return new Promise( ( resuelve, rechaza ) => {
			let grupo = document.createElement('div');
			grupo.classList.add('grupo');
			let etiqueta = document.createElement('label');
			etiqueta.textContent = nombre;
			grupo.appendChild( etiqueta );
			let areaTexto = document.createElement('textarea');
			grupo.appendChild( areaTexto );
			document.querySelector('.ckEditores').appendChild( grupo );
			wmCkEditor.crearEditor( areaTexto, 'contenido').then( editor => {
				ckEditores[ nombre ] = editor;
				resuelve( editor );
				return;
			})
			.catch( error => {
				rechaza( error );
			});
		});
	}

	let cadenaPromesas = Promise.resolve();
	comun.setIdiomas.forEach( idioma => {
		cadenaPromesas = cadenaPromesas.then( () => {	// Agrega promesa de crear editor a la cadena
			return crearEditor( idioma );				// Promesa de crear editor con el idioma como nombre
		});
	});

	cadenaPromesas.then( () => {
		// Todos los editores están iniciados
		dataOriginal = recogerDatos();
	}).catch( error => { console.error( error ) } );
	//
	let headerAuth = 'Basic ' + btoa( localStorage.getItem('uid') + ':' + localStorage.getItem('token') );
	let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma };
	let listaContenidos;
	// Obtiene lista de IDs de contenido
	comun.esperaAjax( true, 'listaIds');
	fetch( `${comun.urlBaseApi}/apis/wm-chorro/v1/`, { method: 'get', headers: reqHeaders } )
	.then( respuesta => respuesta.json() )
	.then( idsConte => {
		if ( idsConte.length > 0 ) {
			listaContenidos = new ListaSelect( document.getElementById('listaContenidos'), mostrarContenido );
			listaContenidos.antesDeCambiar = () => {
				// Evento para retener la selección de un item y verificar si hay que guardar
				return new Promise( ( resuelve, rechaza ) => {
					comun.continuarSinGuardar( dataOriginal, recogerDatos() ).then( continuar => {
						if ( continuar ) {
							resuelve( true );
						} else {
							resuelve( false );
						}
					}).catch( error => { console.error( error ) } );
				});
			};
			let aParaPoblarLista = [];
			idsConte.forEach( idConte => {
				aParaPoblarLista.push({ clave: idConte, valor: idConte });
			});
			listaContenidos.poblar( aParaPoblarLista, { nombreClave: "clave", nombreValor: "valor" } );
			comun.esperaAjax( false, 'listaIds');
		}
	})
	.catch( error => {
		console.error( error );
	});

	//	
	function mostrarContenido( claveValor ) {
		comun.esperaAjax( true, 'obtieneConte');
		fetch( `${comun.urlBaseApi}/apis/wm-chorro/v1/${claveValor.clave}`, { method: 'get', headers: reqHeaders } )
		.then( respuesta => respuesta.json() )
		.then( contenido => {
			if ( contenido.error ) {
				tostada( contenido.error, 4, 'color-tres');
			} else {
				document.getElementById('idOriginal').value = contenido.id;
				document.getElementById('idContenido').value = contenido.id;
				// CKEditor al final para reservar los datos del formulario cuando los editores estén listos
				let editoresListos = 0;
				comun.setIdiomas.forEach( idioma => {
					ckEditores[ idioma ].setData( contenido[idioma] )
					dataOriginal = recogerDatos();		// Guarda para verificar si se modificaron datos al abandonar la página
				});
			}
			comun.esperaAjax( false, 'obtieneConte');
		})
		.catch( error => {
			comun.esperaAjax( false, 'obtieneConte');
			console.error( error );
		});
	}

	// Recoger datos del formulario para enviar
	function recogerDatos() {
		let datos = {
			id: document.getElementById('idContenido' ).value
		};
		comun.setIdiomas.forEach( idioma => {
			datos[idioma] = ckEditores[ idioma ].getData();
		});
		return datos;
	}

	// Guardar contenido
	document.getElementById('guardar').addEventListener('click', () => {
		comun.esperaAjax( true, 'guardaConte');
		let idOriginal = document.getElementById('idOriginal').value;
		let metodo = idOriginal === '' ? 'post' : 'put';
		let url = `${comun.urlBaseApi}/apis/wm-chorro/v1/`;
		url += metodo == 'put' ? idOriginal : '';
		let contenido = recogerDatos();
		//
		comun.setIdiomas.forEach( idioma => {	// Revisa el contenido en cada idioma
			// Si empieza con '<p>', termina con '</p>' y hay una sola '<p>' es párrafo único
			if ( contenido[idioma].substr( 0, 3 ) === '<p>' && contenido[idioma].substr( -4 ) === '</p>' && contenido[idioma].indexOf('<p>', 3 ) === -1 ) {
				// Quita etiquetas
				contenido[idioma] = contenido[idioma].substring( 3, contenido[idioma].length - 4 );
			}
		});
		//
		fetch( url, {
			method: metodo,
			headers: reqHeaders,
			body: JSON.stringify( contenido )
		})
		.then( respuesta => respuesta.json() )
		.then( contenido => {
			if ( contenido.error ) {
				tostada( contenido.error, 4, 'color-cuatro');
			} else {
				let idConte = contenido.url.substr( contenido.url.lastIndexOf('/') + 1 );
				if ( metodo == 'put' ) {
					listaContenidos.actualizar( idOriginal, idConte, idConte );
				} else if ( metodo == 'post' ) {
					listaContenidos.agregar( idConte, idConte );
				}
				document.getElementById('idContenido').value = idConte;
				document.getElementById('idOriginal').value = idConte;
				tostada( document.querySelector('.okGuardado').textContent, 4, 'color-dos');
				dataOriginal = recogerDatos();		// Guarda para verificar si se modificaron datos al abandonar la página
			}
			comun.esperaAjax( false, 'guardaConte');
		})
		.catch( error => {
			comun.esperaAjax( false, 'guardaConte');
			console.error( error );
		});
	});

	// Eliminar contenido
	document.getElementById('eliminar').addEventListener('click', () => {
		if ( document.getElementById('idOriginal' ).value !== '' ) {
			emergente.mostrar( document.getElementById('confirmaBorrar') );
		}
	});
	document.querySelector('#confirmaBorrar .confirmar').addEventListener('click', () => {
		emergente.ocultar( document.getElementById('confirmaBorrar') );
		comun.esperaAjax( true, 'borraConte');
		let idOriginal = document.getElementById('idOriginal').value;
		fetch( `${comun.urlBaseApi}/apis/wm-chorro/v1/${idOriginal}`, {
			method: 'delete',
			headers: reqHeaders
		})
		.then( respuesta => {
			if ( respuesta.status != 200 && respuesta.status != 204 ) return respuesta.json();
			return {};
		})
		.then( contenido => {
			if ( contenido.error ) {
				tostada( contenido.error, 4, 'color-cuatro');
			} else {
				document.getElementById('idOriginal').value = '';
				document.getElementById('idContenido').value = '';
				comun.setIdiomas.forEach( idioma => {
					ckEditores[ idioma ].setData('');
				});
				listaContenidos.borrar( idOriginal );
				scrollIt( document.getElementsByTagName('body')[0], 350, 'easeOutQuad', () => {
					document.getElementById('idContenido').focus();
				});
				listaContenidos.reiniciar();
				dataOriginal = recogerDatos();
			}
			comun.esperaAjax( false, 'borraConte');
		})
		.catch( error => {
			comun.esperaAjax( false, 'borraConte');
			console.error( error );
		});
	});

	// Limpiar editor
	document.getElementById('nuevo').addEventListener('click', () => {
		comun.continuarSinGuardar( dataOriginal, recogerDatos() ).then( continuar => {
			if ( continuar ) {
				document.getElementById('idOriginal').value = '';
				document.getElementById('idContenido').value = '';
				comun.setIdiomas.forEach( idioma => {
					ckEditores[ idioma ].setData('');
				});
				scrollIt( document.getElementsByTagName('body')[0], 350, 'easeOutQuad', () => {
					document.getElementById('idContenido').focus();
				});
				listaContenidos.reiniciar();
				dataOriginal = recogerDatos();
			}
		}).catch( error => { console.error( error ) } );
	});

	//
	window.onbeforeunload = evento => {
		let dataActual = recogerDatos();
		if ( JSON.stringify( dataActual ) !== JSON.stringify( dataOriginal ) ) {
			let mensaje = 'Es posible que los cambios implementados no se puedan guardar.';
			evento.returnValue = mensaje;		// Gecko, Trident, Chrome 34+
			return mensaje;						// Gecko, WebKit, Chrome <34
		}
	};

}
