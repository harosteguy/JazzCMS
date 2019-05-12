import estilos from '../estilo/secciones-categorias.scss';
import chorrear from './modulos/chorro';
import * as comun from './modulos/comun';
import { scrollIt } from './modulos/utiles';
import { emergente } from './modulos/emergente';
import { ListaSelect } from './modulos/formularios';
import tostada from './widgets/tostada';
import * as wmCkEditor from './modulos/ckeditor';
import SelectorImagen from './widgets/selector-imagen';
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
	document.querySelector('.menu-lateral .secciones-categorias').classList.add('activo');

	let ckDescripcion;
	wmCkEditor.crearEditor( document.getElementById('descripcion'), 'categoria')
	.then( editor => {
		ckDescripcion = editor;
		dataOriginal = recogerDatos();
	}).catch( error => { console.error( error ) } );

	let listaCategorias = new ListaSelect( document.getElementById('listaCategorias'), mostrarCategoria );
	listaCategorias.antesDeCambiar = () => {
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

	let headerAuth = 'Basic ' + btoa( localStorage.getItem('uid') + ':' + localStorage.getItem('token') );
	let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma };

	// Obtiene secciones
	comun.esperaAjax( true, 'secciones' );
	fetch(`${comun.urlBaseApi}/apis/wm-articulus/v1/blogs/`, { method: 'get', headers: reqHeaders } )
	.then( respuesta => respuesta.json() )
	.then( secciones => {
		if ( secciones.length > 0 ) {
			let opt;
			secciones.forEach( seccion => {
				opt = document.createElement('option');
				opt.value = seccion.nombreUrl;
				opt.innerText = seccion.nombre;
				document.getElementById('secciones').appendChild( opt );
			});
		}
		comun.esperaAjax( false, 'secciones' );
	})
	.catch( error => {
		comun.esperaAjax( false, 'secciones');
		console.error( error );
	});

	// Obtener categorías de una sección
	function obtenerCategorias( seccion ) {
		comun.esperaAjax( true, 'obtenerCat' );
		fetch( `${comun.urlBaseApi}/apis/wm-articulus/v1/blogs/${seccion}/categorias`, { method: 'get', headers: reqHeaders } )
		.then( respuesta => respuesta.json() )
		.then( listaCateg => {
			listaCategorias.vaciar();
			if ( listaCateg.length > 0 ) {
				listaCategorias.poblar( listaCateg, { nombreClave: "nombreBase", nombreValor: "nombre" } );
			}
			comun.esperaAjax( false, 'obtenerCat' );
		})
		.catch( error => {
			comun.esperaAjax( false, 'obtenerCat');
			console.error( error );
		});
	}

	// Guarda valor de la sección on focus para poder revertir el evento change
	document.getElementById('secciones').addEventListener('focus', function( evento ) {
		this.dataset.valorOnFocus = this.value;
	});
	// Elige sección
	document.getElementById('secciones').addEventListener('change', function() {
		// Si la categoría es nueva, no se verifica la modificación de datos al cambiar de sección porque no se limpia el editor
		if ( document.getElementById('nombreBase').value === '' ) {
			if ( this.value ) {
				obtenerCategorias( this.value );
			} else {
				listaCategorias.vaciar();
			}
		} else {
			comun.continuarSinGuardar( dataOriginal, recogerDatos() ).then( continuar => {
				if ( continuar ) {
					if ( this.value ) {
						obtenerCategorias( this.value );
					} else {
						listaCategorias.vaciar();
					}
					limpiarEditor();
				} else {
					this.value = this.dataset.valorOnFocus;
				}
			}).catch( error => { console.error( error ) } );
		}
	});

	// Limpiar editor
	function limpiarEditor() {
		document.getElementById('nombreBase').value = '';
		document.getElementById('nombre').value = '';
		document.getElementById('totArtis').textContent = '0';
		ckDescripcion.setData('');
		listaCategorias.reiniciar();
		document.querySelector('.imgPrincipal .foto').src = '/wm/interfaz/img/sin_foto.jpg';
		document.querySelector('.imgPrincipal .quitar').classList.add('oculto');
		document.getElementById('urlImgPrincipal').value = '';
		scrollIt( document.getElementsByTagName('body')[0], 350, 'easeOutQuad', () => {
			document.getElementById('nombre').focus();
		});
		dataOriginal = recogerDatos();
	}

	document.getElementById('nuevo').addEventListener('click', () => {
		comun.continuarSinGuardar( dataOriginal, recogerDatos() ).then( continuar => {
			if ( continuar ) limpiarEditor();
		}).catch( error => { console.error( error ) } );
	});

	//
	function mostrarCategoria( claveValor ) {
		comun.esperaAjax( true, 'obtieneCat');
		let url = `${comun.urlBaseApi}/apis/wm-articulus/v1/blogs/${document.getElementById('secciones').value}/categorias/${claveValor.clave}/?incNumArticulos=1`;
		let imagenes;
		fetch( url, { method: 'get', headers: reqHeaders } )
		.then( respuesta => respuesta.json() )
		.then( cat => {
			if ( cat.error ) {
				tostada( document.querySelector('.errorObteniendoCat').textContent, 4, 'color-tres');
				throw new Error( cat.error );
			}
			document.getElementById('nombreBase').value = cat.nombreBase;
			document.getElementById('nombre').value = cat.nombre;
			document.getElementById('totArtis').textContent = cat.numArticulos;
			ckDescripcion.setData( cat.descripcion );
			// Imagen principal
			if ( cat.imgPrincipal !== '' ) {
				document.querySelector('.imgPrincipal .foto').src = cat.imgPrincipal;
				document.getElementById('urlImgPrincipal').value = cat.imgPrincipal;
				document.querySelector('.imgPrincipal .quitar').classList.remove('oculto');
			} else {
				document.querySelector('.imgPrincipal .foto').src = '/wm/interfaz/img/sin_foto.jpg';
				document.getElementById('urlImgPrincipal').value = '';
				document.querySelector('.imgPrincipal .quitar').classList.add('oculto');
			}
			dataOriginal = recogerDatos();		// Guarda para verificar si se modificaron datos al abandonar la página
			comun.esperaAjax( false, 'obtieneCat');
		})
		.catch( error => {
			comun.esperaAjax( false, 'obtieneCat');
			console.error( error );
		});
	}

	// Selecciona imagen principal
	document.querySelector('.imgPrincipal .selector').addEventListener('click', () => {
		// Si la categoría todavía no se guardó avisa y sale
		if ( document.getElementById('nombreBase').value === '' ) {
			tostada( document.querySelector('.guardeCateParaImg').textContent, 4, 'color-tres');
			return;
		}
		// Título para el selector de imagen
		let titulo = document.querySelector('.imgPrincipal label').textContent;
		// Muestra selector de imagen
		let url = `${comun.urlBaseApi}/apis/wm-articulus/v1/blogs/${document.getElementById('secciones').value}/categorias/${document.getElementById('nombreBase').value}/imagenes`;
		let selecImagen = new SelectorImagen( titulo, url, false );		// El tercer parámetro es para no pedir confirmación al borrar una imagen
		selecImagen.mostrar().then( ( [ urlImg, estado ] ) => {
			if ( estado === 'existente' || estado === 'nueva' ) {
				// Muestra imagen principal
				document.querySelector('.imgPrincipal .foto').src = urlImg;
				document.querySelector('.imgPrincipal .quitar').classList.remove('oculto');
				document.getElementById('urlImgPrincipal').value = urlImg;
			}
		}).catch( error => {
			tostada( document.querySelector('.errorSelectorImg').textContent, 4, 'color-cuatro');
			console.error( error );
		});
		// Antes de borrar una imagen del selector se verifica que la imagen no esté en uso
		selecImagen.antesDeBorrar = divImagen => {
			return new Promise( resuelve => {
				let imgEnUso = false;
				// Obtiene nombre de la imagen sin sufijo '/img/foto-480.jpg' >--> 'foto.jpg'
				let nomImgABorrar = divImagen.querySelector('img').src.split('/').pop();
				nomImgABorrar = nomImgABorrar.substr( 0, nomImgABorrar.length - 8 ) + nomImgABorrar.substr( -4 );
				// Convierte en DOM el contenido del editor
				let template = document.createElement('template');
				let textoHtml = ckDescripcion.getData();
				textoHtml = textoHtml.trim();
				template.innerHTML = textoHtml;
				// Verifica imágenes en el editor
				let imgs = template.content.querySelectorAll('img');
				for ( let img of imgs ) {
					if ( img.src.split('/').pop() === nomImgABorrar ) {
						imgEnUso = true;
						break;
					}
				}
				// Verifica imagen principal del artículo
				let nomImgPrincipal = document.getElementById('urlImgPrincipal').value.split('/').pop();
				if ( !imgEnUso && nomImgABorrar === nomImgPrincipal ) {
					imgEnUso = true;
				}
				//
				if ( imgEnUso ) tostada( document.querySelector('.imgEnUsoEnCate').textContent, 4, 'color-tres');
				// Resolviendo con true se borrará la imagen
				resuelve( !imgEnUso );
			});
		};
	});

	// Quita imagen principal
	document.querySelector('.imgPrincipal .quitar').addEventListener('click', () => {
		document.querySelector('.imgPrincipal .foto').src = '/wm/interfaz/img/sin_foto.jpg';
		document.querySelector('.imgPrincipal .quitar').classList.add('oculto');
		document.getElementById('urlImgPrincipal').value = '';
	});

	// Recoger datos del formulario para enviar
	function recogerDatos() {
		return {
			nombre: document.getElementById('nombre').value,
			descripcion: ckDescripcion.getData(),
			imgPrincipal: document.getElementById('urlImgPrincipal').value
		};
	}

	// Guardar categoría
	document.getElementById('guardar').addEventListener('click', () => {
		comun.esperaAjax( true, 'guardaCat');
		// Verifica selección de seccion
		let seccionBase = document.getElementById('secciones').value;
		if ( seccionBase === '' ) {
			tostada( document.querySelector('.faltaSeccion').textContent, 4, 'color-tres');
			scrollIt( document.getElementsByTagName('body')[0], 300, 'easeOutQuad');
			document.getElementById('secciones').focus();
			comun.esperaAjax( false, 'guardaCat');
			return;
		}
		//
		let nombreBase = document.getElementById('nombreBase').value;
		let metodo = ( nombreBase == '' ) ? 'post' : 'put';
		let url = `${comun.urlBaseApi}/apis/wm-articulus/v1/blogs/${document.getElementById('secciones').value}/categorias/`;
		url += metodo == 'put' ? nombreBase : '';
		let cat = recogerDatos();
		dataOriginal = cat;		// Guarda para verificar si se modificaron datos al abandonar la página
		fetch( url, { method: metodo, headers: reqHeaders, body: JSON.stringify( cat ) } )
		.then( respuesta => respuesta.json() )
		.then( resCat => {
			if ( resCat.error ) {
				tostada( resCat.error, 4, 'color-tres');
				throw new Error( resCat.error );
			} else {
				// Recupera categoría guardada
				return fetch( comun.urlBaseApi + resCat.url, { method: 'get', headers: reqHeaders } );
			}
		})
		.then( respuesta => respuesta.json() )
		.then( categoria => {
			document.getElementById('nombreBase').value = categoria.nombreBase;
			document.getElementById('nombre').value = categoria.nombre;
			ckDescripcion.setData( categoria.descripcion );
			if ( metodo == 'put' ) {
				listaCategorias.actualizar( nombreBase, categoria.nombreBase, categoria.nombre );
			} else if ( metodo == 'post' ) {
				listaCategorias.agregar( categoria.nombreBase, categoria.nombre );
			}
			comun.esperaAjax( false, 'guardaCat');
			tostada( document.querySelector('.okGuardado').textContent, 4, 'color-dos');
		})
		.catch( error => {
			comun.esperaAjax( false, 'guardaCat');
			console.error( error );
		});
	});

	// Eliminar categoría
	document.getElementById('eliminar').addEventListener('click', () => {
		if ( document.getElementById('nombreBase' ).value !== '' ) {
			emergente.mostrar( document.getElementById('confirmaBorrar') );
		}
	});
	document.querySelector('#confirmaBorrar .confirmar').addEventListener('click', () => {
		emergente.ocultar( document.getElementById('confirmaBorrar') );
		comun.esperaAjax( true, 'borraCat' );
		let nombreBase = document.getElementById('nombreBase').value;
		let url = `${comun.urlBaseApi}/apis/wm-articulus/v1/blogs/${document.getElementById('secciones').value}/categorias/${nombreBase}`;
		fetch( url, { method: 'delete', headers: reqHeaders } )
		.then( respuesta => {
			if ( respuesta.status != 200 && respuesta.status != 204 ) return respuesta.json();
			return {};
		})
		.then( cat => {
			if ( cat.error ) {
				tostada( cat.error, 4, 'color-cuatro');
			} else {
				listaCategorias.borrar( nombreBase );
				limpiarEditor();
			}
			comun.esperaAjax( false, 'borraCat');
		})
		.catch( error => {
			comun.esperaAjax( false, 'borraCat');
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
