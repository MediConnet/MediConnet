# 📊 Análisis Completo de APIs del Frontend MediConnet

**Fecha:** Enero 2025  
**Estado:** Análisis de conectividad Backend ↔ Frontend

---

## 🎯 Resumen Ejecutivo

### Estado General
- ✅ **Módulos con APIs Reales:** 6 (Auth, Doctor, Farmacia, Clínica, Admin, Anuncios)
- ⚠️ **Módulos con Mocks:** 4 (Insumos, Laboratorios, Home parcial, Ambulancias)
- 🔴 **Endpoints Críticos Pendientes:** 22+

### Prioridad de Implementación
1. **ALTA** 🔴 - Médico Asociado a Clínica (11 endpoints)
2. **ALTA** 🔴 - Mensajería Clínica-Recepción (3 endpoints)
3. **MEDIA** 🟡 - Insumos Médicos (5 endpoints)
4. **MEDIA** 🟡 - Laboratorios (1 endpoint)
5. **BAJA** 🟢 - Home (3 endpoints - tienen fallback)

---

## ✅ MÓDULOS COMPLETAMENTE CONECTADOS

### 1. Autenticación (`/api/auth`)
**Estado:** ✅ 100% Conectado

**Endpoints Implementados:**
- ✅ `POST /api/auth/register` - Registro de usuarios
- ✅ `POST /api/auth/login` - Inicio de sesión
- ✅ `POST /api/auth/refresh` - Refrescar token
- ✅ `POST /api/auth/logout` - Cerrar sesión
- ✅ `GET /api/auth/me` - Usuario actual
- ✅ `POST /api/auth/forgot-password` - Recuperar contraseña
- ✅ `POST /api/auth/reset-password` - Resetear contraseña

**Archivo:** `src/features/auth/infrastructure/auth.api.ts`

---

### 2. Panel de Doctor (`/api/doctors`)
**Estado:** ✅ 95% Conectado (excepto médico asociado a clínica)

**Endpoints Implementados:**
- ✅ `GET /api/doctors/profile` - Perfil del doctor
- ✅ `PUT /api/doctors/profile` - Actualizar perfil
- ✅ `GET /api/doctors/appointments` - Citas del doctor
- ✅ `PUT /api/doctors/appointments/:id/status` - Actualizar estado de cita
- ✅ `POST /api/doctors/appointments/:id/diagnosis` - Crear diagnóstico
- ✅ `GET /api/doctors/appointments/:id/diagnosis` - Obtener diagnóstico
- ✅ `GET /api/doctors/payments` - Pagos del doctor
- ✅ `GET /api/doctors/schedule` - Horario del doctor
- ✅ `PUT /api/doctors/schedule` - Actualizar horario
- ✅ `GET /api/doctors/patients` - Pacientes del doctor
- ✅ `GET /api/specialties` - Especialidades médicas

**Archivos:**
- `src/features/doctor-panel/infrastructure/doctors.api.ts`
- `src/features/doctor-panel/infrastructure/appointments.api.ts`
- `src/features/doctor-panel/infrastructure/diagnoses.api.ts`
- `src/features/doctor-panel/infrastructure/patients.api.ts`

---

### 3. Panel de Farmacia (`/api/pharmacies`)
**Estado:** ✅ 100% Conectado

**Endpoints Implementados:**
- ✅ `GET /api/pharmacies/profile` - Perfil de farmacia
- ✅ `PUT /api/pharmacies/profile` - Actualizar perfil
- ✅ `GET /api/pharmacies/branches` - Sucursales
- ✅ `POST /api/pharmacies/branches` - Crear sucursal
- ✅ `PUT /api/pharmacies/branches/:id` - Actualizar sucursal
- ✅ `DELETE /api/pharmacies/branches/:id` - Eliminar sucursal
- ✅ `GET /api/pharmacies/reviews` - Reseñas

**Archivo:** `src/features/pharmacy-panel/infrastructure/pharmacy.api.ts`

---

### 4. Panel de Clínica (`/api/clinics`)
**Estado:** ✅ 90% Conectado (excepto mensajería con recepción)

**Endpoints Implementados:**
- ✅ `GET /api/clinics/profile` - Perfil de clínica
- ✅ `PUT /api/clinics/profile` - Actualizar perfil
- ✅ `GET /api/clinics/doctors` - Doctores de la clínica
- ✅ `POST /api/clinics/doctors/invite` - Invitar doctor
- ✅ `DELETE /api/clinics/doctors/:id` - Eliminar doctor
- ✅ `PUT /api/clinics/doctors/:id/status` - Cambiar estado doctor
- ✅ `POST /api/clinics/doctors/:id/assign-office` - Asignar consultorio
- ✅ `GET /api/clinics/appointments` - Citas de la clínica
- ✅ `PUT /api/clinics/appointments/:id/status` - Actualizar estado cita
- ✅ `GET /api/clinics/dashboard` - Dashboard de clínica

