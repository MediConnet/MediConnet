// NOTE: Configuración de variables de entorno
/**
 * Variables de entorno de la aplicación
 * Se cargan desde el archivo .env usando el prefijo VITE_
 */
export const env = {
  // En desarrollo, usar localhost. En producción, usar la URL de producción
  API_URL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'development' 
    ? 'http://localhost:3000/api' 
    : 'https://medi-connect-backend-1-2c8b.onrender.com/api'),
  APP_NAME: import.meta.env.VITE_APP_NAME || 'DOCALINK',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development',
  // AWS Cognito (opcional - si se usa autenticación directa desde frontend)
  COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID,
  COGNITO_REGION: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
} as const;

