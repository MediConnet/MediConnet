# 📋 Resumen de Tareas Pendientes para Backend

**Fecha:** 12 de Febrero, 2026  
**Proyecto:** DOCALINK  
**Estado Frontend:** ✅ Completado y Funcionando  
**Estado Backend:** ⏳ Pendiente de Implementación

---

## 🎯 Tareas Pendientes

El frontend está completamente implementado y funcionando. Ahora necesitamos que el backend implemente los siguientes endpoints:

### 1. Sistema de Recuperación de Contraseña (2 endpoints)
### 2. Eliminación de Usuarios (1 endpoint)

---

## 🔐 TAREA 1: Sistema de Recuperación de Contraseña

### Descripción
Permitir a TODOS los usuarios (clínicas, doctores, farmacias, laboratorios, ambulancias, insumos, pacientes, admin) recuperar su contraseña mediante email.

### Endpoints Requeridos

#### 1.1. POST /api/auth/forgot-password
**Función:** Enviar email con enlace de recuperación

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Si el email está registrado, recibirás un enlace de recuperación en los próximos minutos."
}
```

**Validaciones:**
- ✅ Verificar que el email existe en la BD
- ✅ Siempre responder el mismo mensaje (no revelar si el email existe - seguridad)
- ✅ Generar token único y aleatorio (32 bytes)
- ✅ Hashear token con SHA-256 antes de guardar en BD
- ✅ Token expira en 1 hora
- ✅ Límite de 3 intentos por hora por email
- ✅ Enviar email con enlace: `${FRONTEND_URL}/reset-password?token=${token}`

---

#### 1.2. POST /api/auth/reset-password
**Función:** Actualizar contraseña con token válido

**Request Body:**
```json
{
  "token": "abc123def456...",
  "newPassword": "nuevaContraseña123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "message": "Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña."
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Token inválido o expirado. Por favor solicita un nuevo enlace de recuperación."
}
```

**Validaciones:**
- ✅ Verificar que token existe en BD
- ✅ Verificar que token no ha expirado (1 hora)
- ✅ Verificar que token no ha sido usado
- ✅ Validar contraseña mínimo 6 caracteres
- ✅ Hashear nueva contraseña con bcrypt (10 rondas)
- ✅ Actualizar contraseña del usuario
- ✅ Marcar token como usado (used = true, usedAt = now)

---

### Tabla Requerida: password_resets

```sql
CREATE TABLE password_resets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_email (email),
  INDEX idx_expires_at (expires_at)
);
```

---

### Dependencias Necesarias

```bash
npm install resend bcrypt
```

---

### Variables de Entorno

Agregar al archivo `.env`:

```env
# Servicio de Email (Resend)
RESEND_API_KEY=re_TU_API_KEY_AQUI
RESEND_FROM_EMAIL=noreply@docalink.com

