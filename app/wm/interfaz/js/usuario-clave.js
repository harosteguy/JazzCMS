!function(A){var e={};function t(o){if(e[o])return e[o].exports;var n=e[o]={i:o,l:!1,exports:{}};return A[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}t.m=A,t.c=e,t.d=function(A,e,o){t.o(A,e)||Object.defineProperty(A,e,{enumerable:!0,get:o})},t.r=function(A){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(A,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(A,"__esModule",{value:!0})},t.t=function(A,e){if(1&e&&(A=t(A)),8&e)return A;if(4&e&&"object"==typeof A&&A&&A.__esModule)return A;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:A}),2&e&&"string"!=typeof A)for(var n in A)t.d(o,n,function(e){return A[e]}.bind(null,n));return o},t.n=function(A){var e=A&&A.__esModule?function(){return A.default}:function(){return A};return t.d(e,"a",e),e},t.o=function(A,e){return Object.prototype.hasOwnProperty.call(A,e)},t.p="",t(t.s=119)}({11:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getFechaLarga=e.getFechaHoraCorta=e.getFechaCorta=e.getMesAbreviado=e.getMesPalabra=void 0,e.dispararEvento=function(A,e){var t=void 0;return document.createEventObject?(t=document.createEventObject(),A.fireEvent("on"+e,t)):((t=document.createEvent("HTMLEvents")).initEvent(e,!0,!0),!A.dispatchEvent(t))},e.subirHasta=function(A,e){e=e.toLowerCase();for(;A&&A.parentNode;)if((A=A.parentNode).tagName&&A.tagName.toLowerCase()===e.toLowerCase())return A;return null},e.padIzquierdo=function(A,e){return String(e+A).slice(-e.length)},e.dbFecha=function(A){if(""===A)return"";var e=A.substr(0,4),t=A.substr(5,2);return A.substr(8,2)+"/"+t+"/"+e},e.fechaDb=function(A){if(""===A)return"";var e=A.substr(0,2),t=A.substr(3,2);return A.substr(6,4)+"-"+t+"-"+e},e.dbFechaHora=function(e){if(""===e)return"";var t=e.split(" ");return A.exports.dbFecha(t[0])+" "+t[1]},e.fechaHora2horaMinutos=function(A){return A.split(" ")[1].substr(0,5)},e.fechaHoraDb=function(e){if(""===e)return"";var t=e.split(" ");return A.exports.fechaDb(t[0])+" "+t[1]},e.desplegar=function(A,e){A.style.display="block";var t=A.scrollHeight+"px";A.style.display="",A.classList.add("desplegado"),A.style.height=t,A.style.opacity="1",window.setTimeout(function(){A.style.height="auto","function"==typeof e&&e()},300)},e.plegar=function(A,e){A.style.height=A.scrollHeight+"px",window.setTimeout(function(){A.style.height="0",A.style.opacity="0"},60),window.setTimeout(function(){A.classList.remove("desplegado"),"function"==typeof e&&e()},300)},e.scrollIt=function(A){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:200,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"linear",o=arguments[3],n={linear:function(A){return A},easeInQuad:function(A){return A*A},easeOutQuad:function(A){return A*(2-A)},easeInOutQuad:function(A){return A<.5?2*A*A:(4-2*A)*A-1},easeInCubic:function(A){return A*A*A},easeOutCubic:function(A){return--A*A*A+1},easeInOutCubic:function(A){return A<.5?4*A*A*A:(A-1)*(2*A-2)*(2*A-2)+1},easeInQuart:function(A){return A*A*A*A},easeOutQuart:function(A){return 1- --A*A*A*A},easeInOutQuart:function(A){return A<.5?8*A*A*A*A:1-8*--A*A*A*A},easeInQuint:function(A){return A*A*A*A*A},easeOutQuint:function(A){return 1+--A*A*A*A*A},easeInOutQuint:function(A){return A<.5?16*A*A*A*A*A:1+16*--A*A*A*A*A}},r=window.pageYOffset,i="now"in window.performance?window.performance.now():(new Date).getTime(),a=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight),c=window.innerHeight||document.documentElement.clientHeight||document.getElementsByTagName("body")[0].clientHeight,s="number"==typeof A?A:A.offsetTop,u=Math.round(a-s<c?a-c:s);if("requestAnimationFrame"in window==!1)return window.scroll(0,u),void(o&&o());!function A(){var a="now"in window.performance?window.performance.now():(new Date).getTime();var c=Math.min(1,(a-i)/e);var s=n[t](c);window.scroll(0,Math.ceil(s*(u-r)+r));if(window.pageYOffset===u)return void(o&&o());window.requestAnimationFrame(A)}()};var o=t(5);var n=e.getMesPalabra=function(A,e){var t={es:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],en:["january","february","march","april","may","june","july","august","september","october","november","dicember"]};return e in t?t[e][A.getMonth()]:t[o.setIdiomas[0]][A.getMonth()]},r=e.getMesAbreviado=function(A,e){var t={es:["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],en:["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]};return e in t?t[e][A.getMonth()]:t[o.setIdiomas[0]][A.getMonth()]},i=e.getFechaCorta=function(A,e){return A.getDate().toString()+" "+r(A,e)+", "+A.getFullYear().toString()};e.getFechaHoraCorta=function(e,t){return i(e,t).toString()+" "+A.exports.padIzquierdo(e.getHours().toString(),"00")+":"+A.exports.padIzquierdo(e.getMinutes().toString(),"00")},e.getFechaLarga=function(A,e){return A.getDate().toString()+" "+n(A,e)+", "+A.getFullYear().toString()}},119:function(A,e,t){"use strict";t(120);var o=i(t(17)),n=function(A){if(A&&A.__esModule)return A;var e={};if(null!=A)for(var t in A)Object.prototype.hasOwnProperty.call(A,t)&&(e[t]=A[t]);return e.default=A,e}(t(5)),r=i(t(6));function i(A){return A&&A.__esModule?A:{default:A}}n.registrarServiceWorker().catch(function(A){console.error(A.message)}),n.setIdiomaPagina();var a=n.obtenerIdiomaUrl(),c=a===n.setIdiomas[0]?"":a+"/";n.mostrarUsuario().then(function(A){window.location.href="/"+c+"wm/"}).catch(function(A){(0,o.default)(function(){n.esperaAjax(!1,"cargapagina")}),n.setLinkIdioma(),console.log(A)}),document.getElementById("frmCorreo").addEventListener("submit",function(A){A.preventDefault(),n.esperaAjax(!0,"clave");var e=document.getElementById("frmCorreo"),t={"Accept-Language":a},o=void 0;window.fetch(n.getUrlBaseApi()+"/apis/usuarios/v1/emailClave",{method:"post",headers:t,body:JSON.stringify({email:e.elements.email.value})}).then(function(A){return o=A,A.json()}).then(function(A){if(A.error)throw new Error(A.error);n.esperaAjax(!1,"clave"),(0,r.default)(document.querySelector(".avisoEmailClaveOk").textContent,8,"color-dos"),e.elements.email.value=""}).catch(function(A){400===o.status?(0,r.default)(document.querySelector(".errCorreo").textContent,4,"color-cuatro"):404===o.status?(0,r.default)(document.querySelector(".usrNoExiste").textContent,4,"color-cuatro"):200!==o.status&&(0,r.default)(document.querySelector(".algoSalioMal").textContent,4,"color-cuatro"),console.error(A.message),n.esperaAjax(!1,"clave")})})},12:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=e.emergente={mostrar:function(A,e,t,n){document.body.style.overflow="hidden",window.setTimeout(function(){A.classList.add("visible")},60);var r=function(e){void 0!==e&&e.preventDefault(),"function"==typeof t&&t(),o.ocultar(A,function(){document.body.style.overflow="auto","function"==typeof n&&n()})};A.querySelector(".fondo").removeEventListener("click",r),A.querySelector(".fondo").addEventListener("click",r),A.querySelector(".cerrar").removeEventListener("click",r),A.querySelector(".cerrar").addEventListener("click",r);var i=A.querySelector(".cancelar");i&&(i.removeEventListener("click",r),i.addEventListener("click",r)),window.setTimeout(function(){"function"==typeof e&&e()},600)},ocultar:function(A,e){A.classList.remove("visible"),document.body.style.overflow="auto",window.setTimeout(function(){"function"==typeof e&&e()},600)}}},120:function(A,e,t){},17:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(A){var e=void 0,t=void 0,n=void 0,r=[],i=document.querySelectorAll("[data-contenido]");for(e=0;e<i.length;e++)n=i[e].getAttribute("data-contenido"),-1===r.indexOf(n)&&r.push(n);var a=document.querySelectorAll("[aria-label]");for(e=0;e<a.length;e++)n=a[e].getAttribute("aria-label"),-1===r.indexOf(n)&&r.push(n);var c=r.toString();if(""!==c){var s=(0,o.obtenerIdiomaUrl)();window.fetch(o.urlApiPropia+"/apis/chorro/v1/?chorro="+c,{method:"get",headers:{"Accept-Language":s}}).then(function(A){if(200!==A.status)throw new Error("Error descargando contenidos");return A}).then(function(A){return A.json()}).then(function(o){var n=void 0,r=void 0;for(n in o)for(r=document.querySelectorAll('[data-contenido="'+n+'"]'),e=0;e<r.length;e++)"TITLE"===r[e].tagName?r[e].innerText=o[n]:"META"===r[e].tagName?r[e].setAttribute("content",o[n]):"INPUT"===r[e].tagName||"TEXTAREA"===r[e].tagName?r[e].setAttribute("placeholder",o[n]):"IMG"===r[e].tagName?r[e].setAttribute("alt",o[n]):r[e].innerHTML=o[n];var i=document.querySelectorAll('[aria-label="'+n+'"]');for(t=0;t<i.length;t++)i[t].setAttribute("aria-label",o[n]);"function"==typeof A&&A()}).catch(function(A){console.error(A)})}};var o=t(5)},18:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.autorizacion=function(){return new Promise(function(A,e){if(window.sessionStorage.getItem("uid")&&window.sessionStorage.getItem("token")){var t="en"===document.getElementsByTagName("html")[0].getAttribute("lang")?"en":"es",n={Authorization:"Basic "+window.btoa(window.sessionStorage.getItem("uid")+":"+window.sessionStorage.getItem("token")),"Accept-Language":t};window.fetch((0,o.getUrlBaseApi)()+"/apis/usuarios/v1/autorizacion",{method:"get",headers:n}).then(function(A){if(200===A.status)return A.json();e(new Error("Usuario no autorizado"))}).then(function(e){A(e)}).catch(function(A){console.error(A),e(new Error("Usuario no autorizado"))})}else e(new Error("Usuario no autorizado"))})},e.login=function(A,e){};var o=t(5)},24:function(A,e,t){},5:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.menuLateral=e.setIdiomas=e.urlBaseApi=e.urlApiPropia=void 0,e.getUrlBaseApi=function(){return null!==window.localStorage.getItem("urlBaseApi")?window.localStorage.getItem("urlBaseApi"):A.exports.urlBaseApi},e.registrarServiceWorker=function(){return new Promise(function(A,e){if(!("serviceWorker"in navigator))return e(new Error("El navegador no soporta service worker"));navigator.serviceWorker.register("/sw.js").then(function(e){return A(e)}).catch(function(A){return e(A)})})},e.mostrarUsuario=function(){return new Promise(function(e,t){(0,n.autorizacion)().then(function(t){document.getElementById("nombreUsuario").innerText=t.nombre,document.getElementById("fotoUsuario").onerror=function(){this.onerror="",this.src="data:image/jpeg;base64,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"},document.getElementById("fotoUsuario").src=A.exports.getUrlBaseApi()+"/img/usuarios/"+(0,o.padIzquierdo)(t.id.toString(),"000000")+".jpg",document.querySelector(".barra-superior .conectado").classList.remove("oculto"),document.querySelector(".barra-superior .desconectado").classList.add("oculto"),e(t),document.getElementById("desconectarse").addEventListener("click",function(A){A.preventDefault(),window.sessionStorage.removeItem("uid"),window.sessionStorage.removeItem("token"),window.sessionStorage.removeItem("nombre"),window.sessionStorage.removeItem("apellido"),window.sessionStorage.removeItem("esAdmin"),window.location.href="/"+i()+"/wm/usuario/login"})}).catch(function(A){document.querySelector(".barra-superior .conectado").classList.add("oculto"),document.querySelector(".barra-superior .desconectado").classList.remove("oculto"),t(A)})})},e.obtenerIdiomaUrl=i,e.setIdiomaPagina=function(){var e=A.exports.obtenerIdiomaUrl();document.documentElement.lang=e;var t=void 0,o=document.querySelectorAll("[href]"),n=e===A.exports.setIdiomas[0]?"":e+"/";o.forEach(function(A){t=A.href,A.href=A.href.replace(/\[\[idiomaUrl\]\]/,n),t!==A.href&&(A.hreflang=e)})},e.setLinkIdioma=function(){var e=A.exports.obtenerIdiomaUrl();document.querySelector("a.idioma").innerText=e===A.exports.setIdiomas[0]?"inglés":"spanish",document.querySelector("a.idioma").href=e===A.exports.setIdiomas[0]?"/"+A.exports.setIdiomas[1]+"/wm/":"/wm/"},e.esperaAjax=function(A,e){var t=document.getElementById("capaEspera"),o=void 0,n=void 0;if(A){if(!t){(t=document.createElement("div")).id="capaEspera";var r=document.createElement("img");r.src="/wm/interfaz/img/spinner.svg",r.classList.add("spinner"),t.appendChild(r),document.body.appendChild(t)}o=t.getAttribute("data-procesos"),-1===(n=o?JSON.parse(o):[]).indexOf(e)&&(n.push(e),t.dataset.procesos=JSON.stringify(n)),t.classList.add("visible")}else if(t=document.getElementById("capaEspera")){o=t.getAttribute("data-procesos");var i=(n=o?JSON.parse(o):[]).indexOf(e);i>-1&&(n.splice(i,1),t.dataset.procesos=JSON.stringify(n)),0===n.length&&t.classList.remove("visible")}},e.continuarSinGuardar=function(A,e){return new Promise(function(t,o){JSON.stringify(e)!==JSON.stringify(A)?(r.emergente.mostrar(document.getElementById("confirmaContinuar")),document.querySelector("#confirmaContinuar .continuar").addEventListener("click",function A(){document.querySelector("#confirmaContinuar .continuar").removeEventListener("click",A),r.emergente.ocultar(document.getElementById("confirmaContinuar")),t(!0)}),document.querySelector("#confirmaContinuar .cancelar").addEventListener("click",function A(){document.querySelector("#confirmaContinuar .cancelar").removeEventListener("click",A),t(!1)})):t(!0)})};var o=t(11),n=t(18),r=t(12);e.urlApiPropia="",e.urlBaseApi="";e.setIdiomas=["es","en"];function i(){var e=document.location.pathname.split("/");return e.shift(),A.exports.setIdiomas.includes(e[0])?e[0]:A.exports.setIdiomas[0]}e.menuLateral={iniciar:function(){var e=A.exports.getUrlBaseApi();e=""===e?document.location.origin:e,document.querySelector(".urlBaseApi .url").textContent=e;("1"===window.sessionStorage.getItem("esAdmin")?["inicio","secciones-indice","secciones-articulo","secciones-categorias","secciones-secciones","secciones-autores","contenidos"]:["inicio","secciones-indice","secciones-articulo"]).forEach(function(A){document.querySelector(".menu-lateral ."+A).style.display="block"}),document.querySelector(".barra-superior .hamburguesa").addEventListener("click",function(A){A.preventDefault();var e=document.querySelector(".barra-superior .hamburguesa .ico");document.querySelector(".menu-lateral").classList.contains("visible")?(document.querySelector(".menu-lateral").classList.remove("visible"),e.innerHTML='<svg viewBox="0 0 448 512"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/></svg>'):(document.querySelector(".menu-lateral").classList.add("visible"),e.innerHTML='<svg viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>')})}}},6:function(A,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(A,e,t){t=t||"color-uno";var o=document.createElement("div");o.classList.add("tostada",t);var n=document.createElement("a");n.href="#",n.classList.add("cerrar"),n.innerHTML="&#215;",o.appendChild(n),n.addEventListener("click",function(A){A.preventDefault(),o.classList.remove("visible"),window.setTimeout(function(){o.remove()},600)});var r=document.createElement("p"),i=document.createTextNode(A);r.appendChild(i),o.appendChild(r);var a=void 0;document.getElementById("tostador")?a=document.getElementById("tostador"):((a=document.createElement("div")).id="tostador",document.getElementsByTagName("body")[0].appendChild(a));a.insertBefore(o,a.firstChild),o.classList.add("visible"),window.setTimeout(function(){o.classList.remove("visible"),window.setTimeout(function(){o.remove()},600)},1e3*e)},t(24)}});