/** Carga noticias desde js/news.json usando fetch (Ajax). */

function createNewsItem(item) {
  const article = document.createElement('article');
  article.className = 'news-item';

  const h = document.createElement('h3');
  h.textContent = item.title;

  const time = document.createElement('time');
  time.dateTime = item.date;
  time.textContent = new Date(item.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: '2-digit' });

  const p = document.createElement('p');
  p.textContent = item.summary;

  article.append(h, time, p);
  return article;
}

const FALLBACK_NEWS = {
  items: [
    { title: 'Nuevo proyecto de e-commerce', date: '2026-01-18', summary: 'Lanzamos una tienda con catálogo dinámico y optimizaciones de rendimiento.' },
    { title: 'Mejoras en accesibilidad', date: '2025-12-05', summary: 'Actualizamos componentes para cumplir WCAG y mejorar la experiencia.' },
    { title: 'Plantillas modulares', date: '2025-11-10', summary: 'Nuevos bloques reutilizables para acelerar entregas.' }
  ]
};

function renderNews(root, status, payload, note) {
  root.innerHTML = '';
  for (const item of payload.items.slice(0, 6)) {
    root.append(createNewsItem(item));
  }
  if (status) status.textContent = note ?? '';
}

export async function loadNews() {
  const root = document.querySelector('[data-news]');
  if (!root) return;

  const status = document.querySelector('[data-news-status]');
  if (status) status.textContent = 'Cargando noticias…';

  const isFileProtocol = window.location.protocol === 'file:';
  if (isFileProtocol) {
    renderNews(root, status, FALLBACK_NEWS, 'Mostrando noticias de ejemplo (modo local).');
    return;
  }

  try {
    // Ajax: carga desde archivo externo JSON.
    const url = new URL('./news.json', import.meta.url);
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    /** @type {{items: Array<{title:string,date:string,summary:string}>}} */
    const payload = await res.json();
    renderNews(root, status, payload);
  } catch (error) {
    // Fallo de red o bloqueo por ejecución con file:// (usa Live Server).
    renderNews(root, status, FALLBACK_NEWS, 'Mostrando noticias de ejemplo por problema de carga.');
  }
}
