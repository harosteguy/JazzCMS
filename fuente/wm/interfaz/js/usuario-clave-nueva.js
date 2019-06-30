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

import '../estilo/usuario-clave-nueva.scss'
import chorrear from './modulos/chorro-sw-cache'
import * as comun from './modulos/comun'
import tostada from './widgets/tostada'

comun.registrarServiceWorker().catch(error => { console.error(error.message) })
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
document.getElementById('frmClaves').addEventListener('submit', e => {
  e.preventDefault()
  comun.esperaAjax(true, 'clave')
  const frmClaves = document.getElementById('frmClaves')
  const reqHeaders = { 'Accept-Language': idioma }
  const datos = {
    token: document.location.pathname.split('/').pop(), // Lee token de URL
    clave1: frmClaves.elements['clave1'].value,
    clave2: frmClaves.elements['clave2'].value
  }
  if (datos.clave1 !== datos.clave2) {
    tostada(document.querySelector('.clavesNoIguales').textContent, 4, 'color-cuatro')
    comun.esperaAjax(false, 'clave')
    return
  }
  //
  let resp
  window.fetch(comun.getUrlBaseApi() + '/apis/usuarios/v1/nuevaClave',
    {
      method: 'put',
      headers: reqHeaders,
      body: JSON.stringify(datos)
    })
    .then(respuesta => {
      resp = respuesta
      return respuesta.json()
    })
    .then(usr => {
      if (usr.error) throw new Error(usr.error)

      window.sessionStorage.setItem('uid', usr.id)
      window.sessionStorage.setItem('token', usr.token)
      window.sessionStorage.setItem('nombre', usr.nombre)
      window.sessionStorage.setItem('apellido', usr.apellido)
      window.sessionStorage.setItem('esAdmin', usr.esAdmin)
      window.location.href = `/${idiomaUrl}wm/`
    })
    .catch(error => {
      if (resp.status === 400) {
        tostada(document.querySelector('.errClavesToken').textContent, 4, 'color-cuatro')
      } else if (resp.status === 404) {
        tostada(document.querySelector('.tokenNoExiste').textContent, 4, 'color-cuatro')
      } else if (resp.status !== 200) {
        tostada(document.querySelector('.algoSalioMal').textContent, 4, 'color-cuatro')
      }
      console.error(error.message)
      comun.esperaAjax(false, 'clave')
    })
})
