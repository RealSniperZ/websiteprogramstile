/**
 * Validadores puros (testables) para el formulario de contacto.
 * - Reglas del enunciado:
 *   - Nombre: solo letras, max 15
 *   - Apellidos: solo letras, max 40
 *   - Teléfono: solo números, longitud 9
 *   - Email: formato estándar
 */

const LETTERS_REGEX = /^[\p{L} ]+$/u;
const DIGITS_REGEX = /^\d+$/;

/** @param {string} value */
export function normalize(value) {
  return (value ?? '').trim();
}

/** @param {string} value */
export function validateName(value) {
  const v = normalize(value);
  if (!v) return { ok: false, message: 'El nombre es obligatorio.' };
  if (v.length > 15) return { ok: false, message: 'Máximo 15 caracteres.' };
  if (!LETTERS_REGEX.test(v)) return { ok: false, message: 'Solo letras y espacios.' };
  return { ok: true, message: '' };
}

/** @param {string} value */
export function validateSurname(value) {
  const v = normalize(value);
  if (!v) return { ok: false, message: 'Los apellidos son obligatorios.' };
  if (v.length > 40) return { ok: false, message: 'Máximo 40 caracteres.' };
  if (!LETTERS_REGEX.test(v)) return { ok: false, message: 'Solo letras y espacios.' };
  return { ok: true, message: '' };
}

/** @param {string} value */
export function validatePhone(value) {
  const v = normalize(value);
  if (!v) return { ok: false, message: 'El teléfono es obligatorio.' };
  if (!DIGITS_REGEX.test(v)) return { ok: false, message: 'Solo números.' };
  if (v.length !== 9) return { ok: false, message: 'Debe tener 9 dígitos.' };
  return { ok: true, message: '' };
}

/** @param {string} value */
export function validateEmail(value) {
  const v = normalize(value);
  if (!v) return { ok: false, message: 'El correo es obligatorio.' };
  // Regex pragmática (evita overfitting): local@domain.tld
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(v)) return { ok: false, message: 'Formato de correo inválido.' };
  return { ok: true, message: '' };
}

/**
 * Valida un checkbox de términos.
 * @param {boolean} checked
 */
export function validateTerms(checked) {
  if (!checked) return { ok: false, message: 'Debes aceptar las condiciones.' };
  return { ok: true, message: '' };
}