# URL del Frontend
FRONTEND_URL=http://localhost:5173
# En producción: FRONTEND_URL=https://docalink.com
```

**⚠️ IMPORTANTE:** 
- Obtener API Key en: https://resend.com (gratis)
- NUNCA subir el archivo `.env` a GitHub
- Agregar `.env` a `.gitignore`

---

### Documentación Detallada

Para implementación completa, revisar estos archivos:

1. **BACKEND_RECUPERACION_CONTRASEÑA.md** - Configuración general y código completo
2. **BACKEND_ENDPOINT_RESET_PASSWORD.md** - Especificación detallada del endpoint reset-password

---

## 🗑️ TAREA 2: Eliminación de Usuarios

### Descripción
Permitir a administradores eliminar permanentemente usuarios de la base de datos.

### Endpoint Requerido

#### DELETE /api/users/:userId
**Función:** Eliminar usuario permanentemente

**Headers:**
```
Authorization: Bearer {token_del_admin}
```

**URL Parameters:**
- `userId` (string, requerido): ID del usuario a eliminar

**Response Success (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado correctamente"
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "No autorizado. Solo administradores pueden eliminar usuarios."
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "No puedes eliminar tu propia cuenta de administrador"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

### Validaciones Requeridas

1. ✅ **Verificar autenticación:** Solo usuarios autenticados
2. ✅ **Verificar autorización:** Solo usuarios con rol `ADMIN`
3. ✅ **Evitar auto-eliminación:** Admin no puede eliminarse a sí mismo
4. ✅ **Verificar existencia:** Usuario debe existir en BD
5. ✅ **Eliminar datos relacionados:** Usar CASCADE o eliminar manualmente

---

### Configuración de Base de Datos

**Opción 1: CASCADE en Foreign Keys (Recomendado)**

```sql
-- Configurar CASCADE para eliminar automáticamente datos relacionados
ALTER TABLE providers
ADD CONSTRAINT fk_provider_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE clinics
ADD CONSTRAINT fk_clinic_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE appointments
ADD CONSTRAINT fk_appointment_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE reviews
ADD CONSTRAINT fk_review_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE sessions
ADD CONSTRAINT fk_session_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE password_resets
ADD CONSTRAINT fk_password_reset_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;
```

**Opción 2: Eliminación Manual (Si no tienes CASCADE)**

Eliminar manualmente en este orden:
1. Reviews
2. Appointments
3. Sessions
4. Password Resets
5. Provider/Clinic
6. User

---

### Logs de Auditoría (Recomendado)

```javascript
// Antes de eliminar
console.log(`🗑️ Admin ${requestingUser.email} eliminando usuario ${userToDelete.email} (ID: ${userId})`);

// Después de eliminar
console.log(`✅ Usuario ${userToDelete.email} eliminado exitosamente`);
```

---

### Documentación Detallada

Para implementación completa, revisar:

**BACKEND_ENDPOINT_DELETE_USER.md** - Especificación completa con código de ejemplo

---

## 🧪 Cómo Probar

### Recuperación de Contraseña

#### 1. Probar forgot-password
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com"}'
```

#### 2. Verificar email recibido
- Revisar bandeja de entrada
- Copiar el token del enlace

#### 3. Probar reset-password
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"abc123def456...",
    "newPassword":"nuevaContraseña123"
  }'
```

#### 4. Verificar login con nueva contraseña
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"usuario@ejemplo.com",
    "password":"nuevaContraseña123"
  }'
```

---

### Eliminación de Usuarios

#### 1. Login como admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@docalink.com",
    "password":"admin123"
  }'
```

#### 2. Copiar token de la respuesta

#### 3. Eliminar usuario
```bash
curl -X DELETE http://localhost:3000/api/users/123 \
  -H "Authorization: Bearer {token_admin}"
```

#### 4. Verificar que el usuario ya no existe
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer {token_admin}"
```

---

## ✅ Checklist de Implementación

### Recuperación de Contraseña
- [ ] Instalar dependencias: `npm install resend bcrypt`
- [ ] Configurar variables de entorno (RESEND_API_KEY, FRONTEND_URL)
- [ ] Crear cuenta en Resend y obtener API Key
- [ ] Crear tabla `password_resets` en BD
- [ ] Crear servicio de email (`email.service.js`)
- [ ] Implementar endpoint `POST /api/auth/forgot-password`
- [ ] Implementar endpoint `POST /api/auth/reset-password`
- [ ] Probar flujo completo desde frontend
- [ ] Verificar que llegue el email
- [ ] Verificar que se actualice la contraseña
- [ ] Verificar que el token expire en 1 hora
- [ ] Verificar que el token solo se use una vez

### Eliminación de Usuarios
- [ ] Implementar endpoint `DELETE /api/users/:userId`
- [ ] Agregar middleware de autenticación
- [ ] Agregar middleware de autorización (solo admin)
- [ ] Validar que el usuario existe
- [ ] Validar que admin no se elimine a sí mismo
- [ ] Configurar CASCADE en foreign keys (o eliminar manualmente)
- [ ] Agregar logs de auditoría
- [ ] Probar desde Postman/curl
- [ ] Probar desde frontend
- [ ] Verificar que se eliminen datos relacionados

