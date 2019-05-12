import { dispararEvento, subirHasta, plegar, desplegar } from './utiles';

//---------------------------------------------------------------------------
// Botonera

/*
<div class="botonera">
	<button value="uno" class="boton">Opción Uno</button>
	<button value="dos" class="boton">Opción Dos</button>
	<button value="tres" class="boton">Opción Tres</button>
</div>
*/

export let botonera = {
	iniciar: ( contenedor, valor ) => {
		let botones = contenedor.querySelectorAll('.boton');
		for ( let boton of botones ) {
			if ( boton.value === valor ) {
				boton.classList.add('activo');
			} else {
				boton.classList.remove('activo');
			}
		}
		contenedor.addEventListener('click', evento => {
			for ( let boton of botones ) {
				if ( boton.value === evento.target.value ) {
					boton.classList.add('activo');
				} else {
					boton.classList.remove('activo');
				}
			}
		});
	},
	leer: contenedor => {
		let botones = contenedor.querySelectorAll('.boton');
		for ( let boton of botones ) {
			if ( boton.classList.contains('activo') ) {
				return boton.value;
			}
		}
		return false;
	}
};


//---------------------------------------------------------------------------
// Checkbox personalizado

/*
<div class="algo">
	<input type="checkbox" class="control">
	<label>Etiqueta opcional</label>
</div>
*/

export let checkbox = {
	iniciar: () => {
		// Crea checkbox
		document.querySelectorAll('input[type="checkbox"].control').forEach( inputCheck => {
			let caja = document.createElement('a');
			caja.setAttribute('href', '#');
			caja.classList.add('cms-checkbox');
			caja.innerHTML = '<svg viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>';
			if ( inputCheck.checked ) caja.querySelector('svg').classList.add('visto');
			inputCheck.parentNode.insertBefore( caja, inputCheck.nextSibling );
			inputCheck.classList.add('oculto');
		});
		// Click
		document.getElementsByTagName('body')[0].addEventListener('click', evento => {
			let elemento = evento.target;
			if ( !elemento.tagName || elemento.tagName.toLowerCase() !== 'a' ) {
				elemento = subirHasta( evento.target, 'a');
			}
			if ( elemento && elemento.tagName && elemento.tagName.toLowerCase() === 'a' && elemento.classList.contains('cms-checkbox') ) {
				evento.preventDefault();
				let inputCheck = elemento.previousSibling;
				inputCheck.checked = !inputCheck.checked;
				dispararEvento( inputCheck, 'change');
			}
		});
		// Change
		document.getElementsByTagName('body')[0].addEventListener('change', evento => {
			if ( evento.target.tagName.toLowerCase() === 'input' && evento.target.getAttribute('type') == 'checkbox' ) {
				if ( evento.target.checked ) {
					evento.target.nextSibling.querySelector('svg').classList.add('visto');
				} else {
					evento.target.nextSibling.querySelector('svg').classList.remove('visto');
				}
			}
		});
	}
};

//---------------------------------------------------------------------------
// Multi select

/*
<div class="multi-select" id="unIdentificador">
	<div class="grupo desplegable">
		<select class="control"><option value="0"></option></select><button type="button" class="sel-menos boton">x</button>
	</div>
	<button type="button" class="sel-mas boton">+</button>
</div>
*/
export let multiSelect = {
	iniciar: ( contenedor, opciones ) => {
		// Agrega options al select inicial
		opciones = opciones || [];
		if ( opciones.length > 0 ) {
			opciones.forEach( item => {
				let opt = document.createElement('option');
				opt.value = item.id;
				opt.textContent = item.nombre;
				contenedor.firstElementChild.firstElementChild.appendChild( opt );
			});
		}
		// Agregar select
		contenedor.getElementsByClassName('sel-mas')[0].addEventListener('click', function ( evento ) {
			let selItem = contenedor.firstElementChild.cloneNode( true );
			contenedor.insertBefore( selItem, this );
			desplegar( selItem );
		});
		// Quitar select
		contenedor.addEventListener('click', function ( evento ) {
			let elemento = evento.target;
			if ( !elemento.tagName || elemento.tagName.toLowerCase() !== 'button' ) {
				elemento = subirHasta( evento.target, 'button');
			}
			if ( elemento && elemento.classList.contains('sel-menos') ) {
				if ( contenedor.childElementCount > 2 ) { // Un select y botón más
					plegar( elemento.parentNode, () => {
						elemento.parentNode.remove();
					});
				}
			}
		});
	},
	leer: contenedor => {
		let aValues = [];
		let selects = contenedor.querySelectorAll('.desplegado');
		for ( let sel of selects ) {
			aValues.push( sel.querySelector('select').value );
		}
		return aValues;
	},
	escribir: ( contenedor, selecciones ) => {
		// Elimina selects visibles
		let items = contenedor.querySelectorAll('.desplegado');
		for ( let item of items ) contenedor.removeChild( item );
		//
		selecciones.forEach( seleccion => {
			let selItem = contenedor.firstElementChild.cloneNode( true );
			selItem.getElementsByTagName('select')[0].value = seleccion;
			contenedor.insertBefore( selItem, contenedor.querySelector('.sel-mas') );
			desplegar( selItem );
		});
	},
	reiniciar: ( contenedor, opciones ) => {
		opciones = opciones || [];
		// Elimina selects visibles
		let items = contenedor.querySelectorAll('.desplegado');
		for ( let item of items ) contenedor.removeChild( item );
		//
		let selPlantilla = contenedor.firstElementChild.firstElementChild;
		let options = selPlantilla.querySelectorAll('option');
		for ( let op of options ) selPlantilla.removeChild( op );		// Elimina options del select plantilla
		if ( opciones.length > 0 ) {
			opciones.forEach( item => {
				let opt = document.createElement('option');
				opt.value = item.id;
				opt.textContent = item.nombre;
				selPlantilla.appendChild( opt );
			});
		}
	}
};

