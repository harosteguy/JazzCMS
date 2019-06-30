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

import '../estilo/pagina-ejemplo.scss'
import chorrear from './modulos/chorro-sw-cache'

let setIdiomas = ['es', 'en']

chorrear()

// Obtiene idioma de URL
let partes = document.location.pathname.split('/')
partes.shift() // Quita el host
let idioma = setIdiomas.includes(partes[0]) ? partes[0] : setIdiomas[0]

// Setea idioma en la página
document.documentElement.lang = idioma // html lang
// Setea href y hreflang
let hrefOrig
let enlaces = document.querySelectorAll('[href]')
let idiomaUrl = idioma === setIdiomas[0] ? '' : idioma + '/'
enlaces.forEach(enlace => {
  hrefOrig = enlace.href
  enlace.href = enlace.href.replace(/\[\[idiomaUrl\]\]/, idiomaUrl)
  if (hrefOrig !== enlace.href) { // Si cambió href
    enlace.hreflang = idioma // set hreflang
  }
})

// Selector de idiomas
document.querySelector('a.idioma').innerText = idioma === setIdiomas[0] ? 'inglés' : 'spanish'
document.querySelector('a.idioma').href = idioma === setIdiomas[0] ? '/' + setIdiomas[1] + '/' : '/'
