# 🚀 Configuración para Desarrollo Local - DOCALINK

## ✅ Cambios Aplicados

### 1. Configuración del `.env`
```env
# Backend URL - Cambiar según el entorno
# Para desarrollo local, usar: http://localhost:3000/api
# Para producción, usar: https://doca-link-backend.onrender.com/api
VITE_API_URL=http://localhost:3000/api

VITE_APP_NAME=DOCALINK
VITE_NODE_ENV=development
```

### 2. Rebranding Completo a DOCALINK
- ✅ Nombre actualizado en toda la aplicación
- ✅ Logo configurado: `/docalink-logo.png`
- ✅ Tagline: "Conecta tu salud"
- ✅ Título de página actualizado
- ✅ Meta tags actualizados
- ✅ Footer actualizado
- ✅ Componente de logo configurado

### 3. Archivos Modificados
- `.env` - Configurado para localhost
- `src/app/config/env.ts` - Nombre por defecto actualizado
- `src/shared/components/Footer.tsx` - Branding actualizado
- `src/features/home/infrastructure/home.api.ts` - Textos actualizados
- `src/features/clinic-panel/presentation/pages/ClinicInvitationPage.tsx` - Referencia actualizada

## 🔧 Próximos Pasos

### Para Conectar al Backend Local:

1. **Asegúrate de que el backend esté corriendo en el puerto 3000:**
   ```bash
   # En la carpeta del backend
   npm run dev
   # o
   npm start
   ```

2. **Inicia el frontend:**
   ```bash
   npm run dev
   ```

3. **El frontend se conectará automáticamente a:**
   ```
   http://localhost:3000/api
   ```

### Para Volver a Producción:

Simplemente cambia el `.env`:
```env
VITE_API_URL=https://doca-link-backend.onrender.com/api
VITE_NODE_ENV=production
```

## 📝 Notas Importantes

- El archivo `env.ts` tiene un fallback automático a `localhost:3000` en modo desarrollo
- El logo está en: `public/docalink-logo.png` y `src/assets/docalink-logo.png`
- Todos los componentes ya usan el nombre "DOCALINK"
- El build se completó exitosamente sin errores

## 🎨 Branding DOCALINK

- **Nombre:** DOCALINK
- **Tagline:** Conecta tu salud
- **Logo:** Cruz médica + estetoscopio + enlace
- **Colores:** Turquesa, azul y morado
- **Año:** © 2025

## ⚠️ Recordatorio

Cuando trabajes en local, asegúrate de que:
1. El backend esté corriendo en `http://localhost:3000`
2. El `.env` apunte a `http://localhost:3000/api`
3. Reinicia el servidor de desarrollo después de cambiar el `.env`