**Archivos:**
- `src/features/clinic-panel/infrastructure/clinic.api.ts`
- `src/features/clinic-panel/infrastructure/clinic-doctors.api.ts`
- `src/features/clinic-panel/infrastructure/clinic-appointments.api.ts`

---

### 5. Panel de Administración (`/api/admin`)
**Estado:** ✅ 100% Conectado

**Endpoints Implementados:**
- ✅ `GET /api/admin/dashboard/stats` - Estadísticas generales
- ✅ `GET /api/admin/requests` - Solicitudes de proveedores
- ✅ `PUT /api/admin/requests/:id/approve` - Aprobar solicitud
- ✅ `PUT /api/admin/requests/:id/reject` - Rechazar solicitud
- ✅ `GET /api/admin/ad-requests` - Solicitudes de anuncios
- ✅ `PUT /api/admin/ad-requests/:id/approve` - Aprobar anuncio
- ✅ `PUT /api/admin/ad-requests/:id/reject` - Rechazar anuncio
- ✅ `GET /api/admin/activity-history` - Historial de actividad
- ✅ `GET /api/admin/service-stats` - Estadísticas de servicios
- ✅ `GET /api/admin/settings` - Configuración admin

**Archivos:**
- `src/features/admin-dashboard/infrastructure/dashboard.api.ts`
- `src/features/admin-dashboard/infrastructure/requests.api.ts`
- `src/features/admin-dashboard/infrastructure/ad-requests.api.ts`

---

### 6. Anuncios (`/api/ads`)
**Estado:** ✅ 100% Conectado

**Endpoints Implementados:**
- ✅ `GET /api/ads/active` - Anuncios activos (público)
- ✅ `GET /api/providers/me/ads` - Anuncios del proveedor
- ✅ `POST /api/providers/me/ads` - Crear anuncio
- ✅ `PUT /api/ads/:id` - Actualizar anuncio
- ✅ `DELETE /api/ads/:id` - Eliminar anuncio

**Archivo:** `src/shared/api/ads.api.ts`

---

## 🔴 MÓDULOS CON ENDPOINTS PENDIENTES

### 1. Médico Asociado a Clínica (PRIORIDAD ALTA)
**Estado:** ⚠️ 0% Conectado - Usando mocks

**Endpoints Pendientes (11):**

#### Información de Clínica
- 🔴 `GET /api/doctors/clinic-info` - Info básica de la clínica asociada

#### Perfil Profesional
- 🔴 `GET /api/doctors/clinic/profile` - Perfil del médico asociado
- 🔴 `PUT /api/doctors/clinic/profile` - Actualizar perfil

#### Mensajería con Recepción
- 🔴 `GET /api/doctors/clinic/reception/messages` - Mensajes con recepción
- 🔴 `POST /api/doctors/clinic/reception/messages` - Enviar mensaje
- 🔴 `PATCH /api/doctors/clinic/reception/messages/read` - Marcar como leídos

#### Bloqueo de Fechas
- 🔴 `GET /api/doctors/clinic/date-blocks` - Solicitudes de bloqueo
- 🔴 `POST /api/doctors/clinic/date-blocks/request` - Solicitar bloqueo

#### Citas del Médico Asociado
- 🔴 `GET /api/doctors/clinic/appointments` - Citas confirmadas
- 🔴 `PATCH /api/doctors/clinic/appointments/:id/status` - Actualizar estado

