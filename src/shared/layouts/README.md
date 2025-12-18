# Layouts

## ¿Por qué tener varios layouts?

Tener múltiples layouts es una **buena práctica** porque:

1. **Separación de responsabilidades**: Cada layout maneja una sección diferente de la app
2. **Reutilización**: Evitas duplicar código de estructura común
3. **Mantenibilidad**: Cambios en un layout no afectan a otros
4. **Flexibilidad**: Puedes tener layouts específicos para diferentes contextos

## Layouts actuales

### `AppLayout.tsx`
- **Uso**: Páginas autenticadas de la aplicación principal
- **Características**: Header, sidebar, navegación
- **Rutas**: `/home`, `/search`, `/doctor/:id`, etc.

### `AuthLayout.tsx`
- **Uso**: Páginas de autenticación (login, register)
- **Características**: Layout mínimo (las páginas tienen su propio diseño)
- **Rutas**: `/login`, `/register`

## Posibles layouts futuros

### `AdminLayout.tsx`
- Para páginas de administración
- Con navegación específica de admin

### `PublicLayout.tsx`
- Para páginas públicas sin autenticación
- Con footer, header público, etc.

### `MinimalLayout.tsx`
- Para páginas que no necesitan header/sidebar
- Como páginas de error, landing, etc.

## Patrón recomendado

```tsx
// En el router
<Route element={<Layout />}>
  <Route path="/ruta" element={<Page />} />
</Route>
```

Esto permite:
- Agrupar rutas con el mismo layout
- Aplicar guards (ProtectedRoute, RoleRoute) al nivel del layout
- Mantener el código organizado



