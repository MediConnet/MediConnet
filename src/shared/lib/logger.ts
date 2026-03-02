// NOTE: Logger helper para controlar logs en producción
// Solo muestra logs en desarrollo, excepto errores que siempre se muestran

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  /**
   * Log de información general (solo en desarrollo)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log de información (solo en desarrollo)
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Log de advertencias (solo en desarrollo)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log de errores (siempre se muestran, incluso en producción)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * Log de debug (solo en desarrollo)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
