# Especificación Backend: Sincronización de Cadenas de Farmacias

## 📋 Resumen

Cuando una farmacia pertenece a una cadena de farmacias, el **nombre comercial**, **logo** y **descripción** deben ser controlados únicamente por el administrador desde el panel de administración. Las farmacias asociadas NO pueden editar estos campos, pero deben ver los datos actualizados de la cadena.

---

## 🔄 Flujo de Sincronización

### 1. **Registro de Farmacia con Cadena**

Cuando una farmacia se registra seleccionando una cadena (`chainId`):

- El backend debe establecer `is_chain_member = true`
- El backend debe copiar los datos de la cadena a la farmacia:
  - `full_name` = `chain.name`
  - `profile_picture_url` = `chain.logo_url`
  - `description` = `chain.description`

---

### 2. **GET /api/pharmacies/profile** (Panel de Farmacia)

**Cuando `is_chain_member === true`**, el backend DEBE devolver:

```json
{
  "success": true,
  "data": {
    "id": "pharma-001",
    "full_name": "Farmacias metropolitana",  // ⭐ Nombre de la cadena
    "profile_picture_url": "https://...",     // ⭐ Logo de la cadena
    "description": "Descripción de la cadena", // ⭐ Descripción de la cadena
    "ruc": "1790710319001",
    "website_url": "www.farmacia.com",
    "address": "Av. Amazonas N25 y Colón",
    "status": "published",
    "whatsapp": "+593 99 123 4567",
    "chain_id": "chain-001",
    "is_chain_member": true,                  // ⭐ CRÍTICO: Debe ser true
    "chain_name": "Farmacias metropolitana",  // ⭐ Nombre de la cadena
    "chain_logo": "https://...",              // ⭐ Logo de la cadena
    "chain_description": "Descripción...",    // ⭐ Descripción de la cadena
    "location": { ... },
    "schedule": [ ... ],
    "stats": { ... },
    "is_active": true
  }
}
```

**Campos críticos:**
- `is_chain_member`: **DEBE ser `true`** (no `null`, no `undefined`, no `false`)
- `chain_name`: Nombre actualizado de la cadena
- `chain_logo`: Logo actualizado de la cadena
- `chain_description`: Descripción actualizada de la cadena
- `full_name`: Debe coincidir con `chain_name`
- `profile_picture_url`: Debe coincidir con `chain_logo`
- `description`: Debe coincidir con `chain_description`

---

### 3. **PUT /api/pharmacies/profile** (Panel de Farmacia)

**Cuando `is_chain_member === true`**, el backend DEBE:

1. **IGNORAR** los siguientes campos si vienen en el request:
   - `full_name` (nombre comercial)
   - `profile_picture_url` (logo)
   - `description` (descripción)

2. **PERMITIR** actualizar solo:
   - `ruc`
   - `website_url`
   - `address`
   - `whatsapp`
   - `status`
   - `is_active`
   - `location`
   - `schedule`

3. **NO permitir** cambiar `chain_id` (una vez asignada, no se puede cambiar)

**Ejemplo de request (farmacia miembro de cadena):**
```json
{
  "ruc": "1790710319001",
  "website_url": "www.farmacia.com",
  "address": "Nueva dirección",
  "whatsapp": "+593 99 123 4567"
}
```

**El backend DEBE ignorar:**
- `full_name` → No actualizar
- `profile_picture_url` → No actualizar
- `description` → No actualizar

---

### 4. **PUT /api/admin/pharmacy-chains/:id** (Panel de Administración)

**Cuando se actualiza una cadena**, el backend DEBE:

1. Actualizar los datos de la cadena en la tabla `pharmacy_chains`
2. **AUTOMÁTICAMENTE actualizar** todas las farmacias asociadas (`chain_id = :id`) con:
   - `full_name` = nuevo `name` de la cadena
   - `profile_picture_url` = nuevo `logo_url` de la cadena
   - `description` = nueva `description` de la cadena

**Ejemplo de actualización en cascada:**

