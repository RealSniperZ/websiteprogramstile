import { validateEmail, validateName, validatePhone, validateSurname, validateTerms } from './validators.js';

/**
 * Reglas de descuento por plazo (en meses).
 * Nota: el enunciado no fija tramos; se implementa una política simple y transparente.
 */
export function discountRateForMonths(months) {
  const m = Number(months);
  if (!Number.isFinite(m) || m <= 0) return 0;
  if (m >= 12) return 0.15;
  if (m >= 6) return 0.1;
  if (m >= 3) return 0.05;
  return 0;
}

/**
 * @param {{ basePrice: number, months: number, extrasTotal: number }} input
 */
export function computeBudget(input) {
  const basePrice = Number(input.basePrice);
  const months = Number(input.months);
  const extrasTotal = Number(input.extrasTotal);

  if (!Number.isFinite(basePrice) || basePrice < 0) throw new Error('Precio base inválido');
  if (!Number.isFinite(months) || months <= 0) throw new Error('Plazo inválido');
  if (!Number.isFinite(extrasTotal) || extrasTotal < 0) throw new Error('Extras inválidos');

  const subTotal = basePrice + extrasTotal;
  const discountRate = discountRateForMonths(months);
  const discountAmount = subTotal * discountRate;
  const total = Math.max(0, subTotal - discountAmount);

  return { subTotal, discountRate, discountAmount, total };
}

function formatCurrencyEUR(value) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
}

/**
 * Inicializa el formulario de presupuesto (en navegador).
 */
export function setupBudgetForm() {
  const form = document.querySelector('[data-budget-form]');
  if (!form) return;

  const nameEl = /** @type {HTMLInputElement|null} */ (form.querySelector('#nombre'));
  const surnameEl = /** @type {HTMLInputElement|null} */ (form.querySelector('#apellidos'));
  const phoneEl = /** @type {HTMLInputElement|null} */ (form.querySelector('#telefono'));
  const emailEl = /** @type {HTMLInputElement|null} */ (form.querySelector('#email'));
  const termsEl = /** @type {HTMLInputElement|null} */ (form.querySelector('#terms'));

  const productEl = /** @type {HTMLSelectElement|null} */ (form.querySelector('#producto'));
  const monthsEl = /** @type {HTMLInputElement|null} */ (form.querySelector('#plazo'));
  const extrasEls = /** @type {NodeListOf<HTMLInputElement>} */ (form.querySelectorAll('input[name="extra"]'));

  const outSubtotal = form.querySelector('[data-out="subtotal"]');
  const outDiscount = form.querySelector('[data-out="discount"]');
  const outTotal = /** @type {HTMLInputElement|null} */ (form.querySelector('#presupuestoFinal'));

  const setFieldError = (id, message) => {
    const errorEl = form.querySelector(`[data-error-for="${id}"]`);
    if (errorEl) errorEl.textContent = message;
  };

  // Valida datos de contacto según enunciado y pinta errores por campo.
  const validateContact = () => {
    const r1 = validateName(nameEl?.value ?? '');
    setFieldError('nombre', r1.message);

    const r2 = validateSurname(surnameEl?.value ?? '');
    setFieldError('apellidos', r2.message);

    const r3 = validatePhone(phoneEl?.value ?? '');
    setFieldError('telefono', r3.message);

    const r4 = validateEmail(emailEl?.value ?? '');
    setFieldError('email', r4.message);

    const r5 = validateTerms(Boolean(termsEl?.checked));
    setFieldError('terms', r5.message);

    return r1.ok && r2.ok && r3.ok && r4.ok && r5.ok;
  };

  // Recalcula el presupuesto con cada cambio (sin botones ni recargar).
  const computeAndRender = () => {
    try {
      const basePrice = Number(productEl?.value ?? NaN);
      const months = Number(monthsEl?.value ?? NaN);
      const extrasTotal = Array.from(extrasEls)
        .filter(e => e.checked)
        .reduce((acc, e) => acc + Number(e.value || 0), 0);

      const { subTotal, discountAmount, total } = computeBudget({ basePrice, months, extrasTotal });

      if (outSubtotal) outSubtotal.textContent = formatCurrencyEUR(subTotal);
      if (outDiscount) outDiscount.textContent = formatCurrencyEUR(discountAmount);
      if (outTotal) outTotal.value = formatCurrencyEUR(total);
    } catch (error) {
      if (outSubtotal) outSubtotal.textContent = '—';
      if (outDiscount) outDiscount.textContent = '—';
      if (outTotal) outTotal.value = '';
    }
  };

  const onBlurValidateIds = new Map([
    ['nombre', () => setFieldError('nombre', validateName(nameEl?.value ?? '').message)],
    ['apellidos', () => setFieldError('apellidos', validateSurname(surnameEl?.value ?? '').message)],
    ['telefono', () => setFieldError('telefono', validatePhone(phoneEl?.value ?? '').message)],
    ['email', () => setFieldError('email', validateEmail(emailEl?.value ?? '').message)]
  ]);

  form.addEventListener('input', (ev) => {
    const target = /** @type {HTMLElement} */ (ev.target);
    if (target?.id === 'terms') setFieldError('terms', validateTerms(Boolean(termsEl?.checked)).message);
    computeAndRender();
  });

  form.addEventListener('change', () => computeAndRender());

  form.addEventListener('blur', (ev) => {
    const target = /** @type {HTMLElement} */ (ev.target);
    const fn = target?.id ? onBlurValidateIds.get(target.id) : undefined;
    if (fn) fn();
  }, true);

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // Bloquea el envío si falta algún campo o no se aceptan las condiciones.
    const ok = validateContact();
    computeAndRender();

    const submitError = form.querySelector('[data-submit-error]');
    if (submitError) submitError.textContent = '';

    if (!ok) {
      if (submitError) submitError.textContent = 'Revisa los campos marcados antes de enviar.';
      return;
    }

    // Sin backend: simulamos envío.
    try {
      const okMsg = form.querySelector('[data-submit-ok]');
      if (okMsg) okMsg.textContent = 'Presupuesto enviado correctamente.';
      form.reset();
      computeAndRender();
      setTimeout(() => { if (okMsg) okMsg.textContent = ''; }, 4000);
    } catch {
      if (submitError) submitError.textContent = 'No se pudo enviar el formulario. Inténtalo de nuevo.';
    }
  });

  const resetBtn = form.querySelector('[data-reset]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      ['nombre','apellidos','telefono','email','terms'].forEach(id => setFieldError(id, ''));
      const okMsg = form.querySelector('[data-submit-ok]');
      const errMsg = form.querySelector('[data-submit-error]');
      if (okMsg) okMsg.textContent = '';
      if (errMsg) errMsg.textContent = '';
      computeAndRender();
    });
  }

  // Render inicial
  computeAndRender();
}
