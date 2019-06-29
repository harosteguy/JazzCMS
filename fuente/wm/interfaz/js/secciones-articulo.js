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

import '../estilo/secciones-articulo.scss'
import chorrear from './modulos/chorro'
import * as comun from './modulos/comun'
import { dispararEvento, dbFechaHora, fechaHoraDb, scrollIt } from './modulos/utiles'
import { emergente } from './modulos/emergente'
import { checkbox, multiSelect } from './modulos/formularios'
import tostada from './widgets/tostada'
import * as wmCkEditor from './modulos/ckeditor'
import SelectorImagen from './widgets/selector-imagen'
import flatpickr from 'flatpickr'
import { Spanish } from '../../../../node_modules/flatpickr/dist/l10n/es'

require('../../../../node_modules/flatpickr/dist/themes/material_blue.css')
//
comun.registrarServiceWorker().catch(error => { console.error(error.message) })
comun.setIdiomaPagina()
let idioma = comun.obtenerIdiomaUrl()
let idiomaUrl = idioma === comun.setIdiomas[0] ? '' : idioma + '/'

comun.mostrarUsuario().then(usr => {
  if (usr.esAdmin === 1) {
    hacer()
  } else {
    // Comprueba si es un autor activo
    let headerAuth = 'Basic ' + window.btoa(window.sessionStorage.getItem('uid') + ':' + window.sessionStorage.getItem('token'))
    let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma }
    window.fetch(`${comun.getUrlBaseApi()}/apis/wm-articulus/v1/autores/`, { method: 'get', headers: reqHeaders })
      .then(respuesta => {
        if (respuesta.status !== 200) {
          throw new Error('El status no es 200')
        }
        return respuesta.json()
      })
      .then(autor => {
        if (autor.autorActivo) {
          hacer()
        } else {
          throw new Error('No es un autor activo')
        }
      })
      .catch(error => {
        console.error(error)
        window.sessionStorage.removeItem('uid')
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('nombre')
        window.sessionStorage.removeItem('apellido')
        window.sessionStorage.removeItem('esAdmin')
        window.location.href = `/${idiomaUrl}`
      })
  }
})
  .catch(error => {
    console.error(error)
    window.sessionStorage.removeItem('uid')
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('nombre')
    window.sessionStorage.removeItem('apellido')
    window.sessionStorage.removeItem('esAdmin')
    window.location.href = `/${idiomaUrl}wm/usuario/login/`
  })

