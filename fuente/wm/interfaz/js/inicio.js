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

import '../estilo/inicio.scss'
import chorrear from './modulos/chorro'
import * as comun from './modulos/comun'
import { wdAutores, wdSecciones } from './widgets/widgets'

comun.setIdiomaPagina()
let idioma = comun.obtenerIdiomaUrl()
let idiomaUrl = idioma === comun.setIdiomas[0] ? '' : idioma + '/'

comun.mostrarUsuario().then(usr => {
  if (usr.esAdmin === 1) {
    hacer(usr)
  } else {
    // Comprueba si es un autor activo
    let headerAuth = 'Basic ' + window.btoa(window.localStorage.getItem('uid') + ':' + window.localStorage.getItem('token'))
    let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma }
    window.fetch(`${comun.urlBaseApi}/apis/wm-articulus/v1/autores/`, { method: 'get', headers: reqHeaders })
      .then(respuesta => {
        if (respuesta.status !== 200) {
          throw new Error('El status no es 200')
        }
        return respuesta.json()
      })
      .then(autor => {
        if (autor.autorActivo) {
          hacer(usr)
        } else {
          throw new Error('No es un autor activo')
        }
      })
      .catch(error => {
        console.error(error)
        window.localStorage.removeItem('uid')
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('nombre')
        window.localStorage.removeItem('apellido')
        window.localStorage.removeItem('esAdmin')
        window.location.href = `/${idiomaUrl}`
      })
  }
})
  .catch(error => {
    console.error(error)
    window.localStorage.removeItem('uid')
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('nombre')
    window.localStorage.removeItem('apellido')
    window.localStorage.removeItem('esAdmin')
    window.location.href = `/${idiomaUrl}wm/login/`
  })

//
function hacer (usr) {
  chorrear(() => {
    comun.esperaAjax(false, 'cargapagina')
  })
  comun.menuLateral.iniciar()
  comun.setLinkIdioma()

  document.querySelector('.menu-lateral .inicio').classList.add('activo')

  if (usr.esAdmin === 1) {
    wdAutores()
    wdSecciones()
  }
}
