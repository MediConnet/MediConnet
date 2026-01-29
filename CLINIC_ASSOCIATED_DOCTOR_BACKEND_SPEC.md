# 👨‍⚕️ Panel de Médico Asociado a Clínica - Especificación Técnica para Backend

Este documento contiene **TODAS** las especificaciones técnicas que el backend debe implementar para soportar el Panel de Médico Asociado a Clínica.

---

## 📋 Índice

1. [Resumen y Objetivo](#1-resumen-y-objetivo)
2. [Detección de Médico Asociado](#2-detección-de-médico-asociado)
3. [Estructuras de Datos](#3-estructuras-de-datos)
4. [Endpoints Requeridos](#4-endpoints-requeridos)
5. [Restricciones y Permisos](#5-restricciones-y-permisos)
6. [Gestión de Citas y Pagos](#6-gestión-de-citas-y-pagos)
7. [Validaciones](#7-validaciones)

---

## 1. Resumen y Objetivo

### 1.1. Objetivo
Permitir que un médico asociado a una clínica tenga un panel limitado donde pueda:
- ✅ Completar y editar su perfil profesional (especialidad, experiencia, descripción)
- ✅ Ver su agenda de citas confirmadas
- ✅ Marcar citas como atendidas o no asistidas
- ✅ Crear diagnósticos después de atender
- ✅ Comunicarse con la recepción de la clínica
- ✅ Solicitar bloqueos de fechas (requiere aprobación de la clínica)
- ✅ Recibir notificaciones cuando se agenden o cancelen citas

### 1.2. Restricciones
El médico asociado **NO puede**:
- ❌ Gestionar precios de consulta
- ❌ Gestionar métodos de pago
- ❌ Gestionar cuentas bancarias
- ❌ Modificar horarios oficiales (solo la clínica)
- ❌ Ver información financiera (pagos, montos, comisiones)
- ❌ Cancelar citas (solo marcarlas como atendidas/no asistidas)

### 1.3. Gestión de Pagos
- Los pagos se registran **únicamente en la cuenta de la clínica**
- El médico asociado **NO ve información de pagos** en su panel
- Los reportes financieros son exclusivos del panel de la clínica

---

## 2. Detección de Médico Asociado

### 2.1. Campo en Dashboard
El backend debe incluir información de clínica en la respuesta de `/api/doctors/dashboard`:

```json
{
  "success": true,
  "data": {
    "totalAppointments": 50,
    "totalReviews": 25,
    "averageRating": 4.5,
    "provider": {
      // ... datos del médico ...
    },
    "clinic": {
      "id": "uuid",
      "name": "Clínica San José",
      "address": "Av. Principal 123, Quito",
      "phone": "0991234567",
      "whatsapp": "0991234567",
      "logoUrl": "https://..."
    }
  }
}
```

**Si `clinic` es `null` o no existe**, el médico es independiente y usa el panel completo.

**Si `clinic` existe**, el médico está asociado y debe usar el panel limitado.

### 2.2. Base de Datos
El backend debe tener una relación entre `providers` y `clinics`:

```sql
-- Ejemplo de estructura
ALTER TABLE providers ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id);
-- O usar tabla intermedia clinic_doctors
```

---

## 3. Estructuras de Datos

### 3.1. Información de Clínica
```typescript
interface ClinicInfo {
  id: string;              // UUID
  name: string;            // Nombre de la clínica
  address: string;         // Dirección completa
  phone: string;           // Teléfono (10 dígitos)
  whatsapp: string;        // WhatsApp (10 dígitos)
  logoUrl?: string;        // URL del logo (opcional)
}
```

### 3.2. Perfil de Médico Asociado
```typescript
interface ClinicAssociatedDoctorProfile {
  id: string;                    // ID del médico
  clinicId: string;              // ID de la clínica
  clinicInfo: ClinicInfo;        // Información de la clínica
  specialty: string;             // Especialidad (editable)
  experience?: number;           // Años de experiencia (editable)
  bio?: string;                  // Descripción profesional (editable, max 500 chars)
  education?: string[];           // Estudios (editable)
  certifications?: string[];     // Certificaciones (editable)
  profileImageUrl?: string;      // Foto de perfil (editable)
  phone?: string;                // Teléfono personal (opcional, editable)
  whatsapp?: string;             // WhatsApp personal (opcional, editable)
  email: string;                 // Email (no editable desde aquí)
}
```

### 3.3. Citas del Médico Asociado
```typescript
interface ClinicAssociatedAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  date: string;                 // ISO date (YYYY-MM-DD)
  time: string;                  // HH:mm
  reason?: string;              // Motivo de la consulta
  status: 'CONFIRMED' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
  // ❌ NO incluir: paymentStatus, amount, paymentMethod, isPaid
}
```

### 3.4. Mensajes con Recepción
```typescript
interface ReceptionMessage {
  id: string;
  clinicId: string;
  doctorId: string;
  from: 'doctor' | 'reception';
  message: string;
  timestamp: string;            // ISO 8601
  isRead: boolean;
  senderName?: string;          // Nombre del remitente
}
```

### 3.5. Solicitud de Bloqueo de Fecha
```typescript
interface DateBlockRequest {
  id: string;
  doctorId: string;
  clinicId: string;
  startDate: string;            // ISO date (YYYY-MM-DD)
  endDate: string;              // ISO date (YYYY-MM-DD)
  reason: string;               // Motivo (10-200 caracteres)
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;            // ISO 8601
  reviewedAt?: string;          // ISO 8601 (cuando se revisa)
  reviewedBy?: string;          // ID del administrador que revisa
  rejectionReason?: string;     // Razón de rechazo (opcional)
}
```

---

## 4. Endpoints Requeridos

### 4.1. Información de Clínica

#### GET `/api/doctors/clinic-info`
Obtener información de la clínica asociada al médico autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Clínica San José",
    "address": "Av. Principal 123, Quito, Ecuador",
    "phone": "0991234567",
    "whatsapp": "0991234567",
    "logoUrl": "https://..."
  }
}
```

**Errores:**
- `404 Not Found`: El médico no está asociado a ninguna clínica
- `401 Unauthorized`: Token inválido o expirado

---

### 4.2. Perfil del Médico Asociado

#### GET `/api/doctors/clinic/profile`
Obtener perfil profesional del médico asociado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clinicId": "uuid",
    "clinicInfo": {
      "id": "uuid",
      "name": "Clínica San José",
      "address": "Av. Principal 123",
      "phone": "0991234567",
      "whatsapp": "0991234567"
    },
    "specialty": "Cardiología",
    "experience": 10,
    "bio": "Médico cardiólogo con más de 10 años de experiencia...",
    "education": [
      "Universidad Central del Ecuador - Medicina",
      "Especialización en Cardiología - Universidad de Quito"
    ],
    "certifications": [
      "Certificación en Ecocardiografía",
      "Certificación en Electrocardiografía"
    ],
    "profileImageUrl": "https://...",
    "phone": "0998765432",
    "whatsapp": "0998765432",
    "email": "doctor@example.com"
  }
}
```

#### PUT `/api/doctors/clinic/profile`
Actualizar perfil profesional del médico asociado.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "specialty": "Cardiología",
  "experience": 10,
  "bio": "Nueva descripción profesional...",
  "education": ["Estudio 1", "Estudio 2"],
  "certifications": ["Certificación 1"],
  "phone": "0998765432",
  "whatsapp": "0998765432"
}
```

**Validaciones:**
- `specialty`: Requerido, debe ser una de las especialidades válidas
- `experience`: Opcional, número entero >= 0
- `bio`: Opcional, máximo 500 caracteres
- `education`: Opcional, array de strings
- `certifications`: Opcional, array de strings
- `phone`: Opcional, 10 dígitos (Ecuador)
- `whatsapp`: Opcional, 10 dígitos (Ecuador)

**Response:**
```json
{
  "success": true,
  "data": {
    // Perfil actualizado completo
  }
}
```

**Errores:**
- `400 Bad Request`: Error de validación
- `403 Forbidden`: El médico no está asociado a una clínica
- `401 Unauthorized`: Token inválido

---

### 4.3. Citas del Médico Asociado

#### GET `/api/doctors/clinic/appointments`
Obtener citas confirmadas del médico asociado.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `date` (opcional): Filtrar por fecha (YYYY-MM-DD)
- `status` (opcional): Filtrar por estado (default: solo CONFIRMED)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "patientId": "uuid",
      "patientName": "María González",
      "patientPhone": "0991111111",
      "date": "2025-01-15",
      "time": "10:00",
      "reason": "Consulta general",
      "status": "CONFIRMED"
    }
  ]
}
```

**Importante:**
- ❌ **NO incluir** información financiera (paymentStatus, amount, paymentMethod, isPaid)
- Solo mostrar citas donde `clinic_id` coincida con la clínica del médico
- Solo mostrar citas donde `doctor_id` coincida con el médico autenticado

#### PATCH `/api/doctors/clinic/appointments/:appointmentId/status`
Actualizar estado de cita (marcar como atendida o no asistió).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "COMPLETED" | "NO_SHOW"
}
```

**Validaciones:**
- Solo se puede cambiar a `COMPLETED` o `NO_SHOW`
- No se puede cancelar desde aquí (solo la clínica puede cancelar)
- El médico debe ser el asignado a la cita
- La cita debe pertenecer a la clínica del médico

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "COMPLETED",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**Errores:**
- `400 Bad Request`: Estado inválido o cita no puede cambiar a ese estado
- `403 Forbidden`: El médico no tiene permiso para modificar esta cita
- `404 Not Found`: Cita no encontrada

---

### 4.4. Mensajes con Recepción

#### GET `/api/doctors/clinic/reception/messages`
Obtener mensajes entre el médico y la recepción de la clínica.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (opcional): Número de mensajes a retornar (default: 50)
- `offset` (opcional): Offset para paginación (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "clinicId": "uuid",
      "doctorId": "uuid",
      "from": "reception",
      "message": "Buenos días, tenemos una cita urgente para las 2:00 PM.",
      "timestamp": "2025-01-15T08:00:00Z",
      "isRead": false,
      "senderName": "Recepción"
    },
    {
      "id": "uuid",
      "clinicId": "uuid",
      "doctorId": "uuid",
      "from": "doctor",
      "message": "Sí, puedo atenderla. Gracias por avisar.",
      "timestamp": "2025-01-15T08:15:00Z",
      "isRead": true,
      "senderName": "Dr. Juan Pérez"
    }
  ]
}
```

#### POST `/api/doctors/clinic/reception/messages`
Enviar mensaje a la recepción de la clínica.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "message": "Texto del mensaje"
}
```

**Validaciones:**
- `message`: Requerido, mínimo 1 carácter, máximo 1000 caracteres

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clinicId": "uuid",
    "doctorId": "uuid",
    "from": "doctor",
    "message": "Texto del mensaje",
    "timestamp": "2025-01-15T10:00:00Z",
    "isRead": false,
    "senderName": "Dr. Juan Pérez"
  }
}
```

#### PATCH `/api/doctors/clinic/reception/messages/read`
Marcar mensajes como leídos.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "messageIds": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mensajes marcados como leídos"
}
```

---

### 4.5. Solicitudes de Bloqueo de Fecha

#### GET `/api/doctors/clinic/date-blocks`
Obtener solicitudes de bloqueo de fecha del médico.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "doctorId": "uuid",
      "clinicId": "uuid",
      "startDate": "2025-02-15",
      "endDate": "2025-02-20",
      "reason": "Vacaciones",
      "status": "pending",
      "createdAt": "2025-01-10T00:00:00Z"
    },
    {
      "id": "uuid",
      "doctorId": "uuid",
      "clinicId": "uuid",
      "startDate": "2025-01-10",
      "endDate": "2025-01-12",
      "reason": "Congreso médico",
      "status": "approved",
      "createdAt": "2025-01-05T00:00:00Z",
      "reviewedAt": "2025-01-06T00:00:00Z",
      "reviewedBy": "admin-clinic-uuid"
    }
  ]
}
```

#### POST `/api/doctors/clinic/date-blocks/request`
Solicitar bloqueo de fecha.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "startDate": "2025-02-15",
  "endDate": "2025-02-20",
  "reason": "Vacaciones"
}
```

**Validaciones:**
- `startDate`: Requerido, formato YYYY-MM-DD, debe ser fecha futura
- `endDate`: Requerido, formato YYYY-MM-DD, debe ser >= startDate
- `reason`: Requerido, mínimo 10 caracteres, máximo 200 caracteres

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "doctorId": "uuid",
    "clinicId": "uuid",
    "startDate": "2025-02-15",
    "endDate": "2025-02-20",
    "reason": "Vacaciones",
    "status": "pending",
    "createdAt": "2025-01-10T00:00:00Z"
  }
}
```

