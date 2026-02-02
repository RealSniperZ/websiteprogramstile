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

export async function loadNews() {
  const root = document.querySelector('[data-news]');
  if (!root) return;

  const status = document.querySelector('[data-news-status]');
  if (status) status.textContent = 'Cargando noticias…';

  try {
    // Ajax: carga desde archivo externo JSON.
    const url = new URL('./news.json', import.meta.url);
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    /** @type {{items: Array<{title:string,date:string,summary:string}>}} */
    const payload = await res.json();

    root.innerHTML = '';
    for (const item of payload.items.slice(0, 6)) {
      root.append(createNewsItem(item));
    }

    if (status) status.textContent = '';
  } catch (error) {
    // Fallo de red o bloqueo por ejecución con file:// (usa Live Server).
    if (status) status.textContent = 'No se pudieron cargar las noticias.';
  }
}
