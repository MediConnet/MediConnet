# 🚀 Guía Rápida para Backend - DOCALINK

## 📋 ¿Qué necesito implementar?

### 1. Sistema de Recuperación de Contraseña (2 endpoints)
### 2. Eliminación de Usuarios (1 endpoint)

---

## 🔐 1. RECUPERACIÓN DE CONTRASEÑA

### Paso 1: Instalar dependencias
```bash
npm install resend bcrypt
```

### Paso 2: Configurar .env
```env
RESEND_API_KEY=re_TU_API_KEY_AQUI
RESEND_FROM_EMAIL=noreply@docalink.com
FRONTEND_URL=http://localhost:5173
```

**Obtener API Key:** https://resend.com (gratis)

### Paso 3: Crear tabla en BD
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Paso 4: Implementar endpoints

#### Endpoint 1: POST /api/auth/forgot-password
```javascript
// Request: { email: "usuario@ejemplo.com" }
// Response: { success: true, message: "Si el email está registrado..." }

// Pasos:
// 1. Buscar usuario por email
// 2. Generar token aleatorio (32 bytes)
// 3. Hashear token con SHA-256
// 4. Guardar en password_resets (expira en 1 hora)
// 5. Enviar email con Resend
// 6. Responder siempre lo mismo (seguridad)
```

#### Endpoint 2: POST /api/auth/reset-password
```javascript
// Request: { token: "abc123...", newPassword: "nueva123" }
// Response: { success: true, data: { message: "Contraseña actualizada..." } }

// Pasos:
// 1. Hashear token recibido con SHA-256
// 2. Buscar en password_resets (no usado, no expirado)
// 3. Validar contraseña (mínimo 6 caracteres)
// 4. Hashear nueva contraseña con bcrypt
// 5. Actualizar user.password
// 6. Marcar token como usado
```

---

## 🗑️ 2. ELIMINACIÓN DE USUARIOS

### Paso 1: Configurar CASCADE en BD
```sql
ALTER TABLE providers
ADD CONSTRAINT fk_provider_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

-- Repetir para: clinics, appointments, reviews, sessions, password_resets
```

### Paso 2: Implementar endpoint

#### Endpoint: DELETE /api/users/:userId
```javascript
// Headers: Authorization: Bearer {token_admin}
// Response: { success: true, message: "Usuario eliminado correctamente" }

// Validaciones:
// 1. Verificar que es ADMIN (del token JWT)
// 2. Verificar que usuario existe
// 3. Verificar que no se elimina a sí mismo
// 4. Eliminar usuario (CASCADE elimina datos relacionados)
// 5. Log de auditoría
```

---

## 🧪 Probar Endpoints

### Recuperación de Contraseña
```bash
# 1. Solicitar recuperación
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com"}'

# 2. Revisar email y copiar token

# 3. Restablecer contraseña
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"abc123...","newPassword":"nueva123"}'
```

### Eliminación de Usuarios
```bash
# 1. Login como admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@docalink.com","password":"admin123"}'

# 2. Eliminar usuario (usar token del paso 1)
curl -X DELETE http://localhost:3000/api/users/123 \
  -H "Authorization: Bearer {token_admin}"
```

---

## ✅ Checklist

### Recuperación de Contraseña
- [ ] Instalar `resend` y `bcrypt`
- [ ] Configurar variables de entorno
- [ ] Crear tabla `password_resets`
- [ ] Implementar `POST /api/auth/forgot-password`
- [ ] Implementar `POST /api/auth/reset-password`
- [ ] Probar flujo completo

### Eliminación de Usuarios
- [ ] Configurar CASCADE en foreign keys
- [ ] Implementar `DELETE /api/users/:userId`
- [ ] Validar que solo admin puede eliminar
- [ ] Validar que admin no se elimine a sí mismo
- [ ] Probar desde frontend

---

## 📚 Documentación Completa

Para código completo y detalles, revisar:

1. **BACKEND_RECUPERACION_CONTRASEÑA.md** - Código completo de recuperación
2. **BACKEND_ENDPOINT_RESET_PASSWORD.md** - Especificación reset-password
3. **BACKEND_ENDPOINT_DELETE_USER.md** - Especificación delete user
4. **RESUMEN_TAREAS_PENDIENTES_BACKEND.md** - Resumen general

---

## 🆘 Ayuda Rápida

### Error: "Token inválido o expirado"
- Verificar que el token se hashea con SHA-256
- Verificar que no haya expirado (1 hora)
- Verificar que no se haya usado

### Error: "No autorizado"
- Verificar que el token JWT sea válido
- Verificar que el usuario sea ADMIN

### Error: "Email no enviado"
- Verificar RESEND_API_KEY en .env
- Verificar que la API Key sea válida
- Revisar logs de Resend

---

**Frontend:** ✅ Completado  
**Backend:** ⏳ Pendiente  
**Build:** ✅ Sin errores

**¡Todo listo para implementar!**