**Errores:**
- `400 Bad Request`: Error de validación (fechas inválidas, motivo muy corto/largo)
- `403 Forbidden`: El médico no está asociado a una clínica
- `409 Conflict`: Ya existe una solicitud de bloqueo para ese rango de fechas

---

## 5. Restricciones y Permisos

### 5.1. Validaciones de Seguridad

1. **Verificación de Asociación:**
   - Todos los endpoints deben verificar que el médico esté asociado a una clínica
   - Si no está asociado, retornar `403 Forbidden` o `404 Not Found`

2. **Verificación de Propiedad:**
   - El médico solo puede ver/editar sus propias citas
   - El médico solo puede ver/editar sus propios mensajes
   - El médico solo puede ver/editar sus propias solicitudes de bloqueo

3. **Verificación de Clínica:**
   - Todas las operaciones deben validar que la clínica del médico coincida con la clínica de los recursos

### 5.2. Campos No Editables

El médico asociado **NO puede modificar**:
- ❌ Precio de consulta (`consultation_fee`)
- ❌ Métodos de pago (`payment_methods`)
- ❌ Cuenta bancaria (`bank_account`)
- ❌ Horarios oficiales (`schedules`) - Solo la clínica puede modificar
- ❌ Estado de verificación (`verification_status`)
- ❌ Estado de publicación (`is_published`)

