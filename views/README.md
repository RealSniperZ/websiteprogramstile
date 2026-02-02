# TRABAJO FINAL — JavaScript Avanzado

## Estructura

- `views/`: páginas HTML
- `css/`: estilos
- `js/`: lógica JavaScript + datos externos (`news.json`)
- `images/`: recursos (logo/galería)

## Páginas

- `views/index.html`: inicio con secciones y carga de **Noticias** por Ajax (JSON).
- `views/productos.html`: galería dinámica (render con JS + modal).
- `views/presupuesto.html`: formulario en dos partes (contacto + presupuesto) con validación y cálculo en vivo.
- `views/contacto.html`: mapa OpenStreetMap + cálculo de ruta (requiere internet).

## Cómo ejecutar

- Recomendado: VS Code + extensión **Live Server**.
  - Opción A (recomendada): abre `index.html` (raíz) y usa “Open with Live Server”.
  - Opción B: abre `views/index.html` y usa “Open with Live Server”.

### Si ves `Cannot GET /views/index.html`

Eso significa que el servidor local que estás usando **no está sirviendo la carpeta raíz del proyecto**.

- Si el servidor tiene como raíz `views/`, entonces la URL correcta es `/index.html` (no `/views/index.html`).
- Si el servidor tiene como raíz la carpeta del proyecto, entonces la URL correcta es `/` o `/index.html`.

> Nota: si abres el HTML directamente desde el explorador (protocolo `file://`), algunos navegadores bloquean `fetch()` por seguridad y las noticias podrían no cargarse.

## GitHub Pages

- Este repositorio incluye un `index.html` en la raíz que redirige a `views/index.html` para que GitHub Pages muestre el sitio correctamente.

## Requisito de noticias (Ajax)

- Fuente de datos: `js/news.json`
- Cargador: `js/news.js` (usa `fetch()` y renderiza en la sección de noticias)

## Validación HTML

- Pasa cada HTML por W3C Validator: https://validator.w3.org/

## Notas

- `views/contacto.html` usa Leaflet + Leaflet Routing Machine (CDN) y OSRM; requiere conexión a Internet.
