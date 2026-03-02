// NOTE: Configuración de variables de entorno
/**
 * Variables de entorno de la aplicación
 * Se cargan desde el archivo .env usando el prefijo VITE_
 */

/**
 * Función helper para asegurar que la URL siempre termine en /api
 */
const ensureApiUrl = (url: string | undefined, fallback: string): string => {
  const baseUrl = url || fallback;
  
  // Si la URL no termina en /api, agregarlo
  if (!baseUrl.endsWith('/api')) {
    // Remover trailing slash si existe
    const cleanUrl = baseUrl.replace(/\/$/, '');
    return `${cleanUrl}/api`;
  }
  
  return baseUrl;
};

// URL base del backend (sin /api)
const getBaseBackendUrl = (): string => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:3000';
  }
  return 'https://api.docalink.com';
};

// Construir URL completa con /api
const buildApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  const fallback = `${getBaseBackendUrl()}/api`;
  
  if (envUrl) {
    return ensureApiUrl(envUrl, fallback);
  }
  
  return fallback;
};

export const env = {
  // En desarrollo, usar localhost. En producción, usar la URL de producción
  // SIEMPRE termina en /api
  API_URL: buildApiUrl(),
  APP_NAME: import.meta.env.VITE_APP_NAME || 'DOCALINK',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development',
  // AWS Cognito (opcional - si se usa autenticación directa desde frontend)
  COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID,
  COGNITO_REGION: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
} as const;

