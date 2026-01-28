# 🏥 Panel de Clínica - Especificación Técnica para Backend

Este documento contiene **TODAS** las especificaciones técnicas que el backend debe implementar para soportar el Panel de Clínica, basado en:
- ✅ Lo que ya está implementado en el frontend
- ✅ Los requisitos del PDF del Panel de Clínica
- ✅ Las estructuras de datos TypeScript del frontend

---

## 📋 Índice

1. [Requisitos del PDF](#1-requisitos-del-pdf)
2. [Estructuras de Datos (TypeScript)](#2-estructuras-de-datos-typescript)
3. [Endpoints Requeridos](#3-endpoints-requeridos)
4. [Modelos de Base de Datos](#4-modelos-de-base-de-datos)
5. [Flujos de Usuario](#5-flujos-de-usuario)
6. [Notificaciones Automáticas](#6-notificaciones-automáticas)
7. [Validaciones y Reglas de Negocio](#7-validaciones-y-reglas-de-negocio)

---

## 1. Requisitos del PDF

### 1.1. Objetivo
- La clínica **administra**, no atiende pacientes directamente
- Control centralizado de múltiples médicos
- Agenda centralizada de todas las citas
- Mantener la marca de la clínica

### 1.2. Roles

**Administrador de Clínica:**
- Una sola cuenta principal por clínica
- Puede: configurar clínica, invitar médicos, ver agendas, coordinar horarios

**Médicos Asociados:**
- NO se registran desde cero
- Son invitados por la clínica
- Solo editan su perfil profesional
- NO pueden cambiar datos de la clínica

### 1.3. Módulos Requeridos
1. ✅ Perfil de la Clínica
2. ✅ Gestión de Médicos
3. ✅ Agenda Centralizada
4. ✅ Configuración de Horarios
5. ✅ Recepción / Control Diario
6. ⚠️ Notificaciones Automáticas

---

## 2. Estructuras de Datos (TypeScript)

### 2.1. ClinicProfile
```typescript
interface ClinicProfile {
  id: string;                    // UUID
  name: string;                  // Nombre de la clínica
  logoUrl?: string;              // URL del logo
  specialties: string[];         // Array de especialidades
  address: string;               // Dirección completa
  phone: string;                 // Teléfono (10 dígitos, Ecuador)
  whatsapp: string;              // WhatsApp (10 dígitos, Ecuador)
  generalSchedule: ClinicSchedule; // Horarios generales
  description: string;           // Descripción de la clínica
  isActive: boolean;            // Estado activo/inactivo
  createdAt?: string;           // ISO 8601
  updatedAt?: string;           // ISO 8601
}
```

### 2.2. ClinicSchedule
```typescript
interface ClinicSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface DaySchedule {
  enabled: boolean;    // Si el día está habilitado
  startTime: string;   // Formato: 'HH:mm' (ej: '08:00')
  endTime: string;     // Formato: 'HH:mm' (ej: '18:00')
}
```

### 2.3. ClinicDashboard
```typescript
interface ClinicDashboard {
  totalDoctors: number;           // Total de médicos en la clínica
  activeDoctors: number;          // Médicos activos
  totalAppointments: number;     // Total de citas (histórico)
  todayAppointments: number;     // Citas de hoy
  pendingAppointments: number;   // Citas pendientes
  completedAppointments: number; // Citas completadas
  clinic: ClinicProfile;          // Perfil completo de la clínica
}
```

### 2.4. ClinicDoctor
```typescript
interface ClinicDoctor {
  id: string;                    // UUID
  clinicId: string;              // UUID de la clínica
  userId?: string;               // UUID del usuario (null hasta aceptar invitación)
  email: string;                 // Email del médico
  name?: string;                 // Nombre (se completa al aceptar invitación)
  specialty?: string;            // Especialidad
  isActive: boolean;            // Activo/Inactivo
  isInvited: boolean;           // Si está invitado pero no aceptó
  invitationToken?: string;      // Token de invitación
  invitationExpiresAt?: string;  // ISO 8601 - Expiración del token
  officeNumber?: string;         // Número de consultorio (opcional)
  profileImageUrl?: string;      // URL de foto de perfil
  phone?: string;                // Teléfono
  whatsapp?: string;             // WhatsApp
  createdAt: string;            // ISO 8601
  updatedAt?: string;           // ISO 8601
  professionalProfile?: {        // Solo editable por el médico
    bio?: string;
    experience?: number;
    education?: string[];
    certifications?: string[];
  };
}
```

### 2.5. DoctorInvitation
```typescript
interface DoctorInvitation {
  id: string;                   // UUID
  clinicId: string;              // UUID de la clínica
  email: string;                 // Email invitado
  invitationToken: string;       // Token único y seguro
  expiresAt: string;            // ISO 8601 - Expira en 7 días
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;            // ISO 8601
}
```

### 2.6. ClinicAppointment
```typescript
type AppointmentStatus = 'scheduled' | 'confirmed' | 'attended' | 'cancelled' | 'no_show';
type ReceptionStatus = 'arrived' | 'not_arrived' | 'attended';

interface ClinicAppointment {
  id: string;                    // UUID
  clinicId: string;              // UUID de la clínica
  doctorId: string;              // UUID del médico
  doctorName: string;            // Nombre del médico (para evitar joins)
  doctorSpecialty: string;       // Especialidad (para evitar joins)
  patientId: string;             // UUID del paciente
  patientName: string;           // Nombre del paciente
  patientPhone?: string;         // Teléfono del paciente
  patientEmail?: string;         // Email del paciente
  date: string;                  // Formato: 'YYYY-MM-DD'
  time: string;                  // Formato: 'HH:mm'
  reason?: string;               // Motivo de la cita
  status: AppointmentStatus;    // Estado de la cita
  receptionStatus?: ReceptionStatus; // Estado de recepción
  receptionNotes?: string;       // Notas de recepción
  createdAt: string;            // ISO 8601
  updatedAt?: string;           // ISO 8601
}
```

---

## 3. Endpoints Requeridos

### 3.1. Perfil de la Clínica

#### GET `/api/clinics/profile`
Obtener perfil de la clínica del usuario autenticado

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
    "logoUrl": "https://cdn.example.com/logos/clinic-uuid.jpg",
    "specialties": ["Medicina General", "Cardiología", "Pediatría"],
    "address": "Av. Principal 123, Quito, Ecuador",
    "phone": "0991234567",
    "whatsapp": "0991234567",
    "generalSchedule": {
      "monday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      "tuesday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      "wednesday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      "thursday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      "friday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      "saturday": { "enabled": true, "startTime": "09:00", "endTime": "13:00" },
      "sunday": { "enabled": false, "startTime": "09:00", "endTime": "13:00" }
    },
    "description": "Clínica especializada en atención médica integral...",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### PUT `/api/clinics/profile`
Actualizar perfil de la clínica

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "Clínica San José",
  "logoUrl": "https://...",
  "specialties": ["Medicina General", "Cardiología"],
  "address": "Av. Principal 123",
  "phone": "0991234567",
  "whatsapp": "0991234567",
  "description": "Nueva descripción",
  "generalSchedule": {
    "monday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
    "tuesday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
    "wednesday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
    "thursday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
    "friday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
    "saturday": { "enabled": true, "startTime": "09:00", "endTime": "13:00" },
    "sunday": { "enabled": false, "startTime": "09:00", "endTime": "13:00" }
  }
}
```

**Validaciones:**
- `phone` y `whatsapp`: exactamente 10 dígitos (Ecuador)
- `specialties`: array de strings, mínimo 1
- `generalSchedule`: objeto con los 7 días de la semana
- `description`: mínimo 10 caracteres

#### POST `/api/clinics/upload-logo`
Subir logo de la clínica

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
```
FormData con campo 'logo' (archivo de imagen)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logoUrl": "https://cdn.example.com/logos/clinic-uuid.jpg"
  }
}
```

---

### 3.2. Dashboard de Clínica

#### GET `/api/clinics/dashboard`
Obtener estadísticas del dashboard

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDoctors": 5,
    "activeDoctors": 4,
    "totalAppointments": 120,
    "todayAppointments": 8,
    "pendingAppointments": 3,
    "completedAppointments": 5,
    "clinic": {
      "id": "uuid",
      "name": "Clínica San José",
      ...
    }
  }
}
```

**Lógica:**
- `totalDoctors`: COUNT de `clinic_doctors` donde `clinic_id = X`
- `activeDoctors`: COUNT de `clinic_doctors` donde `clinic_id = X` AND `is_active = true`
- `todayAppointments`: COUNT de `appointments` donde `clinic_id = X` AND `date = TODAY`
- `pendingAppointments`: COUNT de `appointments` donde `clinic_id = X` AND `status IN ('scheduled', 'confirmed')`
- `completedAppointments`: COUNT de `appointments` donde `clinic_id = X` AND `status = 'attended'`

---

### 3.3. Gestión de Médicos

#### GET `/api/clinics/doctors`
Obtener lista de médicos de la clínica

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (opcional): `active` | `inactive` | `all` (default: `all`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "clinicId": "uuid",
      "userId": "uuid",
      "email": "dr.perez@clinic.com",
      "name": "Dr. Juan Pérez",
      "specialty": "Cardiología",
      "isActive": true,
      "isInvited": false,
      "officeNumber": "101",
      "profileImageUrl": "https://...",
      "phone": "0991111111",
      "whatsapp": "0991111111",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/clinics/doctors/invite`
Invitar médico por email

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "email": "nuevo.doctor@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clinicId": "uuid",
    "email": "nuevo.doctor@example.com",
    "invitationToken": "token-secreto-aleatorio-256-bits",
    "expiresAt": "2025-01-08T00:00:00Z",
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00Z",
    "invitationLink": "https://app.mediconnect.com/clinic/invite?token=token-secreto-aleatorio-256-bits"
  }
}
```

**Lógica del Backend:**
1. Validar que el email no esté ya registrado en esta clínica
2. Generar token único y seguro (256 bits, URL-safe)
3. Crear registro en `doctor_invitations` con `status = 'pending'`
4. Crear registro en `clinic_doctors` con `is_invited = true`, `user_id = NULL`
5. Enviar email con el link de invitación
6. El token expira en 7 días

#### POST `/api/clinics/doctors/invite/link`
Generar link de invitación (sin enviar email)

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "email": "nuevo.doctor@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invitationLink": "https://app.mediconnect.com/clinic/invite?token=token-secreto-aleatorio-256-bits",
    "expiresAt": "2025-01-08T00:00:00Z"
  }
}
```

#### GET `/api/clinics/invite/:token`
Validar token de invitación (público, para página de aceptación)

**Response:**
```json
{
  "success": true,
  "data": {
    "clinic": {
      "id": "uuid",
      "name": "Clínica San José"
    },
    "email": "nuevo.doctor@example.com",
    "expiresAt": "2025-01-08T00:00:00Z",
    "isValid": true
  }
}
```

**Validaciones:**
- Token debe existir
- Token no debe estar expirado (`expires_at > NOW()`)
- Token debe tener `status = 'pending'`

#### POST `/api/clinics/invite/:token/accept`
Aceptar invitación y crear cuenta de médico

**Request:**
```json
{
  "name": "Dr. Nuevo Médico",
  "specialty": "Medicina General",
  "password": "SecurePass123!",
  "phone": "0991234567",
  "whatsapp": "0991234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "nuevo.doctor@example.com",
    "token": "jwt-token",
    "doctor": {
      "id": "uuid",
      "clinicId": "uuid",
      "userId": "uuid",
      "name": "Dr. Nuevo Médico",
      "specialty": "Medicina General",
      "isActive": true,
      "isInvited": false,
      ...
    }
  }
}
```

**Lógica del Backend:**
1. Validar token (debe existir, no expirado, status = 'pending')
2. Crear usuario en `users` con `role = 'provider'`, `serviceType = 'doctor'`
3. Actualizar `clinic_doctors` con `user_id`, `name`, `specialty`, `is_invited = false`
4. Actualizar `doctor_invitations` con `status = 'accepted'`
5. Generar JWT token
6. Enviar notificación de bienvenida

#### PATCH `/api/clinics/doctors/:doctorId/status`
Activar/desactivar médico

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "isActive": false,
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### PATCH `/api/clinics/doctors/:doctorId/office`
Asignar consultorio

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "officeNumber": "102"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "officeNumber": "102",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### 3.4. Agenda Centralizada

#### GET `/api/clinics/appointments`
Obtener todas las citas de la clínica

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `date` (opcional): `YYYY-MM-DD` - Filtrar por fecha específica
- `doctorId` (opcional): `uuid` - Filtrar por médico
- `status` (opcional): `scheduled` | `confirmed` | `attended` | `cancelled` | `no_show`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "clinicId": "uuid",
      "doctorId": "uuid",
      "doctorName": "Dr. Juan Pérez",
      "doctorSpecialty": "Cardiología",
      "patientId": "uuid",
      "patientName": "Paciente Ejemplo",
      "patientPhone": "0991234567",
      "patientEmail": "paciente@example.com",
      "date": "2025-01-15",
      "time": "10:00",
      "reason": "Consulta de rutina",
      "status": "confirmed",
      "receptionStatus": "arrived",
      "receptionNotes": null,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Nota:** El backend debe hacer JOINs para obtener `doctorName`, `doctorSpecialty`, `patientName`, `patientPhone`, `patientEmail` desde las tablas relacionadas.

#### PATCH `/api/clinics/appointments/:appointmentId/status`
Actualizar estado de cita

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "attended"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "attended",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### 3.5. Recepción / Control Diario

#### GET `/api/clinics/reception/today`
Obtener citas del día para recepción

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
      "time": "10:00",
      "patientName": "Paciente Ejemplo",
      "doctorName": "Dr. Juan Pérez",
      "doctorSpecialty": "Cardiología",
      "receptionStatus": "arrived",
      "receptionNotes": null
    }
  ]
}
```

#### PATCH `/api/clinics/appointments/:appointmentId/reception`
Actualizar estado de recepción

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "receptionStatus": "attended",
  "receptionNotes": "Paciente atendido correctamente"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "receptionStatus": "attended",
    "receptionNotes": "Paciente atendido correctamente",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### 3.6. Horarios de Médicos

#### GET `/api/clinics/doctors/:doctorId/schedule`
Obtener horarios del médico en la clínica

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "doctorId": "uuid",
    "clinicId": "uuid",
    "schedule": {
      "monday": { "enabled": true, "startTime": "09:00", "endTime": "17:00", "breakStart": "13:00", "breakEnd": "14:00" },
      "tuesday": { "enabled": true, "startTime": "09:00", "endTime": "17:00" },
      "wednesday": { "enabled": false, "startTime": "09:00", "endTime": "17:00" },
      "thursday": { "enabled": true, "startTime": "09:00", "endTime": "17:00" },
      "friday": { "enabled": true, "startTime": "09:00", "endTime": "17:00" },
      "saturday": { "enabled": false, "startTime": "09:00", "endTime": "13:00" },
      "sunday": { "enabled": false, "startTime": "09:00", "endTime": "13:00" }
    }
  }
}
```

#### PUT `/api/clinics/doctors/:doctorId/schedule`
Actualizar horarios del médico (solo el médico puede hacerlo)

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "schedule": {
    "monday": { "enabled": true, "startTime": "09:00", "endTime": "17:00" },
    "tuesday": { "enabled": true, "startTime": "09:00", "endTime": "17:00" },
    ...
  }
}
```

