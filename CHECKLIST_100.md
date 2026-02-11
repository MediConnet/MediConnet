# ✅ MediConnet — Checklist para dejar la Web al 100% (sin DEMO / sin mocks)

**Fecha:** 2026-02-11  
**Objetivo:** Que la web funcione **con datos reales** (backend) en todos los paneles, sin información “DEMO”, sin `localStorage` como base de datos, y con flujos completos (crear/leer/actualizar).

---

## ✅ Definición de “100%”

Para considerar la web al **100%**, se debe cumplir:

- **0 mocks activos** en producción (sin `*.mock.ts` consumiéndose en runtime).
- **0 datos DEMO** por defecto en pantallas de paneles nuevos.
- **Persistencia real**: no depender de `localStorage` para datos críticos (perfil, bank account, documentos, etc.).
- **Todos los endpoints de paneles** conectados con `httpClient` (token + errores manejados).
- **Estados vacíos** correctos (“Aún no tienes…”) cuando no hay data en BD.
- **Build/Lint** sin errores y flujos principales validados manualmente.

---

## 🔴 Bloqueadores principales (para llegar a 100%)

### 1) Eliminar mocks + conectar APIs reales (por módulo)

#### Admin Dashboard
- **Servicios activos (lista)** usa mock:
  - `src/features/admin-dashboard/presentation/pages/ServicesDashboardPage.tsx` → `getActiveServicesMock()`
  - **Requiere endpoint** tipo: `GET /api/admin/services/active` (o equivalente)
- **Stats y actividad** usan mocks en usecases:
  - `src/features/admin-dashboard/application/get-service-stats.usecase.ts` → `stats.mock.ts`
  - `src/features/admin-dashboard/application/get-activity-history.usecase.ts` → `activity.mock.ts`
  - `src/features/admin-dashboard/application/get-admin-settings.usecase.ts` → `settings.mock.ts`
  - **Requiere endpoints** reales de stats/actividad/settings
- **Ads / Solicitudes de anuncios** usan storage/mocks:
  - `src/features/admin-dashboard/infrastructure/ads.mock.ts`
  - `src/features/admin-dashboard/infrastructure/ad-requests.mock.ts`
  - usecases: `get-ad-request-by-provider.usecase.ts`, `create-ad.usecase.ts`, `create-ad-request.usecase.ts`
  - **Requiere endpoints** reales (crear/listar/actualizar ads y solicitudes)

#### Clínica
- **Perfil clínica**: tiene fallback a mock si falla backend:
  - `src/features/clinic-panel/application/get-clinic-profile.usecase.ts`
  - `src/features/clinic-panel/application/update-clinic-profile.usecase.ts`
  - **Acción**: cuando backend esté estable, **eliminar fallback** a `clinic.mock.ts`
- **Gestión de médicos / precios**: `updateConsultationFee` usa mock directo:
  - `src/features/clinic-panel/presentation/hooks/useClinicDoctors.ts` (import dinámico `doctors.mock`)
  - **Requiere endpoint** real para actualizar tarifa por doctor (ej: `PATCH /api/clinics/doctors/:id/fee`)
- **Recepción / mensajes**: revisar si hay endpoints reales o sigue en mock:
  - `src/features/clinic-panel/infrastructure/reception-messages.mock.ts`

#### Doctor
- **Médico asociado a clínica** usa mock en varios puntos:
  - `src/features/doctor-panel/infrastructure/clinic-associated.mock.ts`
  - componentes/hooks: `ClinicAssociatedAppointmentsSection.tsx`, `useReceptionMessages.ts`, `useDateBlockRequests.ts`
  - **Requiere endpoints** reales (asociación, citas, recepción, bloqueos)
- **Pagos doctor**: `GET /api/doctors/payments` debe existir y ser real (si se muestra en panel).
- **Reseñas doctor (panel)**: ya consume `GET /api/doctors/reviews`, pero para “100%” el backend debe implementar lógica real (hoy puede ser placeholder → ok para estado vacío).

#### Insumos (Supplies)
- Aún hay piezas con mocks:
  - `src/features/supplies-panel/application/supplies.mock.ts`
  - `src/features/supplies-panel/infrastructure/products.mock.ts`
  - `src/features/supplies-panel/infrastructure/orders.mock.ts`
