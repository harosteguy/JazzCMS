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

import { urlBaseApi } from './comun'

export function autorizacion () {
  return new Promise((resolve, reject) => {
    if (window.localStorage.getItem('uid') && window.localStorage.getItem('token')) {
      let htmlLang = document.getElementsByTagName('html')[0].getAttribute('lang') === 'en' ? 'en' : 'es'
      let reqHeaders = {
        'Authorization': 'Basic ' + window.btoa(window.localStorage.getItem('uid') + ':' + window.localStorage.getItem('token')),
        'Accept-Language': htmlLang
      }
      window.fetch(`${urlBaseApi}/apis/usuarios/v1/autorizacion`, { method: 'get', headers: reqHeaders })
        .then(respuesta => {
          if (respuesta.status !== 200) {
            reject(new Error('Usuario no autorizado'))
            return
          }
          return respuesta.json()
        })
        .then(usuario => {
          resolve(usuario)
        })
        .catch(error => {
          console.error(error)
          reject(new Error('Usuario no autorizado'))
        })
    } else {
      reject(new Error('Usuario no autorizado'))
    }
  })
}

export function login (email, clave) {

}