**Validación:** Los horarios del médico NO pueden estar fuera de los horarios de la clínica.

---

## 4. Modelos de Base de Datos

### 4.1. Tabla: `clinics`
```sql
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id) -- Un usuario solo puede tener una clínica
);
```

### 4.2. Tabla: `clinic_specialties`
```sql
CREATE TABLE clinic_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  specialty VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(clinic_id, specialty)
);
```

### 4.3. Tabla: `clinic_schedules`
```sql
CREATE TABLE clinic_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Lunes, 6=Domingo
  enabled BOOLEAN DEFAULT false,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(clinic_id, day_of_week)
);
```

### 4.4. Tabla: `clinic_doctors`
```sql
CREATE TABLE clinic_doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL hasta que acepte invitación
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  specialty VARCHAR(255),
  office_number VARCHAR(50),
  profile_image_url VARCHAR(500),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  is_invited BOOLEAN DEFAULT true,
  invitation_token VARCHAR(255) UNIQUE,
  invitation_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(clinic_id, email) -- Un email solo puede estar una vez por clínica
);
```

### 4.5. Tabla: `doctor_invitations`
```sql
CREATE TABLE doctor_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  invitation_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.6. Tabla: `doctor_schedules`
```sql
CREATE TABLE doctor_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES clinic_doctors(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  enabled BOOLEAN DEFAULT false,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(doctor_id, clinic_id, day_of_week)
);
```

### 4.7. Modificación a `appointments`
```sql
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reception_status VARCHAR(50) CHECK (reception_status IN ('arrived', 'not_arrived', 'attended'));
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reception_notes TEXT;
```

---

## 5. Flujos de Usuario

### 5.1. Registro de Clínica
1. Usuario se registra con `role: "provider"` y `serviceType: "clinic"`
2. Backend crea registro en `clinics` vinculado al `user_id`
3. Backend crea horarios por defecto en `clinic_schedules` (todos deshabilitados)
4. Usuario puede acceder al panel de clínica

### 5.2. Invitación de Médico
1. Administrador invita médico por email o genera link
2. Backend crea registro en `doctor_invitations` y `clinic_doctors` (con `is_invited=true`, `user_id=NULL`)
3. Si es por email: backend envía email con link
4. Médico hace clic en link y completa registro
5. Backend actualiza `clinic_doctors` con `user_id`, `name`, `specialty`, `is_invited=false`
6. Backend actualiza `doctor_invitations` con `status='accepted'`
7. Médico puede acceder a su panel

### 5.3. Creación de Cita
1. Paciente agenda cita con médico de la clínica
2. Backend crea `appointment` con `clinic_id`
3. Backend envía notificaciones (ver sección 6)

### 5.4. Control de Recepción
1. Recepción marca estado: `arrived`, `not_arrived`, o `attended`
2. Backend actualiza `appointments.reception_status`
3. Si se marca como `attended`, el médico puede crear diagnóstico

---

## 6. Notificaciones Automáticas

### 6.1. Cuando se agenda una cita nueva

**Al Médico:**
- Email: "Tienes una nueva cita agendada para [fecha] a las [hora] con [paciente]"
- Push notification (si tiene app móvil)
- WhatsApp (opcional): "Nueva cita: [fecha] [hora] - [paciente]"

**A la Clínica:**
- Email: "Nueva cita agendada: [médico] - [paciente] - [fecha] [hora]"
- Notificación en dashboard

**Al Paciente:**
- Email: "Tu cita ha sido confirmada: [fecha] [hora] con [médico] en [clínica]"
- WhatsApp: "Tu cita en [clínica] está confirmada para [fecha] a las [hora]"

### 6.2. Cuando se confirma una cita

**Al Paciente:**
- Email/WhatsApp: Recordatorio 24 horas antes

### 6.3. Cuando se cancela una cita

**Al Médico:**
- Email: "Cita cancelada: [paciente] - [fecha] [hora]"

**A la Clínica:**
- Notificación en dashboard

**Al Paciente:**
- Email/WhatsApp: "Tu cita del [fecha] ha sido cancelada"

---

## 7. Validaciones y Reglas de Negocio

### 7.1. Seguridad
- Solo el administrador de la clínica puede:
  - Invitar médicos
  - Activar/desactivar médicos
  - Asignar consultorios
  - Ver todas las citas
  - Editar perfil de la clínica
- Los médicos solo pueden:
  - Editar su perfil profesional
  - Gestionar sus propias citas
  - Ver sus propias citas
  - Configurar sus horarios (dentro de los horarios de la clínica)
- Validar que `clinic_id` en requests pertenezca al usuario autenticado

### 7.2. Validaciones de Datos
- Email de invitación debe ser único por clínica
- Token de invitación debe expirar en 7 días
- Horarios de médico no pueden estar fuera de horarios de clínica
- Teléfono y WhatsApp: exactamente 10 dígitos (Ecuador)
- `specialties`: array mínimo 1 elemento
- `description`: mínimo 10 caracteres

### 7.3. En la App Móvil
- Cuando un médico atiende en una clínica, mostrar:
  - "Este médico atiende en [Nombre de Clínica]"
  - Logo de la clínica
  - Dirección de la clínica

### 7.4. Formato de Respuestas
TODAS las respuestas deben seguir:
```json
{
  "success": boolean,
  "data": T,
  "message": string (opcional)
}
```

### 7.5. Códigos de Estado HTTP
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado
- `400 Bad Request`: Error de validación
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: Sin permisos
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

---

## 8. Especialidades Disponibles

El frontend usa estas 20 especialidades (deben estar disponibles en el backend):

1. Medicina General
2. Cardiología
3. Dermatología
4. Ginecología
5. Pediatría
6. Oftalmología
7. Traumatología
8. Neurología
9. Psiquiatría
10. Urología
11. Endocrinología
12. Gastroenterología
13. Neumología
14. Otorrinolaringología
15. Oncología
16. Reumatología
17. Nefrología
18. Cirugía General
19. Anestesiología
20. Odontología

---

## ✅ Checklist de Implementación

- [ ] Crear tablas en base de datos
- [ ] Implementar endpoints de perfil de clínica
- [ ] Implementar endpoints de gestión de médicos
- [ ] Implementar sistema de invitaciones
- [ ] Implementar endpoints de agenda centralizada
- [ ] Implementar endpoints de recepción
- [ ] Implementar endpoints de horarios
- [ ] Integrar sistema de notificaciones (email/WhatsApp)
- [ ] Validar permisos y seguridad
- [ ] Agregar logs y monitoreo
- [ ] Documentar API con Swagger/OpenAPI

---

**Nota Final:** Este documento contiene TODO lo que el frontend espera del backend. Cualquier modificación debe ser comunicada al equipo de frontend.
