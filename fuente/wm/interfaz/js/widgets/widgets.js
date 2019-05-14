import { urlBaseApi, obtenerIdiomaUrl } from '../modulos/comun';

/*
Hay que incluír la siguiente línea;
y += me.height/2 - itemHeight*me.legendItems.length/2;
antes de la línea siguiente;
drawLegendBox(x, y, legendItem);
en Chart.js para alinear verticalmente las referencias a la derecha de la torta
*/
import Chart from '../../../../../node_modules/chart.js/dist/Chart.js';
//
function colores( cantidad ) {
	let salida = [];
	let colores = ['#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#303f9f', '#1976d2', '#0288d1', '#0097a7', '#00796b', '#388e3c', '#689f38', '#afb42b', '#fbc02d', '#ffa000', '#f57c00', '#e64a19', '#5d4037'];
	while ( cantidad-- ) {
		let i = Math.floor( Math.random() * colores.length );
		salida.push( colores.splice( i, 1 ) );
	}
	return salida;
}

export function wdSecciones() {
	let headerAuth = 'Basic ' + btoa( localStorage.getItem('uid') + ':' + localStorage.getItem('token') );
	let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': obtenerIdiomaUrl() };
	fetch(`${urlBaseApi}/apis/wm-articulus/v1/blogs/?incNumArticulos=1`, { method: 'get', headers: reqHeaders } )
	.then( respuesta => respuesta.json() )
	.then( secciones => {
		if ( secciones.length > 0 ) {
			let aDatos = [], aEtiquetas = [];
			secciones.forEach( seccion => {
				aDatos.push( seccion.numArticulos );
				aEtiquetas.push( seccion.nombre );
			});
			//
			let ctx = document.getElementById('tortaSecciones').getContext('2d');
			let tortaSecciones = new Chart(ctx,{
				type: 'doughnut',
				data: {
					datasets: [{
						data: aDatos,
						backgroundColor: colores( aDatos.length )
					}],
					labels: aEtiquetas
				},
				options: {
					responsive: true,
					legend: {
						position: 'right',
						fullWidth: false,
						labels: {
							boxWidth: 20
						}
					},
					layout: {
						padding: {
							top: 10,
							right: 20,
							bottom: 10,
							left: 20
						}
					}
/*
					animation: {
						duration: 0 // general animation time
					},
					hover: {
						animationDuration: 0 // duration of animations when hovering an item
					},
					responsiveAnimationDuration: 0 // animation duration after a resize
*/


				}
			});
		}
	})
	.catch( error => {
		console.error( error );
	});
}

export function wdAutores() {
	let headerAuth = 'Basic ' + btoa( localStorage.getItem('uid') + ':' + localStorage.getItem('token') );
	let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': obtenerIdiomaUrl() };
	fetch(`${urlBaseApi}/apis/wm-articulus/v1/autores/`, { method: 'get', headers: reqHeaders } )
	.then( respuesta => respuesta.json() )
	.then( autores => {
		if ( autores.length > 0 ) {
			let aDatos = [], aEtiquetas = [];
			autores.forEach( autor => {
				aDatos.push( autor.nroArticulos );
				aEtiquetas.push( autor.nombreAutor );
			});
			//
			let ctx = document.getElementById('tortaAutores').getContext('2d');
			let tortaAutores = new Chart(ctx,{
				type: 'doughnut',
				data: {
					datasets: [{
						data: aDatos,
						backgroundColor: colores( aDatos.length )
					}],
					labels: aEtiquetas
				},
				options: {
					responsive: true,
					legend: {
						position: 'right',
						fullWidth: false,
						labels: {
							boxWidth: 20
						}
					},
					layout: {
						padding: {
							top: 10,
							right: 20,
							bottom: 10,
							left: 20
						}
					}
				}
			});
		}
	})
	.catch( error => {
		console.error( error );
	});
}

export function wdUsuarios() {




}