//
function hacer () {
  let dataOriginal // Variable para verificar si se modificaron datos al abandonar la página
  chorrear(() => {
    comun.esperaAjax(false, 'cargapagina') // Muestra la página con los contenidos mínimos cargados
  })
  comun.menuLateral.iniciar()
  comun.setLinkIdioma() // Selector de idioma
  document.querySelector('.menu-lateral .secciones-articulo').classList.add('activo')
  checkbox.iniciar() // Checkboxes personalizados
  // Obtiene de la URL nombre base del artículo y del blog
  let partes = document.location.pathname.split('/')
  if (partes[ partes.length - 1 ] === '') { // Si la URL temina en barra el último elemento del array estará vacío
    partes.pop() // entonces lo elimina
  }
  let artiBase, blogBase
  if (partes.length === 6 || partes.length === 7) { // URL sin y con idioma
    artiBase = partes[ partes.length - 1 ]
    blogBase = partes[ partes.length - 2 ]
  } else {
    artiBase = ''
    blogBase = ''
  }
  // Valores para peticiones a la API
  let headerAuth = 'Basic ' + window.btoa(window.sessionStorage.getItem('uid') + ':' + window.sessionStorage.getItem('token'))

  let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma }

  let urlApi = `${comun.getUrlBaseApi()}/apis/wm-articulus/v1/blogs/`

  // Categorias
  multiSelect.iniciar(document.getElementById('categorias'))
  // Selector de fecha
  if (idioma === 'es') {
    flatpickr.localize(Spanish)
  }
  flatpickr(document.getElementById('fechaPublicado'), {
    enableTime: true,
    allowInput: true,
    dateFormat: 'd/m/Y H:i:S',
    enableSeconds: true
  })
  flatpickr(document.getElementById('auxFecha'), {
    enableTime: true,
    allowInput: true,
    dateFormat: 'd/m/Y H:i:S',
    enableSeconds: true
  })
  // Editor HTML
  let ckEditores = []
  wmCkEditor.crearEditor(document.getElementById('entradilla'), 'articuloIntro')
    .then(editor => {
      ckEditores['entradilla'] = editor
      return wmCkEditor.crearEditor(document.getElementById('texto'), 'articuloCuerpo')
    }).then(editor => {
      ckEditores['texto'] = editor
      //
      dataOriginal = recogerDatos()
      // Obtiene blogs
      return window.fetch(urlApi, { method: 'get', headers: reqHeaders })
    })
    .then(respuesta => respuesta.json())
    .then(listaBlogs => {
      if (listaBlogs.length > 0) {
        var opt; var selBlog = document.getElementById('secciones')
        listaBlogs.forEach(blog => {
          opt = document.createElement('option')
          opt.setAttribute('value', blog.nombreUrl)
          opt.innerText = blog.nombre
          selBlog.appendChild(opt)
        })
      } else { // El usuario no tiene permisos en ningún blog
        window.sessionStorage.removeItem('uid')
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('nombre')
        window.sessionStorage.removeItem('apellido')
        window.sessionStorage.removeItem('esAdmin')
        window.location.href = `/${idiomaUrl}`
        throw new Error('Usuario no autorizado.')
      }
      if (artiBase && blogBase) {
        mostrarArticulo(blogBase, artiBase)
      }
    }).catch(error => {
      console.error(error)
    })

  //
  function mostrarArticulo (blogBase, artiBase) {
    comun.esperaAjax(true, 'obtenerArti')
    window.fetch(urlApi + blogBase + '/articulos/' + artiBase, { method: 'get', headers: reqHeaders })
      .then(respuesta => respuesta.json())
      .then(arti => {
        // Actualiza URL
        window.history.pushState(null, null, `/${idiomaUrl}wm/secciones/articulo/${blogBase}/${artiBase}`)
        // Blog del artículo
        document.getElementById('secciones').value = blogBase
        document.getElementById('secciones').disabled = true
        // Options de categoría
        arti.aux.categorias.unshift({ id: 0, nombre: ' ' })
        multiSelect.reiniciar(document.getElementById('categorias'), arti.aux.categorias)
        // Artículo
        document.getElementById('tituloUrlOriginal').value = arti.tituloUrl
        document.getElementById('tituloUrl').value = arti.tituloUrl
        document.getElementById('copete').value = arti.copete
        document.getElementById('titulo').value = arti.titulo
        ckEditores['entradilla'].setData(arti.entradilla)
        ckEditores['texto'].setData(arti.texto)
        // Categorías del articulo
        let idsCat = arti.categorias.map(cat => cat.id)
        multiSelect.escribir(document.getElementById('categorias'), idsCat)
        // Fecha
        document.getElementById('fechaPublicado').value = arti.fechaPublicado ? dbFechaHora(arti.fechaPublicado) : ''
        // Publicado o borrador
        document.getElementById('publicado').checked = arti.publicado === 1
        dispararEvento(document.getElementById('publicado'), 'change') // Actualiza estado del checkbox
        // Imagen principal
        if (arti.imgPrincipal !== '') {
          document.querySelector('.imgPrincipal .foto').src = arti.imgPrincipal
          document.getElementById('urlImgPrincipal').value = arti.imgPrincipal
          document.querySelector('.imgPrincipal .quitar').classList.remove('oculto')
        }
        // Datos auxiliares
        document.getElementById('auxTexto').value = arti.auxTexto
        document.getElementById('auxFecha').value = arti.auxFecha ? dbFechaHora(arti.auxFecha) : ''
        document.getElementById('auxEntero').value = arti.auxEntero
        document.getElementById('auxDecimal').value = arti.auxDecimal
        // Guarda para verificar si se modificaron datos al abandonar la página
        dataOriginal = recogerDatos()
        comun.esperaAjax(false, 'obtenerArti')
      })
      .catch(error => {
        comun.esperaAjax(false, 'obtenerArti')
        console.error(error)
      })
  }

  // Recoger datos del formulario para enviar
  function recogerDatos () {
    return {
      copete: document.getElementById('copete').value,
      titulo: document.getElementById('titulo').value,
      tituloUrl: document.getElementById('tituloUrl').value,
      entradilla: ckEditores['entradilla'].getData(),
      texto: ckEditores['texto'].getData(),
      publicado: (document.getElementById('publicado').checked ? 1 : 0),
      fechaPublicado: fechaHoraDb(document.getElementById('fechaPublicado').value),
      idsCat: multiSelect.leer(document.getElementById('categorias')),
      imgPrincipal: document.getElementById('urlImgPrincipal').value,
      auxTexto: document.getElementById('auxTexto').value,
      auxFecha: fechaHoraDb(document.getElementById('auxFecha').value),
      auxEntero: document.getElementById('auxEntero').value,
      auxDecimal: document.getElementById('auxDecimal').value
    }
  }
  // Actualiza select categorías al seleccionar blog
  document.getElementById('secciones').addEventListener('change', () => {
    comun.esperaAjax(true, 'actualiCat')
    let blogBase = document.getElementById('secciones').value
    window.fetch(urlApi + blogBase + '/categorias/', { method: 'get', headers: reqHeaders })
      .then(respuesta => respuesta.json())
      .then(categorias => {
        categorias.unshift({ id: 0, nombre: ' ' })
        multiSelect.reiniciar(document.getElementById('categorias'), categorias)
        comun.esperaAjax(false, 'actualiCat')
      })
      .catch(error => {
        comun.esperaAjax(false, 'obtenerArti')
        console.error(error)
      })
  })

  // Limpia editor
  document.getElementById('nuevo').addEventListener('click', () => {
    comun.continuarSinGuardar(dataOriginal, recogerDatos()).then(continuar => {
      if (continuar) limpiarEditor()
    }).catch(error => { console.error(error) })
  })
  function limpiarEditor () {
    window.history.pushState(null, null, `/${idiomaUrl}wm/secciones/articulo/`)// Actualiza URL
    document.getElementById('tituloUrlOriginal').value = ''
    document.getElementById('copete').value = ''
    document.getElementById('titulo').value = ''
    document.getElementById('tituloUrl').value = ''
    ckEditores['entradilla'].setData('')
    ckEditores['texto'].setData('')
    document.getElementById('secciones').disabled = false
    document.getElementById('secciones').value = ''
    multiSelect.reiniciar(document.getElementById('categorias'))
    document.getElementById('fechaPublicado').value = ''
    document.getElementById('publicado').checked = false
    dispararEvento(document.getElementById('publicado'), 'change')// Actualiza estado del checkbox personalizado
    document.querySelector('.imgPrincipal .foto').src = '/wm/interfaz/img/sin_foto.jpg'
    document.querySelector('.imgPrincipal .quitar').classList.add('oculto')
    document.getElementById('urlImgPrincipal').value = ''
    document.getElementById('auxTexto').value = ''
    document.getElementById('auxFecha').value = ''
    document.getElementById('auxEntero').value = ''
    document.getElementById('auxDecimal').value = ''
    scrollIt(document.getElementsByTagName('body')[0], 400, 'easeOutQuad', () => {
      document.getElementById('titulo').focus()
    })
    dataOriginal = recogerDatos()
  }

  // Selecciona imagen principal
  document.querySelector('.imgPrincipal .selector').addEventListener('click', () => {
    // Si el artículo todavía no se guardó avisa y sale
    if (document.getElementById('tituloUrlOriginal').value === '') {
      tostada(document.querySelector('.guardeArtiParaImg').textContent, 4, 'color-tres')
      return
    }
    // Título para el selector de imagen
    let titulo = document.querySelector('.imgPrincipal label').textContent
    // Obtiene del URL nombre base del artículo y del blog o sección
    let partes = document.location.pathname.split('/')
    if (partes[ partes.length - 1 ] === '') {
      partes.pop() // Si la URL temina en barra el último elemento del array estará vacío. Se descarta.
    }
    if (partes.length === 6 || partes.length === 7) { // URL sin y con idioma
      let artiBase = partes[ partes.length - 1 ]
      let blogBase = partes[ partes.length - 2 ]
      let url = `${urlApi}${blogBase}/articulos/${artiBase}/imagenes`
      // Muestra selector de imagen
      let selecImagen = new SelectorImagen(titulo, url, false) // El tercer parámetro es para no pedir confirmación al borrar una imagen
      selecImagen.mostrar().then(([ urlImg, estado ]) => {
        if (estado === 'existente' || estado === 'nueva') {
          // Muestra imagen principal
          document.querySelector('.imgPrincipal .foto').src = urlImg
          document.querySelector('.imgPrincipal .quitar').classList.remove('oculto')
          document.getElementById('urlImgPrincipal').value = urlImg
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
          let textoHtml = ckEditores['texto'].getData()
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

  // Quita imagen principal
  document.querySelector('.imgPrincipal .quitar').addEventListener('click', () => {
    document.querySelector('.imgPrincipal .foto').src = '/wm/interfaz/img/sin_foto.jpg'
    document.querySelector('.imgPrincipal .quitar').classList.add('oculto')
    document.getElementById('urlImgPrincipal').value = ''
  })

  // Guardar artículo
  document.getElementById('guardar').addEventListener('click', () => {
    guardarArticulo()
  })

  function guardarArticulo () {
    comun.esperaAjax(true, 'guardarArti')
    // Verifica selección de blog
    let blogBase = document.getElementById('secciones').value
    if (blogBase === '') {
      tostada(document.querySelector('.faltaSeccion').textContent, 4, 'color-tres')
      scrollIt(document.getElementsByTagName('body')[0], 300, 'easeOutQuad')
      document.getElementById('secciones').focus()
      comun.esperaAjax(false, 'guardarArti')
      return
    }
    // Recoge datos del formulario
    let arti = recogerDatos()
    // Verifica título
    if (arti.titulo === '') {
      tostada(document.querySelector('.faltaTitulo').textContent, 4, 'color-tres')
      scrollIt(document.getElementsByTagName('body')[0], 300, 'easeOutQuad')
      document.getElementById('titulo').focus()
      comun.esperaAjax(false, 'guardarArti')
      return
    }
    dataOriginal = arti // Guarda para verificar si se modificaron datos al abandonar la página
    // Método
    let metodo = document.getElementById('tituloUrlOriginal').value === '' ? 'post' : 'put'
    //
    let url = urlApi + blogBase + '/articulos/' + document.getElementById('tituloUrlOriginal').value
    window.fetch(url, { method: metodo, headers: reqHeaders, body: JSON.stringify(arti) })
      .then(respuesta => respuesta.json())
      .then(resArti => {
        if (resArti.error) {
          comun.esperaAjax(false, 'guardarArti')
          // tostada( document.querySelector('.errorGuardandoArti').textContent, 4, 'color-cuatro');
          tostada(resArti.error, 4, 'color-cuatro')
          console.error(resArti.error)
          return
        }
        limpiarEditor()
        // Muestra artículo actualizado
        let partes = resArti.url.split('/')
        let artiBase = partes[ partes.length - 1 ]
        mostrarArticulo(blogBase, artiBase)
        comun.esperaAjax(false, 'guardarArti')
        tostada(document.querySelector('.okGuardado').textContent, 4, 'color-dos')
      })
      .catch(error => {
        comun.esperaAjax(false, 'guardarArti')
        tostada(document.querySelector('.errorGuardandoArti').textContent, 4, 'color-cuatro')
        console.error(error)
      })
  }

  // Eliminar artículo
  document.getElementById('eliminar').addEventListener('click', () => {
    if (document.getElementById('tituloUrlOriginal').value !== '') {
      emergente.mostrar(document.getElementById('confirmaBorrar'))
    }
  })
  document.querySelector('#confirmaBorrar .confirmar').addEventListener('click', () => {
    emergente.ocultar(document.getElementById('confirmaBorrar'))
    comun.esperaAjax(true, 'borrarArti')
    let url = urlApi + document.getElementById('secciones').value + '/articulos/' + document.getElementById('tituloUrlOriginal').value
    window.fetch(url, { method: 'delete', headers: reqHeaders })
      .then(respuesta => {
        if (respuesta.status !== 200 && respuesta.status !== 204) return respuesta.json()
        return {}
      })
      .then(resArti => {
        if (resArti.error) {
          comun.esperaAjax(false, 'borrarArti')
          tostada(document.querySelector('.errorBorrandoArti').textContent, 4, 'color-cuatro')
          console.error(resArti.error)
          return
        }
        limpiarEditor()
        comun.esperaAjax(false, 'borrarArti')
      })
      .catch(error => {
        comun.esperaAjax(false, 'borrarArti')
        tostada(document.querySelector('.errorBorrandoArti').textContent, 4, 'color-cuatro')
        console.error(error)
      })
  })

  //
  window.onbeforeunload = evento => {
    let dataActual = recogerDatos()
    if (JSON.stringify(dataActual) !== JSON.stringify(dataOriginal)) {
      let mensaje = 'Es posible que los cambios implementados no se puedan guardar.'
      evento.returnValue = mensaje // Gecko, Trident, Chrome 34+
      return mensaje // Gecko, WebKit, Chrome <34
    }
  }
}
