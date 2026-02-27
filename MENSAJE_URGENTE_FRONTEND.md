# 🚨 Error 404 - Frontend aún llama a rutas sin `/api`

## 📋 Problema Detectado

El frontend **sigue haciendo peticiones sin el prefijo `/api`**, lo que causa errores 404.

### ❌ URL Actual (Incorrecta):
```
POST https://medi-connect-backend-1-2c8b.onrender.com/auth/login
```

### ✅ URL Correcta (Esperada):
```
POST https://medi-connect-backend-1-2c8b.onrender.com/api/auth/login
```

---

## 🔍 Evidencia del Error

En la consola del navegador se ve:
```
POST https://medi-connect-backend-1-2c8b.onrender.com/auth/login 404 (Not Found)
Error al iniciar sesión: AxiosError: Request failed with status code 404
```

**El frontend NO está usando el prefijo `/api` en la URL base.**

---

## ✅ Solución

### 1. Verificar Archivo de Configuración

**Archivo:** `.env` o `src/app/config/env.ts`

```typescript
// ✅ CORRECTO
VITE_API_URL=https://medi-connect-backend-1-2c8b.onrender.com/api

// ❌ INCORRECTO (lo que está pasando ahora)
VITE_API_URL=https://medi-connect-backend-1-2c8b.onrender.com
```

**IMPORTANTE:** La URL debe terminar en `/api`, no solo en `.com`

### 2. Verificar Cliente HTTP

**Archivo:** `src/shared/lib/http.ts` o similar

```typescript
// ✅ CORRECTO
export const httpClient: AxiosInstance = axios.create({
  baseURL: env.API_URL, // Debe ser: https://medi-connect-backend-1-2c8b.onrender.com/api
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Luego usar rutas relativas:
httpClient.post('/auth/login', data) // → /api/auth/login ✅
```

### 3. Verificar Variables de Entorno en Vercel

Si usan variables de entorno en Vercel, verificar que:

```
VITE_API_URL=https://medi-connect-backend-1-2c8b.onrender.com/api
```

**NO:**
```
VITE_API_URL=https://medi-connect-backend-1-2c8b.onrender.com
```

---

## 🧪 Verificación

### Paso 1: Verificar en el código
Buscar dónde se define la URL base y confirmar que termina en `/api`

### Paso 2: Limpiar caché
- Hard refresh: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
- O probar en modo incógnito

### Paso 3: Verificar deployment
- Confirmar que los cambios se desplegaron en Vercel
- Verificar que las variables de entorno en Vercel estén correctas

### Paso 4: Prueba desde consola
Abrir la consola del navegador y ejecutar:

```javascript
// Esto debería funcionar:
fetch('https://medi-connect-backend-1-2c8b.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
```

Si esta petición funciona, el problema es que el frontend no está usando la URL base correcta.

---

## 📝 Checklist de Verificación

Por favor, verifiquen:

- [ ] El archivo `.env` tiene `VITE_API_URL` con `/api` al final
- [ ] El archivo de configuración (`env.ts`) tiene la URL base con `/api`
- [ ] El cliente HTTP (axios/fetch) usa la URL base correcta
- [ ] Las variables de entorno en Vercel están configuradas con `/api`
- [ ] Se hizo un nuevo deployment después de los cambios
- [ ] Se limpió la caché del navegador
- [ ] Se probó en modo incógnito

---

## 🔧 Archivos a Revisar

1. **`.env`** - Variable de entorno local
2. **`src/app/config/env.ts`** - Configuración de entorno
3. **`src/shared/lib/http.ts`** - Cliente HTTP (axios)
4. **Variables de entorno en Vercel** - Configuración de producción

---

## ⚠️ Nota Importante

El backend está funcionando correctamente. El problema es que el frontend no está usando la URL base correcta con el prefijo `/api`.

**Todas las rutas del backend están bajo `/api`:**
- ✅ `/api/auth/login`
- ✅ `/api/auth/register`
- ✅ `/api/auth/me`
- ✅ `/api/auth/logout`
- ✅ `/api/health`
- ✅ `/api/patients/...`
- ✅ `/api/doctors/...`
- etc.

---

## 📞 Siguiente Paso

Una vez corregida la URL base:

1. El error 404 debería desaparecer
2. El login debería funcionar correctamente
3. Todas las demás peticiones deberían funcionar

Si después de corregir la URL base aún hay problemas, avísenme y revisamos los logs del backend.

---

**Fecha:** 27 de Febrero, 2026  
**Backend URL:** `https://medi-connect-backend-1-2c8b.onrender.com/api`  
**Estado Backend:** ✅ Funcionando correctamente  
**Problema:** Frontend no usa el prefijo `/api` en la URL base
