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

import { padIzquierdo } from './utiles'
import { autorizacion } from './usuario'
import { emergente } from './emergente'

// URL para los contenidos de la misma aplicación como etiquetas, avisos, etc. Usada en chorro.js o chorro-sw-cache.js
export const urlApiPropia = '' // Dejar vacío si es igual a la URL de la aplicación

// URL por defecto de los contenidos que gestiona la aplicación
export const urlBaseApi = '' // Dejar vacío si es igual a la URL de la aplicación

export function getUrlBaseApi () {
  return window.localStorage.getItem('urlBaseApi') !== null
    ? window.localStorage.getItem('urlBaseApi')
    : module.exports.urlBaseApi
}

export const setIdiomas = ['es', 'en'] // El primero es el idioma por defecto

export function registrarServiceWorker () {
  return new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(swReg => {
          return resolve(swReg)
        })
        .catch(error => {
          return reject(error)
        })
    } else {
      return reject(new Error('El navegador no soporta service worker'))
    }
  })
}

export function mostrarUsuario () {
  return new Promise((resolve, reject) => {
    autorizacion().then(usr => {
      document.getElementById('nombreUsuario').innerText = usr.nombre
      document.getElementById('fotoUsuario').onerror = function () {
        this.onerror = ''
        // this.src = '/wm/interfaz/img/perfil.svg';
        this.src = 'data:image/jpeg;base64,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'
      }
      document.getElementById('fotoUsuario').src = `${module.exports.getUrlBaseApi()}/img/usuarios/${padIzquierdo(usr.id.toString(), '000000')}.jpg`
      document.querySelector('.barra-superior .conectado').classList.remove('oculto')
      document.querySelector('.barra-superior .desconectado').classList.add('oculto')
      resolve(usr)
      //
      document.getElementById('desconectarse').addEventListener('click', e => {
        e.preventDefault()
        window.sessionStorage.removeItem('uid')
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('nombre')
        window.sessionStorage.removeItem('apellido')
        window.sessionStorage.removeItem('esAdmin')
        //
        window.location.href = `/${obtenerIdiomaUrl()}/wm/usuario/login`
      })
    })
      .catch(error => {
        document.querySelector('.barra-superior .conectado').classList.add('oculto')
        document.querySelector('.barra-superior .desconectado').classList.remove('oculto')
        reject(error)
        // console.log('Usuario no autorizado');
      })
  })
}

export function obtenerIdiomaUrl () {
  const partes = document.location.pathname.split('/')
  partes.shift() // Quita el host
  return module.exports.setIdiomas.includes(partes[0]) ? partes[0] : module.exports.setIdiomas[0]
}

export function setIdiomaPagina () {
  let idioma
  const partesUrl = document.location.pathname.split('/')
  partesUrl.shift() // Quita el host
  if (module.exports.setIdiomas.includes(partesUrl[0])) { // Si hay un idioma válido en URL lo guarda en localStorage
    window.localStorage.setItem('idiomaAppCms', partesUrl[0])
    idioma = partesUrl[0]
  } else {
    idioma = window.localStorage.getItem('idiomaAppCms') // Busca idioma en localStorage
    if (!module.exports.setIdiomas.includes(idioma)) { // Si no hay idioma válido en localStorage
      // Busca idioma válido en el navegador o usa idioma por defecto
      idioma = window.navigator.language.substr(0, 2)
      idioma = module.exports.setIdiomas.includes(idioma) ? idioma : module.exports.setIdiomas[0]
      window.localStorage.setItem('idiomaAppCms', idioma)
    }
    const url = window.location.protocol + '//' + window.location.host + '/' + idioma + window.location.pathname
    window.history.replaceState(null, null, url)
  }
  // Setea html lang
  document.documentElement.lang = idioma
  // Setea href y hreflang
  let hrefOrig
  const enlaces = document.querySelectorAll('[href]')
  const idiomaUrl = idioma === module.exports.setIdiomas[0] ? '' : idioma + '/'
  enlaces.forEach(enlace => {
    hrefOrig = enlace.href
    enlace.href = enlace.href.replace(/\[\[idiomaUrl\]\]/, idiomaUrl)
    if (hrefOrig !== enlace.href) { // Si cambió href
      enlace.hreflang = idioma // set hreflang
    }
  })
  //
  return idioma
}

