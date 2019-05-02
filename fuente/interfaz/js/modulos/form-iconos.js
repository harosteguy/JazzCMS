
export function iniciar() {
	// Evento focus y blur de controles
	let controles = document.querySelectorAll('form .control');
	for ( var i = 0; i < controles.length; i++ ) {
		//
		controles[i].addEventListener('focus', function () {
			if ( !this.classList.contains('error') ) {
				this.classList.add('foco');									// Control
				this.previousElementSibling.classList.remove('error');		// Ícono
				this.previousElementSibling.classList.add('foco');
			}
		});
		//
		controles[i].addEventListener('blur', function () {
			this.classList.remove('foco');									// Control
			this.previousElementSibling.classList.remove('foco');			// Ícono
			if ( !this.checkValidity() ) {
				this.classList.add('error');
				this.previousElementSibling.classList.add('error');
				this.nextElementSibling.classList.add('visible');
			}
		});
		//
		controles[i].addEventListener('keyup', function () {
			if ( this.checkValidity() ) {
				this.classList.remove('error');								// Control
				this.classList.add('foco');
				this.previousElementSibling.classList.remove('error');		// Ícono
				this.previousElementSibling.classList.add('foco');
				if ( this.nextElementSibling ) {
					this.nextElementSibling.classList.remove('visible');	// Mensaje de error
				}
			} else {
				this.classList.remove('foco');
				this.classList.add('error');
				this.previousElementSibling.classList.remove('foco');
				this.previousElementSibling.classList.add('error');
				if ( this.nextElementSibling ) {
					this.nextElementSibling.classList.add('visible');
				}
			}
		});
	}
}

export function validar() {
	let controles = document.querySelectorAll('form .control');
	let error = false;
	for ( var i = 0; i < controles.length; i++ ) {
		if ( !controles[i].checkValidity() ) {
			controles[i].classList.add('error');							// Control
			controles[i].previousElementSibling.classList.add('error');		// Ícono
			if ( controles[i].nextElementSibling ) {
				controles[i].nextElementSibling.classList.add('visible');	// Mensaje de error
			}
			error = true;
		}
	}
	if ( error ) {
		document.querySelector('.control:invalid').focus();					// Foco en primer control con error
		return false;
	} else {
		return true;
	}
}

export function datos() {
	let respuesta = {};
	let controles = document.querySelectorAll('form .control');
	for ( var i = 0; i < controles.length; i++ ) {
		respuesta[ controles[i].name ] = controles[i].value;
	}
	return respuesta;
}

export function limpiar() {
	let controles = document.querySelectorAll('form .control');
	for ( var i = 0; i < controles.length; i++ ) {
		controles[i].value = '';
	}
}
