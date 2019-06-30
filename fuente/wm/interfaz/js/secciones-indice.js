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

import '../estilo/secciones-indice.scss'
import chorrear from './modulos/chorro-sw-cache'
import * as comun from './modulos/comun'
import { getFechaCorta, fechaHora2horaMinutos, fechaHoraDb } from './modulos/utiles'
import { botonera, ListaSelect } from './modulos/formularios'
import tostada from './widgets/tostada'
import flatpickr from 'flatpickr'
// import '../../../../node_modules/flatpickr/dist/l10n/es'
import { Spanish } from '../../../../node_modules/flatpickr/dist/l10n/es'
import '../../../../node_modules/flatpickr/dist/themes/material_blue.css'
//
comun.registrarServiceWorker().catch(error => { console.error(error.message) })
comun.setIdiomaPagina()
let idioma = comun.obtenerIdiomaUrl()
let idiomaUrl = idioma === comun.setIdiomas[0] ? '' : idioma + '/'

comun.mostrarUsuario().then(usr => {
  if (usr.esAdmin === 1) {
    hacer()
    document.querySelector('.grupo.autor').classList.remove('oculto')
  } else {
    // Comprueba si es un autor activo
    let headerAuth = 'Basic ' + window.btoa(window.sessionStorage.getItem('uid') + ':' + window.sessionStorage.getItem('token'))
    let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma }
    window.fetch(`${comun.getUrlBaseApi()}/apis/wm-articulus/v1/autores/`, { method: 'get', headers: reqHeaders })
      .then(respuesta => {
        if (respuesta.status !== 200) {
          throw new Error('El status no es 200')
        }
        return respuesta.text()
      })
      .then(autor => {
        autor = JSON.parse(autor)
        if (autor.autorActivo) {
          hacer()
        } else {
          throw new Error('No es un autor activo')
        }
      })
      .catch(error => {
        window.sessionStorage.removeItem('uid')
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('nombre')
        window.sessionStorage.removeItem('apellido')
        window.sessionStorage.removeItem('esAdmin')
        window.location.href = `/${idiomaUrl}`
        console.log(error, 1)
      })
  }
})
  .catch(error => {
    window.sessionStorage.removeItem('uid')
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('nombre')
    window.sessionStorage.removeItem('apellido')
    window.sessionStorage.removeItem('esAdmin')
    window.location.href = `/${idiomaUrl}wm/usuario/login/`
    console.log(error, 2)
  })

