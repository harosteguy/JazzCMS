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

import '../estilo/secciones-secciones.scss'
import chorrear from './modulos/chorro'
import * as comun from './modulos/comun'
import { scrollIt } from './modulos/utiles'
import { emergente } from './modulos/emergente'
import { ListaSelect } from './modulos/formularios'
import tostada from './widgets/tostada'
import * as wmCkEditor from './modulos/ckeditor'
//
comun.setIdiomaPagina()
let idioma = comun.obtenerIdiomaUrl()
let idiomaUrl = idioma === comun.setIdiomas[0] ? '' : idioma + '/'

comun.mostrarUsuario().then(usr => {
  if (usr.esAdmin === 1) {
    hacer()
  } else {
    window.location.href = `/${idiomaUrl}`
  }
})
  .catch(error => {
    console.error(error)
    window.location.href = `/${idiomaUrl}`
  })

//
function hacer () {
  let dataOriginal // Variable para verificar si se modificaron datos al abandonar la página
  chorrear(() => {
    comun.esperaAjax(false, 'cargapagina')
  })
  comun.menuLateral.iniciar()
  comun.setLinkIdioma()
  document.querySelector('.menu-lateral .secciones-secciones').classList.add('activo')

  let ckDescripcion
  wmCkEditor.crearEditor(document.getElementById('descripcion'), 'seccion')
    .then(editor => {
      ckDescripcion = editor
      dataOriginal = recogerDatos()
    }).catch(error => { console.error(error) })

  let listaSecciones = new ListaSelect(document.getElementById('listaSecciones'), mostrarSeccion)
  listaSecciones.antesDeCambiar = () => {
    // Evento para retener la selección de un item y verificar si hay que guardar
    return new Promise((resolve, reject) => {
      comun.continuarSinGuardar(dataOriginal, recogerDatos()).then(continuar => {
        if (continuar) {
          resolve(true)
        } else {
          resolve(false)
        }
      }).catch(error => { console.error(error) })
    })
  }

  let headerAuth = 'Basic ' + window.btoa(window.sessionStorage.getItem('uid') + ':' + window.sessionStorage.getItem('token'))
  let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma }

  // Obtiene secciones
  comun.esperaAjax(true, 'secciones')
  window.fetch(`${comun.getUrlBaseApi()}/apis/wm-articulus/v1/blogs/`, { method: 'get', headers: reqHeaders })
    .then(respuesta => respuesta.json())
    .then(secciones => {
      if (secciones.length > 0) {
        listaSecciones.poblar(secciones, { nombreClave: 'nombreUrl', nombreValor: 'nombre' })
      }
      comun.esperaAjax(false, 'secciones')
    })
    .catch(error => {
      comun.esperaAjax(false, 'secciones')
      console.error(error)
    })

  // Limpiar editor
  function limpiarEditor () {
    document.getElementById('nombreUrl').value = ''
    document.getElementById('nombre').value = ''
    document.getElementById('totArtis').textContent = '0'
    ckDescripcion.setData('')
    listaSecciones.reiniciar()
    scrollIt(document.getElementsByTagName('body')[0], 350, 'easeOutQuad', () => {
      document.getElementById('nombre').focus()
    })
    dataOriginal = recogerDatos()
  }
  document.getElementById('nuevo').addEventListener('click', () => {
    comun.continuarSinGuardar(dataOriginal, recogerDatos()).then(continuar => {
      if (continuar) limpiarEditor()
    }).catch(error => { console.error(error) })
  })

  //
  function mostrarSeccion (claveValor) {
    comun.esperaAjax(true, 'obtieneSeccion')
    let url = `${comun.getUrlBaseApi()}/apis/wm-articulus/v1/blogs/${claveValor.clave}/?incNumArticulos=1`
    window.fetch(url, { method: 'get', headers: reqHeaders })
      .then(respuesta => respuesta.json())
      .then(seccion => {
        if (seccion.error) {
          tostada(seccion.error, 4, 'color-tres')
          throw new Error(seccion.error)
        } else {
          document.getElementById('nombreUrl').value = seccion.nombreUrl
          document.getElementById('nombre').value = seccion.nombre
          document.getElementById('totArtis').textContent = seccion.numArticulos
          ckDescripcion.setData(seccion.descripcion)
          dataOriginal = recogerDatos() // Guarda para verificar si se modificaron datos al abandonar la página
          comun.esperaAjax(false, 'obtieneSeccion')
        }
      })
      .catch(error => {
        comun.esperaAjax(false, 'obtieneSeccion')
        console.error(error)
      })
  }

  // Recoger datos del formulario para enviar
  function recogerDatos () {
    return {
      nombre: document.getElementById('nombre').value,
      descripcion: ckDescripcion.getData()
    }
  }

  // Guardar sección
  document.getElementById('guardar').addEventListener('click', () => {
    comun.esperaAjax(true, 'guardaSeccion')
    let nombreUrl = document.getElementById('nombreUrl').value
    let metodo = (nombreUrl === '') ? 'post' : 'put'
    let url = `${comun.getUrlBaseApi()}/apis/wm-articulus/v1/blogs/`
    url += metodo === 'put' ? nombreUrl : ''
    let seccion = recogerDatos()
    dataOriginal = seccion // Guarda para verificar si se modificaron datos al abandonar la página
    window.fetch(url, { method: metodo, headers: reqHeaders, body: JSON.stringify(seccion) })
      .then(respuesta => respuesta.json())
      .then(resSecc => {
        if (resSecc.error) {
          tostada(resSecc.error, 4, 'color-tres')
          throw new Error(resSecc.error)
        } else {
          // Recupera categoría guardada
          return window.fetch(comun.getUrlBaseApi() + resSecc.url, { method: 'get', headers: reqHeaders })
        }
      })
      .then(respuesta => respuesta.json())
      .then(seccion => {
        document.getElementById('nombreUrl').value = seccion.nombreUrl
        document.getElementById('nombre').value = seccion.nombre
        ckDescripcion.setData(seccion.descripcion)
        if (metodo === 'put') {
          listaSecciones.actualizar(nombreUrl, seccion.nombreUrl, seccion.nombre)
        } else if (metodo === 'post') {
          listaSecciones.agregar(seccion.nombreUrl, seccion.nombre)
        }
        comun.esperaAjax(false, 'guardaSeccion')
        tostada(document.querySelector('.okGuardado').textContent, 4, 'color-dos')
      })
      .catch(error => {
        comun.esperaAjax(false, 'guardaSeccion')
        console.error(error)
      })
  })

  // Eliminar seccion
  document.getElementById('eliminar').addEventListener('click', () => {
    if (document.getElementById('nombreUrl').value !== '') {
      emergente.mostrar(document.getElementById('confirmaBorrar'))
    }
  })
  document.querySelector('#confirmaBorrar .confirmar').addEventListener('click', () => {
    emergente.ocultar(document.getElementById('confirmaBorrar'))
    comun.esperaAjax(true, 'borraSeccion')
    let nombreUrl = document.getElementById('nombreUrl').value
    let url = `${comun.getUrlBaseApi()}/apis/wm-articulus/v1/blogs/${nombreUrl}`
    window.fetch(url, { method: 'delete', headers: reqHeaders })
      .then(respuesta => {
        if (respuesta.status !== 200 && respuesta.status !== 204) return respuesta.json()
        return {}
      })
      .then(seccion => {
        if (seccion.error) {
          tostada(seccion.error, 4, 'color-cuatro')
        } else {
          listaSecciones.borrar(nombreUrl)
          limpiarEditor()
        }
        comun.esperaAjax(false, 'borraSeccion')
      })
      .catch(error => {
        comun.esperaAjax(false, 'borraSeccion')
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
