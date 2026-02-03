# ✅ Checklist de Implementación Backend

## 🎯 Progreso General

```
Total: 26 endpoints pendientes
├── Fase 1 (Crítico):    [ ] 0/13 (0%)
├── Fase 2 (Importante): [ ] 0/6  (0%)
└── Fase 3 (Mejoras):    [ ] 0/7  (0%)
```

---

## 🔴 FASE 1: CRÍTICO (13 endpoints)

### Médico Asociado a Clínica (10 endpoints)

#### Información Básica
- [ ] `GET /api/doctors/clinic-info`
  - **Descripción:** Info básica de la clínica asociada
  - **Archivo Frontend:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts:17`
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: { id, name, address, phone, whatsapp, logoUrl } }`

#### Perfil Profesional
- [ ] `GET /api/doctors/clinic/profile`
  - **Descripción:** Perfil del médico asociado
  - **Archivo Frontend:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts:40`
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: { id, clinicId, clinicInfo, specialty, experience, bio, ... } }`

- [ ] `PUT /api/doctors/clinic/profile`
  - **Descripción:** Actualizar perfil del médico asociado
  - **Archivo Frontend:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts:53`
  - **Request:** `{ specialty, experience, bio, education, certifications, phone, whatsapp }`
  - **Response:** Mismo formato que GET

#### Mensajería con Recepción
- [ ] `GET /api/doctors/clinic/reception/messages`
  - **Descripción:** Obtener mensajes con la recepción
  - **Archivo Frontend:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts:65`
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: [{ id, clinicId, doctorId, from, message, timestamp, isRead, senderName }] }`

- [ ] `POST /api/doctors/clinic/reception/messages`
  - **Descripción:** Enviar mensaje a la recepción
  - **Archivo Frontend:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts:78`
  - **Request:** `{ message: string }`
  - **Response:** Mismo formato que GET (un solo mensaje)

- [ ] `PATCH /api/doctors/clinic/reception/messages/read`
  - **Descripción:** Marcar mensajes como leídos
  - **Archivo Frontend:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts:90`
  - **Request:** `{ messageIds: string[] }`
  - **Response:** `{ success: true }`

#### Bloqueo de Fechas
- [ ] `GET /api/doctors/clinic/date-blocks`
  - **Descripción:** Obtener solicitudes de bloqueo de fechas
  - **Archivo Frontend:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts:101`
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: [{ id, doctorId, clinicId, startDate, endDate, reason, status, ... }] }`

- [ ] `POST /api/doctors/clinic/date-blocks/request`
  - **Descripción:** Solicitar bloqueo de fechas
  - **Archivo Frontend:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts:116`
  - **Request:** `{ startDate: string, endDate: string, reason: string }`
  - **Response:** Mismo formato que GET (una sola solicitud)

#### Citas del Médico Asociado
- [ ] `GET /api/doctors/clinic/appointments`
  - **Descripción:** Obtener citas del médico asociado
  - **Archivo Frontend:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts:128`
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: [{ id, patientId, patientName, patientPhone, date, time, reason, status }] }`

- [ ] `PATCH /api/doctors/clinic/appointments/:appointmentId/status`
  - **Descripción:** Actualizar estado de cita
  - **Archivo Frontend:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts:142`
  - **Request:** `{ status: 'COMPLETED' | 'NO_SHOW' }`
  - **Response:** Mismo formato que GET (cita actualizada)

---

### Mensajería Clínica-Recepción (3 endpoints)

- [ ] `GET /api/clinics/reception/messages`
  - **Descripción:** Obtener mensajes de la recepción
  - **Archivo Frontend:** `src/features/clinic-panel/infrastructure/clinic-reception-messages.api.ts:6`
  - **Query Params:** `?doctorId=uuid` (opcional)
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: [{ id, clinicId, doctorId, doctorName, from, message, timestamp, isRead, senderName }] }`

- [ ] `POST /api/clinics/reception/messages`
  - **Descripción:** Enviar mensaje desde la recepción
  - **Archivo Frontend:** `src/features/clinic-panel/infrastructure/clinic-reception-messages.api.ts:19`
  - **Request:** `{ doctorId: string, message: string }`
  - **Response:** Mismo formato que GET (un solo mensaje)

- [ ] `PATCH /api/clinics/reception/messages/read`
  - **Descripción:** Marcar mensajes como leídos
  - **Archivo Frontend:** `src/features/clinic-panel/infrastructure/clinic-reception-messages.api.ts:34`
  - **Request:** `{ messageIds: string[] }`
  - **Response:** `{ success: true }`

---

## 🟡 FASE 2: IMPORTANTE (6 endpoints)

### Insumos Médicos (5 endpoints)

- [ ] `GET /api/supplies`
  - **Descripción:** Listar tiendas de insumos
  - **Archivo Frontend:** `src/features/supplies-panel/infrastructure/supply.api.ts:11`
  - **Request:** Público (sin auth)
  - **Response:** `{ success: true, data: [{ id, name, description, address, phone, rating, imageUrl }] }`

- [ ] `GET /api/supplies/:id`
  - **Descripción:** Detalle de tienda de insumos
  - **Archivo Frontend:** `src/features/supplies-panel/infrastructure/supply.api.ts:25`
  - **Request:** Público (sin auth)
  - **Response:** Mismo formato que GET /api/supplies (un solo objeto)

- [ ] `GET /api/supplies/:id/reviews`
  - **Descripción:** Obtener reseñas de tienda
  - **Archivo Frontend:** `src/features/supplies-panel/infrastructure/supply.api.ts:43`
  - **Request:** Público (sin auth)
  - **Response:** `{ success: true, data: [{ id, supplyStoreId, userId, userName, rating, comment, createdAt }] }`

