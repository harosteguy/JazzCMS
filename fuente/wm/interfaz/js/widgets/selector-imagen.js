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

import { obtenerIdiomaUrl, esperaAjax } from '../modulos/comun'
import tostada from './tostada'

export default class SelectorImagen {
  constructor (titulo, url, confirmarEliminar = true) {
    this.divSelector = document.getElementById('widgetSelectorImagen').cloneNode(true)// Crea un clon para usar como selector
    this.divSelector.id = 'selectorImagen'// Lo identifica para manejo externo
    this.divImagenes = this.divSelector.querySelector('.imagenes')
    this.titulo = titulo
    this.url = url
    this.idioma = obtenerIdiomaUrl()
    this.headerAuth = 'Basic ' + window.btoa(window.localStorage.getItem('uid') + ':' + window.localStorage.getItem('token'))
    this.reqHeaders = { 'Authorization': this.headerAuth, 'Accept-Language': this.idioma }
    this.confirmarEliminar = confirmarEliminar
    this.antesDeBorrar = divImagen => Promise.resolve(true) // Función antes de borrar debe retornar una promesa que se resuelva con true para confirmar el borrado
    this.despuesDeBorrar = divImagen => {}
  }

  mostrar () {
    return new Promise((resolve, reject) => {
      // Si hay un selector en document se elimina
      if (document.getElementById('selectorImagen')) {
        document.getElementById('selectorImagen').remove()
      }
      // Título del selector
      this.divSelector.querySelector('.titulo').textContent = this.titulo
      // Obtiene set de imágenes de la API en this.url y las agrega al selector
      esperaAjax(true, 'obtenerImagenes')
      window.fetch(this.url, { method: 'get', headers: this.reqHeaders })
        .then(respuesta => respuesta.json())
        .then(imgs => {
          if (imgs.error) throw new Error(imgs.error)
          let clonImagen
          imgs.forEach(img => {
            // Usa la imagen mas chica
            // Ver sufijos que retorna la petición. console.log( img )
            if (img.substr(-8, 4) === '-480') {
              clonImagen = this.divSelector.querySelector('.plantilla.imagen').cloneNode(true)
              clonImagen.querySelector('img').src = img
              clonImagen.classList.remove('plantilla')
              this.divImagenes.insertBefore(clonImagen, this.divSelector.querySelector('.agregar'))
            }
          })
          // Muestra
          document.getElementById('selectorImagenModal').appendChild(this.divSelector)
          this.divSelector.classList.remove('plantilla')
          document.getElementById('selectorImagenModal').classList.add('visible')
          esperaAjax(false, 'obtenerImagenes')
        })
        .catch(error => {
          console.error(error)
          esperaAjax(false, 'obtenerImagenes')
          reject(error)
        })
      // Escuchador de click
      let escuchaClick = evento => {
        if (evento.target.tagName === 'IMG') { // Resuelve con la imagen seleccionada
          // this.divSelector.removeEventListener('click', escuchaClick) // Quita escuchadores
          // this.divSelector.querySelector('.inputImagen').removeEventListener('change', escuchaInputImgChange)
          document.getElementById('selectorImagenModal').removeEventListener('click', escuchaClick) // Quita escuchadores
          document.getElementById('selectorImagenModal').removeEventListener('change', escuchaInputImgChange)

          this.divSelector.remove() // Elimina selector del DOM
          document.getElementById('selectorImagenModal').classList.remove('visible')
          // Quita sufijo al nombre de la imagen '/img/foto-480.jpg' >--> '/img/foto.jpg'
          let imgSrc = evento.target.src.substr(0, evento.target.src.length - 8) + evento.target.src.substr(-4)
          //
          resolve([ imgSrc, 'existente' ])
        } else if (evento.target.classList.contains('cerrar')) { // Cierra el widget
          // this.divSelector.removeEventListener('click', escuchaClick) // Quita escuchadores
          // this.divSelector.querySelector('.inputImagen').removeEventListener('change', escuchaInputImgChange)
          document.getElementById('selectorImagenModal').removeEventListener('click', escuchaClick) // Quita escuchadores
          document.getElementById('selectorImagenModal').removeEventListener('change', escuchaInputImgChange)

          this.divSelector.remove() // Elimina selector del DOM
          document.getElementById('selectorImagenModal').classList.remove('visible')
          resolve([ '', '' ])
        } else if (evento.target.classList.contains('quitar')) {
          if (this.confirmarEliminar) {
            evento.target.nextElementSibling.classList.remove('oculto') // Pide confirmación para borrar imagen
          } else {
            this.borrarImagen(evento.target.parentElement) // Borra pasando el contenedor de la imagen
          }
        } else if (evento.target.classList.contains('cancelar')) { // Cancela confirmación para borrar imagen
          evento.target.parentElement.classList.add('oculto')
        } else if (evento.target.classList.contains('borrar')) { // Borra imagen
          this.borrarImagen(evento.target.parentElement.parentElement) // Pasa el contenedor de la imagen
        }
      }
      // Escuchador de change para el input file
      let escuchaInputImgChange = evento => {
        let inputImagen = this.divSelector.querySelector('.inputImagen')
        this.divSelector.querySelector('.agregar .mas').classList.add('oculto') // Oculta icono de agragar
        this.divSelector.querySelector('.agregar .trompo').classList.remove('oculto') // Muestra spinner
        inputImagen.style.pointerEvents = 'none' // Deshabilita eventos
        //
        let req = new window.XMLHttpRequest()
        let formData = new window.FormData()
        formData.append('imagen', inputImagen.files[0])
        req.onreadystatechange = () => {
          if (req.readyState === 4) {
            // this.divSelector.removeEventListener('click', escuchaClick) // Quita escuchadores
            // this.divSelector.querySelector('.inputImagen').removeEventListener('change', escuchaInputImgChange)
            document.getElementById('selectorImagenModal').removeEventListener('click', escuchaClick) // Quita escuchadores
            document.getElementById('selectorImagenModal').removeEventListener('change', escuchaInputImgChange)

            this.divSelector.remove() // Elimina selector del DOM
            document.getElementById('selectorImagenModal').classList.remove('visible')
            if (req.status === 200) {
              let data = JSON.parse(req.responseText)
              resolve([ data.url, 'nueva' ])
            } else {
              let error = JSON.parse(req.responseText)
              console.error(error)
              reject(new Error(error.error))
            }
          }
        }
        req.open('POST', this.url)
        req.setRequestHeader('Authorization', this.headerAuth)
        req.setRequestHeader('Accept-Language', this.idioma)
        req.send(formData)
      }
      // Agrega escuchadores
      document.getElementById('selectorImagenModal').addEventListener('click', escuchaClick)
      document.getElementById('selectorImagenModal').addEventListener('change', escuchaInputImgChange)
    })
  }

