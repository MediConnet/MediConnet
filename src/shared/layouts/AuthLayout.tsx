// NOTE: Layout para páginas de autenticación (login, register)
// Este layout es mínimo porque LoginPage ya tiene su propio diseño completo
// Útil para agrupar rutas de autenticación y aplicar lógica común si es necesario

import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  // NOTE: Las páginas de auth (LoginPage) ya tienen su propio layout completo
  // Este layout solo actúa como contenedor para el router
  // TODO: Si necesitas agregar elementos comunes a todas las páginas de auth (footer, etc.), hazlo aquí
  return <Outlet />;
};


