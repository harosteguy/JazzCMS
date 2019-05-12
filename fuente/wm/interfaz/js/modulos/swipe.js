export default function swipe( elemento, direccion, callback ) {
	let iniX = null;
	let iniY = null;
	if ( elemento ) {

		//console.log( elemento.dataset.tieneSwipe );

//// Verificar si ya tiene escuchador

		elemento.addEventListener('touchstart', ( evento ) => {
			iniX = evento.touches[0].clientX;
			iniY = evento.touches[0].clientY;
		});

		elemento.addEventListener('touchmove', ( evento ) => {
			if ( ! iniX || ! iniY ) {
				return;
			}
			let finX = evento.touches[0].clientX;
			let finY = evento.touches[0].clientY;
			let difX = iniX - finX;
			let difY = iniY - finY;
			if ( Math.abs( difX ) > Math.abs( difY ) ) {										// Diferencia más significante
				if ( difX > 0 ) {
					if ( direccion === 'left' && typeof callback === 'function' ) {				// left
						callback();
					}
				} else {
					if ( direccion === 'right' && typeof callback === 'function' ) {			// right
						callback();
					}
				}
			} else {
				if ( difY > 0 ) {
					if ( direccion === 'up' && typeof callback === 'function' ) {				// up
						callback();
					}
				} else { 
					if ( direccion === 'down' && typeof callback === 'function' ) {				// down
						callback();
					}
				}
			}
			// reset
			iniX = null;
			iniY = null;
		});


	}
}