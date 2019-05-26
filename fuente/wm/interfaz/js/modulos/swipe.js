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

export default function swipe (elemento, direccion, callback) {
  let iniX = null
  let iniY = null
  if (elemento) {
    // console.log( elemento.dataset.tieneSwipe );

    // //// Verificar si ya tiene escuchador

    elemento.addEventListener('touchstart', (evento) => {
      iniX = evento.touches[0].clientX
      iniY = evento.touches[0].clientY
    })

    elemento.addEventListener('touchmove', (evento) => {
      if (!iniX || !iniY) {
        return
      }
      let finX = evento.touches[0].clientX
      let finY = evento.touches[0].clientY
      let difX = iniX - finX
      let difY = iniY - finY
      if (Math.abs(difX) > Math.abs(difY)) { // Diferencia más significante
        if (difX > 0) {
          if (direccion === 'left' && typeof callback === 'function') { // left
            callback()
          }
        } else {
          if (direccion === 'right' && typeof callback === 'function') { // right
            callback()
          }
        }
      } else {
        if (difY > 0) {
          if (direccion === 'up' && typeof callback === 'function') { // up
            callback()
          }
        } else {
          if (direccion === 'down' && typeof callback === 'function') { // down
            callback()
          }
        }
      }
      // reset
      iniX = null
      iniY = null
    })
  }
}