```sql
-- 1. Actualizar la cadena
UPDATE pharmacy_chains 
SET name = 'Nuevo Nombre', logo_url = 'https://...', description = 'Nueva descripción'
WHERE id = 'chain-001';

-- 2. Actualizar TODAS las farmacias asociadas
UPDATE pharmacies 
SET 
  full_name = 'Nuevo Nombre',
  profile_picture_url = 'https://...',
  description = 'Nueva descripción'
WHERE chain_id = 'chain-001' AND is_chain_member = true;
```

**Respuesta del endpoint:**
```json
{
  "success": true,
  "data": {
    "id": "chain-001",
    "name": "Nuevo Nombre",
    "logo_url": "https://...",
    "description": "Nueva descripción",
    "is_active": true,
    "updated_at": "2026-01-31T10:00:00Z"
  },
  "message": "Cadena actualizada. Se actualizaron 15 farmacias asociadas."
}
```

---

## ✅ Validaciones Backend

### Al registrar una farmacia con cadena:

1. Verificar que la cadena existe y está activa
2. Establecer `is_chain_member = true`
3. Copiar datos de la cadena a la farmacia

### Al actualizar perfil de farmacia:

1. Si `is_chain_member === true`:
   - Rechazar cambios a `full_name`, `profile_picture_url`, `description`
   - Retornar error 400 si se intenta cambiar estos campos
2. Si `is_chain_member === false`:
   - Permitir actualizar todos los campos normalmente

### Al actualizar una cadena:

1. Actualizar la cadena
2. Actualizar todas las farmacias asociadas en una transacción
3. Retornar el número de farmacias actualizadas

---

## 🔍 Endpoints Críticos

### 1. GET /api/pharmacies/profile
- **DEBE** devolver `is_chain_member: true` si la farmacia pertenece a una cadena
- **DEBE** devolver `chain_name`, `chain_logo`, `chain_description` actualizados

### 2. PUT /api/pharmacies/profile
- **DEBE** rechazar cambios a `full_name`, `profile_picture_url`, `description` si `is_chain_member === true`
- **DEBE** retornar error 400 con mensaje claro si se intenta cambiar estos campos

### 3. PUT /api/admin/pharmacy-chains/:id
- **DEBE** actualizar la cadena
- **DEBE** actualizar todas las farmacias asociadas en cascada
- **DEBE** retornar el número de farmacias actualizadas

---

## 📝 Ejemplo de Respuesta Correcta

**GET /api/pharmacies/profile** (farmacia miembro de cadena):

```json
{
  "success": true,
  "data": {
    "id": "pharma-001",
    "full_name": "Farmacias metropolitana",
    "profile_picture_url": "https://cdn.example.com/chain-logo.png",
    "description": "Somos parte de tu vida...",
    "ruc": "1790710319001",
    "website_url": "www.farmacia.com",
    "address": "Av. Amazonas N25 y Colón",
    "status": "published",
    "whatsapp": "+593 99 123 4567",
    "chain_id": "chain-001",
    "is_chain_member": true,
    "chain_name": "Farmacias metropolitana",
    "chain_logo": "https://cdn.example.com/chain-logo.png",
    "chain_description": "Somos parte de tu vida...",
    "location": {
      "latitude": -0.1807,
      "longitude": -78.4678,
      "address": "Av. Amazonas N25 y Colón"
    },
    "schedule": [ ... ],
    "stats": {
      "profile_views": 1240,
      "contact_clicks": 350,
      "total_reviews": 128,
      "average_rating": 4.8
    },
    "is_active": true
  }
}
```

---

## ⚠️ Errores Comunes a Evitar

1. **NO** devolver `is_chain_member: null` o `undefined` → Debe ser `true` o `false`
2. **NO** permitir actualizar `full_name`, `profile_picture_url`, `description` si `is_chain_member === true`
3. **NO** olvidar actualizar las farmacias asociadas cuando se actualiza una cadena
4. **NO** devolver datos desactualizados de la cadena en `GET /api/pharmacies/profile`

---

## 🎯 Resultado Esperado

1. ✅ El frontend deshabilita los campos de nombre y logo cuando `is_chain_member === true`
2. ✅ Cuando el admin actualiza una cadena, todas las farmacias asociadas ven los cambios automáticamente
3. ✅ Las farmacias NO pueden editar nombre, logo ni descripción si pertenecen a una cadena
4. ✅ El frontend muestra siempre los datos actualizados de la cadena
