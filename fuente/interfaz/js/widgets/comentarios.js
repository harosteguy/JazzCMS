import estilos from '../../estilo/widgets/_comentarios.scss';

import { autorizacion } from '../modulos/usuario';
import { urlBaseApi, obtenerIdiomaUrl, esperaAjax } from '../modulos/comun';
import { padIzquierdo, getFechaCorta, fechaHora2horaMinutos, desplegar, plegar } from '../modulos/utiles';
import tostada from './tostada';
//
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

let ckOpciones = {
	plugins: [ Essentials, Bold, Italic, List, Paragraph ],
	toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', 'undo', 'redo'],
	image: {
		toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative']
	}
};
//
export function iniciar( seccionBase, artiBase, idioma, usr = false ) {

	let sangriaRespuesta = 30;	// px
	let urlApi = `${urlBaseApi}/apis/articulus/v1/blogs/${seccionBase}/articulos/${artiBase}/comentarios`;
	let divComen = document.getElementById('comentarios');
	let ckComen, ckResp;
	//
	if ( usr ) {
		divComen.querySelector('#frmComentario .usuarioNombre').textContent = usr.nombre + ' ' + usr.apellido;
		divComen.querySelector('#frmRespuesta .usuarioNombre').textContent = usr.nombre + ' ' + usr.apellido;
		let elementos = divComen.querySelectorAll('.conectado');
		for ( const elemento of elementos ) elemento.classList.remove('oculto');
	} else {
		document.getElementById('textoComen').disabled = true;
		let elementos = divComen.querySelectorAll('.desconectado');
		for ( const elemento of elementos ) elemento.classList.remove('oculto');
	}
	//
	fetch( urlApi, { method: 'get', headers: { 'Accept-Language': idioma } } )
	.then( res => res.json() )
	.then( comentarios => {
		//--------------------
		// Muestra comentarios
		let clonConversa, clonComen,
			orden = 1,
			divListaComen = divComen.querySelector('.comentarios');
		divComen.querySelector('.total').textContent = comentarios.length;					// Muestra cantidad de comentarios
		comentarios.forEach( ( com, i ) => {
			// Si conversación nueva y no es la primera, agrega conversación anterior
			if ( com.idPadre === 0 && i > 0 ) {
				if ( i === 1 ) {
					divListaComen.appendChild( clonConversa );								// Agrega la primera conversación
				} else {
					divListaComen.insertBefore( clonConversa, divListaComen.firstChild );	// Agrega conversación en primera posición
				}
				clonConversa.classList.remove('plantilla');
			}
			// Si conversación nueva agrega comentario inicial
			if ( com.idPadre === 0 ) {
				clonConversa = divComen.querySelector('.conversacion.plantilla').cloneNode( true );		// Clona plantilla
				clonComen = divComen.querySelector('.comentario.plantilla').cloneNode( true );
				agregaDatos( clonComen, com, orden );
				orden ++;
				clonConversa.appendChild( clonComen );
				clonComen.classList.remove('plantilla');
			} else {
				// Agrega respuesta a la conversación
				clonComen = divComen.querySelector('.comentario.plantilla').cloneNode( true );
				agregaDatos( clonComen, com, 0 );
				clonComen.style.paddingLeft = ( com.rama * sangriaRespuesta ) + 'px';
				if ( com.rama > 2 ) {
					clonComen.querySelector('.mostrarFormResp').remove();		// Evita anidamiento excesivo de respuestas quitando botón responder
				}
				clonConversa.appendChild( clonComen );				
				clonComen.classList.remove('plantilla');
			}
			// Si último comentario agrega la conversación
			if ( i === comentarios.length - 1 ) {
				divListaComen.insertBefore( clonConversa, divListaComen.firstChild );
				clonConversa.classList.remove('plantilla');
			}
		});
		//
		ClassicEditor.create( document.getElementById('textoComen'), ckOpciones )
		.then( editor => {
			ckComen = editor;
			return ClassicEditor.create( document.getElementById('textoResp'), ckOpciones );
		}).then( editor => {
			ckResp = editor;
		}).catch( error => { console.error( error ) } );

		//----------------------------------------------------------------------------------
		// Agrega escuchador a los botones responder para mostrar el formulario de respuesta
		// y convierte el botón en "Cancelar respuesta" para ocultarlo
		divComen.querySelector('.comentarios').addEventListener('click', evento => {
			evento.preventDefault();
			if ( evento.target.classList.contains('mostrarFormResp') ) {
				let boton = evento.target;																	// El botón clicado
				let frmResp = document.getElementById('frmRespuesta');
				if ( boton.dataset.mostrando && boton.dataset.mostrando === '1' ) {							// El botón está en estado "Cancelar respuesta"
					plegar( frmResp, () => {																	// Oculta el formulario
						ckResp.setData('');
					});
					boton.dataset.mostrando = '0';																// Marca el botón
					boton.textContent = divComen.querySelector('.appResponder').textContent;					// y cambia su texto
				} else {																					// El botón está en estado responder
					if ( frmResp.classList.contains('desplegado') ) {											// Si el formulario está visible
						plegar( frmResp, () => {																	// lo oculta
							ckResp.setData('');
							ckResp.destroy();															// Antes de mover cke
							boton.parentElement.nextElementSibling.appendChild( frmRespuesta );						// lo pone en lugar
							ClassicEditor.create( document.getElementById('textoResp'), ckOpciones )	// Después de mover cke
							.then( editor => {
								ckResp = editor;
								ckResp.editing.view.focus();
							}).catch( error => { console.error( error ) } );
							desplegar( frmResp );																	// y lo muestra
							// Pone todos los botones en estado responder
							let botones = divComen.querySelectorAll('.comentarios .mostrarFormResp');
							for ( const bot of botones ) {
								bot.dataset.mostrando = '0';
								bot.textContent = divComen.querySelector('.appResponder').textContent;
							}
							// Pone el botón clicado en estado "Cancelar respuesta"
							boton.dataset.mostrando = '1';
							boton.textContent = divComen.querySelector('.appCancelarResp').textContent;
						});
					} else {
						ckResp.destroy();																// Antes de mover cke
						boton.parentElement.nextElementSibling.appendChild( frmRespuesta );
						ClassicEditor.create( document.getElementById('textoResp'), ckOpciones )		// Después de mover cke
						.then( editor => {
							ckResp = editor;
							ckResp.editing.view.focus();
						}).catch( error => { console.error( error ) } );
						desplegar( frmResp );
						boton.dataset.mostrando = '1';
						boton.textContent = divComen.querySelector('.appCancelarResp').textContent;
					}
				}
			}
		});
	}).catch( error => { console.error( error ) } );
	//
	function agregaDatos( comen, com, numero ) {
		comen.dataset.id = com.id;
		comen.dataset.rama = com.rama;
		comen.querySelector('.imgComenta').onerror = function () {
			this.onerror = '';
			//this.src = '/interfaz/img/perfil.svg';
			this.src = 'data:image/jpeg;base64,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';
		};
		comen.querySelector('.imgComenta').src = `/img/usuarios/${padIzquierdo( com.uid.toString(), '000000')}.jpg`;
		if ( numero > 0 ) {
			comen.querySelector('.numero').textContent = numero;
		} else {
			comen.querySelector('.numero').textContent = '';
			comen.querySelector('.numero').previousElementSibling.textContent = '';	// Etiqueta nro.
		}
		comen.querySelector('.autor').textContent = com.autor;
		comen.querySelector('.fecha').textContent = getFechaCorta( new Date( com.fecha ), idioma );
		comen.querySelector('.hora').textContent = fechaHora2horaMinutos( com.fecha );
		comen.querySelector('.texto').innerHTML = com.texto;
	}

	//
	document.querySelector('#frmComentario .comentar').addEventListener('click', () => {
		let comen = {
			texto: ckComen.getData(),
			idPadre: 0
		}
		enviarComentario( comen )
		.then( com => {
			// Muestra comentario
			let clonConversa = divComen.querySelector('.conversacion.plantilla').cloneNode( true );
			let clonComen = divComen.querySelector('.comentario.plantilla').cloneNode( true );
			// Orden
			let nro = document.querySelector('#comentarios .comentarios .comentario .numero');	// Número del último comentario
			let orden;
			if ( nro ) {
				let anterior = parseInt( nro.textContent, 10 ) || 0;
				orden = anterior > 0 ? anterior + 1 : 0;
			} else {
				orden = 1;
			}
			//
			com.rama = 0;
			agregaDatos( clonComen, com, orden );
			ckComen.setData('');									// Limpia textarea
			clonConversa.appendChild( clonComen );										// Agrega comentario a la conversación
			clonComen.classList.remove('plantilla');
			let divListaComen = divComen.querySelector('.comentarios');
			if ( divListaComen.childNodes.length === 0 ) {
				divListaComen.appendChild( clonConversa );								// Agrega la primera conversación
			} else {
				divListaComen.insertBefore( clonConversa, divListaComen.firstChild );	// Agrega conversación en primera posición
			}
			clonConversa.classList.add('desplegable');
			clonConversa.classList.remove('plantilla');
			desplegar( clonConversa );
			// Actualiza número de comentarios
			divComen.querySelector('.total').textContent = parseInt( divComen.querySelector('.total').textContent, 10 ) + 1;
		})
		.catch( error => {
			tostada( error.message, 4, 'color-tres' );
		});
	});

	document.querySelector('#frmRespuesta .responder').addEventListener('click', () => {
		let frmRespuesta = document.querySelector('#frmRespuesta');
		let comenQueSeResponde = frmRespuesta.parentElement.parentElement;
		let comen = {
			texto: ckResp.getData(),
			idPadre: comenQueSeResponde.dataset.id
		}
		enviarComentario( comen )
		.then( com => {
			plegar( frmRespuesta, () => {														// Oculta formulario
				ckResp.setData('');
				let boton = comenQueSeResponde.querySelector('.mostrarFormResp');
				boton.dataset.mostrando = '0';													// Marca el botón
				boton.textContent = divComen.querySelector('.appResponder').textContent;		// y cambia su texto
			});
			// Agrega respuesta a la conversación
			let rama = parseInt( comenQueSeResponde.dataset.rama, 10 ) + 1;
			com.rama = rama;
			let clonComen = divComen.querySelector('.comentario.plantilla').cloneNode( true );
			agregaDatos( clonComen, com, 0 );
			clonComen.style.paddingLeft = ( rama * sangriaRespuesta ) + 'px';
			if ( rama > 2 ) {
				clonComen.querySelector('.mostrarFormResp').remove();		// Evita anidamiento excesivo de respuestas quitando botón responder
			}
			comenQueSeResponde.parentNode.insertBefore( clonComen, comenQueSeResponde.nextSibling );	// Agrega respuesta
			clonComen.classList.add('desplegable');
			clonComen.classList.remove('plantilla');
			desplegar( clonComen );
		})
		.catch( error => {
			tostada( error.message, 4, 'color-tres' );
		});
	});

	function enviarComentario( comentario ) {
		return new Promise( ( resuelve, rechaza ) => {
			esperaAjax( true, 'guardaComen');
			let reqHeaders = {
				"Authorization": "Basic " + btoa( localStorage.getItem('uid') + ":" + localStorage.getItem('token') ),
				"Accept-Language": obtenerIdiomaUrl()
			};
			fetch( urlApi, { method: 'post', headers: reqHeaders, body: JSON.stringify( comentario ) } )
			.then( res => {
				if ( res.status !== 200 ) {
					rechaza( new Error( divComen.querySelector('.appErrorGuardarComen').textContent ) );
					return;
				}
				return res.json();
			})
			.then( comen => {
				esperaAjax( false, 'guardaComen');
				resuelve( comen );
				return;
			})
			.catch( error => {
				esperaAjax( false, 'guardaComen');
				rechaza( new Error( divComen.querySelector('.appErrorGuardarComen').textContent ) );
			});
		});
	}

}
