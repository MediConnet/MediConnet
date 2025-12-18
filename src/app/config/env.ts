// NOTE: Configuración de variables de entorno
// TODO: Agregar más variables según sea necesario (API keys, etc.)

/**
 * Variables de entorno de la aplicación
 * Se cargan desde el archivo .env usando el prefijo VITE_
 */
export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MediConnect',
  NODE_ENV: import.meta.env.MODE || 'development',
} as const;

