# 🚀 Checklist de Despliegue - MediConnet

**Fecha:** 2026-02-11  
**Estado Actual:** ~75% listo para producción  
**Objetivo:** Llegar al 100% para despliegue seguro y profesional

---

## 🔴 CRÍTICO - Bloquea Despliegue

### 1. URLs Hardcodeadas de Localhost ⚠️

**Problema:** Hay URLs hardcodeadas que romperán en producción:

- ❌ `src/app/store/auth.store.ts:27` → `const API_URL = 'http://localhost:3000/api';`
- ❌ `src/shared/components/SendEmailForm.tsx:40` → `'http://localhost:3000/send-email'`

**Solución:**
```typescript
// Usar env.API_URL en lugar de localhost
const API_URL = env.API_URL || 'https://api.mediconnet.com/v1';
```

**Acción:** Reemplazar TODAS las URLs hardcodeadas por variables de entorno.

---

### 2. Variables de Entorno Faltantes

**Problema:** No hay archivo `.env.example` ni documentación de variables requeridas.

**Solución:** Crear `.env.example`:
```env
# API Configuration
VITE_API_URL=https://api.mediconnet.com/v1
VITE_APP_NAME=MediConnet
VITE_NODE_ENV=production

# AWS Cognito (si se usa)
VITE_COGNITO_USER_POOL_ID=
VITE_COGNITO_CLIENT_ID=
VITE_COGNITO_REGION=us-east-1
```

**Acción:** 
- [ ] Crear `.env.example`
- [ ] Documentar todas las variables en README
- [ ] Asegurar que `.env` esté en `.gitignore`

---

### 3. Configuración de Build para Producción

**Problema:** `vite.config.ts` está muy básico, falta optimización.

**Solución:** Agregar configuración de producción:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Desactivar en producción
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
})
```

**Acción:** Optimizar configuración de build.

---

## 🟡 IMPORTANTE - Mejora Calidad

### 4. SEO y Meta Tags

**Problema:** `index.html` tiene meta tags básicos.

**Solución:** Mejorar SEO:
```html
<meta name="description" content="DOCALINK - Plataforma integral de servicios médicos en Ecuador. Agenda citas, encuentra doctores, farmacias, laboratorios y más." />
<meta name="keywords" content="salud, médicos, citas médicas, farmacias, laboratorios, Ecuador" />
<meta name="author" content="DOCALINK" />
<meta property="og:title" content="DOCALINK - Conecta tu salud" />
<meta property="og:description" content="Plataforma integral de servicios médicos en Ecuador" />
<meta property="og:image" content="/src/assets/docalink-logo.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

**Acción:** Agregar meta tags completos para SEO.

---

### 5. Error Boundaries

**Problema:** No hay Error Boundaries para capturar errores de React.

