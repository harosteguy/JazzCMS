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

import { getUrlBaseApi, obtenerIdiomaUrl } from '../modulos/comun'

/*
Hay que incluír la siguiente línea;
y += me.height/2 - itemHeight*me.legendItems.length/2;
antes de la línea siguiente;
drawLegendBox(x, y, legendItem);
en Chart.js para alinear verticalmente las referencias a la derecha de la torta
*/
import Chart from '../../../../../node_modules/chart.js/dist/Chart.js'
//
function colores (cantidad) {
  let salida = []
  let colores = ['#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#303f9f', '#1976d2', '#0288d1', '#0097a7', '#00796b', '#388e3c', '#689f38', '#afb42b', '#fbc02d', '#ffa000', '#f57c00', '#e64a19', '#5d4037']
  while (cantidad--) {
    let i = Math.floor(Math.random() * colores.length)
    salida.push(colores.splice(i, 1))
  }
  return salida
}

export function wdSecciones () {
  let headerAuth = 'Basic ' + window.btoa(window.sessionStorage.getItem('uid') + ':' + window.sessionStorage.getItem('token'))
  let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': obtenerIdiomaUrl() }
  window.fetch(`${getUrlBaseApi()}/apis/wm-articulus/v1/blogs/?incNumArticulos=1`, { method: 'get', headers: reqHeaders })
    .then(respuesta => respuesta.json())
    .then(secciones => {
      if (secciones.length > 0) {
        let aDatos = []; let aEtiquetas = []
        secciones.forEach(seccion => {
          aDatos.push(seccion.numArticulos)
          aEtiquetas.push(seccion.nombre)
        })
        //
        let ctx = document.getElementById('tortaSecciones').getContext('2d')
        let tortaSecciones = new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: aDatos,
              backgroundColor: colores(aDatos.length)
            }],
            labels: aEtiquetas
          },
          options: {
            responsive: true,
            legend: {
              position: 'right',
              fullWidth: false,
              labels: {
                boxWidth: 20
              }
            },
            layout: {
              padding: {
                top: 10,
                right: 20,
                bottom: 10,
                left: 20
              }
            }
            /*
            animation: {
              duration: 0 // general animation time
            },
            hover: {
              animationDuration: 0 // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0 // animation duration after a resize
            */
          }
        })
      }
    })
    .catch(error => {
      console.error(error)
    })
}

export function wdAutores () {
  let headerAuth = 'Basic ' + window.btoa(window.sessionStorage.getItem('uid') + ':' + window.sessionStorage.getItem('token'))
  let reqHeaders = { 'Authorization': headerAuth, 'Accept-Language': obtenerIdiomaUrl() }
  window.fetch(`${getUrlBaseApi()}/apis/wm-articulus/v1/autores/`, { method: 'get', headers: reqHeaders })
    .then(respuesta => respuesta.json())
    .then(autores => {
      if (autores.length > 0) {
        let aDatos = []; let aEtiquetas = []
        autores.forEach(autor => {
          aDatos.push(autor.nroArticulos)
          aEtiquetas.push(autor.nombreAutor)
        })
        //
        let ctx = document.getElementById('tortaAutores').getContext('2d')
        let tortaAutores = new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: aDatos,
              backgroundColor: colores(aDatos.length)
            }],
            labels: aEtiquetas
          },
          options: {
            responsive: true,
            legend: {
              position: 'right',
              fullWidth: false,
              labels: {
                boxWidth: 20
              }
            },
            layout: {
              padding: {
                top: 10,
                right: 20,
                bottom: 10,
                left: 20
              }
            }
          }
        })
      }
    })
    .catch(error => {
      console.error(error)
    })
}

export function wdUsuarios () {

}
