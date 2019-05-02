import estilos from '../../estilo/imports/_menu.scss';

export function iniciar( idItem ) {
	let menu = document.getElementById('menu');
	let item = document.getElementById( idItem );
	if ( item ) {
		item.classList.add('activo');												// Resalta item
		let rect = item.getBoundingClientRect();
		menu.querySelector('.items').scrollLeft = Math.ceil( rect.left - 50 );		// y lo hace visible dentro del menu
	}
	// Mantiene el menú pegado a tope de página
	let sticky = menu.offsetTop;
	window.addEventListener('scroll', () => {
		if ( window.pageYOffset >= sticky ) {
			menu.classList.add('sticky')
		} else {
			menu.classList.remove('sticky');
		}
	});
	// Muestra con fade in
	menu.classList.add('visible');
}