**Solución:** Crear `ErrorBoundary.tsx`:
```typescript
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Algo salió mal
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {this.state.error?.message || 'Error desconocido'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Recargar página
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Acción:** Implementar Error Boundaries en puntos clave.

---

### 6. Manejo de Imágenes Externas

**Problema:** Hay URLs de imágenes externas (Unsplash) que pueden fallar.

**Solución:** 
- Agregar `onError` handlers a todas las imágenes
- Considerar usar un CDN propio
- Implementar placeholders

**Acción:** Revisar y mejorar manejo de imágenes.

---

### 7. Performance y Optimización

**Pendientes:**
- [ ] Lazy loading de rutas
- [ ] Code splitting optimizado
- [ ] Optimización de imágenes (WebP, lazy load)
- [ ] Service Worker para cache (PWA)
- [ ] Compresión de assets

**Acción:** Implementar optimizaciones de performance.

---

## 🟢 RECOMENDADO - Mejoras Adicionales

### 8. Testing

**Falta:**
- [ ] Tests unitarios (Jest/Vitest)
- [ ] Tests de integración
- [ ] Tests E2E (Playwright/Cypress)

**Acción:** Agregar suite de tests básica.

---

### 9. Documentación de Despliegue

**Falta:**
- [ ] README con instrucciones de despliegue
- [ ] Guía de configuración de variables de entorno
- [ ] Documentación de arquitectura
- [ ] Guía de troubleshooting

**Acción:** Crear documentación completa.

---

### 10. Seguridad

**Revisar:**
- [ ] Headers de seguridad (CSP, X-Frame-Options)
- [ ] Validación de inputs en frontend
- [ ] Sanitización de datos
- [ ] Rate limiting en frontend (si aplica)
- [ ] HTTPS obligatorio

**Acción:** Auditar seguridad básica.

---

### 11. Analytics y Monitoreo

**Falta:**
- [ ] Google Analytics / Plausible
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

**Acción:** Integrar herramientas de monitoreo.

---

### 12. Accesibilidad (A11y)

**Revisar:**
- [ ] ARIA labels
- [ ] Navegación por teclado
- [ ] Contraste de colores
- [ ] Screen reader compatibility

**Acción:** Auditar accesibilidad básica.

---

## 📋 Checklist Rápido Pre-Despliegue

### Antes de Desplegar:

- [ ] **Eliminar todas las URLs de localhost**
- [ ] **Crear `.env.example` y documentar variables**
- [ ] **Optimizar `vite.config.ts` para producción**
- [ ] **Mejorar meta tags y SEO**
- [ ] **Implementar Error Boundaries**
- [ ] **Ejecutar `npm run build` sin errores**
- [ ] **Ejecutar `npm run lint` sin errores**
- [ ] **Probar build localmente con `npm run preview`**
- [ ] **Verificar que todas las rutas funcionen**
- [ ] **Probar login/logout en build de producción**
- [ ] **Verificar que las imágenes se carguen correctamente**
- [ ] **Revisar consola del navegador (sin errores críticos)**

---

## 🎯 Prioridades para Llegar al 100%

### Fase 1 (CRÍTICO - 1-2 días):
1. ✅ Eliminar URLs de localhost
2. ✅ Configurar variables de entorno
3. ✅ Optimizar build
4. ✅ Probar build completo

### Fase 2 (IMPORTANTE - 2-3 días):
5. ✅ SEO y meta tags
6. ✅ Error Boundaries
7. ✅ Manejo de imágenes
8. ✅ Performance básica

### Fase 3 (RECOMENDADO - 1 semana):
9. ✅ Testing básico
10. ✅ Documentación
11. ✅ Seguridad
12. ✅ Analytics

---

## 📊 Estado Actual vs Objetivo

| Categoría | Estado Actual | Objetivo | Prioridad |
|-----------|---------------|----------|-----------|
| URLs y Config | ❌ 60% | ✅ 100% | 🔴 CRÍTICO |
| Build | ⚠️ 70% | ✅ 100% | 🔴 CRÍTICO |
| SEO | ⚠️ 50% | ✅ 100% | 🟡 IMPORTANTE |
| Error Handling | ⚠️ 40% | ✅ 100% | 🟡 IMPORTANTE |
| Performance | ⚠️ 60% | ✅ 100% | 🟡 IMPORTANTE |
| Testing | ❌ 0% | ✅ 80% | 🟢 RECOMENDADO |
| Documentación | ⚠️ 50% | ✅ 100% | 🟢 RECOMENDADO |
| Seguridad | ⚠️ 70% | ✅ 100% | 🟢 RECOMENDADO |

**Progreso General: ~75% → Objetivo: 100%**

---

## 🚀 Comandos para Despliegue

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env con variables de producción
cp .env.example .env
# Editar .env con valores reales

# 3. Build de producción
npm run build

# 4. Verificar build localmente
npm run preview

# 5. Desplegar carpeta 'dist' a tu hosting
# (Vercel, Netlify, AWS S3, etc.)
```

---

## 📝 Notas Finales

- **No desplegar con mocks activos** (ver `CHECKLIST_100.md`)
- **Asegurar que el backend esté en producción** antes de desplegar frontend
- **Probar en ambiente staging primero**
- **Tener rollback plan** listo

---

**Última actualización:** 2026-02-11  
**Próxima revisión:** Después de implementar Fase 1
