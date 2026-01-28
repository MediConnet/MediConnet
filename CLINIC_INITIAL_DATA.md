# 🏥 Datos Iniciales para Clínica - MediConnet

Este documento contiene todos los datos necesarios para crear la cuenta de prueba de **Clínica** en el backend.

---

## 📋 Índice

1. [Usuario de Clínica](#usuario-de-clínica)
2. [Perfil de Proveedor](#perfil-de-proveedor)
3. [Endpoints para Pruebas](#endpoints-para-pruebas)
4. [Inserción en Base de Datos](#inserción-en-base-de-datos)
5. [Script Prisma Seed](#script-prisma-seed)

---

## 👤 Usuario de Clínica

### Clínica Central

**Credenciales de Login:**
- **Email:** `clinic@medicones.com`
- **Password:** `clinic123`
- **Role:** `provider`
- **ServiceType:** `clinic`

**Datos Completos del Usuario:**
```json
{
  "email": "clinic@medicones.com",
  "password": "clinic123",
  "name": "Clínica Central",
  "role": "provider",
  "serviceType": "clinic",
  "tipo": "clinic",
  "isActive": true
}
```

---

## 🏢 Perfil de Proveedor

### Datos del Perfil de Clínica

```json
{
  "commercialName": "Clínica Central",
  "description": "Clínica médica con múltiples especialidades y médicos asociados. Ofrecemos atención integral de salud con tecnología de vanguardia.",
  "address": "Av. Principal 456, Quito",
  "phone": "0998765432",
  "whatsapp": "+593 99 876 5432",
  "specialties": [
    "Medicina General",
    "Cardiología",
    "Pediatría",
    "Ginecología",
    "Traumatología",
    "Neurología"
  ],
  "logoUrl": null,
  "isActive": true,
  "verificationStatus": "APPROVED"
}
```

**Nota:** Las especialidades se almacenan como un array de strings en el perfil de la clínica.

---

## 🧪 Endpoints para Pruebas

### 1. Login de Clínica

**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "clinic@medicones.com",
  "password": "clinic123"
}
```

**Response Esperada:**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "uuid-del-usuario",
      "email": "clinic@medicones.com",
      "name": "Clínica Central",
      "role": "provider",
      "serviceType": "clinic",
      "tipo": "clinic"
    },
    "token": "jwt-token-here",
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

### 2. Obtener Perfil de Clínica

**GET** `/api/clinics/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Esperada:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-de-la-clinica",
    "name": "Clínica Central",
    "logoUrl": null,
    "specialties": [
      "Medicina General",
      "Cardiología",
      "Pediatría",
      "Ginecología"
    ],
    "address": "Av. Principal 456, Quito",
    "phone": "0998765432",
    "whatsapp": "+593 99 876 5432",
    "generalSchedule": {
      "monday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      "tuesday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      "wednesday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      "thursday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      "friday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      "saturday": { "enabled": false, "startTime": null, "endTime": null },
      "sunday": { "enabled": false, "startTime": null, "endTime": null }
    },
    "description": "Clínica médica con múltiples especialidades...",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Obtener Dashboard de Clínica

**GET** `/api/clinics/dashboard`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Esperada:**
```json
{
  "success": true,
  "data": {
    "totalDoctors": 0,
    "activeDoctors": 0,
    "totalAppointments": 0,
    "todayAppointments": 0
  }
}
```

---

## 💾 Inserción en Base de Datos

### SQL Directo

```sql
-- 1. Crear usuario de clínica
INSERT INTO users (
  id,
  email,
  password_hash,
  role,
  is_active,
  created_at
) VALUES (
  gen_random_uuid(),
  'clinic@medicones.com',
  '$2b$10$TuHashAqui', -- Hash de 'clinic123' usando bcrypt
  'provider',
  true,
  NOW()
) RETURNING id;

-- 2. Obtener el category_id para 'clinic' (ajustar según tu tabla service_categories)
-- Asumiendo que existe una categoría para clínicas
SELECT id FROM service_categories WHERE slug = 'clinic' LIMIT 1;

-- 3. Crear perfil de proveedor (provider)
INSERT INTO providers (
  id,
  user_id,
  category_id,
  commercial_name,
  description,
  logo_url,
  verification_status,
  commission_percentage,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'clinic@medicones.com'),
  (SELECT id FROM service_categories WHERE slug = 'clinic' LIMIT 1),
  'Clínica Central',
  'Clínica médica con múltiples especialidades y médicos asociados.',
  NULL,
  'APPROVED',
  15.0,
  NOW(),
  NOW()
) RETURNING id;

-- 4. Crear sucursal principal de la clínica
INSERT INTO provider_branches (
  id,
  provider_id,
  city_id,
  name,
  description,
  address_text,
  phone_contact,
  email_contact,
  is_main,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM providers WHERE commercial_name = 'Clínica Central'),
  (SELECT id FROM cities WHERE name = 'Quito' LIMIT 1),
  'Clínica Central - Sede Principal',
  'Sede principal de la clínica',
  'Av. Principal 456, Quito',
  '0998765432',
  'clinic@medicones.com',
  true,
  true,
  NOW(),
  NOW()
);
```

**Nota:** Reemplaza `$2b$10$TuHashAqui` con el hash real generado por bcrypt para la contraseña `clinic123`.

---

## 🔧 Script Prisma Seed

### Código TypeScript para Prisma Seed

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🏥 Creando datos iniciales para Clínica...');

  // 1. Hash de contraseña
  const clinicPassword = await bcrypt.hash('clinic123', 10);

  // 2. Crear usuario de clínica
  const clinicUser = await prisma.users.create({
    data: {
      email: 'clinic@medicones.com',
      password_hash: clinicPassword,
      role: 'provider',
      is_active: true,
    },
  });

  console.log('✅ Usuario de clínica creado:', clinicUser.email);

  // 3. Obtener category_id para clínica
  // Ajustar según tu estructura de service_categories
  const clinicCategory = await prisma.service_categories.findFirst({
    where: {
      slug: 'clinic', // O el slug que uses para clínicas
    },
  });

  if (!clinicCategory) {
    console.warn('⚠️ No se encontró categoría "clinic". Creando categoría...');
    // Crear categoría si no existe
    const newCategory = await prisma.service_categories.create({
      data: {
        name: 'Clínica',
        slug: 'clinic',
        default_color_hex: '#14b8a6',
        allows_booking: true,
      },
    });
    clinicCategory = newCategory;
  }

  // 4. Crear perfil de proveedor (clínica)
  const clinicProvider = await prisma.providers.create({
    data: {
      user_id: clinicUser.id,
      category_id: clinicCategory.id,
      commercial_name: 'Clínica Central',
      description: 'Clínica médica con múltiples especialidades y médicos asociados. Ofrecemos atención integral de salud con tecnología de vanguardia.',
      logo_url: null,
      verification_status: 'APPROVED',
      commission_percentage: 15.0,
    },
  });

  console.log('✅ Perfil de proveedor creado:', clinicProvider.commercial_name);

  // 5. Obtener ciudad (Quito)
  const quitoCity = await prisma.cities.findFirst({
    where: {
      name: 'Quito',
    },
  });

  if (!quitoCity) {
    console.warn('⚠️ No se encontró la ciudad "Quito". Creando ciudad...');
    const newCity = await prisma.cities.create({
      data: {
        name: 'Quito',
        state: 'Pichincha',
        country: 'Ecuador',
      },
    });
    quitoCity = newCity;
  }

  // 6. Crear sucursal principal
  const clinicBranch = await prisma.provider_branches.create({
    data: {
      provider_id: clinicProvider.id,
      city_id: quitoCity.id,
      name: 'Clínica Central - Sede Principal',
      description: 'Sede principal de la clínica',
      address_text: 'Av. Principal 456, Quito',
      phone_contact: '0998765432',
      email_contact: 'clinic@medicones.com',
      is_main: true,
      is_active: true,
    },
  });

  console.log('✅ Sucursal principal creada:', clinicBranch.name);

  console.log('🎉 Datos de clínica creados exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error al crear datos de clínica:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 📝 Notas Importantes

### 1. Hash de Contraseña
- La contraseña `clinic123` debe ser hasheada con **bcrypt** antes de insertarse
- Cost factor recomendado: **10**
- Ejemplo: `await bcrypt.hash('clinic123', 10)`

### 2. Role y ServiceType
- **Role:** Debe ser `provider` (o `profesional` según tu esquema)
- **ServiceType/Tipo:** Debe ser `clinic`
- El frontend espera que `user.role === "provider"` y `user.serviceType === "clinic"` para redirigir a `/clinic/dashboard`

### 3. Redirección después del Login
Después del login exitoso, el frontend redirige según:
- `role: "provider"` + `serviceType: "clinic"` → `/clinic/dashboard`

### 4. Estructura de Datos
- El usuario se crea en la tabla `users`
- El perfil se crea en la tabla `providers` con `category_id` correspondiente a clínicas
- La sucursal principal se crea en `provider_branches` con `is_main: true`

### 5. Verificación
- El estado de verificación puede ser `APPROVED` para permitir acceso inmediato
- O `PENDING` si requiere aprobación del administrador

---

## ✅ Checklist para Backend

- [ ] Usuario `clinic@medicones.com` creado en `users`
- [ ] Contraseña hasheada correctamente (`clinic123`)
- [ ] Role configurado como `provider`
- [ ] ServiceType/Tipo configurado como `clinic`
- [ ] Perfil de proveedor creado en `providers`
- [ ] Categoría de clínica existe en `service_categories`
- [ ] Sucursal principal creada en `provider_branches`
- [ ] Endpoint `/api/auth/login` acepta las credenciales
- [ ] Endpoint `/api/clinics/profile` retorna datos correctos
- [ ] Endpoint `/api/clinics/dashboard` funciona correctamente
- [ ] Redirección funciona después del login

---

## 🔗 Referencias

- **Especificación Completa del Panel de Clínica:** Ver `CLINIC_PANEL_BACKEND_SPEC.md`
- **Guía de Integración Frontend:** Ver `BACKEND_COMPLETE_GUIDE.md`
- **Endpoints Completos:** Ver `BACKEND_ENDPOINTS.md`

---

**Última actualización:** 2024-01-XX