//---------------------------------------------------------------------------
// Lista select

/*
<ul id="unIdentificador" class="lista-select control">
	<li></li>
</ul>
*/
export class ListaSelect {

	constructor( elementoUl, cbClick ) {
		this.elementoUl = elementoUl;
		//
		this.antesDeCambiar = () => Promise.resolve( true );
		//
		this.elementoUl.addEventListener('click', evento => {
			this.antesDeCambiar().then( cambiar => {
				if ( cambiar !== true ) return;
				let clicado = evento.target;
				if ( clicado.tagName.toLowerCase() === 'li' ) {
					let li, lis = this.elementoUl.querySelectorAll('li');
					for ( li of lis ) li.classList.remove('activo');							// Elimina fondo de todos los list items
					clicado.classList.add('activo');											// Agrega fondo al clicado
				}
				if ( typeof cbClick === 'function' ) {
					cbClick({ clave: clicado.dataset.clave, valor: clicado.textContent });		// Función on click devuelve clave/valor
				}
			}).catch( error => { console.error( error ) } );
		});
	}

	poblar( datos, claveValor ) {
		// datos >> array de objetos en los que dos de sus propiedades seran clave/valor en cada item de la lista
		//claveValor >> { nombreClave: "nombre de la propiedad clave", nombreValor: "nombre de la propiedad valor" }
		let itemLista;
		datos.forEach( item => {
			itemLista = document.createElement('li');
			itemLista.textContent = item[claveValor.nombreValor];
			itemLista.dataset.clave = item[claveValor.nombreClave];
			this.elementoUl.appendChild( itemLista );
		});
	}

	seleccionar( indice ) {
		let i = 0, li, lis = this.elementoUl.querySelectorAll('li');
		for ( li of lis ) {
			if ( i === indice ) {
				li.classList.add('activo');
				break;
			}
			i ++;
		}
		return { clave: li.dataset.clave, valor: li.textContent };
	}

	seleccionado() {
		let li, lis = this.elementoUl.querySelectorAll('li');
		for ( li of lis ) {
			if ( li.classList.contains('activo') ) return { clave: li.dataset.clave, valor: li.textContent };
		}
		return false;
	}

	agregar( clave, valor ) {
		let valorNuevo = valor.toLowerCase(),
			valorLista,
			agregado = false;
		let itemLista = document.createElement('li');
		itemLista.textContent = valor;
		itemLista.dataset.clave = clave;
		itemLista.classList.add('activo');
		let li, lis = this.elementoUl.getElementsByTagName('li');
		for ( li of lis ) {
			li.classList.remove('activo');
			valorLista = li.textContent.toLowerCase();
			if ( valorNuevo < valorLista ) {
				this.elementoUl.insertBefore( itemLista, li );
				agregado = true;
				itemLista.scrollIntoView( { behavior: "smooth", block: "start", inline: "nearest" } );
				break;
			}
		}
		if ( !agregado ) {
			this.elementoUl.appendChild( itemLista );
			itemLista.scrollIntoView( { behavior: "smooth", block: "start", inline: "nearest" } );
		}
	}

	actualizar( clave, nuevaClave, nuevoValor ) {
		let itemLista = this.elementoUl.querySelector(`[data-clave="${clave}"]`);
		itemLista.textContent = nuevoValor;
		itemLista.dataset.clave = nuevaClave;
	}

	borrar( clave ) {
		this.elementoUl.querySelector(`[data-clave="${clave}"]`).remove();
	}

	reiniciar() {
		let li, lis = this.elementoUl.querySelectorAll('li');
		for ( li of lis ) li.classList.remove('activo');
		this.elementoUl.scrollTop = 0;
	}

	vaciar() {
		while ( this.elementoUl.firstChild ) this.elementoUl.firstChild.remove();
	}

}
