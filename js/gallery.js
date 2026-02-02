/** Galería dinámica: render de miniaturas + modal. */

const imgUrl = (name) => new URL(`../images/${name}`, import.meta.url).toString();

const IMAGES = [
  { src: imgUrl('gallery-1.svg'), alt: 'Proyecto 1', caption: 'Landing moderna' },
  { src: imgUrl('gallery-2.svg'), alt: 'Proyecto 2', caption: 'Dashboard UI' },
  { src: imgUrl('gallery-3.svg'), alt: 'Proyecto 3', caption: 'E-commerce' },
  { src: imgUrl('gallery-4.svg'), alt: 'Proyecto 4', caption: 'Formulario y validación' },
  { src: imgUrl('gallery-5.svg'), alt: 'Proyecto 5', caption: 'Mapa y rutas' },
  { src: imgUrl('gallery-6.svg'), alt: 'Proyecto 6', caption: 'Componentes reusables' }
];

function openModal(modal, image) {
  const img = modal.querySelector('img');
  const title = modal.querySelector('[data-modal-title]');
  if (img) {
    img.src = image.src;
    img.alt = image.alt;
  }
  if (title) title.textContent = image.caption;

  modal.setAttribute('open', '');
  const close = modal.querySelector('[data-modal-close]');
  if (close) close.focus();
}

function closeModal(modal) {
  modal.removeAttribute('open');
}

export function setupGallery() {
  const root = document.querySelector('[data-gallery]');
  const modal = document.querySelector('[data-modal]');
  if (!root || !modal) return;

  const closeBtn = modal.querySelector('[data-modal-close]');
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));

  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) closeModal(modal);
  });

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && modal.hasAttribute('open')) closeModal(modal);
  });

  root.innerHTML = '';
  IMAGES.forEach((image) => {
    const fig = document.createElement('figure');
    fig.className = 'thumb';

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';

    const cap = document.createElement('figcaption');
    cap.textContent = image.caption;

    fig.append(img, cap);
    fig.tabIndex = 0;

    fig.addEventListener('click', () => openModal(modal, image));
    fig.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        openModal(modal, image);
      }
    });

    root.append(fig);
  });
}
