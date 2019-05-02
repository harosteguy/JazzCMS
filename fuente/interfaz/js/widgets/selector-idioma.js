import estilos from '../../estilo/widgets/_selector-idioma.scss';
import { obtenerIdiomaUrl, setIdiomaIsoNombre } from '../modulos/comun';

export function iniciar() {
	let idiomaPagina = obtenerIdiomaUrl();
	let clonIdioma;
	setIdiomaIsoNombre.forEach( idioma => {
		clonIdioma = document.querySelector('.selectorIdioma .plantilla').cloneNode( true );
		clonIdioma.querySelector('.enlace').href = `/${idioma.iso}/`;
		clonIdioma.querySelector('.enlace').textContent = idioma.nombre;
		if ( idioma.iso === idiomaPagina ) {
			clonIdioma.querySelector('.enlace').classList.add('activo');
		}
		document.querySelector('.selectorIdioma .idiomas').appendChild( clonIdioma );
		clonIdioma.classList.remove('plantilla');
	});
}
