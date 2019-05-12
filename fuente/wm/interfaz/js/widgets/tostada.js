import estilos from '../../estilo/widgets/_tostada.scss';

export default function tostada( texto, segundos, claseColor ) {
	claseColor = claseColor || 'color-uno';
	// Crea tostada
	let tostada = document.createElement('div');
	tostada.classList.add('tostada', claseColor );
	// Crea y agrega botón cerrar
	let cerrar = document.createElement('a');
	cerrar.href = '#';
	cerrar.classList.add('cerrar');
	cerrar.innerHTML = '&#215;';
	tostada.appendChild( cerrar );
	cerrar.addEventListener('click', function( evento ) {
		evento.preventDefault();
		tostada.classList.remove('visible');
		window.setTimeout( () => {
			tostada.remove();		// Elimina después de la transición de .visible
		}, 600 );
	});
	// Crea y agrega párrafo
	let parrafo = document.createElement('p');
	let txt = document.createTextNode( texto );
	parrafo.appendChild( txt );
	tostada.appendChild( parrafo );
	// Crea u obtiene contenedor
	let tostador;
	if ( !document.getElementById('tostador') ) {
		tostador = document.createElement('div');
		tostador.id = 'tostador';
		document.getElementsByTagName('body')[0].appendChild( tostador );
	} else {
		tostador = document.getElementById('tostador');
	}
	// Agrega y muestra tostada durante el tiempo indicado
	tostador.insertBefore( tostada, tostador.firstChild );
	tostada.classList.add('visible');
	window.setTimeout( () => {
		tostada.classList.remove('visible');
		window.setTimeout( () => {
			tostada.remove();		// Elimina después de la transición de .visible
		}, 600 );
	}, segundos * 1000 );
}
