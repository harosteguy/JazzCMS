import estilos from '../estilo/wm-secciones-autores.scss';
import chorrear from './modulos/chorro';
import * as comun from './modulos/wm-comun';
import { dispararEvento } from './modulos/utiles';
import { emergente } from './modulos/emergente';
import { checkbox, multiSelect, ListaSelect } from './modulos/formularios';
import tostada from './widgets/tostada';
import * as wmCkEditor from './modulos/wm-ckeditor';
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
	console.error( error );
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
	document.querySelector('.menu-lateral .secciones-autores').classList.add('activo');

	let ckDescripcion;
	wmCkEditor.crearEditor( document.getElementById('descripcion'), 'autor')
	.then( editor => {
		ckDescripcion = editor;
		dataOriginal = recogerDatos();
	}).catch( error => { console.error( error ) } );

	let listaAutores = new ListaSelect( document.getElementById('listaAutores'), mostrarAutor );
	listaAutores.antesDeCambiar = () => {
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
	checkbox.iniciar();												// Checkboxes personalizados

	let headerAuth = 'Basic ' + btoa( localStorage.getItem('uid') + ':' + localStorage.getItem('token') );
	let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma };

	// Obtiene autores
	comun.esperaAjax( true, 'autores' );
	fetch(`${comun.urlBaseApi}/apis/wm-articulus/v1/autores/`, { method: 'get', headers: reqHeaders } )
	.then( respuesta => respuesta.json() )
	.then( autores => {
		if ( autores.length > 0 ) {
			listaAutores.poblar( autores, { nombreClave: "uid", nombreValor: "nombreUsuario" } );
		}
		comun.esperaAjax( false, 'autores' );
	})
	.catch( error => {
		comun.esperaAjax( false, 'autores');
		console.error( error );
	});

	// Obtiene secciones
	comun.esperaAjax( true, 'listaSecciones' );
	let listaSecciones;
	fetch(`${comun.urlBaseApi}/apis/wm-articulus/v1/blogs/`, { method: 'get', headers: reqHeaders } )
	.then( respuesta => respuesta.json() )
	.then( secciones => {
		listaSecciones = secciones;
		listaSecciones.unshift({ id: 0, nombre: " " })
		if ( listaSecciones.length > 0 ) {
			multiSelect.iniciar( document.getElementById('secciones'), listaSecciones );
		}
		comun.esperaAjax( false, 'listaSecciones' );
	});

	// Limpiar editor
	function limpiarEditor() {
		document.getElementById('guardarNuevo').value = '1';
		document.getElementById('uid').value = '0';
		document.getElementById('nombreUsr').textContent = '';
		document.getElementById('nroArticulos').textContent = '';
		document.getElementById('seudonimo').value = '';
		ckDescripcion.setData('');
		document.getElementById('activo').checked = false;
		dispararEvento( document.getElementById('activo'), 'change');	// Actualiza estado del checkbox
		multiSelect.reiniciar( document.getElementById('secciones'), listaSecciones );
		listaAutores.reiniciar();
		dataOriginal = recogerDatos();
	}

	// Nuevo autor
	document.getElementById('nuevo').addEventListener('click', () => {
		if ( document.getElementById('guardarNuevo').value == '1' ) {
			document.getElementById('emailNuevoAutor').value = '';
			document.querySelector('#nuevoAutor .aviso').textContent = '';
			emergente.mostrar( document.getElementById('nuevoAutor'), () => {
				document.getElementById('emailNuevoAutor').focus();				// Se pide el email
			});
		} else {
			comun.continuarSinGuardar( dataOriginal, recogerDatos() ).then( continuar => {
				if ( continuar ) {
					limpiarEditor();
					document.getElementById('emailNuevoAutor').value = '';
					document.querySelector('#nuevoAutor .aviso').textContent = '';
					emergente.mostrar( document.getElementById('nuevoAutor'), () => {
						document.getElementById('emailNuevoAutor').focus();				// Se pide el email
					});
				}
			}).catch( error => { console.error( error ) } );
		}
	});

	// Busca usuario por su email para convertir en autor
	document.getElementById('emailNuevoAutor').addEventListener('keyup', ( evento ) => {
		if ( evento.keyCode == 13 ) {
			buscarUsuario();
		}
	});

	//
	function mostrarAutor( claveValor ) {
		comun.esperaAjax( true, 'obtieneAutor');
		let url = `${comun.urlBaseApi}/apis/wm-articulus/v1/autores/${claveValor.clave}`;
		fetch( url, { method: 'get', headers: reqHeaders } )
		.then( respuesta => respuesta.json() )
		.then( autor => {
			if ( autor.error ) {
				tostada( autor.error, 4, 'color-tres');
				throw new Error( autor.error );
			} else {
				document.getElementById('guardarNuevo').value = '0';
				document.getElementById('uid').value = autor.uid;
				document.getElementById('nombreUsr').textContent = autor.nombreUsuario;
				document.getElementById('nroArticulos').textContent = autor.nroArticulos;
				document.getElementById('seudonimo').value = autor.nombreAutor;
				document.getElementById('activo').checked = autor.activo == 1;
				dispararEvento( document.getElementById('activo'), 'change');	// Actualiza estado del checkbox
				multiSelect.escribir( document.getElementById('secciones'), autor.blogs );
				// CKEditor al final para reservar los datos del formulario cuando el editor esté listo
				ckDescripcion.setData( autor.descripcion );
				dataOriginal = recogerDatos();		// Guarda para verificar si se modificaron datos al abandonar la página
				comun.esperaAjax( false, 'obtieneAutor');
			}
		})
		.catch( error => {
			comun.esperaAjax( false, 'obtieneAutor');
			console.error( error );
		});
	}

	document.getElementById('buscarUsuario').addEventListener('click', buscarUsuario );

	function buscarUsuario() {
		let email = document.getElementById('emailNuevoAutor').value;
		if ( email != '' ) {
			comun.esperaAjax( true, 'buscaUsuario' );
			fetch(`${comun.urlBaseApi}/apis/usuarios/v1/?email=${email}`, { method: 'get', headers: reqHeaders } )
			.then( respuesta => respuesta.json() )
			.then( usr => {
				if ( usr.error ) {
					tostada( usr.error, 4, 'color-tres');
				} else {
					document.getElementById('guardarNuevo').value = '1';
					document.getElementById('uid').value = usr.id;
					document.getElementById('nombreUsr').textContent = usr.nombre + ' ' + usr.apellido;
					emergente.ocultar( document.getElementById('nuevoAutor') );
					document.getElementById('seudonimo').focus();
				}
				comun.esperaAjax( false, 'buscaUsuario');
			})
			.catch( error => {
				comun.esperaAjax( false, 'buscaUsuario');
				console.error( error );
			});
		} else {
			document.getElementById('emailNuevoAutor').focus();
		}
	}

	// Recoger datos del formulario para enviar
	function recogerDatos() {
		let autorActivo = document.getElementById('activo').checked ? 1 : 0;
		return {
			uid: document.getElementById('uid').value,
			nombreAutor: document.getElementById('seudonimo').value,
			nombreUsuario: document.getElementById('nombreUsr').textContent,
			descripcion: ckDescripcion.getData(),
			activo: autorActivo,
			blogs: multiSelect.leer( document.getElementById('secciones') )			// Array de IDs de secciones
		};
	}

	// Guarda autor
	document.getElementById('guardar').addEventListener('click', () => {
		comun.esperaAjax( true, 'guardaAutor' );
		let metodo = document.getElementById('guardarNuevo').value == '1' ? 'post' : 'put';
		let autor = recogerDatos();
		dataOriginal = autor;		// Guarda para verificar si se modificaron datos al abandonar la página
		let url = `${comun.urlBaseApi}/apis/wm-articulus/v1/autores/`;
		url = metodo == 'put' ? url + document.getElementById('uid').value : url;
		fetch( url, { method: metodo, headers: reqHeaders, body: JSON.stringify( autor ) } )
		.then( respuesta => respuesta.json() )
		.then( resAutor => {
			if ( resAutor.error ) {
				tostada( resAutor.error, 4, 'color-tres');
			} else {
				document.getElementById('guardarNuevo').value = '0';							// Si se vuelve a guardar método PUT
				if ( metodo == 'post' ) {														// Agrega item al listado en su posición alfabética
					listaAutores.agregar( document.getElementById('uid').value, document.getElementById('nombreUsr').textContent );
				}
				tostada( document.querySelector('.okGuardado').textContent, 4, 'color-dos');
			}
			comun.esperaAjax( false, 'guardaAutor');
		})
		.catch( error => {
			comun.esperaAjax( false, 'guardaAutor');
			console.error( error );
		});
	});

	// Borra autor
	document.getElementById('eliminar').addEventListener('click', () => {
		if ( document.getElementById('uid' ).value != '0' ) {
			emergente.mostrar( document.getElementById('confirmaBorrar') );
		}
	});
	document.querySelector('#confirmaBorrar .confirmar').addEventListener('click', () => {
		emergente.ocultar( document.getElementById('confirmaBorrar') );
		comun.esperaAjax( true, 'borraAutor');
		let uid = document.getElementById('uid').value;
		fetch(`${comun.urlBaseApi}/apis/wm-articulus/v1/autores/${uid}`, { method: 'delete', headers: reqHeaders } )
		.then( respuesta => {
			if ( respuesta.status != 200 && respuesta.status != 204 ) return respuesta.json();
			return {};
		})
		.then( autor => {
			if ( autor.error ) {
				tostada( autor.error, 4, 'color-cuatro');
			} else {
				listaAutores.borrar( uid );
				limpiarEditor();
			}
			comun.esperaAjax( false, 'borraAutor');
		})
		.catch( error => {
			comun.esperaAjax( false, 'borraAutor');
			console.error( error );
		});
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