- [ ] `POST /api/supplies/:id/reviews`
  - **Descripción:** Crear reseña
  - **Archivo Frontend:** `src/features/supplies-panel/infrastructure/supply.api.ts:61`
  - **Request:** `{ rating: number, comment?: string }` + `Authorization: Bearer <token>`
  - **Response:** Mismo formato que GET (una sola reseña)

- [ ] `GET /api/supplies/:userId/dashboard`
  - **Descripción:** Dashboard de tienda de insumos
  - **Archivo Frontend:** `src/features/supplies-panel/infrastructure/supplies.repository.ts:26`
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: { store: {...}, stats: {...}, recentOrders: [...], products: [...] } }`

---

### Laboratorios (1 endpoint)

- [ ] `GET /api/laboratories/:userId/dashboard`
  - **Descripción:** Dashboard de laboratorio
  - **Archivo Frontend:** `src/features/laboratory-panel/infrastructure/laboratories.repository.ts:112`
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: { laboratory: {...}, stats: {...}, recentAppointments: [...], availableExams: [...] } }`

---

## 🟢 FASE 3: MEJORAS (7 endpoints)

### Home (3 endpoints)

- [ ] `GET /api/home/content`
  - **Descripción:** Contenido principal del home
  - **Archivo Frontend:** `src/features/home/infrastructure/home.api.ts:14`
  - **Request:** Público (sin auth)
  - **Response:** `{ success: true, data: { hero: {...}, features: {...}, featuredServices: {...}, joinSection: {...}, footer: {...} } }`
  - **Nota:** ✅ Tiene fallback a mock

- [ ] `GET /api/home/features`
  - **Descripción:** Características de la plataforma
  - **Archivo Frontend:** `src/features/home/infrastructure/home.api.ts:60`
  - **Request:** Público (sin auth)
  - **Response:** `{ success: true, data: [{ id, icon, title, description, order }] }`
  - **Nota:** ✅ Tiene fallback a mock

- [ ] `GET /api/home/featured-services`
  - **Descripción:** Servicios destacados
  - **Archivo Frontend:** `src/features/home/infrastructure/home.api.ts:106`
  - **Request:** Público (sin auth)
  - **Response:** `{ success: true, data: [{ id, name, specialty, rating, imageUrl, location }] }`
  - **Nota:** ✅ Tiene fallback a array vacío

---

### Ambulancias (4 endpoints)

- [ ] `GET /api/ambulances/profile`
  - **Descripción:** Perfil de ambulancia
  - **Archivo Frontend:** `src/features/ambulance-panel/infrastructure/ambulance.mock.ts`
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: { id, name, description, phone, whatsapp, address, ... } }`
  - **Nota:** ⚠️ No hay API definida, solo mock

- [ ] `PUT /api/ambulances/profile`
  - **Descripción:** Actualizar perfil de ambulancia
  - **Request:** `{ name, description, phone, whatsapp, address, ... }` + `Authorization: Bearer <token>`
  - **Response:** Mismo formato que GET
  - **Nota:** ⚠️ No hay API definida, solo mock

- [ ] `GET /api/ambulances/reviews`
  - **Descripción:** Obtener reseñas de ambulancia
  - **Archivo Frontend:** `src/features/ambulance-panel/infrastructure/reviews.mock.ts`
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: [{ id, rating, comment, patientName, date }] }`
  - **Nota:** ⚠️ No hay API definida, solo mock

- [ ] `GET /api/ambulances/settings`
  - **Descripción:** Configuración de ambulancia
  - **Archivo Frontend:** `src/features/ambulance-panel/infrastructure/settings.mock.ts`
  - **Request:** `Authorization: Bearer <token>`
  - **Response:** `{ success: true, data: { notifications: {...}, privacy: {...}, ... } }`
  - **Nota:** ⚠️ No hay API definida, solo mock

---

## 📊 Progreso por Módulo

### Médico Asociado a Clínica
```
[ ] 0/10 (0%)
```

### Mensajería Clínica
```
[ ] 0/3 (0%)
```

### Insumos Médicos
```
[ ] 0/5 (0%)
```

### Laboratorios
```
[ ] 0/1 (0%)
```

### Home
```
[ ] 0/3 (0%)
```

### Ambulancias
```
[ ] 0/4 (0%)
```

---

## 🔧 Pasos para Implementar un Endpoint

1. **Backend:**
   - [ ] Crear el endpoint en el backend
   - [ ] Probar con Postman/Thunder Client
   - [ ] Verificar que retorna `{ success: true, data: ... }`

2. **Frontend:**
   - [ ] Abrir el archivo indicado en el checklist
   - [ ] Descomentar la llamada a `httpClient`
   - [ ] Eliminar el código mock
   - [ ] Probar en el navegador

3. **Verificación:**
   - [ ] Verificar que no hay errores en consola
   - [ ] Verificar que los datos se muestran correctamente
   - [ ] Marcar el checkbox en este archivo ✅

---

## 📚 Documentación de Referencia

- **Análisis Completo:** `ANALISIS_APIS_FRONTEND.md`
- **Resumen Ejecutivo:** `RESUMEN_CONEXION_BACKEND.md`
- **Endpoints Pendientes:** `PENDING_ENDPOINTS.md`
- **Todos los Endpoints:** `ALL_ENDPOINTS.md`
- **Guía de Integración:** `API_INTEGRATION.md`

---

**Última actualización:** Enero 2025  
**Instrucciones:** Marca con `[x]` cada endpoint que implementes
