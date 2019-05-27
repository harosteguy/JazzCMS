/**
 * This file is part of JazzCMS
 *
 * JazzCMS - Webapp for managing content of applications.
 * Copyright (C) 2019 by Guillermo Harosteguy <harosteguy@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// En webpack.config.js se excluye este archivo de babel-loader para poder extender la función Plugin sin error
//* ************************************************************************************************************
import { urlBaseApi, obtenerIdiomaUrl } from './comun'
import tostada from '../widgets/tostada'
import SelectorImagen from '../widgets/selector-imagen'

import './ckeditor5-idiomas/en.js'
import './ckeditor5-idiomas/es.js'

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import Link from '@ckeditor/ckeditor5-link/src/link'
import List from '@ckeditor/ckeditor5-list/src/list'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'

import './ckeditor.css'
//
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

class ImagenDeArticulo extends Plugin {
  init () {
    const editor = this.editor
    editor.ui.componentFactory.add('imagenDeArticulo', locale => {
      const view = new ButtonView(locale)
      view.set({
        label: 'Insert image',
        icon: imageIcon,
        tooltip: true
      })
      // Click en el botón
      view.on('execute', () => {
        // Si el artículo todavía no se guardó avisa y sale
        if (document.getElementById('tituloUrlOriginal').value === '') {
          tostada(document.querySelector('.guardeArtiParaImg').textContent, 4, 'color-tres')
          return
        }
        // Busca título para el selector de imagen si hay una label para el editor
        let etiqueta = editor.sourceElement.previousElementSibling
        let titulo = etiqueta.tagName === 'LABEL' ? etiqueta.textContent : ''
        // Obtiene del URL nombre base del artículo y del blog o sección
        let partes = document.location.pathname.split('/')
        if (partes[ partes.length - 1 ] === '') {
          partes.pop() // Si la URL temina en barra el último elemento del array estará vacío. Se descarta.
        }
        if (partes.length === 6 || partes.length === 7) { // URL sin y con idioma
          let artiBase = partes[ partes.length - 1 ]
          let blogBase = partes[ partes.length - 2 ]
          let url = `${urlBaseApi}/apis/wm-articulus/v1/blogs/${blogBase}/articulos/${artiBase}/imagenes`
          // Muestra selector de imagen
          let selecImagen = new SelectorImagen(titulo, url, false) // El tercer parámetro es para no pedir confirmación al borrar una imagen
          selecImagen.mostrar().then(([ urlImg, estado ]) => {
            if (estado === 'existente' || estado === 'nueva') {
              // Muestra imagen en el editor
              editor.model.change(writer => {
                let elementoImagen = writer.createElement('image', { src: urlImg })
                editor.model.insertContent(elementoImagen, editor.model.document.selection) // Inserta imagen en el lugar del cursor
              })
            }
          }).catch(error => {
            tostada(document.querySelector('.errorSelectorImg').textContent, 4, 'color-cuatro')
            console.error(error)
          })
          // Antes de borrar una imagen del selector se verifica que la imagen no esté en uso
          selecImagen.antesDeBorrar = divImagen => {
            return new Promise(resolve => {
              let imgEnUso = false
              // Obtiene nombre de la imagen sin sufijo '/img/foto-480.jpg' >--> 'foto.jpg'
              let nomImgABorrar = divImagen.querySelector('img').src.split('/').pop()
              nomImgABorrar = nomImgABorrar.substr(0, nomImgABorrar.length - 8) + nomImgABorrar.substr(-4)
              // Convierte en DOM el contenido del editor
              let template = document.createElement('template')
              let textoHtml = editor.getData()
              textoHtml = textoHtml.trim()
              template.innerHTML = textoHtml
              // Verifica imágenes en el editor
              let imgs = template.content.querySelectorAll('img')
              for (let img of imgs) {
                if (img.src.split('/').pop() === nomImgABorrar) {
                  imgEnUso = true
                  break
                }
              }
              // Verifica imagen principal del artículo
              let nomImgPrincipal = document.getElementById('urlImgPrincipal').value.split('/').pop()
              if (!imgEnUso && nomImgABorrar === nomImgPrincipal) {
                imgEnUso = true
              }
              //
              if (imgEnUso) tostada(document.querySelector('.imgEnUsoEnArti').textContent, 4, 'color-tres')
              // Resolviendo con true se borrará la imagen
              resolve(!imgEnUso)
            })
          }
        } else {
          console.error('Se espera blogBase como penúltimo elemento de URL y artiBase como último.')
          tostada(document.querySelector('.errorLeyendoUrl').textContent, 5, 'color-tres')
        }
      })
      return view
    })
  }
}

class ImagenDeCategoria extends Plugin {
  init () {
    const editor = this.editor
    editor.ui.componentFactory.add('imagenDeCategoria', locale => {
      const view = new ButtonView(locale)
      view.set({
        label: 'Insert image',
        icon: imageIcon,
        tooltip: true
      })
      // Click en el botón
      view.on('execute', () => {
        // Si la categoría todavía no se guardó avisa y sale
        if (document.getElementById('nombreBase').value === '') {
          tostada(document.querySelector('.guardeCateParaImg').textContent, 4, 'color-tres')
          return
        }
        // Busca título para el selector de imagen si hay una label para el editor
        let etiqueta = editor.sourceElement.previousElementSibling
        let titulo = etiqueta.tagName === 'LABEL' ? etiqueta.textContent : ''
        // Muestra selector de imagen
        let url = `${urlBaseApi}/apis/wm-articulus/v1/blogs/${document.getElementById('secciones').value}/categorias/${document.getElementById('nombreBase').value}/imagenes`
        let selecImagen = new SelectorImagen(titulo, url, false) // El tercer parámetro es para no pedir confirmación al borrar una imagen
        selecImagen.mostrar().then(([ urlImg, estado ]) => {
          if (estado === 'existente' || estado === 'nueva') {
            // Muestra imagen en el editor
            editor.model.change(writer => {
              let elementoImagen = writer.createElement('image', { src: urlImg })
              editor.model.insertContent(elementoImagen, editor.model.document.selection) // Inserta imagen en el lugar del cursor
            })
          }
        }).catch(error => {
          tostada(document.querySelector('.errorSelectorImg').textContent, 4, 'color-cuatro')
          console.error(error)
        })
        // Antes de borrar una imagen del selector se verifica que la imagen no esté en uso
        selecImagen.antesDeBorrar = divImagen => {
          return new Promise(resolve => {
            let imgEnUso = false
            // Obtiene nombre de la imagen sin sufijo '/img/foto-480.jpg' >--> 'foto.jpg'
            let nomImgABorrar = divImagen.querySelector('img').src.split('/').pop()
            nomImgABorrar = nomImgABorrar.substr(0, nomImgABorrar.length - 8) + nomImgABorrar.substr(-4)
            // Convierte en DOM el contenido del editor
            let template = document.createElement('template')
            let textoHtml = editor.getData()
            textoHtml = textoHtml.trim()
            template.innerHTML = textoHtml
            // Verifica imágenes en el editor
            let imgs = template.content.querySelectorAll('img')
            for (let img of imgs) {
              if (img.src.split('/').pop() === nomImgABorrar) {
                imgEnUso = true
                break
              }
            }
            // Verifica imagen principal del artículo
            let nomImgPrincipal = document.getElementById('urlImgPrincipal').value.split('/').pop()
            if (!imgEnUso && nomImgABorrar === nomImgPrincipal) {
              imgEnUso = true
            }
            //
            if (imgEnUso) tostada(document.querySelector('.imgEnUsoEnCate').textContent, 4, 'color-tres')
            // Resolviendo con true se borrará la imagen
            resolve(!imgEnUso)
          })
        }
      })
      return view
    })
  }
}

class ImagenDeContenido extends Plugin {
  init () {
    const editor = this.editor
    editor.ui.componentFactory.add('imagenDeContenido', locale => {
      const view = new ButtonView(locale)
      view.set({
        label: 'Insert image',
        icon: imageIcon,
        tooltip: true
      })
      // Click en el botón
      view.on('execute', () => {
        // Si el contenido todavía no se guardó avisa y sale
        if (document.getElementById('idOriginal').value === '') {
          tostada(document.querySelector('.guardeConteParaImg').textContent, 4, 'color-tres')
          return
        }
        // Busca título para el selector de imagen si hay una label para el editor
        let etiqueta = editor.sourceElement.previousElementSibling
        let titulo = etiqueta.tagName === 'LABEL' ? etiqueta.textContent : ''
        // Muestra selector de imagen
        let selecImagen = new SelectorImagen(titulo, `${urlBaseApi}/apis/wm-imagen/v1/contenidos`)
        selecImagen.mostrar().then(([ urlImg, estado ]) => {
          if (estado === 'existente' || estado === 'nueva') {
            // Muestra imagen en el editor
            editor.model.change(writer => {
              let elementoImagen = writer.createElement('image', { src: urlImg })
              editor.model.insertContent(elementoImagen, editor.model.document.selection) // Inserta imagen en el lugar del cursor
            })
          }
        }).catch(error => {
          tostada(document.querySelector('.errorSelectorImg').textContent, 4, 'color-cuatro')
          console.error(error)
        })
      })
      return view
    })
  }
}

let ckOpciones = {
  language: obtenerIdiomaUrl(),
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
  }
}

export function crearEditor (elementoDom, editorPara) {
  if (editorPara === 'articuloIntro') {
    ckOpciones.plugins = [ Essentials, Bold, Italic, BlockQuote, Heading, Link, List, Paragraph ]
    ckOpciones.toolbar = ['heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo']
  } else if (editorPara === 'articuloCuerpo') {
    ckOpciones.plugins = [ Essentials, Bold, Italic, BlockQuote, Heading, Image, ImagenDeArticulo, MediaEmbed, ImageCaption, ImageStyle, ImageToolbar, Link, List, Paragraph ]
    ckOpciones.toolbar = ['heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'ImagenDeArticulo', 'mediaEmbed', 'blockQuote', 'undo', 'redo']
    ckOpciones.mediaEmbed = {
      previewsInData: true,
      removeProviders: [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
    }
  } else if (editorPara === 'categoria') {
    ckOpciones.plugins = [ Essentials, Bold, Italic, BlockQuote, Heading, Image, ImagenDeCategoria, MediaEmbed, ImageCaption, ImageStyle, ImageToolbar, Link, List, Paragraph ]
    ckOpciones.toolbar = ['heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'ImagenDeCategoria', 'mediaEmbed', 'blockQuote', 'undo', 'redo']
    ckOpciones.mediaEmbed = {
      previewsInData: true,
      removeProviders: [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
    }
  } else if (editorPara === 'seccion' || editorPara === 'autor') {
    ckOpciones.plugins = [ Essentials, Bold, Italic, BlockQuote, Heading, Link, List, Paragraph ]
    ckOpciones.toolbar = ['heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo']
  } else if (editorPara === 'contenido') {
    ckOpciones.plugins = [ Essentials, Bold, Italic, BlockQuote, Heading, Image, ImagenDeContenido, MediaEmbed, ImageCaption, ImageStyle, ImageToolbar, Link, List, Paragraph ]
    ckOpciones.toolbar = ['heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'ImagenDeContenido', 'mediaEmbed', 'blockQuote', 'undo', 'redo']
    ckOpciones.mediaEmbed = {
      previewsInData: true,
      removeProviders: [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
    }
  }

  return ClassicEditor.create(elementoDom, ckOpciones)
}
