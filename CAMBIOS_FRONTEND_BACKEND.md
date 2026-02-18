# 📋 Cambios en Frontend - Información para Backend

**Fecha:** 2026-02-11  
**Proyecto:** MediConnet / DOCALINK  
**Prioridad:** Alta - Necesario para despliegue a producción

---

## 🎯 Resumen Ejecutivo

Se realizaron cambios críticos en el frontend para prepararlo para producción. El frontend ahora está configurado para trabajar con variables de entorno y espera una API backend con formato de respuestas estándar.

---

## 🔄 Cambios Principales Realizados

### 1. Eliminación de URLs Hardcodeadas

**ANTES:**
- El frontend tenía URLs hardcodeadas de `localhost:3000`
- Ejemplo: `const API_URL = 'http://localhost:3000/api';`

**AHORA:**
- El frontend usa variables de entorno: `VITE_API_URL`
- Valor por defecto: `https://api.mediconnet.com/v1`
- **Archivos modificados:**
  - `src/app/store/auth.store.ts`
  - `src/shared/components/SendEmailForm.tsx`

**Impacto para Backend:**
- ✅ El backend debe estar disponible en la URL configurada en `VITE_API_URL`
- ✅ Debe funcionar tanto en desarrollo como en producción

---

### 2. Configuración de Variables de Entorno

**Archivo creado:** `.env.example`

El frontend ahora requiere estas variables:

```env
# URL base de la API del backend
VITE_API_URL=https://api.mediconnet.com/v1

# Nombre de la aplicación
VITE_APP_NAME=DOCALINK

# Entorno (development | production)
VITE_NODE_ENV=production
```

**Solicitud al Backend:**
- ⚠️ **Necesitamos confirmar la URL de la API en producción**
- ¿Cuál será la URL final? (ej: `https://api.mediconnet.com/v1`)

---

## 🔌 Configuración de CORS y Headers

### Headers que Envía el Frontend

El frontend envía automáticamente en todas las peticiones:

```
Authorization: Bearer {token}
Content-Type: application/json
```

### Headers que el Backend DEBE Retornar

**CORS - El backend debe configurar:**

```
Access-Control-Allow-Origin: {dominio-del-frontend}
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
```

**Ejemplo para desarrollo:**
```
Access-Control-Allow-Origin: http://localhost:3000
```

**Ejemplo para producción:**
```
Access-Control-Allow-Origin: https://mediconnet.com
```

---

## 📡 Formato de Respuestas Esperado

### ✅ Respuestas Exitosas

El frontend espera **SIEMPRE** este formato:

```json
{
  "success": true,
  "data": {
    // ... datos de la respuesta
  },
  "message": "Mensaje opcional" // Opcional
}
```

**Ejemplos:**

**Login exitoso:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "doctor@example.com",
      "name": "Dr. Juan Pérez",
      "role": "DOCTOR"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Lista de usuarios:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Usuario 1",
      "email": "user1@example.com"
    },
    {
      "id": "2",
      "name": "Usuario 2",
      "email": "user2@example.com"
    }
  ]
}
```

**Operación exitosa sin datos:**
```json
{
  "success": true,
  "data": null,
  "message": "Usuario eliminado correctamente"
}
```

### ❌ Respuestas de Error

El frontend maneja errores con este formato:

```json
{
  "success": false,
  "message": "Mensaje de error descriptivo para el usuario",
  "errors": {
    "code": "ERROR_CODE", // Opcional - código interno
    "field": "Campo específico con error" // Opcional
  }
}
```

**Ejemplos:**

**Error de validación:**
```json
{
  "success": false,
  "message": "Los datos proporcionados no son válidos",
  "errors": {
    "code": "VALIDATION_ERROR",
    "email": "El email ya está en uso"
  }
}
```

**Error de autenticación:**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

**Error de permisos:**
```json
{
  "success": false,
  "message": "No tienes permisos para realizar esta acción"
}
```

### 📊 Códigos de Estado HTTP

El frontend maneja estos códigos automáticamente:

| Código | Acción del Frontend |
|--------|---------------------|
| `200` | ✅ Muestra datos normalmente |
| `201` | ✅ Muestra datos normalmente |
| `400` | ⚠️ Muestra mensaje de error del backend |
| `401` | 🔴 **Cierra sesión automáticamente** |
| `403` | ⚠️ Muestra "Acceso denegado" |
| `404` | ⚠️ Muestra "No encontrado" |
| `500` | ⚠️ Muestra mensaje de error genérico |

---

## 🔐 Autenticación y Tokens

### Flujo de Autenticación

#### 1. Login
**Endpoint:** `POST /auth/login`  
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "Nombre Usuario",
      "role": "DOCTOR",
      "tipo": "clinic"
    },
    "token": "jwt-token-aqui"
  }
}
```

