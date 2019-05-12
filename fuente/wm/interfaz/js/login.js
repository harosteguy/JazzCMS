import estilos from '../estilo/login.scss';
import chorrear from './modulos/chorro';
import * as comun from './modulos/comun';
import tostada from './widgets/tostada';

comun.setIdiomaPagina();
let idioma = comun.obtenerIdiomaUrl();
let idiomaUrl = idioma === comun.setIdiomas[0] ? '' : idioma + '/';

comun.mostrarUsuario().then( usr => {
	location.href = `/${idiomaUrl}wm/`;
})
.catch( error => {
	chorrear( () => {
		comun.esperaAjax( false, 'cargapagina');
	});
	comun.setLinkIdioma();
	console.log( error )
});
//
document.getElementById('frmLogin').addEventListener('submit', e => {
	e.preventDefault();
	comun.esperaAjax( true, 'login' );
	const frmLogin = document.getElementById('frmLogin');
	const headerAuth = "Basic " + btoa( frmLogin.elements['email'].value + ":" + frmLogin.elements['clave'].value );
	const reqHeaders = { "Authorization": headerAuth, "Accept-Language": idioma };
	//
	fetch( comun.urlBaseApi + '/apis/usuarios/v1/token', { method: 'get', headers: reqHeaders } )
	.then( respuesta => {
		return respuesta.json();
	})
	.then( usr => {
		if ( usr.error ) throw new Error( usr.error );

		localStorage.setItem('uid', usr.id );
		localStorage.setItem('token', usr.token );
		localStorage.setItem('nombre', usr.nombre );
		localStorage.setItem('apellido', usr.apellido );
		localStorage.setItem('esAdmin', usr.esAdmin );
		location.href = `/${idiomaUrl}wm/`;
	})
	.catch( error => {
		tostada( error.message, 4, 'color-cuatro');
		comun.esperaAjax( false, 'login' );
	});

});