### 5.3. Información Ocultada

En las respuestas de citas, **NO incluir**:
- ❌ `paymentStatus`
- ❌ `amount`
- ❌ `paymentMethod`
- ❌ `isPaid`
- ❌ `commission`
- ❌ Cualquier información financiera

---

## 6. Gestión de Citas y Pagos

### 6.1. Registro de Pagos

Cuando un paciente agenda y paga una cita:
1. El pago se registra **únicamente en la cuenta de la clínica**
2. El médico asociado **NO ve** esta información en su panel
3. Los reportes financieros son exclusivos del panel de administración de la clínica

### 6.2. Endpoint de Citas

El endpoint `/api/doctors/clinic/appointments` debe:
- Filtrar citas donde `clinic_id` = clínica del médico
- Filtrar citas donde `doctor_id` = médico autenticado
- **Excluir** todos los campos financieros de la respuesta
- Solo mostrar citas con estado `CONFIRMED` por defecto (o el estado solicitado)

### 6.3. Actualización de Estado

El médico puede cambiar el estado de una cita a:
- `COMPLETED`: Cita atendida (permite crear diagnóstico)
- `NO_SHOW`: Paciente no asistió

**NO puede:**
- Cambiar a `CANCELLED` (solo la clínica puede cancelar)
- Cambiar a `CONFIRMED` (solo la clínica puede confirmar)

