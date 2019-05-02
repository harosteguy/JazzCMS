import estilos from '../../estilo/widgets/_contacto.scss';

export function widgetContacto() {
	document.querySelector('.widgetContacto .items').addEventListener('click', evento => {
		evento.preventDefault();
		if ( evento.target.classList.contains('enlace')  ) {
			 window.location.href = evento.target.href + evento.target.querySelector('.txt').textContent;
		}
	});
}