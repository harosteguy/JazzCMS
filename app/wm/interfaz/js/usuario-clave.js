!function(A){var e={};function t(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return A[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=A,t.c=e,t.d=function(A,e,n){t.o(A,e)||Object.defineProperty(A,e,{enumerable:!0,get:n})},t.r=function(A){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(A,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(A,"__esModule",{value:!0})},t.t=function(A,e){if(1&e&&(A=t(A)),8&e)return A;if(4&e&&"object"==typeof A&&A&&A.__esModule)return A;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:A}),2&e&&"string"!=typeof A)for(var o in A)t.d(n,o,function(e){return A[e]}.bind(null,o));return n},t.n=function(A){var e=A&&A.__esModule?function(){return A.default}:function(){return A};return t.d(e,"a",e),e},t.o=function(A,e){return Object.prototype.hasOwnProperty.call(A,e)},t.p="",t(t.s=119)}({11:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getFechaLarga=e.getFechaHoraCorta=e.getFechaCorta=e.getMesAbreviado=e.getMesPalabra=void 0,e.dispararEvento=function(A,e){var t=void 0;return document.createEventObject?(t=document.createEventObject(),A.fireEvent("on"+e,t)):((t=document.createEvent("HTMLEvents")).initEvent(e,!0,!0),!A.dispatchEvent(t))},e.subirHasta=function(A,e){e=e.toLowerCase();for(;A&&A.parentNode;)if((A=A.parentNode).tagName&&A.tagName.toLowerCase()===e.toLowerCase())return A;return null},e.padIzquierdo=function(A,e){return String(e+A).slice(-e.length)},e.dbFecha=function(A){if(""===A)return"";var e=A.substr(0,4),t=A.substr(5,2);return A.substr(8,2)+"/"+t+"/"+e},e.fechaDb=function(A){if(""===A)return"";var e=A.substr(0,2),t=A.substr(3,2);return A.substr(6,4)+"-"+t+"-"+e},e.dbFechaHora=function(e){if(""===e)return"";var t=e.split(" ");return A.exports.dbFecha(t[0])+" "+t[1]},e.fechaHora2horaMinutos=function(A){return A.split(" ")[1].substr(0,5)},e.fechaHoraDb=function(e){if(""===e)return"";var t=e.split(" ");return A.exports.fechaDb(t[0])+" "+t[1]},e.desplegar=function(A,e){A.style.display="block";var t=A.scrollHeight+"px";A.style.display="",A.classList.add("desplegado"),A.style.height=t,A.style.opacity="1",window.setTimeout(function(){A.style.height="auto","function"==typeof e&&e()},300)},e.plegar=function(A,e){A.style.height=A.scrollHeight+"px",window.setTimeout(function(){A.style.height="0",A.style.opacity="0"},60),window.setTimeout(function(){A.classList.remove("desplegado"),"function"==typeof e&&e()},300)},e.scrollIt=function(A){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:200,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"linear",n=arguments[3],o={linear:function(A){return A},easeInQuad:function(A){return A*A},easeOutQuad:function(A){return A*(2-A)},easeInOutQuad:function(A){return A<.5?2*A*A:(4-2*A)*A-1},easeInCubic:function(A){return A*A*A},easeOutCubic:function(A){return--A*A*A+1},easeInOutCubic:function(A){return A<.5?4*A*A*A:(A-1)*(2*A-2)*(2*A-2)+1},easeInQuart:function(A){return A*A*A*A},easeOutQuart:function(A){return 1- --A*A*A*A},easeInOutQuart:function(A){return A<.5?8*A*A*A*A:1-8*--A*A*A*A},easeInQuint:function(A){return A*A*A*A*A},easeOutQuint:function(A){return 1+--A*A*A*A*A},easeInOutQuint:function(A){return A<.5?16*A*A*A*A*A:1+16*--A*A*A*A*A}},r=window.pageYOffset,i="now"in window.performance?window.performance.now():(new Date).getTime(),a=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight),c=window.innerHeight||document.documentElement.clientHeight||document.getElementsByTagName("body")[0].clientHeight,s="number"==typeof A?A:A.offsetTop,u=Math.round(a-s<c?a-c:s);if("requestAnimationFrame"in window==!1)return window.scroll(0,u),void(n&&n());!function A(){var a="now"in window.performance?window.performance.now():(new Date).getTime();var c=Math.min(1,(a-i)/e);var s=o[t](c);window.scroll(0,Math.ceil(s*(u-r)+r));if(window.pageYOffset===u)return void(n&&n());window.requestAnimationFrame(A)}()};var n=t(5);var o=e.getMesPalabra=function(A,e){var t={es:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],en:["january","february","march","april","may","june","july","august","september","october","november","dicember"]};return e in t?t[e][A.getMonth()]:t[n.setIdiomas[0]][A.getMonth()]},r=e.getMesAbreviado=function(A,e){var t={es:["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],en:["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]};return e in t?t[e][A.getMonth()]:t[n.setIdiomas[0]][A.getMonth()]},i=e.getFechaCorta=function(A,e){return A.getDate().toString()+" "+r(A,e)+", "+A.getFullYear().toString()};e.getFechaHoraCorta=function(e,t){return i(e,t).toString()+" "+A.exports.padIzquierdo(e.getHours().toString(),"00")+":"+A.exports.padIzquierdo(e.getMinutes().toString(),"00")},e.getFechaLarga=function(A,e){return A.getDate().toString()+" "+o(A,e)+", "+A.getFullYear().toString()}},119:function(A,e,t){"use strict";t(120);var n=i(t(17)),o=function(A){if(A&&A.__esModule)return A;var e={};if(null!=A)for(var t in A)Object.prototype.hasOwnProperty.call(A,t)&&(e[t]=A[t]);return e.default=A,e}(t(5)),r=i(t(6));function i(A){return A&&A.__esModule?A:{default:A}}o.setIdiomaPagina();var a=o.obtenerIdiomaUrl(),c=a===o.setIdiomas[0]?"":a+"/";o.mostrarUsuario().then(function(A){window.location.href="/"+c+"wm/"}).catch(function(A){(0,n.default)(function(){o.esperaAjax(!1,"cargapagina")}),o.setLinkIdioma(),console.log(A)}),document.getElementById("frmCorreo").addEventListener("submit",function(A){A.preventDefault(),o.esperaAjax(!0,"clave");var e=document.getElementById("frmCorreo"),t={"Accept-Language":a};window.fetch(o.urlBaseApi+"/apis/usuarios/v1/emailClave",{method:"post",headers:t,body:JSON.stringify({email:e.elements.email.value})}).then(function(A){return A.json()}).then(function(A){if(A.error)throw new Error(A.error);o.esperaAjax(!1,"clave"),(0,r.default)(document.querySelector(".avisoEmailClaveOk").textContent,8,"color-dos"),e.elements.email.value=""}).catch(function(A){(0,r.default)(A.message,4,"color-cuatro"),o.esperaAjax(!1,"clave")})})},12:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=e.emergente={mostrar:function(A,e,t,o){document.body.style.overflow="hidden",window.setTimeout(function(){A.classList.add("visible")},60);var r=function(e){void 0!==e&&e.preventDefault(),"function"==typeof t&&t(),n.ocultar(A,function(){document.body.style.overflow="auto","function"==typeof o&&o()})};A.querySelector(".fondo").removeEventListener("click",r),A.querySelector(".fondo").addEventListener("click",r),A.querySelector(".cerrar").removeEventListener("click",r),A.querySelector(".cerrar").addEventListener("click",r);var i=A.querySelector(".cancelar");i&&(i.removeEventListener("click",r),i.addEventListener("click",r)),window.setTimeout(function(){"function"==typeof e&&e()},600)},ocultar:function(A,e){A.classList.remove("visible"),document.body.style.overflow="auto",window.setTimeout(function(){"function"==typeof e&&e()},600)}}},120:function(A,e,t){},17:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(A){var e=void 0,t=void 0,o=void 0,r=[],i=document.querySelectorAll("[data-contenido]");for(e=0;e<i.length;e++)o=i[e].getAttribute("data-contenido"),-1===r.indexOf(o)&&r.push(o);var a=document.querySelectorAll("[aria-label]");for(e=0;e<a.length;e++)o=a[e].getAttribute("aria-label"),-1===r.indexOf(o)&&r.push(o);var c=r.toString();if(""!==c){var s=(0,n.obtenerIdiomaUrl)();window.fetch(n.urlBaseApi+"/apis/chorro/v1/?chorro="+c,{method:"get",headers:{"Accept-Language":s}}).then(function(A){if(200!==A.status)throw new Error("Error descargando contenidos");return A}).then(function(A){return A.json()}).then(function(n){var o=void 0,r=void 0;for(o in n)for(r=document.querySelectorAll('[data-contenido="'+o+'"]'),e=0;e<r.length;e++)"TITLE"===r[e].tagName?r[e].innerText=n[o]:"META"===r[e].tagName?r[e].setAttribute("content",n[o]):"INPUT"===r[e].tagName||"TEXTAREA"===r[e].tagName?r[e].setAttribute("placeholder",n[o]):"IMG"===r[e].tagName?r[e].setAttribute("alt",n[o]):r[e].innerHTML=n[o];var i=document.querySelectorAll('[aria-label="'+o+'"]');for(t=0;t<i.length;t++)i[t].setAttribute("aria-label",n[o]);"function"==typeof A&&A()}).catch(function(A){console.error(A)})}};var n=t(5)},18:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.autorizacion=function(){return new Promise(function(A,e){if(window.sessionStorage.getItem("uid")&&window.sessionStorage.getItem("token")){var t="en"===document.getElementsByTagName("html")[0].getAttribute("lang")?"en":"es",o={Authorization:"Basic "+window.btoa(window.sessionStorage.getItem("uid")+":"+window.sessionStorage.getItem("token")),"Accept-Language":t};window.fetch(n.urlBaseApi+"/apis/usuarios/v1/autorizacion",{method:"get",headers:o}).then(function(A){if(200===A.status)return A.json();e(new Error("Usuario no autorizado"))}).then(function(e){A(e)}).catch(function(A){console.error(A),e(new Error("Usuario no autorizado"))})}else e(new Error("Usuario no autorizado"))})},e.login=function(A,e){};var n=t(5)},24:function(A,e,t){},5:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.menuLateral=e.setIdiomas=e.urlBaseApi=void 0,e.mostrarUsuario=function(){return new Promise(function(A,e){(0,o.autorizacion)().then(function(e){document.getElementById("nombreUsuario").innerText=e.nombre,document.getElementById("fotoUsuario").onerror=function(){this.onerror="",this.src="data:image/jpeg;base64,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"},document.getElementById("fotoUsuario").src="/img/usuarios/"+(0,n.padIzquierdo)(e.id.toString(),"000000")+".jpg",document.querySelector(".barra-superior .conectado").classList.remove("oculto"),document.querySelector(".barra-superior .desconectado").classList.add("oculto"),A(e),document.getElementById("desconectarse").addEventListener("click",function(A){A.preventDefault(),window.sessionStorage.removeItem("uid"),window.sessionStorage.removeItem("token"),window.sessionStorage.removeItem("nombre"),window.sessionStorage.removeItem("apellido"),window.sessionStorage.removeItem("esAdmin"),window.location.href="/"+i()+"/"})}).catch(function(A){document.querySelector(".barra-superior .conectado").classList.add("oculto"),document.querySelector(".barra-superior .desconectado").classList.remove("oculto"),e(A)})})},e.obtenerIdiomaUrl=i,e.setIdiomaPagina=function(){var e=A.exports.obtenerIdiomaUrl();document.documentElement.lang=e;var t=void 0,n=document.querySelectorAll("[href]"),o=e===A.exports.setIdiomas[0]?"":e+"/";n.forEach(function(A){t=A.href,A.href=A.href.replace(/\[\[idiomaUrl\]\]/,o),t!==A.href&&(A.hreflang=e)})},e.setLinkIdioma=function(){var e=A.exports.obtenerIdiomaUrl();document.querySelector("a.idioma").innerText=e===A.exports.setIdiomas[0]?"inglés":"spanish",document.querySelector("a.idioma").href=e===A.exports.setIdiomas[0]?"/"+A.exports.setIdiomas[1]+"/wm/":"/wm/"},e.esperaAjax=function(A,e){var t=document.getElementById("capaEspera"),n=void 0,o=void 0;if(A){if(!t){(t=document.createElement("div")).id="capaEspera";var r=document.createElement("img");r.src="/wm/interfaz/img/spinner.svg",r.classList.add("spinner"),t.appendChild(r),document.body.appendChild(t)}n=t.getAttribute("data-procesos"),-1===(o=n?JSON.parse(n):[]).indexOf(e)&&(o.push(e),t.dataset.procesos=JSON.stringify(o)),t.classList.add("visible")}else if(t=document.getElementById("capaEspera")){n=t.getAttribute("data-procesos");var i=(o=n?JSON.parse(n):[]).indexOf(e);i>-1&&(o.splice(i,1),t.dataset.procesos=JSON.stringify(o)),0===o.length&&t.classList.remove("visible")}},e.continuarSinGuardar=function(A,e){return new Promise(function(t,n){JSON.stringify(e)!==JSON.stringify(A)?(r.emergente.mostrar(document.getElementById("confirmaContinuar")),document.querySelector("#confirmaContinuar .continuar").addEventListener("click",function A(){document.querySelector("#confirmaContinuar .continuar").removeEventListener("click",A),r.emergente.ocultar(document.getElementById("confirmaContinuar")),t(!0)}),document.querySelector("#confirmaContinuar .cancelar").addEventListener("click",function A(){document.querySelector("#confirmaContinuar .cancelar").removeEventListener("click",A),t(!1)})):t(!0)})};var n=t(11),o=t(18),r=t(12);e.urlBaseApi="",e.setIdiomas=["es","en"];function i(){var e=document.location.pathname.split("/");return e.shift(),A.exports.setIdiomas.includes(e[0])?e[0]:A.exports.setIdiomas[0]}e.menuLateral={iniciar:function(){("1"===window.sessionStorage.getItem("esAdmin")?["inicio","irAlSitio","secciones-indice","secciones-articulo","secciones-categorias","secciones-secciones","secciones-autores","contenidos"]:["inicio","irAlSitio","secciones-indice","secciones-articulo"]).forEach(function(A){document.querySelector(".menu-lateral ."+A).style.display="block"}),document.querySelector(".barra-superior .hamburguesa").addEventListener("click",function(A){A.preventDefault();var e=document.querySelector(".barra-superior .hamburguesa .ico");document.querySelector(".menu-lateral").classList.contains("visible")?(document.querySelector(".menu-lateral").classList.remove("visible"),e.innerHTML='<svg viewBox="0 0 448 512"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/></svg>'):(document.querySelector(".menu-lateral").classList.add("visible"),e.innerHTML='<svg viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>')})}}},6:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(A,e,t){t=t||"color-uno";var n=document.createElement("div");n.classList.add("tostada",t);var o=document.createElement("a");o.href="#",o.classList.add("cerrar"),o.innerHTML="&#215;",n.appendChild(o),o.addEventListener("click",function(A){A.preventDefault(),n.classList.remove("visible"),window.setTimeout(function(){n.remove()},600)});var r=document.createElement("p"),i=document.createTextNode(A);r.appendChild(i),n.appendChild(r);var a=void 0;document.getElementById("tostador")?a=document.getElementById("tostador"):((a=document.createElement("div")).id="tostador",document.getElementsByTagName("body")[0].appendChild(a));a.insertBefore(n,a.firstChild),n.classList.add("visible"),window.setTimeout(function(){n.classList.remove("visible"),window.setTimeout(function(){n.remove()},600)},1e3*e)},t(24)}});