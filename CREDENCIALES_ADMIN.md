# 🔑 Credenciales de Administrador - MediConnet

## 👨‍💼 Usuarios Administradores

### Admin Principal
```
Email:    admin@medicones.com
Password: admin123
Rol:      admin
```

### Admin Secundario
```
Email:    admin2@medicones.com
Password: admin123
Rol:      admin
```

---

## 🚀 Cómo Usar

### 1. Login en el Frontend
```
URL: http://localhost:5173/login
Email: admin@medicones.com
Password: admin123
```

### 2. Acceso al Panel de Admin
Después de hacer login, serás redirigido automáticamente al panel de administración:
```
URL: /admin/dashboard
```

---

## 📋 Funcionalidades del Admin

### Panel de Administración
- ✅ Ver estadísticas generales
- ✅ Gestionar solicitudes de proveedores
- ✅ Aprobar/Rechazar solicitudes de anuncios
- ✅ Ver historial de actividad
- ✅ Gestionar usuarios
- ✅ Ver estadísticas de servicios
- ✅ Configuración del sistema

### Endpoints Disponibles
```
GET  /api/admin/dashboard/stats
GET  /api/admin/requests
PUT  /api/admin/requests/:id/approve
PUT  /api/admin/requests/:id/reject
GET  /api/admin/ad-requests
PUT  /api/admin/ad-requests/:id/approve
PUT  /api/admin/ad-requests/:id/reject
GET  /api/admin/activity-history
GET  /api/admin/service-stats
GET  /api/admin/settings
```

---

## 🧪 Probar con cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medicones.com",
    "password": "admin123"
  }'
```

### Obtener Estadísticas (con token)
```bash
curl -X GET http://localhost:3000/api/admin/dashboard/stats \
  -H "Authorization: Bearer <tu-token-aqui>"
```

---

## 🔐 Seguridad

### Contraseñas Hasheadas
Las contraseñas en la base de datos están hasheadas con bcrypt:
```
Contraseña plana: admin123
Hash bcrypt: $2b$10$[hash-generado-por-bcrypt]
```

### Cambiar Contraseña (Recomendado)
Para producción, cambia las contraseñas por defecto:

1. **Desde el panel de admin:**
   - Ir a Configuración → Cambiar Contraseña

2. **Desde la base de datos:**
```javascript
const bcrypt = require('bcrypt');
const newPassword = await bcrypt.hash('nueva-contraseña-segura', 10);
// Actualizar en la base de datos
```

---

## 👥 Otros Usuarios de Prueba

### Doctor
```
Email:    doctor@medicones.com
Password: doctor123
Rol:      provider (doctor)
```

### Farmacia
```
Email:    farmacia@medicones.com
Password: farmacia123
Rol:      provider (pharmacy)
```

### Clínica
```
Email:    clinica@medicones.com
Password: clinica123
Rol:      provider (clinic)
```

### Laboratorio
```
Email:    laboratorio@medicones.com
Password: lab123
Rol:      provider (laboratory)
```

### Ambulancia
```
Email:    ambulancia@medicones.com
Password: ambulancia123
Rol:      provider (ambulance)
```

### Paciente
```
Email:    paciente@medicones.com
Password: paciente123
Rol:      patient
```

---

## 📝 Notas Importantes

1. **Estas son credenciales de desarrollo/prueba**
   - NO usar en producción
   - Cambiar antes de deploy

2. **Roles del Sistema**
   - `admin` - Administrador del sistema
   - `provider` - Proveedores de servicios (doctor, farmacia, etc.)
   - `patient` - Pacientes

3. **Primer Login**
   - Al hacer login, recibirás un JWT token
   - El token expira en 24 horas (configurable)
   - Guarda el token para hacer peticiones autenticadas

4. **Refresh Token**
   - Si el token expira, usa el refresh token
   - Endpoint: `POST /api/auth/refresh`

---

## 🔍 Verificar Usuarios en la Base de Datos

### SQL Query
```sql
SELECT id, email, role, is_active, created_at 
FROM users 
WHERE role = 'admin';
```

### Resultado Esperado
```
id                                   | email                    | role  | is_active | created_at
-------------------------------------|--------------------------|-------|-----------|-------------------
uuid-1                               | admin@medicones.com      | admin | true      | 2025-01-15 10:00:00
uuid-2                               | admin2@medicones.com     | admin | true      | 2025-01-15 10:00:00
```

---

## 🚨 Troubleshooting

### Error: "Invalid credentials"
- Verifica que el email sea exacto: `admin@medicones.com`
- Verifica que la contraseña sea: `admin123`
- Verifica que el usuario exista en la base de datos

### Error: "User not found"
- El usuario no existe en la base de datos
- Ejecuta el seed/migration para crear usuarios iniciales

### Error: "Token expired"
- El token JWT expiró
- Haz login nuevamente o usa el refresh token

### Error: "Forbidden"
- El usuario no tiene permisos de admin
- Verifica que el rol sea `admin` en la base de datos

---

## 📚 Documentación Relacionada

- **Datos Iniciales:** `INITIAL_DATA_FOR_BACKEND.md`
- **Endpoints Backend:** `BACKEND_ENDPOINTS.md`
- **Guía de Integración:** `API_INTEGRATION.md`
- **Mensaje del Backend:** `MENSAJE_PARA_FRONTEND.md`

---

**Última actualización:** Enero 2025  
**Ambiente:** Desarrollo/Pruebas  
**⚠️ CAMBIAR ANTES DE PRODUCCIÓN**
