import swipe from './swipe';

export let emergente = {
	mostrar: ( contenedor, cbDespuesDeAbrir, cbAntesDeCerrar, cbDespuesDeCerrar ) => {
		document.body.style.overflow = 'hidden';			// Fija el fondo quitando scrollbar al body
		window.setTimeout( () => {
			contenedor.classList.add('visible');			// Muestra
		}, 60 );
		// Escuchadores para ocultar
		let cancelar = evento => {
			if ( typeof evento !== 'undefined') evento.preventDefault();
			if ( typeof cbAntesDeCerrar == 'function') cbAntesDeCerrar();
			emergente.ocultar( contenedor, () => {
				document.body.style.overflow = 'auto';
				if ( typeof cbDespuesDeCerrar == 'function') cbDespuesDeCerrar();
			});
		};
		contenedor.querySelector('.fondo').removeEventListener('click', cancelar );
		contenedor.querySelector('.fondo').addEventListener('click', cancelar );
		contenedor.querySelector('.cerrar').removeEventListener('click', cancelar );
		contenedor.querySelector('.cerrar').addEventListener('click', cancelar );
		let btnCancelar = contenedor.querySelector('.cancelar');
		if ( btnCancelar ) {
			btnCancelar.removeEventListener('click', cancelar );
			btnCancelar.addEventListener('click', cancelar );
		}
////		swipe( contenedor, 'up', cancelar );
		//
		window.setTimeout( () => {
			if ( typeof cbDespuesDeAbrir == 'function') cbDespuesDeAbrir();
		}, 600 );
	},
	ocultar:  ( contenedor, cbDespuesDeCerrar ) => {
		contenedor.classList.remove('visible');
		document.body.style.overflow = 'auto';
		window.setTimeout( () => {
			if ( typeof cbDespuesDeCerrar == 'function') cbDespuesDeCerrar();
		}, 600 );
	}
}