//
function hacer () {
  chorrear(() => {
    comun.esperaAjax(false, 'cargapagina')
  })
  comun.menuLateral.iniciar()
  botonera.iniciar(document.getElementById('ordenCampo'), 'crono')
  botonera.iniciar(document.getElementById('ordenDir'), 'desc')
  botonera.iniciar(document.getElementById('filtroEstado'), 'todos')
  comun.setLinkIdioma()
  document.querySelector('.menu-lateral .secciones-indice').classList.add('activo')
  if (idioma === 'es') {
    flatpickr.localize(Spanish)
  }
  flatpickr(document.getElementById('desde'), {
    enableTime: false,
    allowInput: false,
    dateFormat: 'd/m/Y',
    enableSeconds: false
  })
  flatpickr(document.getElementById('hasta'), {
    enableTime: false,
    allowInput: false,
    dateFormat: 'd/m/Y',
    enableSeconds: false
  })
  let headerAuth = 'Basic ' + window.btoa(window.sessionStorage.getItem('uid') + ':' + window.sessionStorage.getItem('token'))
  let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma }
  let listaSecciones, blogBase

  // Obtiene secciones
  comun.esperaAjax(true, 'secciones')
  window.fetch(`${comun.getUrlBaseApi()}/apis/wm-articulus/v1/blogs`, { method: 'get', headers: reqHeaders })
    .then(respuesta => respuesta.json())
    .then(secciones => {
      if (secciones.length > 0) {
        listaSecciones = new ListaSelect(document.getElementById('listaSecciones'), listaOnClick)
        listaSecciones.poblar(secciones, { nombreClave: 'nombreUrl', nombreValor: 'nombre' })
        let seleccion = listaSecciones.seleccionar(0)
        document.querySelector('h1 .seccion').textContent = '"' + seleccion.valor + '"'
        document.querySelector('.buscador .control').placeholder = document.querySelector('.buscarEn').textContent + ' "' + seleccion.valor + '"'
        listar()
        // Obtiene categorías de la sección
        blogBase = listaSecciones.seleccionado().clave
        return window.fetch(`${comun.getUrlBaseApi()}/apis/wm-articulus/v1/blogs/${blogBase}/categorias`, { method: 'get', headers: reqHeaders })
      } else { // El usuario no tiene permisos en ningún blog o no hay secciones cargadas
        window.location.href = `/${idiomaUrl}wm`
      }
    })
    .then(respuesta => respuesta.json())
    .then(categorias => {
      let selCat = document.getElementById('filtroCategoria')
      let optCat
      categorias.forEach(cat => {
        optCat = document.createElement('option')
        optCat.value = cat.id
        optCat.textContent = cat.nombre
        selCat.appendChild(optCat)
      })
      // Autores para el admin
      if (window.sessionStorage.getItem('esAdmin') === '1') {
        return window.fetch(`${comun.getUrlBaseApi()}/apis/wm-articulus/v1/autores?blogBase=${blogBase}`, { method: 'get', headers: reqHeaders })
      }
      comun.esperaAjax(false, 'secciones')
    })
    .then(respuesta => {
      if (respuesta) {
        return respuesta.json()
      }
    })
    .then(autores => {
      if (autores) {
        let selAutor = document.getElementById('filtroAutor')
        let optAutor
        autores.forEach(autor => {
          optAutor = document.createElement('option')
          optAutor.value = autor.uid
          optAutor.textContent = autor.nombreAutor
          selAutor.appendChild(optAutor)
        })
      }
      comun.esperaAjax(false, 'secciones')
    })
    .catch(error => {
      console.error(error)
    })

  function listaOnClick (claveValor) {
    document.querySelector('h1 .tit').textContent = document.querySelector('.artisEn').textContent
    document.querySelector('h1 .seccion').textContent = '"' + claveValor.valor + '"'
    document.querySelector('.buscador .control').placeholder = document.querySelector('.buscarEn').textContent + ' "' + claveValor.valor + '"'
    // Actualiza select de categorías
    window.fetch(`${comun.getUrlBaseApi()}/apis/wm-articulus/v1/blogs/${claveValor.clave}/categorias`, { method: 'get', headers: reqHeaders })
      .then(respuesta => respuesta.json())
      .then(categorias => {
        let selCat = document.getElementById('filtroCategoria')
        let options = selCat.querySelectorAll('option')
        let optCat
        // Elimina options
        let i = options.length
        while (--i) options.item(i).remove() // Deja solo el primer option
        // Agrega options
        categorias.forEach(cat => {
          optCat = document.createElement('option')
          optCat.value = cat.id
          optCat.textContent = cat.nombre
          selCat.appendChild(optCat)
        })
        // Autores para el admin
        if (window.sessionStorage.getItem('esAdmin') === '1') {
          return window.fetch(`${comun.getUrlBaseApi()}/apis/wm-articulus/v1/autores?blogBase=${claveValor.clave}`, { method: 'get', headers: reqHeaders })
        }
      })
      .then(respuesta => respuesta.json())
      .then(autores => {
        if (autores) {
          let selAutor = document.getElementById('filtroAutor')
          let options = selAutor.querySelectorAll('option')
          let optAutor
          // Elimina options
          let i = options.length
          while (--i) options.item(i).remove() // Deja solo el primer option
          // Agrega options
          autores.forEach(autor => {
            optAutor = document.createElement('option')
            optAutor.value = autor.uid
            optAutor.textContent = autor.nombreAutor
            selAutor.appendChild(optAutor)
          })
        }
        //
        listar()
        //
      })
  }

  //
  function listarArticulos (url) {
    return new Promise((resolve, reject) => {
      comun.esperaAjax(true, 'listarArtis')
      window.fetch(url, { method: 'get', headers: reqHeaders })
        .then(respuesta => respuesta.json())
        .then(artis => {
          if (artis.articulos.length > 0) {
            artis.articulos.forEach(arti => {
              let articulo = document.querySelector('#listaArtis .plantilla').cloneNode(true)
              let blogBase = listaSecciones.seleccionado().clave
              articulo.querySelector('.editar').href = `/${idiomaUrl}wm/secciones/articulo/${blogBase}/${arti.tituloUrl}`
              articulo.querySelector('.titulo').href = `/${idiomaUrl}wm/secciones/articulo/${blogBase}/${arti.tituloUrl}`
              articulo.querySelector('.titulo').textContent = arti.titulo
              articulo.querySelector('.fecha').innerHTML = getFechaCorta(new Date(arti.fechaPublicado), idioma)
              articulo.querySelector('.fecha').innerHTML += `<br><span class="hora">${fechaHora2horaMinutos(arti.fechaPublicado)}</span>`
              articulo.querySelector('.autor').textContent = arti.autor
              document.querySelector('#listaArtis .lista').appendChild(articulo)
              articulo.classList.remove('plantilla')
            })
          }
          if (artis.paginacion.siguiente) {
            document.querySelector('#listaArtis .verMas').classList.remove('oculto')
          } else {
            document.querySelector('#listaArtis .verMas').classList.add('oculto')
          }
          document.querySelector('#listaArtis .verMas').dataset.url = comun.getUrlBaseApi() + artis.paginacion.siguiente
          //
          document.getElementById('totResultados').textContent = artis.paginacion.articulos
          comun.esperaAjax(false, 'listarArtis')
          resolve(artis.articulos.length)
        })
        .catch(error => {
          comun.esperaAjax(false, 'listarArtis')
          reject(error)
        })
    })
  }

  document.querySelector('#listaArtis .verMas').addEventListener('click', () => {
    listarArticulos(document.querySelector('#listaArtis .verMas').dataset.url)
  })

  // Buscador
  document.querySelector('.buscador .buscar').addEventListener('click', () => {
    let textoBusca = document.querySelector('.buscador .texto').value
    if (textoBusca !== '') listar()
  })
  document.querySelector('.buscador .texto').addEventListener('keyup', (evento) => {
    if (evento.keyCode === 13) {
      let textoBusca = document.querySelector('.buscador .texto').value
      if (textoBusca !== '') listar()
    }
  })
  document.getElementById('verTodos').addEventListener('click', () => {
    document.querySelector('.buscador .texto').value = ''
    listar()
  })

  // Limpia campos de fecha readonly
  document.querySelector('.grupo.desde .boton').addEventListener('click', () => {
    document.getElementById('desde').value = ''
    listar()
  })
  document.querySelector('.grupo.hasta .boton').addEventListener('click', () => {
    document.getElementById('hasta').value = ''
    listar()
  })

  //
  document.getElementById('filtroCategoria').addEventListener('change', () => { listar() })

  document.getElementById('desde').addEventListener('change', () => { listar() })

  document.getElementById('hasta').addEventListener('change', () => { listar() })

  document.getElementById('filtroAutor').addEventListener('change', () => { listar() })

  document.getElementById('filtroEstado').addEventListener('click', () => { listar() })

  document.getElementById('ordenCampo').addEventListener('click', () => { listar() })

  document.getElementById('ordenDir').addEventListener('click', () => { listar() })

  function listar () {
    let blogBase = listaSecciones.seleccionado().clave
    if (blogBase) {
      let ordenCampo = botonera.leer(document.getElementById('ordenCampo')) === 'alfa' ? 'alfa' : 'crono'
      let ordenDir = botonera.leer(document.getElementById('ordenDir')) === 'asc' ? 'asc' : 'desc'
      let url = `${comun.getUrlBaseApi()}/apis/wm-articulus/v1/blogs/${blogBase}/articulos/?orden=${ordenCampo}&ordenDir=${ordenDir}&porPag=20`
      //
      let textoBusca = document.querySelector('.buscador .texto').value
      if (textoBusca !== '') {
        url += `&busqueda=${textoBusca}`
        document.getElementById('verTodos').style.display = 'block'
        document.querySelector('h1 .tit').textContent = document.querySelector('.busquedaEn').textContent // Texto en idioma para título
      } else {
        document.getElementById('verTodos').style.display = 'none'
        document.querySelector('h1 .tit').textContent = document.querySelector('.artisEn').textContent
      }
      //
      let idCat = document.getElementById('filtroCategoria').value
      if (idCat !== '') {
        url += `&idCat=${idCat}`
      }
      //
      let desde = document.getElementById('desde').value
      if (desde !== '') {
        desde = encodeURIComponent(fechaHoraDb(desde + ' 00:00:00'))
        url += `&desde=${desde}`
      }
      //
      let hasta = document.getElementById('hasta').value
      if (hasta !== '') {
        hasta = encodeURIComponent(fechaHoraDb(hasta + ' 00:00:00'))
        url += `&hasta=${hasta}`
      }
      //
      let idAutor = document.getElementById('filtroAutor').value
      if (idAutor !== '') {
        url += `&idAutor=${idAutor}`
      }
      //
      let filtroEstado = botonera.leer(document.getElementById('filtroEstado'))
      if (filtroEstado !== 'todos') {
        url += `&estado=${filtroEstado}`
      }
      //
      let artis = document.querySelectorAll('#listaArtis .lista .articulo')
      for (var arti of artis) document.querySelector('#listaArtis .lista').removeChild(arti) // Vacía la lista
      //
      listarArticulos(url).then(totListados => {
        if (totListados === 0) {
          if (textoBusca !== '') {
            // No hay resultados para esa búsqueda en la sección actual
            tostada(document.querySelector('.noResulBusca').textContent, 4, 'color-tres')
          } else {
            // No hay artículos en la sección actual
            tostada(document.querySelector('.noArtis').textContent, 4, 'color-uno')
          }
        }
      }).catch(error => { console.error(error) })
    }
  }
}