- El dashboard de insumos todavía usa “persistencia” local (perfil) con `localStorage` en varios componentes.
  - **Requiere endpoints** reales de perfil/ordenes/productos + CRUD

#### Farmacia
- `get-pharmacy-settings.usecase.ts` usa **solo mock**:
  - `src/features/pharmacy-panel/application/get-pharmacy-settings.usecase.ts`
  - **Requiere endpoint** real: settings del panel farmacia (perfil/horarios/estado/…)
- Reviews: tiene API pero cae a mock si falla:
  - `src/features/pharmacy-panel/application/get-pharmacy-reviews.usecase.ts`
  - **Acción**: estabilizar backend y eliminar fallback

#### Laboratorio
- Citas en panel usa mock:
  - `src/features/laboratory-panel/presentation/components/AppointmentsSection.tsx` → `appointments.mock.ts`
  - **Requiere endpoint** real de citas para laboratorio

#### Ambulancia
- Settings usa mock:
  - `src/features/ambulance-panel/application/get-settings.usecase.ts` → `settings.mock.ts`
  - **Requiere endpoint** real de settings
- Reviews: tiene API pero cae a mock si falla:
  - `src/features/ambulance-panel/application/get-reviews.usecase.ts`

---

### 2) Quitar `localStorage` como “BD” para datos críticos

Hoy hay varias pantallas que guardan en `localStorage` (ok para prototipo, no para 100%):

- **Datos bancarios (clínica/doctor)**: deben persistir en backend.
  - Crear endpoints: `GET/PUT` cuenta bancaria (por proveedor autenticado).
- **Perfil/imagen** (insumos/otros paneles): subir imagen y guardar URL (S3/Storage) + perfil en BD.
- **Notificaciones (contadores)**: si se quiere exactitud multi-dispositivo, mover “last seen” a backend.

**Acción 100%**: dejar `localStorage` solo para UX (preferencias) y no para datos de negocio.

---

### 3) Documentos de registro (Profesional) — flujo completo

Frontend ya envía archivos en `multipart/form-data` en `/api/auth/register` cuando hay adjuntos.

Para 100% el backend debe:
- Recibir `licenses[]`, `certificates[]`, `titles[]` (multipart)
- Guardar archivos y retornar URLs (S3/local)
- Persistir metadata en la solicitud
- En Admin, `GET /api/admin/requests` debe incluir `documents: [{id,name,type,url}]` o proveer `GET /api/admin/requests/:id`

---

## 🟡 Pendientes importantes (calidad/UX)

- **Estados vacíos consistentes** (sin datos): reseñas/pagos/agenda/productos/ordenes → “Aún no tienes…”
- **Manejo de errores unificado**: toasts/snackbars en lugar de `alert()`
- **Normalización de responses**: varios endpoints devuelven `{ success, data }` pero otros “shapes” distintos → estandarizar backend o mapear en frontend.
- **Permisos/roles**: asegurar guards para cada panel y rutas.

---

## 🟢 Checklist técnico (para cierre)

- [ ] Eliminar imports a `*.mock.ts` en producción (o proteger por `env.MODE === 'development'`)
- [ ] Revisar `grep` de “mock” y “TODO” y dejarlos en 0 para módulos críticos
- [ ] `npm run build` OK
- [ ] Lint OK
- [ ] Pruebas manuales mínimas:
  - [ ] Login/Logout
  - [ ] Registro profesional con documentos
  - [ ] Admin aprueba/rechaza solicitud y ve documentos
  - [ ] Panel Clínica: perfil, médicos, agenda (si aplica), bank account
  - [ ] Panel Doctor: perfil, reseñas (vacío), pagos (vacío), agenda (si aplica)
  - [ ] Panel Insumos: perfil, productos, orders, reseñas (vacío)

---

## 📌 Recomendación de “ruta” para llegar al 100%

1) **Definir endpoints “mínimos” por panel** (perfil + datos de negocio + listados principales).
2) Conectar frontend a esos endpoints y **quitar mocks**.
3) Reemplazar `localStorage` por backend en datos de negocio.
4) Revisar “pantallas nuevas” para que siempre arranquen vacías, sin DEMO.
5) Cierre con build + smoke tests.