---

## 7. Validaciones

### 7.1. Validaciones de Datos

**Perfil:**
- `specialty`: Debe ser una de las 20 especialidades válidas
- `experience`: Número entero >= 0
- `bio`: Máximo 500 caracteres
- `phone`: 10 dígitos (Ecuador) si se proporciona
- `whatsapp`: 10 dígitos (Ecuador) si se proporciona

**Citas:**
- Solo se pueden ver citas de la clínica del médico
- Solo se pueden modificar citas asignadas al médico
- Solo se puede cambiar estado a `COMPLETED` o `NO_SHOW`

**Mensajes:**
- `message`: Mínimo 1 carácter, máximo 1000 caracteres

**Solicitudes de Bloqueo:**
- `startDate`: Debe ser fecha futura
- `endDate`: Debe ser >= `startDate`
- `reason`: Mínimo 10 caracteres, máximo 200 caracteres
- No puede haber solapamiento con otras solicitudes pendientes o aprobadas

### 7.2. Validaciones de Negocio

1. **Solicitudes de Bloqueo:**
   - No se pueden crear solicitudes para fechas pasadas
   - No se pueden crear solicitudes que se solapen con citas confirmadas
   - La clínica debe poder aprobar/rechazar solicitudes

2. **Citas:**
   - El médico no puede cancelar citas (solo marcarlas como atendidas/no asistidas)
   - Después de marcar como `COMPLETED`, se debe poder crear un diagnóstico

