/** Inicialización común (navbar activa + año del footer). */

export function setupActiveNav() {
  const path = (window.location.pathname || '').toLowerCase();
  const current = path.split('/').pop() || 'index.html';

  const links = document.querySelectorAll('nav a[href]');
  links.forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === current) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

export function setupFooterYear() {
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

export function setupGlobalErrorToast() {
  window.addEventListener('error', () => {
    const el = document.querySelector('[data-global-error]');
    if (el) el.textContent = 'Se produjo un error inesperado. Recarga la página.';
  });
}

export function setupCommon() {
  setupActiveNav();
  setupFooterYear();
  setupGlobalErrorToast();
}
