// En webpack.config.js se excluye este archivo de babel-loader para poder extender la función Plugin sin error
//*************************************************************************************************************
import { urlBaseApi } from './wm-comun';
import tostada from '../widgets/tostada';
import SelectorImagen from '../widgets/wm-selector-imagen';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

import './wm-ckeditor.css';
//
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';


class ImagenDeContenido extends Plugin {
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('imagenDeContenido', locale => {
			const view = new ButtonView( locale );
			view.set({
				label: 'Insert image',
				icon: imageIcon,
				tooltip: true
			});
			// Click en el botón
			view.on('execute', () => {
				// Busca título para el selector de imagen si hay una label para el editor
				let etiqueta = editor.sourceElement.previousElementSibling;
				let titulo = etiqueta.tagName === 'LABEL' ? etiqueta.textContent : '';

				// Muestra selector de imagen
				let selecImagen = new SelectorImagen( titulo, `${urlBaseApi}/apis/wm-imagen/v1/contenidos`);
				selecImagen.mostrar().then( ( [ urlImg, estado ] ) => {
					if ( estado === 'existente' || estado === 'nueva' ) {
						// Muestra imagen en el editor
						editor.model.change( writer => {
							let elementoImagen = writer.createElement('image', { src: urlImg } );
							editor.model.insertContent( elementoImagen, editor.model.document.selection );	// Inserta imagen en el lugar del cursor
						});
					}
				}).catch( error => {
					tostada( document.querySelector('.errorSelectorImg').textContent, 4, 'color-cuatro');
					console.error( error );
				});
			});
			return view;
		} );
	}
}

export function crearEditor( elementoDom ) {
	let ckOpciones = {
		heading: {
			options: [
				{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
				{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
				{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
				{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
			]
		},
		image: {
			toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative']
		},
		plugins: [ Essentials, Bold, Italic, BlockQuote, Heading, Image, ImagenDeContenido, MediaEmbed, ImageCaption, ImageStyle, ImageToolbar, Link, List, Paragraph ],
		toolbar: ['heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'ImagenDeContenido', 'mediaEmbed', 'blockQuote', 'undo', 'redo'],
		mediaEmbed: {
			previewsInData: true,
			removeProviders: [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
		}
	};
	return ClassicEditor.create( elementoDom, ckOpciones );
}