3. **Mensajes:**
   - Los mensajes son internos entre médico y recepción
   - No deben exponer información sensible de pacientes

---

## 8. Base de Datos

### 8.1. Tabla: `clinic_doctors`
```sql
CREATE TABLE clinic_doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  specialty VARCHAR(255),
  experience INTEGER DEFAULT 0,
  bio TEXT,
  education JSONB, -- Array de strings
  certifications JSONB, -- Array de strings
  profile_image_url VARCHAR(500),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  office_number VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  is_invited BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(clinic_id, email)
);
```

### 8.2. Tabla: `reception_messages`
```sql
CREATE TABLE reception_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES clinic_doctors(id) ON DELETE CASCADE,
  from_type VARCHAR(20) NOT NULL CHECK (from_type IN ('doctor', 'reception')),
  from_user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_reception_messages_clinic_doctor (clinic_id, doctor_id, created_at DESC)
);
```

### 8.3. Tabla: `date_block_requests`
```sql
CREATE TABLE date_block_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES clinic_doctors(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (end_date >= start_date),
  INDEX idx_date_block_requests_doctor (doctor_id, created_at DESC),
  INDEX idx_date_block_requests_clinic (clinic_id, status)
);
```

### 8.4. Modificación a `appointments`
```sql
-- Asegurar que appointments tenga clinic_id
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id);

-- Índice para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_doctor_date 
ON appointments(clinic_id, doctor_id, date, status);
```

---

## 9. Notificaciones

### 9.1. Notificaciones al Médico Asociado

El backend debe enviar notificaciones cuando:
1. **Se agenda una cita nueva:**
   - Email: "Tienes una nueva cita agendada para [fecha] a las [hora] con [paciente]"
   - Push notification (si tiene app móvil)
   - Guardar notificación en tabla `notifications` con `type: 'cita'`

2. **Se cancela una cita:**
   - Email: "Cita cancelada: [paciente] - [fecha] [hora]"
   - Guardar notificación en tabla `notifications`

3. **Se aprueba/rechaza solicitud de bloqueo:**
   - Email: "Tu solicitud de bloqueo del [fecha inicio] al [fecha fin] ha sido [aprobada/rechazada]"
   - Guardar notificación en tabla `notifications`

4. **Nuevo mensaje de recepción:**
   - Push notification: "Nuevo mensaje de recepción"
   - Guardar notificación en tabla `notifications`

### 9.2. Endpoint de Notificaciones (Opcional)

