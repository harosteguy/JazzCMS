import estilos from '../../estilo/widgets/_compartir.scss';

export function widgetCompartir( url, titulo, texto ) {
	//if (true) {
	if ('share' in navigator) {
		let compartir = document.querySelectorAll('.compartir .apiCompartir');
		compartir.forEach( compa => {
			compa.classList.remove('oculto');
		});
		document.querySelectorAll('a.apiCompartir').forEach( boton => {
			boton.addEventListener('click', evento => {
				evento.preventDefault();
				navigator.share({
					title: titulo,
					text: texto,
					url: url
				});
			});
		});
	} else {
		let compartir = document.querySelectorAll('.compartir .redesSociales');
		compartir.forEach( compa => {
			compa.classList.remove('oculto');
		});
		let url = encodeURIComponent( location.href );
		let titulo = encodeURIComponent( document.title );

		let anchoPopup = 770;
		let altoPopup = 520;

		let winTop = ( screen.height / 2 ) - ( altoPopup / 2 );
		let winLeft = ( screen.width / 2 ) - ( anchoPopup / 2 );
		//
		let facebook = document.querySelectorAll('.compartir .facebook');
		facebook.forEach( enlace => {
			enlace.href = `https://facebook.com/sharer.php?u=${url}`;
			enlace.addEventListener('click', function ( evento ) {
				evento.preventDefault();
				window.open( this.href, 'Hey!', `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${anchoPopup},height=${altoPopup}`);
			});
		});
		//
		let whatsapp = document.querySelectorAll('.compartir .whatsapp');
		whatsapp.forEach( enlace => {
			enlace.href = `whatsapp://send?text=${url}`;
		});
		//
		let twitter = document.querySelectorAll('.compartir .twitter');
		twitter.forEach( enlace => {
			enlace.href = `https://twitter.com/share?url=${url}&text=${titulo}`;
			enlace.addEventListener('click', function ( evento ) {
				evento.preventDefault();
				window.open( this.href, 'Hey!', `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${anchoPopup},height=${altoPopup}`);
			});
		});
		//
		let pinterest = document.querySelectorAll('.compartir .pinterest');
		pinterest.forEach( enlace => {
			enlace.href = `http://pinterest.com/pin/create/link/?url=${url}`;
			enlace.addEventListener('click', function ( evento ) {
				evento.preventDefault();
				window.open( this.href, 'Hey!', `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${anchoPopup},height=${altoPopup}`);
			});
		});
		//
		let linkedin = document.querySelectorAll('.compartir .linkedin');
		linkedin.forEach( enlace => {
			enlace.href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${titulo}&summary=${texto}`;
			enlace.addEventListener('click', function ( evento ) {
				evento.preventDefault();
				window.open( this.href, 'Hey!', `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${anchoPopup},height=${altoPopup}`);
			});
		});
	}
}