---

## 🔒 Consideraciones de Seguridad

### Recuperación de Contraseña
1. ✅ Token hasheado en BD (SHA-256)
2. ✅ Contraseña hasheada (bcrypt, 10 rondas)
3. ✅ Respuesta estándar (no revelar si email existe)
4. ✅ Expiración corta (1 hora)
5. ✅ Un solo uso por token
6. ✅ Límite de intentos (3 por hora)
7. ✅ HTTPS en producción

### Eliminación de Usuarios
1. ✅ Solo administradores
2. ✅ Admin no puede eliminarse a sí mismo
3. ✅ Confirmación antes de eliminar
4. ✅ Logs de auditoría
5. ✅ Eliminar datos relacionados (CASCADE)
6. ✅ Rate limiting (opcional)

---

## 📚 Recursos

### Resend (Servicio de Email)
- Sitio web: https://resend.com
- Documentación: https://resend.com/docs
- Pricing: Gratis hasta 3,000 emails/mes

### Bcrypt (Hashing de Contraseñas)
- NPM: https://www.npmjs.com/package/bcrypt
- Documentación: https://github.com/kelektiv/node.bcrypt.js

### Seguridad
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Password Reset Best Practices: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html

---

## 🆘 Soporte

Si tienes dudas o problemas:

1. Revisa los archivos de documentación detallada:
   - `BACKEND_RECUPERACION_CONTRASEÑA.md`
   - `BACKEND_ENDPOINT_RESET_PASSWORD.md`
   - `BACKEND_ENDPOINT_DELETE_USER.md`

2. Verifica que las variables de entorno estén correctas

3. Revisa los logs del servidor

4. Prueba con Postman/curl antes de probar desde el frontend

5. Verifica que las tablas existan en la base de datos

---

## 📊 Estado del Proyecto

### ✅ Completado (Frontend)
- Página de recuperación de contraseña (`/forgot-password`)
- Página de restablecimiento de contraseña (`/reset-password`)
- Botón de eliminar usuario en administración
- Modal de confirmación de eliminación
- Validaciones de formularios
- Manejo de errores
- Estados de loading
- Diseño responsive
- Logo DOCALINK actualizado

### ⏳ Pendiente (Backend)
- Endpoint `POST /api/auth/forgot-password`
- Endpoint `POST /api/auth/reset-password`
- Endpoint `DELETE /api/users/:userId`
- Tabla `password_resets`
- Servicio de email con Resend
- Configuración de CASCADE en foreign keys
- Logs de auditoría

---

## 🎯 Prioridad

### Alta Prioridad
1. **Sistema de Recuperación de Contraseña** - Funcionalidad crítica para usuarios que olvidan su contraseña

### Media Prioridad
2. **Eliminación de Usuarios** - Funcionalidad administrativa importante

---

## 📝 Notas Finales

- El frontend está completamente implementado y probado
- El build se completa sin errores: `npm run build` ✅
- Todos los componentes están listos para conectarse con el backend
- La documentación incluye código de ejemplo completo
- Se incluyen casos de prueba y validaciones
- Se consideran aspectos de seguridad y mejores prácticas

---

**¡El frontend está listo! Ahora solo falta implementar el backend siguiendo esta documentación.**

**Archivos de referencia:**
- `BACKEND_RECUPERACION_CONTRASEÑA.md` (configuración completa)
- `BACKEND_ENDPOINT_RESET_PASSWORD.md` (especificación reset-password)
- `BACKEND_ENDPOINT_DELETE_USER.md` (especificación delete user)
- `FRONTEND_RESET_PASSWORD_IMPLEMENTADO.md` (resumen frontend)

---

**Fecha de creación:** 12 de Febrero, 2026  
**Última actualización:** 12 de Febrero, 2026  
**Versión:** 1.0