#### 2. Verificar Sesión
**Endpoint:** `GET /auth/me`  
**Header:** `Authorization: Bearer {token}`

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "Nombre Usuario",
    "role": "DOCTOR"
  }
}
```

**Si el token es inválido:**
- Retornar `401 Unauthorized`
- El frontend cerrará sesión automáticamente

#### 3. Logout
**Endpoint:** `POST /auth/logout`  
**Header:** `Authorization: Bearer {token}`

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

**Nota:** El frontend llama a este endpoint al hacer logout para revocar el token en el servidor.

---

## 🚨 Endpoints Críticos que DEBEN Estar Disponibles

### Autenticación
- ✅ `POST /auth/login` - Iniciar sesión
- ✅ `POST /auth/register` - Registro (con multipart para documentos)
- ✅ `POST /auth/logout` - Cerrar sesión
- ✅ `GET /auth/me` - Verificar sesión actual
- ✅ `POST /auth/forgot-password` - Recuperar contraseña
- ✅ `POST /auth/reset-password` - Resetear contraseña

### Admin Dashboard
- ✅ `GET /admin/users` - Lista de usuarios
- ✅ `DELETE /admin/users/:id` - **Eliminar usuario** ✅ **IMPLEMENTADO Y VERIFICADO**
  - Endpoint correcto: `/admin/users/:id` (no `/users/:id`)
  - Implementado en: `src/features/admin-dashboard/infrastructure/users.api.ts`
  - Usado en: `src/features/admin-dashboard/presentation/pages/UsersPage.tsx`
- ✅ `PATCH /admin/users/:id` - Actualizar usuario
- ✅ `PATCH /admin/users/:id/toggle-status` - Activar/desactivar usuario
- ✅ `GET /admin/requests` - Solicitudes de proveedores pendientes
- ✅ `POST /admin/requests/:id/approve` - Aprobar solicitud
- ✅ `POST /admin/requests/:id/reject` - Rechazar solicitud
- ✅ `GET /admin/ad-requests` - Solicitudes de anuncios
- ✅ `POST /admin/ad-requests/:id/approve` - Aprobar anuncio
- ✅ `POST /admin/ad-requests/:id/reject` - Rechazar anuncio

### Clínica
- ✅ `GET /clinics/profile` - Perfil de la clínica
- ✅ `PUT /clinics/profile` - Actualizar perfil (acepta Base64 para logo)
- ✅ `GET /clinics/doctors` - Lista de médicos de la clínica
- ✅ `DELETE /clinics/doctors/:id` - Eliminar médico
- ✅ `POST /clinics/invite` - Generar link de invitación
  - Body: `{ email: "doctor@example.com" }`
  - Respuesta: `{ success: true, data: { invitationLink: "https://..." } }`
- ✅ `GET /clinics/invite/:token` - Validar token de invitación
  - Respuesta: `{ success: true, data: { clinicName, doctorEmail, expiresAt } }`
- ✅ `POST /clinics/invite/:token/reject` - Rechazar invitación
- ✅ `PATCH /clinics/doctors/:id/fee` - Actualizar tarifa de consulta
  - Body: `{ consultationFee: 50.00 }`

### Doctor
- ✅ `GET /doctors/profile` - Perfil del doctor
- ✅ `PUT /doctors/profile` - Actualizar perfil
- ✅ `GET /doctors/reviews` - Reseñas del doctor
- ✅ `GET /doctors/payments` - Pagos del doctor

### Otros Paneles
- ✅ Endpoints similares para: **Farmacia**, **Laboratorio**, **Ambulancia**, **Insumos Médicos**

---

## 📤 Envío de Archivos (Multipart/Form-Data)

### Registro de Profesionales

El frontend envía documentos en el registro de profesionales:

**Endpoint:** `POST /auth/register`  
**Content-Type:** `multipart/form-data`

**Campos enviados:**
- `email` - string
- `password` - string
- `name` - string
- `role` - string (DOCTOR, PHARMACY, etc.)
- `tipo` - string (clinic, independent, etc.)
- `licenses[]` - **Archivos** (array de archivos)
- `certificates[]` - **Archivos** (array de archivos)
- `titles[]` - **Archivos** (array de archivos)
- Otros campos del formulario

**El backend debe:**
1. ✅ Recibir archivos en formato `multipart/form-data`
2. ✅ Guardar archivos en storage (S3, local, etc.)
3. ✅ Retornar URLs de los archivos guardados
4. ✅ Persistir metadata en la base de datos

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "email": "doctor@example.com",
    "documents": [
      {
        "id": "doc1",
        "type": "license",
        "url": "https://storage.example.com/license.pdf",
        "name": "licencia.pdf"
      }
    ]
  }
}
```

