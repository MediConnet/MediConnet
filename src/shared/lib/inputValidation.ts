/**
 * Utilidades de validación para inputs
 * Funciones para restringir caracteres según el tipo de campo
 */

export type InputType = 'numbers' | 'letters' | 'both';

/**
 * Valida y filtra el input según el tipo permitido
 * @param value - Valor del input
 * @param type - Tipo de validación: 'numbers' (solo números), 'letters' (solo letras), 'both' (ambos)
 * @returns Valor filtrado según el tipo
 */
export const validateInput = (value: string, type: InputType): string => {
  if (type === 'numbers') {
    // Solo números, puntos y comas (para decimales)
    return value.replace(/[^0-9.,]/g, '');
  }
  
  if (type === 'letters') {
    // Solo letras, espacios y caracteres especiales comunes (ñ, acentos, guiones)
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '');
  }
  
  // 'both' - permite números, letras y caracteres comunes
  return value;
};

/**
 * Handler para inputs que solo aceptan números
 */
export const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  callback: (value: string) => void
) => {
  const filtered = validateInput(e.target.value, 'numbers');
  callback(filtered);
};

/**
 * Handler para inputs que solo aceptan letras
 */
export const handleLetterInput = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  callback: (value: string) => void
) => {
  const filtered = validateInput(e.target.value, 'letters');
  callback(filtered);
};

/**
 * Handler para inputs que aceptan ambos (números y letras)
 */
export const handleBothInput = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  callback: (value: string) => void
) => {
  const filtered = validateInput(e.target.value, 'both');
  callback(filtered);
};

/**
 * Valida formato de teléfono (permite números, espacios, guiones, paréntesis y +)
 */
export const handlePhoneInput = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  callback: (value: string) => void
) => {
  const value = e.target.value;
  // Permite números, espacios, guiones, paréntesis, + y el símbolo #
  const filtered = value.replace(/[^0-9\s\-()+#]/g, '');
  callback(filtered);
};

/**
 * Valida formato de email
 */
export const handleEmailInput = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  callback: (value: string) => void
) => {
  const value = e.target.value;
  // Permite letras, números, puntos, guiones, guiones bajos y @
  const filtered = value.replace(/[^a-zA-Z0-9._@-]/g, '');
  callback(filtered);
};