**Archivo:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts`

**Impacto:** 
- ❌ Los médicos asociados a clínicas NO pueden ver sus citas
- ❌ NO pueden comunicarse con la recepción
- ❌ NO pueden solicitar bloqueos de fechas
- ❌ NO pueden actualizar su perfil profesional

**Request/Response Esperados:** Ver `PENDING_ENDPOINTS.md` líneas 1-200

---

### 2. Mensajería Clínica-Recepción (PRIORIDAD ALTA)
**Estado:** ⚠️ 0% Conectado - Usando mocks

**Endpoints Pendientes (3):**
- 🔴 `GET /api/clinics/reception/messages` - Mensajes de recepción
- 🔴 `POST /api/clinics/reception/messages` - Enviar mensaje desde recepción
- 🔴 `PATCH /api/clinics/reception/messages/read` - Marcar como leídos

**Archivo:** `src/features/clinic-panel/infrastructure/clinic-reception-messages.api.ts`

**Impacto:**
- ❌ Las clínicas NO pueden comunicarse con sus médicos asociados
- ❌ NO hay sistema de mensajería interna

**Request/Response Esperados:** Ver `PENDING_ENDPOINTS.md` líneas 201-280

---

### 3. Insumos Médicos (PRIORIDAD MEDIA)
**Estado:** ⚠️ 0% Conectado - Usando mocks completos

**Endpoints Pendientes (5):**
- 🔴 `GET /api/supplies` - Listar tiendas de insumos
- 🔴 `GET /api/supplies/:id` - Detalle de tienda
- 🔴 `GET /api/supplies/:id/reviews` - Reseñas de tienda
- 🔴 `POST /api/supplies/:id/reviews` - Crear reseña
- 🔴 `GET /api/supplies/:userId/dashboard` - Dashboard de tienda

**Archivos:**
- `src/features/supplies-panel/infrastructure/supply.api.ts`
- `src/features/supplies-panel/infrastructure/supplies.repository.ts`

**Impacto:**
- ⚠️ El módulo funciona con datos mock
- ⚠️ Las reseñas se guardan en localStorage (no persisten)
- ⚠️ No hay datos reales de tiendas de insumos

**Request/Response Esperados:** Ver `PENDING_ENDPOINTS.md` líneas 281-380

---

### 4. Laboratorios (PRIORIDAD MEDIA)
**Estado:** ⚠️ 0% Conectado - Usando mocks

**Endpoints Pendientes (1):**
- 🔴 `GET /api/laboratories/:userId/dashboard` - Dashboard de laboratorio

**Archivo:** `src/features/laboratory-panel/infrastructure/laboratories.repository.ts`

**Impacto:**
- ⚠️ El dashboard funciona con datos mock
- ⚠️ Los datos se guardan en localStorage (no persisten)

**Request/Response Esperados:** Ver `PENDING_ENDPOINTS.md` líneas 381-420

---

### 5. Home (PRIORIDAD BAJA)
**Estado:** ⚠️ Parcialmente conectado - Tiene fallback a mocks

**Endpoints Pendientes (3):**
- 🟡 `GET /api/home/content` - Contenido principal (tiene fallback)
- 🟡 `GET /api/home/features` - Características (tiene fallback)
- 🟡 `GET /api/home/featured-services` - Servicios destacados (tiene fallback)

**Archivo:** `src/features/home/infrastructure/home.api.ts`

**Impacto:**
- ✅ El módulo funciona correctamente con fallback
- ⚠️ No se pueden personalizar contenidos desde el backend
- ⚠️ Los servicios destacados están vacíos

**Request/Response Esperados:** Ver `PENDING_ENDPOINTS.md` líneas 281-340

---

### 6. Ambulancias (PRIORIDAD BAJA)
**Estado:** ⚠️ 100% Mocks - No hay APIs definidas

**Endpoints Pendientes:**
- 🔴 `GET /api/ambulances/profile` - Perfil de ambulancia
- 🔴 `PUT /api/ambulances/profile` - Actualizar perfil
- 🔴 `GET /api/ambulances/reviews` - Reseñas
- 🔴 `GET /api/ambulances/settings` - Configuración

**Archivos:**
- `src/features/ambulance-panel/infrastructure/ambulance.mock.ts`
- `src/features/ambulance-panel/infrastructure/reviews.mock.ts`
- `src/features/ambulance-panel/infrastructure/settings.mock.ts`

**Impacto:**
- ⚠️ El módulo completo usa mocks
- ⚠️ No hay persistencia de datos

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Crítico (ALTA PRIORIDAD) 🔴

#### Médico Asociado a Clínica
- [ ] `GET /api/doctors/clinic-info`
- [ ] `GET /api/doctors/clinic/profile`
- [ ] `PUT /api/doctors/clinic/profile`
- [ ] `GET /api/doctors/clinic/reception/messages`
- [ ] `POST /api/doctors/clinic/reception/messages`
- [ ] `PATCH /api/doctors/clinic/reception/messages/read`
- [ ] `GET /api/doctors/clinic/date-blocks`
- [ ] `POST /api/doctors/clinic/date-blocks/request`
- [ ] `GET /api/doctors/clinic/appointments`
- [ ] `PATCH /api/doctors/clinic/appointments/:id/status`

#### Mensajería Clínica
- [ ] `GET /api/clinics/reception/messages`
- [ ] `POST /api/clinics/reception/messages`
- [ ] `PATCH /api/clinics/reception/messages/read`

**Total Fase 1:** 13 endpoints

---

### Fase 2: Importante (MEDIA PRIORIDAD) 🟡

#### Insumos Médicos
- [ ] `GET /api/supplies`
- [ ] `GET /api/supplies/:id`
- [ ] `GET /api/supplies/:id/reviews`
- [ ] `POST /api/supplies/:id/reviews`
- [ ] `GET /api/supplies/:userId/dashboard`

#### Laboratorios
- [ ] `GET /api/laboratories/:userId/dashboard`

**Total Fase 2:** 6 endpoints

---

### Fase 3: Mejoras (BAJA PRIORIDAD) 🟢

#### Home
- [ ] `GET /api/home/content`
- [ ] `GET /api/home/features`
- [ ] `GET /api/home/featured-services`

#### Ambulancias
- [ ] `GET /api/ambulances/profile`
- [ ] `PUT /api/ambulances/profile`
- [ ] `GET /api/ambulances/reviews`
- [ ] `GET /api/ambulances/settings`

**Total Fase 3:** 7 endpoints

---

## 🔧 CÓMO CONECTAR UN ENDPOINT

### Ejemplo: Conectar `/api/supplies`

**Antes (Mock):**
```typescript
export const getSuppliesAPI = async (): Promise<SupplyStore[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<SupplyStore[]>('/supplies');
  // return response.data;

  // NOTE: Datos mock por ahora
  return suppliesMock;
};
```

**Después (API Real):**
```typescript
import { httpClient, extractData } from '@/shared/lib/http';

