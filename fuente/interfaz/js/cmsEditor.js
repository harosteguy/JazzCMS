import { crearEditor } from './modulos/cmsCkeditor';

( function ( cmsEditor, undefined ) {

	cmsEditor.ckEditor = null;
	cmsEditor.iniciado = false;
	cmsEditor.activo = false;
	cmsEditor.iconoEditar = '<svg viewBox="0 0 576 512" width="25" height="22"><path d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"/></svg>';
	cmsEditor.setIdiomas = ['es', 'en'];

	cmsEditor.iniciar = () => {
		return new Promise( ( resuelve, rechaza ) => {
			// Carga estilo de la interfaz
			let link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = '/interfaz/css/cmsEditor.css';
			link.media = 'all';
			document.getElementsByTagName('head')[0].appendChild( link );
			// Carga la plantilla
			fetch('/interfaz/html/cmsEditor.html', { method: 'get' } )
			.then( respuesta => {
				if ( respuesta.status !== 200 ) throw new Error('Error descargando formulario editor.');
				return respuesta;
			})
			.then( respuesta => respuesta.text() )
			.then( frmEditor => {
				let divEditor = document.createElement('div');
				divEditor.id = 'cmsEditor';
				divEditor.innerHTML = frmEditor;
				// Agrega plantilla al body
				document.querySelector('body').appendChild( divEditor );
				// Agrega escuchadores
				divEditor.querySelector('.cerrar').addEventListener('click', e => {
					e.preventDefault();
					cmsEditor.cerrarEditor();
				});
				divEditor.addEventListener('click', function ( e ) {
					if ( e.target !== this ) return;		// Evita que el evento se dispare en elementos hijo
					cmsEditor.cerrarEditor();
				});
				divEditor.querySelector('.guardar').addEventListener('click', e => {
					e.preventDefault();
					cmsEditor.guardarContenido();
				});
				// Inicia ckeditor
				return crearEditor( document.getElementById('cmsContenido') );
			})
			.then( editor => {
				cmsEditor.ckEditor = editor;
				cmsEditor.iniciado = true;

				return fetch('/interfaz/html/wm-selector-imagen.html', { method: 'get' } );
			})
			.then( respuesta => {
				if ( respuesta.status !== 200 ) throw new Error('Error descargando selector de imagen para la edición de contenidos.');
				return respuesta;
			})
			.then( respuesta => respuesta.text() )
			.then( selImg => {

				let divSelImg = document.createElement('div');
				divSelImg.innerHTML = selImg;
				// Agrega selector de imagen al body
				document.querySelector('body').appendChild( divSelImg );


				resuelve();
			})
			.catch( error => {
				cmsEditor.iniciado = false;
				rechaza( error );
			});
		});
	};

	cmsEditor.mostrarInterfaz = ( elemento ) => {
		if ( !cmsEditor.activo ) {
			let i, icono;
			let datas = document.querySelectorAll('body [data-contenido]');							// Obtiene contenedores
			for ( i = 0; i < datas.length; i++ ) {
				icono = document.createElement('span');
				icono.classList.add('cmsIconoEditar');
				icono.innerHTML = cmsEditor.iconoEditar;
				datas[i].insertBefore( icono, datas[i].firstChild );								// Agrega ícono al contenedor
				icono.addEventListener('click', function ( e ) {
					e.preventDefault();
					cmsEditor.editar( this.parentElement );
				});
			}
		}
		cmsEditor.activo = true;
	};

	cmsEditor.ocultarInterfaz = () => {
		let i, iconos = document.querySelectorAll('body [data-contenido] > .cmsIconoEditar');
		for ( i = 0; i < iconos.length; i++ ) iconos[i].remove();
		cmsEditor.activo = false;
	};

	cmsEditor.editar = ( elemento ) => {
		let idContenido = elemento.getAttribute('data-contenido');
		let contenedor = elemento.nodeName;
		let cloncontenedor = elemento.cloneNode( true );	// Clona contenedor,
		cloncontenedor.firstChild.remove();					// quita ícono de edición
		let contenido = cloncontenedor.innerHTML;			// obtiene contenido
		cloncontenedor = undefined;
		//
		let editor = document.querySelector('#cmsEditor');
		editor.querySelector('.id').innerText = idContenido;
		editor.querySelector('.elemento').innerText = `<${contenedor.toLowerCase()}>`;
		cmsEditor.ckEditor.setData( contenido );
		editor.classList.add('visible');
	};

	cmsEditor.guardarContenido = () => {
		let editor = document.querySelector('#cmsEditor');
		let idContenido = editor.querySelector('.id').innerText;
		let contenido = cmsEditor.ckEditor.getData();
		// Si empieza con '<p>', termina con '</p>' y hay una sola '<p>' es párrafo único
		if ( contenido.substr( 0, 3 ) === '<p>' && contenido.substr( -4 ) === '</p>' && contenido.indexOf('<p>', 3 ) === -1 ) {
			// Quita etiquetas
			contenido = contenido.substring( 3, contenido.length - 4 );
		}
		//
		let htmlLang = document.getElementsByTagName('html')[0].getAttribute('lang');
		htmlLang = cmsEditor.setIdiomas.includes( htmlLang ) ? htmlLang : cmsEditor.setIdiomas[0];
		//
		let cuerpoReq = { id: idContenido };
		cuerpoReq[ htmlLang ] = contenido;
		//
		let headerAuth = 'Basic ' + btoa( localStorage.getItem('uid') + ':' + localStorage.getItem('token') );
		let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': htmlLang };
		// Llama a la API para guardar
		fetch( `/apis/wm-chorro/v1/${idContenido}`, {
			method: 'put',
			headers: reqHeaders,
			body: JSON.stringify( cuerpoReq )
		})
		.then( respuesta => respuesta.json() )
		.then( conte => {
			if ( conte.error ) {
//
				console.error( conte.error );

			} else {
				// Reemplaza contenido en contenedores
				let i, contenedores = document.querySelectorAll(`[data-contenido="${idContenido}"]`);
				for ( i = 0; i < contenedores.length; i++ ) {
					// Agrega el Ã­cono de ediciÃ³n antes del contenido y reemplaza todo en el contenedor
					contenedores[i].innerHTML = `<span class="cmsIconoEditar">${cmsEditor.iconoEditar}</span>${contenido}`;
					// Agrega escuchador de evento al Ã­cono
					contenedores[i].querySelector('.cmsIconoEditar').addEventListener('click', function ( e ) {
						e.preventDefault();
						cmsEditor.editar( this.parentElement );
					});
				}
				cmsEditor.cerrarEditor();
			}
		})
		.catch( error => {
//
			console.error( error );

		});
	};

	cmsEditor.cerrarEditor = () => {
		document.querySelector('#cmsEditor').classList.remove('visible');
	};

	function cargarScript( url ) {
		return new Promise( ( resuelve, rechaza ) => {
			if ( document.querySelectorAll(`script[src="${url}"]`).length == 0 ) {		// Si el script no está cargado
				let script = document.createElement('script');
				script.type = 'text/javascript';
				if ( script.readyState ) {	//IE
					script.onreadystatechange = () => {
						if ( script.readyState == 'loaded' || script.readyState == 'complete' ) {
							script.onreadystatechange = null;
							resuelve(true);
						}
					};
				} else {
					script.onload = () => {
						resuelve(true);
					};
				}
				script.src = url;
				document.getElementsByTagName('head')[0].appendChild(script);
			} else {
				resuelve(false);
			}
		});
	};

}( window.cmsEditor = window.cmsEditor || {} ) );