export function setLinkIdioma () {
  const idioma = module.exports.obtenerIdiomaUrl()
  document.querySelector('a.idioma').innerText = idioma === module.exports.setIdiomas[0] ? 'inglés' : 'spanish'
  document.querySelector('a.idioma').href = idioma === module.exports.setIdiomas[0]
    ? '/' + module.exports.setIdiomas[1] + '/wm/'
    : '/' + module.exports.setIdiomas[0] + '/wm/'
}

export function esperaAjax (mostrar, proceso) {
  let capaEspera = document.getElementById('capaEspera')
  let jsonProcesos, aProcesos
  if (mostrar) {
    if (!capaEspera) {
      capaEspera = document.createElement('div')
      capaEspera.id = 'capaEspera'
      const spinner = document.createElement('img')
      spinner.src = '/wm/interfaz/img/spinner.svg'
      spinner.classList.add('spinner')
      capaEspera.appendChild(spinner)
      document.body.appendChild(capaEspera)
    }
    //
    jsonProcesos = capaEspera.getAttribute('data-procesos')
    aProcesos = jsonProcesos ? JSON.parse(jsonProcesos) : []
    if (aProcesos.indexOf(proceso) === -1) {
      aProcesos.push(proceso)
      capaEspera.dataset.procesos = JSON.stringify(aProcesos)
    }
    //
    capaEspera.classList.add('visible')
  } else {
    if ((capaEspera = document.getElementById('capaEspera'))) {
      //
      jsonProcesos = capaEspera.getAttribute('data-procesos')
      aProcesos = jsonProcesos ? JSON.parse(jsonProcesos) : []
      const indice = aProcesos.indexOf(proceso)
      if (indice > -1) {
        aProcesos.splice(indice, 1)
        capaEspera.dataset.procesos = JSON.stringify(aProcesos)
      }
      //
      if (aProcesos.length === 0) {
        capaEspera.classList.remove('visible')
      }
    }
  }
};

// Muestra un diálogo de continuar o cancelar, si hay cambios
// Retorna una promesa que resolve true para continuar y false para cancelar
export function continuarSinGuardar (dataOriginal, dataActual) {
  return new Promise((resolve, reject) => {
    if (JSON.stringify(dataActual) !== JSON.stringify(dataOriginal)) {
      // Muestra emergente
      emergente.mostrar(document.getElementById('confirmaContinuar'))
      // En escuchador de botón continuar resolve( true ) y oculta la ventana
      document.querySelector('#confirmaContinuar .continuar').addEventListener('click', function escuchador () {
        document.querySelector('#confirmaContinuar .continuar').removeEventListener('click', escuchador)
        emergente.ocultar(document.getElementById('confirmaContinuar'))
        resolve(true)
      })
      // En escuchador de botón cancelar resolve( false );
      document.querySelector('#confirmaContinuar .cancelar').addEventListener('click', function escuchador () {
        document.querySelector('#confirmaContinuar .cancelar').removeEventListener('click', escuchador)
        resolve(false)
      })
    } else {
      resolve(true)
    }
  })
}

export const menuLateral = {
  iniciar: () => {
    let uba = module.exports.getUrlBaseApi()
    uba = uba === '' ? document.location.origin : uba
    document.querySelector('.urlBaseApi .url').textContent = uba
    //
    let itemsMenu
    if (window.sessionStorage.getItem('esAdmin') === '1') {
      itemsMenu = ['inicio', 'secciones-indice', 'secciones-articulo', 'secciones-categorias', 'secciones-secciones', 'secciones-autores', 'contenidos']
    } else {
      itemsMenu = ['inicio', 'secciones-indice', 'secciones-articulo']
    }
    itemsMenu.forEach(item => {
      document.querySelector(`.menu-lateral .${item}`).style.display = 'block'
    })
    //
    document.querySelector('.barra-superior .hamburguesa').addEventListener('click', evento => {
      evento.preventDefault()
      const icono = document.querySelector('.barra-superior .hamburguesa .ico')
      if (!document.querySelector('.menu-lateral').classList.contains('visible')) {
        document.querySelector('.menu-lateral').classList.add('visible')
        icono.innerHTML = '<svg viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>'
      } else {
        document.querySelector('.menu-lateral').classList.remove('visible')
        icono.innerHTML = '<svg viewBox="0 0 448 512"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/></svg>'
      }
    })
  }
}