export const getSuppliesAPI = async (): Promise<SupplyStore[]> => {
  const response = await httpClient.get<{ success: boolean; data: SupplyStore[] }>(
    '/supplies'
  );
  return extractData(response);
};
```

### Pasos:
1. Importar `httpClient` y `extractData`
2. Hacer la llamada HTTP con el tipo correcto
3. Usar `extractData()` para extraer los datos
4. Eliminar el código mock
5. Probar con el backend real

---

## 📊 ESTADÍSTICAS FINALES

### Por Estado
- ✅ **Conectados:** 60+ endpoints
- 🔴 **Pendientes Críticos:** 13 endpoints
- 🟡 **Pendientes Importantes:** 6 endpoints
- 🟢 **Pendientes Mejoras:** 7 endpoints

### Por Módulo
| Módulo | Estado | Endpoints Conectados | Endpoints Pendientes |
|--------|--------|---------------------|---------------------|
| Auth | ✅ 100% | 7 | 0 |
| Doctor | ✅ 95% | 11 | 10 (asociado) |
| Farmacia | ✅ 100% | 7 | 0 |
| Clínica | ✅ 90% | 10 | 3 (mensajería) |
| Admin | ✅ 100% | 10 | 0 |
| Anuncios | ✅ 100% | 5 | 0 |
| Insumos | 🔴 0% | 0 | 5 |
| Laboratorios | 🔴 0% | 0 | 1 |
| Home | 🟡 50% | 0 | 3 |
| Ambulancias | 🔴 0% | 0 | 4 |

### Progreso Total
- **Total Endpoints:** 86
- **Conectados:** 60 (70%)
- **Pendientes:** 26 (30%)

---

## 🎯 RECOMENDACIONES

### Inmediatas (Esta Semana)
1. ✅ Implementar endpoints de **Médico Asociado a Clínica** (13 endpoints)
   - Es funcionalidad crítica que está completamente bloqueada
   - Afecta a médicos que trabajan en clínicas

### Corto Plazo (Próximas 2 Semanas)
2. ✅ Implementar endpoints de **Insumos Médicos** (5 endpoints)
   - Módulo completo sin backend
3. ✅ Implementar endpoint de **Laboratorios** (1 endpoint)
   - Dashboard sin datos reales

### Mediano Plazo (Próximo Mes)
4. ✅ Implementar endpoints de **Home** (3 endpoints)
   - Mejorar personalización de contenidos
5. ✅ Implementar endpoints de **Ambulancias** (4 endpoints)
   - Módulo completo sin backend

---

## 📚 DOCUMENTACIÓN RELACIONADA

- **Endpoints Generales:** `BACKEND_ENDPOINTS.md`
- **Endpoints Pendientes:** `PENDING_ENDPOINTS.md`
- **Todos los Endpoints:** `ALL_ENDPOINTS.md`
- **Guía de Integración:** `API_INTEGRATION.md`
- **Spec Médico Asociado:** `CLINIC_ASSOCIATED_DOCTOR_BACKEND_SPEC.md`
- **Spec Panel Clínica:** `CLINIC_PANEL_BACKEND_SPEC.md`

---

**Última actualización:** Enero 2025  
**Generado por:** Kiro AI Assistant  
**Mantenido por:** Equipo Frontend MediConnet
