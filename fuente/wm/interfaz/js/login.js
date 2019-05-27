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

import '../estilo/login.scss'
import chorrear from './modulos/chorro'
import * as comun from './modulos/comun'
import tostada from './widgets/tostada'

comun.setIdiomaPagina()
let idioma = comun.obtenerIdiomaUrl()
let idiomaUrl = idioma === comun.setIdiomas[0] ? '' : idioma + '/'

comun.mostrarUsuario().then(usr => {
  window.location.href = `/${idiomaUrl}wm/`
})
  .catch(error => {
    chorrear(() => {
      comun.esperaAjax(false, 'cargapagina')
    })
    comun.setLinkIdioma()
    console.log(error)
  })
//
document.getElementById('frmLogin').addEventListener('submit', e => {
  e.preventDefault()
  comun.esperaAjax(true, 'login')
  const frmLogin = document.getElementById('frmLogin')
  const headerAuth = 'Basic ' + window.btoa(frmLogin.elements['email'].value + ':' + frmLogin.elements['clave'].value)
  const reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': idioma }
  //
  window.fetch(comun.urlBaseApi + '/apis/usuarios/v1/token', { method: 'get', headers: reqHeaders })
    .then(respuesta => {
      return respuesta.json()
    })
    .then(usr => {
      if (usr.error) throw new Error(usr.error)

      window.localStorage.setItem('uid', usr.id)
      window.localStorage.setItem('token', usr.token)
      window.localStorage.setItem('nombre', usr.nombre)
      window.localStorage.setItem('apellido', usr.apellido)
      window.localStorage.setItem('esAdmin', usr.esAdmin)
      window.location.href = `/${idiomaUrl}wm/`
    })
    .catch(error => {
      tostada(error.message, 4, 'color-cuatro')
      comun.esperaAjax(false, 'login')
    })
})
