# 🚨 Error 404 en Login - Información para Backend

**Fecha:** 2026-02-11  
**Prioridad:** 🔴 CRÍTICA - Bloquea el inicio de sesión  
**Error:** `Request failed with status code 404`

---

## 📋 Problema Reportado

El frontend está recibiendo un **error 404 (Not Found)** al intentar hacer login.

**Error en consola:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
Error al iniciar sesión: AxiosError: Request failed with status code 404
```

**Ubicación del error:**
- Archivo: `src/features/auth/infrastructure/auth.api.ts:87`
- Función: `loginAPI`
- Llamado desde: `LoginPage.tsx:55`

---

## 🔍 URL que el Frontend Está Llamando

### Configuración del Frontend

El frontend está configurado para llamar a:

**Base URL:** `env.API_URL` (por defecto: `https://api.mediconnet.com/v1`)  
**Endpoint:** `/auth/login`  
**Método:** `POST`

**URL Completa que se está intentando:**
```
{API_URL}/auth/login
```

**Ejemplos:**
- Si `VITE_API_URL=http://localhost:3000/api` → `http://localhost:3000/api/auth/login`
- Si `VITE_API_URL=https://api.mediconnet.com/v1` → `https://api.mediconnet.com/v1/auth/login`
- Si no hay `.env` configurado → `https://api.mediconnet.com/v1/auth/login` (valor por defecto)

---

## ✅ Endpoint que el Backend DEBE Tener

### **POST `/auth/login`**

**Ruta completa esperada:**
- Si la baseURL es `http://localhost:3000/api` → El backend debe tener: `POST /api/auth/login`
- Si la baseURL es `http://localhost:3000` → El backend debe tener: `POST /auth/login`

**⚠️ IMPORTANTE:** El frontend llama a `/auth/login` (relativo a la baseURL), así que el backend debe tener la ruta completa según su configuración.

**Ejemplo de código del frontend:**
```typescript
// src/features/auth/infrastructure/auth.api.ts
export const loginAPI = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await httpClient.post<{ success: boolean; data: LoginResponse }>(
    '/auth/login',  // ← Esta es la ruta relativa
    credentials
  );
  return extractData(response);
};
```

---

## 📤 Request que Envía el Frontend

### Headers
```
Content-Type: application/json
```

**Nota:** El header `Authorization` NO se envía en el login (solo se envía después de autenticarse).

### Body
```json
{
  "email": "admin@medicones.com",
  "password": "admin123"
}
```

**Estructura del request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

---

## 📥 Respuesta que el Frontend Espera

### ✅ Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "admin@medicones.com",
      "name": "Admin User",
      "role": "ADMIN",
      "tipo": null,
      "isActive": true,
      "profilePictureUrl": null,
      "provider": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Campos requeridos:**
- ✅ `success: true` - **OBLIGATORIO**
- ✅ `data.user` - Objeto con información del usuario
  - `id` - ID del usuario
  - `email` - Email del usuario
  - `name` - Nombre del usuario (opcional)
  - `role` - Rol del usuario (ADMIN, DOCTOR, CLINIC, etc.)
  - `tipo` - Tipo de proveedor (opcional, puede ser null)
- ✅ `data.token` o `data.accessToken` - JWT token para autenticación

**Nota:** El frontend acepta tanto `token` como `accessToken`, pero necesita al menos uno.

### ❌ Respuesta de Error

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

**Códigos de estado HTTP esperados:**
- `400` - Datos inválidos (email o password mal formateados)
- `401` - Credenciales incorrectas
- `404` - **Endpoint no encontrado** (este es el error actual) ⚠️
- `500` - Error del servidor

---

## 🔧 Verificaciones que el Backend Debe Hacer

### 1. ¿El endpoint existe?

Verificar que el backend tenga el endpoint:
- ✅ `POST /api/auth/login` (si la baseURL incluye `/api`)
- ✅ O `POST /auth/login` (si la baseURL no incluye `/api`)

**Ejemplo Express.js:**
```javascript
// Opción 1: Si las rutas están bajo /api
app.post('/api/auth/login', loginController);

// Opción 2: Si las rutas son directas
app.post('/auth/login', loginController);

// Opción 3: Con router
router.post('/auth/login', loginController);
app.use('/api', router); // Entonces la ruta completa sería /api/auth/login
```

### 2. ¿CORS está configurado?

El backend debe permitir requests desde el frontend:
```
Access-Control-Allow-Origin: http://localhost:5173 (o el dominio del frontend)
Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
```

**Ejemplo Express.js:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // O el dominio del frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. ¿La ruta está registrada correctamente?

Verificar en el código del backend que:
- ✅ La ruta esté registrada antes de los middlewares de error
- ✅ No haya conflictos con otras rutas
- ✅ El método HTTP sea `POST` (no `GET`)

### 4. ¿El servidor está corriendo?

Verificar que:
- ✅ El servidor del backend esté iniciado
- ✅ Esté escuchando en el puerto correcto
- ✅ No haya errores al iniciar el servidor

---

## 🧪 Cómo Verificar

### Desde el Backend:

1. **Verificar que el servidor esté corriendo:**
   ```bash
   # Verificar en qué puerto está corriendo
   # Ejemplo: http://localhost:3000
   ```

