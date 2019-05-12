import estilos from '../estilo/inicio.scss';
import chorrear from './modulos/chorro';
import * as comun from './modulos/comun';
import { wdAutores, wdSecciones } from './widgets/widgets';

comun.setIdiomaPagina();
let idioma = comun.obtenerIdiomaUrl();
let idiomaUrl = idioma === comun.setIdiomas[0] ? '' : idioma + '/';

comun.mostrarUsuario().then( usr => {
	if ( usr.esAdmin === 1 ) {
		hacer( usr );
	} else {
		// Comprueba si es un autor activo
		let headerAuth = 'Basic ' + btoa( localStorage.getItem('uid') + ':' + localStorage.getItem('token') );
		let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma };
		fetch(`${comun.urlBaseApi}/apis/wm-articulus/v1/autores/`, { method: 'get', headers: reqHeaders } )
		.then( respuesta => {
			if ( respuesta.status !== 200 ) {
				throw new Error('El status no es 200');
			}
			return respuesta.json();
		})
		.then( autor => {
			if ( autor.autorActivo ) {
				hacer( usr );
			} else {
				throw new Error('No es un autor activo');
			}
		})
		.catch( error => {
			localStorage.removeItem('uid');
			localStorage.removeItem('token');
			localStorage.removeItem('nombre');
			localStorage.removeItem('apellido');
			localStorage.removeItem('esAdmin');
			window.location.href = `/${idiomaUrl}`;
		});
	}
})
.catch( error => {

console.error(error);

	localStorage.removeItem('uid');
	localStorage.removeItem('token');
	localStorage.removeItem('nombre');
	localStorage.removeItem('apellido');
	localStorage.removeItem('esAdmin');
	window.location.href = `/${idiomaUrl}wm/login/`;
});

//
function hacer( usr ) {
	chorrear( () => {
		comun.esperaAjax( false, 'cargapagina');
	});
	comun.menuLateral.iniciar();
	comun.setLinkIdioma();

	document.querySelector('.menu-lateral .inicio').classList.add('activo');

	if ( usr.esAdmin === 1 ) {
		wdAutores();
		wdSecciones();
	}


}
