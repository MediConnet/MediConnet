// NOTE: Logger centralizado — errores técnicos solo en consola (desarrolladores)

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) console.log(...args);
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) console.info(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) console.warn(...args);
  },
  /** Siempre en consola; nunca mostrar este output en UI */
  error: (...args: unknown[]) => {
    console.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (isDevelopment) console.debug(...args);
  },
};

/** Logger con prefijo de módulo: [DoctorSchedule] mensaje */
export function createLogger(scope: string) {
  const prefix = `[${scope}]`;
  return {
    log: (...args: unknown[]) => logger.log(prefix, ...args),
    info: (...args: unknown[]) => logger.info(prefix, ...args),
    warn: (...args: unknown[]) => logger.warn(prefix, ...args),
    error: (...args: unknown[]) => logger.error(prefix, ...args),
    debug: (...args: unknown[]) => logger.debug(prefix, ...args),
  };
}