  borrarImagen (divImg) {
    this.antesDeBorrar(divImg).then(borrar => {
      if (borrar) {
        // Spinner
        divImg.querySelector('.borrar').classList.add('oculto') // Oculta botón borrar
        divImg.querySelector('.cancelar').classList.add('oculto') // y cancelar
        divImg.querySelector('.trompo').classList.remove('oculto') // Muestra spinner
        // Obtiene nombre de la imagen sin sufijo '/img/foto-480.jpg' >--> 'foto.jpg'
        let srcImg = divImg.querySelector('img').src
        let nombreImg = srcImg.split('/').pop()
        nombreImg = nombreImg.substr(0, nombreImg.length - 8) + nombreImg.substr(-4)
        // Borra en el servidor
        window.fetch(this.url + '/' + nombreImg, { method: 'delete', headers: this.reqHeaders })
          .then(respuesta => {
            if (respuesta.status !== 200 && respuesta.status !== 204) return respuesta.json()
            return {}
          })
          .then(img => {
            if (img.error) {
              tostada(document.querySelector('.errorBorrandoImg').textContent, 4, 'color-cuatro')
              // No spinner
              divImg.querySelector('.borrar').remove('oculto') // Muestra botón borrar
              divImg.querySelector('.cancelar').classList.remove('oculto') // y cancelar
              divImg.querySelector('.trompo').classList.add('oculto') // Oculta spinner
            } else {
              this.despuesDeBorrar(divImg)
              divImg.remove() // Quita la imagen del widget
            }
          })
          .catch(error => {
            // No spinner
            divImg.querySelector('.borrar').remove('oculto') // Muestra botón borrar
            divImg.querySelector('.cancelar').classList.remove('oculto') // y cancelar
            divImg.querySelector('.trompo').classList.add('oculto') // Oculta spinner
            console.error(error)
          })
      }
    })
      .catch(error => {
        console.error(error)
      })
  }
}
