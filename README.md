# JazzCMS

JazzCMS + JazzAPI = Headles CMS

JazzCMS es una aplicación web estática, ligera y veloz para gestionar contenidos.

## Tabla de contenidos

- [Pre requisitos](#pre-requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Licencia](#licencia)

---
## Pre requisitos

- Un servidor web.

---
## Instalación

- Copiar el contenido de la carpeta app en la carpeta de html público de tu servidor.

---
## Configuración

#### Reglas de reescritura de URL

En el archivo de configuración de Nginx de deben agregar las siguientes reglas dentro del bloque server:
````
rewrite ^(/wm/secciones/articulo/)([a-z0-9-]+)/([a-z0-9-]+)$ $1 last;
rewrite ^/(es|en)(/wm/secciones/articulo/)([a-z0-9-]+)/([a-z0-9-]+)$ $2 last;
rewrite ^(/wm/usuario/clave/nueva/)([a-f0-9]+)$ $1 last;
rewrite ^/(es|en)(/wm/usuario/clave/nueva/)([a-f0-9]+)$ $2 last;
rewrite ^(/es|/en)(/)*(.*)$ /$3 last;
````
Basicamente se ignora lo que continúe a "/wm/secciones/articulo/" y a "/wm/usuario/clave/nueva/", y en todos los casos el idioma.

Usar el equivalente para otros servidores.

---
## Uso

- Cargar en un navegador y empezar a gestionar.

Las credenciales del usuario "admin" se configuran durante la instalación de las APIs.

---
## Licencia

JazzCMS es una aplicación web para la gestión de contenidos de aplicaciones.
Copyright (C) 2019 by Guillermo Harosteguy <harosteguy@gmail.com>

Este programa es software libre: puede redistribuirlo y/o modificarlo bajo
los términos de la Licencia General Pública de GNU publicada por la Free
Software Foundation, ya sea la versión 3 de la Licencia, o (a su elección)
cualquier versión posterior.

Este programa se distribuye con la esperanza de que sea útil pero SIN
NINGUNA GARANTÍA; incluso sin la garantía implícita de MERCANTIBILIDAD o
CALIFICADA PARA UN PROPÓSITO EN PARTICULAR. Vea la Licencia General Pública
de GNU para más detalles.

Usted ha debido de recibir una copia de la Licencia General Pública
de GNU junto con este programa. Si no, vea <http://www.gnu.org/licenses/>.

---