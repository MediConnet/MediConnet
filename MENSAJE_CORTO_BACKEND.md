# 🚨 PROBLEMA CRÍTICO: Endpoint de Ambulancia No Funciona

## Fecha: 10 de febrero de 2026

---

## 🎯 EL PROBLEMA

Cuando un usuario se registra como ambulancia y el admin aprueba, al iniciar sesión el endpoint `GET /api/ambulances/profile` devuelve error:

```
Error: Error al obtener ambulancia
```

---

## 🔍 LO QUE ESTÁ PASANDO

1. ✅ Usuario se registra como ambulancia
2. ✅ Admin aprueba la solicitud
3. ✅ Usuario inicia sesión → Token JWT generado correctamente
4. ✅ Frontend envía request: `GET /api/ambulances/profile` con Bearer token
5. ❌ **Backend devuelve error**: "Error al obtener ambulancia"

---

## 🔧 LO QUE NECESITAN VERIFICAR

### 1. ¿Se Crea el Provider al Aprobar?

Cuando el admin aprueba una solicitud de ambulancia, ¿se crea el registro en la tabla `providers`?

```sql
-- Verificar si existe el provider
SELECT * FROM providers WHERE user_id = 'USER_ID_DEL_TOKEN';
```

**Debe existir un registro con:**
- `user_id` = ID del usuario que se registró
- `category_id` = ID de la categoría "Ambulancia"
- `verification_status` = 'verified'

### 2. ¿Se Crea la Ambulancia al Aprobar?

Cuando el admin aprueba, ¿se crea el registro en la tabla `ambulances`?

```sql
-- Verificar si existe la ambulancia
SELECT * FROM ambulances WHERE provider_id = 'PROVIDER_ID';
```

**Debe existir un registro con:**
- `provider_id` = ID del provider
- Datos de la ambulancia (nombre comercial, teléfono, etc.)

### 3. ¿El Endpoint Busca Correctamente?

El endpoint `GET /api/ambulances/profile` debe:

```javascript
// 1. Obtener user_id del token JWT
const userId = req.user.id;

// 2. Buscar el provider
const provider = await Provider.findOne({
  where: { user_id: userId }
});

if (!provider) {
  return res.status(404).json({
    success: false,
    message: 'No se encontró un proveedor asociado a este usuario'
  });
}

// 3. Buscar la ambulancia
const ambulance = await Ambulance.findOne({
  where: { provider_id: provider.id }
});

if (!ambulance) {
  return res.status(404).json({
    success: false,
    message: 'No se encontró una ambulancia asociada a este proveedor'
  });
}

// 4. Devolver el perfil
return res.json({
  success: true,
  data: ambulance
});
```

---

## 🧪 CÓMO PROBAR

### Paso 1: Registrar una ambulancia de prueba

Email: `test-ambulancia@ejemplo.com`
Contraseña: `test123`

### Paso 2: Aprobar la solicitud

Desde el panel de admin, aprobar la solicitud.

### Paso 3: Verificar en la BD

```sql
-- 1. Buscar el usuario
SELECT id, email, role FROM users WHERE email = 'test-ambulancia@ejemplo.com';

-- 2. Buscar el provider (usar el user_id del paso anterior)
SELECT * FROM providers WHERE user_id = 'USER_ID_AQUI';

-- 3. Buscar la ambulancia (usar el provider_id del paso anterior)
SELECT * FROM ambulances WHERE provider_id = 'PROVIDER_ID_AQUI';
```

### Paso 4: Iniciar sesión y verificar

1. Iniciar sesión con `test-ambulancia@ejemplo.com`
2. Copiar el token JWT de la respuesta
3. Hacer request manual:

```bash
curl -X GET http://localhost:3000/api/ambulances/profile \
  -H "Authorization: Bearer TOKEN_AQUI"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "commercialName": "Nombre de la ambulancia",
    "emergencyPhone": "0999999999",
    "whatsappContact": "0999999999",
    ...
  }
}
```

---

## 📊 LOGS RECOMENDADOS

Agregar estos logs en el endpoint para depurar:

```javascript
console.log('🔍 [AMBULANCE PROFILE] 1. User ID del token:', userId);

const provider = await Provider.findOne({ where: { user_id: userId } });
console.log('🔍 [AMBULANCE PROFILE] 2. Provider encontrado:', provider);

if (!provider) {
  console.error('❌ [AMBULANCE PROFILE] No se encontró provider para user_id:', userId);
  return res.status(404).json({ success: false, message: 'Provider no encontrado' });
}

const ambulance = await Ambulance.findOne({ where: { provider_id: provider.id } });
console.log('🔍 [AMBULANCE PROFILE] 3. Ambulancia encontrada:', ambulance);

if (!ambulance) {
  console.error('❌ [AMBULANCE PROFILE] No se encontró ambulancia para provider_id:', provider.id);
  return res.status(404).json({ success: false, message: 'Ambulancia no encontrada' });
}
```

---

## ✅ RESULTADO ESPERADO

Después de la corrección:

1. Usuario se registra como ambulancia
2. Admin aprueba → Se crean registros en `providers` y `ambulances`
3. Usuario inicia sesión
4. Request a `GET /api/ambulances/profile` devuelve los datos correctos
5. Dashboard muestra el perfil de la ambulancia del usuario

---

## 🚨 URGENCIA

🔴 **CRÍTICO** - Los usuarios no pueden usar la aplicación después de registrarse.

---

## 📝 NOTA

El frontend está funcionando correctamente:
- ✅ Token se genera correctamente
- ✅ Token se guarda correctamente
- ✅ Token se envía correctamente en el header Authorization
- ✅ El problema está 100% en el backend

**El error está en:**
1. La creación de registros al aprobar la solicitud, O
2. La lógica del endpoint `GET /api/ambulances/profile`

---

**Contacto**: Frontend Team
**Fecha**: 10 de febrero de 2026
**Prioridad**: 🔴 CRÍTICA
