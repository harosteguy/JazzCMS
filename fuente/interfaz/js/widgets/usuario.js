import estilos from '../../estilo/widgets/_usuario.scss';
import { autorizacion } from '../modulos/usuario';
import { padIzquierdo } from '../modulos/utiles';

export function widgetUsuario( cb = () => {} ) {
	autorizacion().then( usr => {
		if ( usr ) {
			let wdUsr = document.getElementById('usuario');
			wdUsr.querySelector('.nombre').textContent = usr.nombre;
			//wdUsr.querySelector('.apellido').textContent = usr.apellido;
			wdUsr.querySelector('.foto').onerror = function () {
				this.onerror = '';
				//this.src = '/interfaz/img/perfil.svg';
				this.src = 'data:image/jpeg;base64,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';
			};
			wdUsr.querySelector('.foto').src = `/img/usuarios/${padIzquierdo( usr.id.toString(), '000000')}.jpg`
			wdUsr.querySelectorAll('.conectado').forEach( elemento => {
				elemento.classList.remove('oculto');
			});
			localStorage.setItem('nombre', usr.nombre );
			localStorage.setItem('apellido', usr.apellido );
			sessionStorage.setItem('esAdmin', usr.esAdmin );
			if ( usr.esAdmin === 1 ) {
				wdUsr.querySelector('.cmsWm').classList.remove('oculto');
				setModoEditor();
			}
			cb( usr );
		} else {
			desconectar();
			cb( false );
		}
	})
	.catch( error => {
		desconectar();
		cb( false );
		//console.log( error );
	});
	function desconectar() {
		localStorage.removeItem('uid');
		localStorage.removeItem('token');
		localStorage.removeItem('nombre');
		localStorage.removeItem('apellido');
		sessionStorage.removeItem('esAdmin');
		document.querySelectorAll('#usuario .desconectado').forEach( elemento => {
			elemento.classList.remove('oculto');
		});
	}
}

function setModoEditor() {
	// Carga script de editor de contenidos y lo inicia
	cargarScript('/interfaz/js/cmsEditor.js', () => {
		cmsEditor.iniciar().then( () => {
			// Icono de mostrar y ocultar interfaz
			let icono = document.querySelector('#usuario .cmsEditor');
			icono.classList.remove('oculto');
			icono.addEventListener('click', e => {
				e.preventDefault();
				if ( cmsEditor.activo ) {
					cmsEditor.ocultarInterfaz();
				} else {
					cmsEditor.mostrarInterfaz();
				}
			})
			icono.classList.add('visible');
		}).catch( e => { console.log( e ) } );
	});

	function cargarScript( url, callback ) {
		if ( document.querySelectorAll(`script[src="${url}"]`).length == 0 ) {		// Si el script no está cargado
			let script = document.createElement('script');
			script.type = 'text/javascript';
			if ( script.readyState ) {	//IE
				script.onreadystatechange = () => {
					if ( script.readyState == 'loaded' || script.readyState == 'complete' ) {
						script.onreadystatechange = null;
						callback(true);
					}
				};
			} else {
				script.onload = () => { callback(true) };
			}
			script.src = url;
			document.getElementsByTagName('head')[0].appendChild(script);
		} else {
			callback(false);
		}
	}
}