### Actualización de Logo (Clínica)

**Endpoint:** `PUT /clinics/profile`  
**Body:** Puede incluir `logoUrl` como Base64:
```json
{
  "name": "Clínica Ejemplo",
  "logoUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**El backend debe:**
- ✅ Convertir Base64 a archivo
- ✅ Guardar en storage
- ✅ Retornar URL pública del logo

---

## ⚡ Configuración de Timeout y Performance

- **Timeout configurado:** 30 segundos
- **Requests rápidos (sin loading):**
  - `/auth/me` - Verificación de sesión
  - `/health` - Health check

**Recomendación:** El backend debe responder en menos de 30 segundos para todas las operaciones.

---

## 🧪 Testing y Validación

### Checklist para Backend

Antes de desplegar, el backend debe verificar:

- [ ] ✅ CORS configurado correctamente para el dominio del frontend
- [ ] ✅ Todos los endpoints retornan formato `{ success, data }`
- [ ] ✅ Errores retornan formato `{ success: false, message }`
- [ ] ✅ Autenticación con Bearer token funciona correctamente
- [ ] ✅ Logout revoca el token en el servidor
- [ ] ✅ Multipart/form-data funciona en registro
- [ ] ✅ Health check disponible: `GET /health`
- [ ] ✅ Endpoint de eliminar usuario funciona: `DELETE /admin/users/:id`
- [ ] ✅ Endpoints de invitaciones de clínica funcionan
- [ ] ✅ Manejo de Base64 para logos funciona

---

## 📝 Información que Necesitamos del Backend

Para completar la configuración del frontend, necesitamos:

### 1. URL de la API en Producción
- ¿Cuál será la URL final?
  - Ejemplo: `https://api.mediconnet.com/v1`
  - O: `https://backend.mediconnet.com/api/v1`

### 2. Dominio del Frontend (para CORS)
- ¿Cuál será el dominio del frontend en producción?
  - Ejemplo: `https://mediconnet.com`
  - O: `https://www.mediconnet.com`

### 3. Configuración de AWS Cognito (si aplica)
- `COGNITO_USER_POOL_ID`
- `COGNITO_CLIENT_ID`
- `COGNITO_REGION`

---

## 🚀 Próximos Pasos

### Backend debe:
1. ✅ Confirmar URL de API en producción
2. ✅ Verificar que CORS esté configurado
3. ✅ Validar formato de respuestas estándar
4. ✅ Probar endpoints críticos (especialmente `DELETE /admin/users/:id`)
5. ✅ Confirmar endpoints de invitaciones de clínica

### Frontend hará:
1. ✅ Configurar `.env` con URL de producción
2. ✅ Probar build completo: `npm run build`
3. ✅ Probar conexión con backend de producción
4. ✅ Desplegar frontend

---

## 📞 Contacto y Soporte

**Si hay dudas sobre:**
- Formato de respuestas
- Endpoints específicos
- Configuración de CORS
- Manejo de archivos

**Contactar al equipo de frontend con:**
- Ejemplos de requests/responses
- Códigos de error específicos
- Logs de la consola del navegador

---

## 📚 Documentación Adicional

El frontend tiene documentación adicional en:
- `CHECKLIST_100.md` - Lista de endpoints que aún usan mocks
- `CHECKLIST_DESPLIEGUE.md` - Checklist completo de despliegue

---

## ✅ Resumen de Cambios Técnicos

| Cambio | Archivo | Impacto |
|--------|---------|---------|
| Variables de entorno | `auth.store.ts`, `SendEmailForm.tsx` | ✅ URLs dinámicas |
| Configuración de build | `vite.config.ts` | ✅ Optimización producción |
| SEO mejorado | `index.html` | ✅ Meta tags completos |
| Protección .env | `.gitignore` | ✅ Seguridad |

---

**Última actualización:** 2026-02-11  
**Versión Frontend:** Preparado para producción  
**Estado:** ✅ Listo para integración con backend