2. **Probar el endpoint directamente con curl:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@medicones.com","password":"admin123"}'
   ```

3. **Probar con Postman o Insomnia:**
   - URL: `http://localhost:3000/api/auth/login` (o la ruta que corresponda)
   - Method: `POST`
   - Headers: `Content-Type: application/json`
   - Body: `{"email":"admin@medicones.com","password":"admin123"}`

4. **Verificar logs del servidor:**
   - ¿Llega la petición al servidor?
   - ¿Qué ruta está intentando acceder?
   - ¿Hay algún error en los logs?
   - ¿El controlador se está ejecutando?

### Desde el Frontend (Network Tab):

1. Abrir **Developer Tools** (F12)
2. Ir a la pestaña **Network**
3. Intentar hacer login
4. Buscar la petición a `/auth/login`
5. Verificar:
   - **Request URL:** ¿Cuál es la URL completa?
   - **Status Code:** ¿404, 200, 401, etc.?
   - **Request Headers:** ¿Se están enviando correctamente?
   - **Response:** ¿Qué retorna el servidor?

---

## 📝 Información que Necesitamos del Backend

Para solucionar el problema, necesitamos que el backend confirme:

### 1. URL Base del Backend
- ¿En qué URL está corriendo el backend?
  - [ ] `http://localhost:3000`
  - [ ] `http://localhost:3001`
  - [ ] `http://localhost:8000`
  - [ ] Otro: _______

### 2. Estructura de Rutas
- ¿Cuál es la ruta exacta del endpoint de login?
  - [ ] `/api/auth/login`
  - [ ] `/auth/login`
  - [ ] `/v1/auth/login`
  - [ ] Otra: _______

### 3. Estado del Servidor
- ¿El backend está corriendo ahora?
  - [ ] Sí
  - [ ] No

### 4. Configuración de CORS
- ¿CORS está configurado?
  - [ ] Sí
  - [ ] No
  - [ ] No estoy seguro

### 5. Middleware o Proxy
- ¿Hay algún middleware o proxy que modifique las rutas?
  - [ ] Sí, especificar: _______
  - [ ] No

---

## 🚀 Solución Esperada

Una vez que el backend confirme:

1. ✅ **URL base del backend** (ej: `http://localhost:3000/api`)
2. ✅ **Ruta exacta del endpoint** (ej: `/auth/login` o `/api/auth/login`)
3. ✅ **Que el endpoint esté funcionando** (probar con curl/Postman)

El frontend configurará la variable de entorno `VITE_API_URL` con la URL correcta.

**Ejemplo de configuración en `.env`:**
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📋 Ejemplos de Configuración Correcta

### Escenario 1: Backend en puerto 3000 con prefijo `/api`

**Backend:**
```javascript
// Express.js
app.post('/api/auth/login', loginController);
// Servidor corriendo en: http://localhost:3000
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3000/api
```

**Resultado:** Frontend llama a `http://localhost:3000/api/auth/login` ✅

---

### Escenario 2: Backend en puerto 3000 sin prefijo

**Backend:**
```javascript
// Express.js
app.post('/auth/login', loginController);
// Servidor corriendo en: http://localhost:3000
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3000
```

**Resultado:** Frontend llama a `http://localhost:3000/auth/login` ✅

---

### Escenario 3: Backend con versión `/v1`

**Backend:**
```javascript
// Express.js
app.use('/api/v1', authRoutes);
// authRoutes.post('/auth/login', loginController);
// Servidor corriendo en: http://localhost:3000
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3000/api/v1
```

**Resultado:** Frontend llama a `http://localhost:3000/api/v1/auth/login` ✅

---

## 🔍 Debugging Adicional

### Si el endpoint existe pero sigue dando 404:

1. **Verificar orden de middlewares:**
   ```javascript
   // ❌ INCORRECTO - El middleware de error captura todo antes
   app.use(errorHandler);
   app.post('/api/auth/login', loginController);

   // ✅ CORRECTO - Las rutas antes de los middlewares de error
   app.post('/api/auth/login', loginController);
   app.use(errorHandler);
   ```

2. **Verificar que no haya conflicto de rutas:**
   ```javascript
   // Verificar que no haya otra ruta que capture primero
   app.get('/api/auth/*', someOtherHandler); // Esto podría interferir
   ```

3. **Verificar logs del servidor:**
   - ¿Se está registrando la petición?
   - ¿Hay algún middleware que esté bloqueando?

---

## 📞 Contacto y Soporte

**Si el backend necesita más información:**
- Ver documentación completa en: `CAMBIOS_FRONTEND_BACKEND.md`
- Ver formato de respuestas esperado en la misma documentación
- Ver otros endpoints en: `CHECKLIST_100.md`

**Para probar rápidamente:**
1. Confirmar URL base del backend
2. Confirmar ruta exacta del endpoint
3. Probar con curl/Postman que funcione
4. Enviar la información al frontend para configurar `.env`

---

## ✅ Checklist para el Backend

Antes de confirmar que está listo, verificar:

- [ ] El servidor está corriendo
- [ ] El endpoint `POST /auth/login` (o la ruta correspondiente) existe
- [ ] El endpoint responde con formato `{ success: true, data: {...} }`
- [ ] CORS está configurado correctamente
- [ ] Se puede probar con curl/Postman y funciona
- [ ] Los logs muestran que las peticiones llegan al servidor
- [ ] No hay errores en los logs del servidor

---

**Última actualización:** 2026-02-11  
**Estado:** ⚠️ Esperando confirmación del backend sobre URL y ruta exacta