#### GET `/api/doctors/clinic/notifications`
Obtener notificaciones del médico asociado.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "cita",
      "title": "Nueva cita agendada",
      "body": "Dr. Juan Pérez - María González - 15/01/2025 10:00",
      "isRead": false,
      "data": {
        "appointmentId": "uuid",
        "date": "2025-01-15",
        "time": "10:00"
      },
      "createdAt": "2025-01-14T08:00:00Z"
    }
  ]
}
```

---

## 10. Ejemplos de Uso

### 10.1. Flujo: Médico Asociado Inicia Sesión

1. Médico inicia sesión con credenciales
2. Backend verifica si `provider.clinic_id` existe
3. Si existe, incluye `clinic` en la respuesta de `/api/doctors/dashboard`
4. Frontend detecta `clinic !== null` y muestra panel limitado

### 10.2. Flujo: Ver Citas

1. Médico accede a "Mis Citas"
2. Frontend llama a `GET /api/doctors/clinic/appointments`
3. Backend filtra:
   - `appointments.clinic_id = doctor.clinic_id`
   - `appointments.doctor_id = doctor.id`
   - `appointments.status = 'CONFIRMED'`
4. Retorna solo citas confirmadas **sin información financiera**

### 10.3. Flujo: Marcar Cita como Atendida

1. Médico selecciona una cita y marca como "Atendida"
2. Frontend llama a `PATCH /api/doctors/clinic/appointments/:id/status` con `{ status: "COMPLETED" }`
3. Backend valida:
   - El médico es el asignado a la cita
   - La cita pertenece a la clínica del médico
   - El estado actual permite el cambio
4. Backend actualiza el estado
5. Frontend permite crear diagnóstico

### 10.4. Flujo: Solicitar Bloqueo de Fecha

1. Médico solicita bloqueo del 15/02/2025 al 20/02/2025 por "Vacaciones"
2. Frontend llama a `POST /api/doctors/clinic/date-blocks/request`
3. Backend valida:
   - Fechas son futuras
   - `endDate >= startDate`
   - Motivo tiene 10-200 caracteres
   - No hay solapamiento con otras solicitudes pendientes/aprobadas
4. Backend crea solicitud con `status: 'pending'`
5. Administrador de clínica puede aprobar/rechazar desde su panel

---

## 11. Checklist de Implementación

- [ ] Agregar campo `clinic_id` a tabla `providers` o usar tabla `clinic_doctors`
- [ ] Modificar `/api/doctors/dashboard` para incluir `clinic` si existe
- [ ] Implementar `GET /api/doctors/clinic-info`
- [ ] Implementar `GET /api/doctors/clinic/profile`
- [ ] Implementar `PUT /api/doctors/clinic/profile`
- [ ] Implementar `GET /api/doctors/clinic/appointments` (sin info financiera)
- [ ] Implementar `PATCH /api/doctors/clinic/appointments/:id/status`
- [ ] Implementar `GET /api/doctors/clinic/reception/messages`
- [ ] Implementar `POST /api/doctors/clinic/reception/messages`
- [ ] Implementar `PATCH /api/doctors/clinic/reception/messages/read`
- [ ] Implementar `GET /api/doctors/clinic/date-blocks`
- [ ] Implementar `POST /api/doctors/clinic/date-blocks/request`
- [ ] Crear tabla `reception_messages`
- [ ] Crear tabla `date_block_requests`
- [ ] Validar permisos (médico solo puede ver/editar sus propios recursos)
- [ ] Validar que médico esté asociado a clínica en todos los endpoints
- [ ] Ocultar información financiera en respuestas de citas
- [ ] Implementar notificaciones cuando se agenden/cancelen citas
- [ ] Implementar notificaciones para solicitudes de bloqueo
- [ ] Probar todos los flujos de usuario

---

## 12. Notas Importantes

1. **Seguridad:**
   - Todos los endpoints deben validar que el médico esté autenticado
   - Todos los endpoints deben validar que el médico esté asociado a la clínica
   - El médico solo puede acceder a recursos de su propia clínica

2. **Performance:**
   - Usar índices en `clinic_id`, `doctor_id`, `date` para consultas eficientes
   - Paginar resultados de mensajes y solicitudes de bloqueo si hay muchos

3. **Compatibilidad:**
   - Los médicos independientes (sin `clinic_id`) deben seguir usando el panel completo
   - No romper funcionalidad existente para médicos independientes

---

**Nota Final:** Este documento contiene TODO lo que el frontend espera del backend para el Panel de Médico Asociado a Clínica. Cualquier modificación debe ser comunicada al equipo de frontend.
