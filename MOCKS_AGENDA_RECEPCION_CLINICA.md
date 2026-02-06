# ✅ Mocks: Agenda Centralizada y Recepción - Clínica Central

## 📋 Resumen

Se agregaron mocks realistas para:
1. **Agenda Centralizada** - Citas de todos los médicos de la clínica
2. **Recepción - Control Diario** - Mensajes entre recepción y médicos

---

## 📅 1. Agenda Centralizada

### Archivo: `src/features/clinic-panel/infrastructure/appointments.mock.ts`

### Citas de HOY - Dr. Juan Pérez (Cardiólogo - Consultorio 101)

| Hora  | Paciente         | Motivo                          | Estado      | Recepción  |
|-------|------------------|---------------------------------|-------------|------------|
| 09:00 | Carlos Mendoza   | Control de presión arterial     | ✅ Atendido | Atendido   |
| 10:00 | Luis Torres      | Dolor en el pecho               | ⏰ Confirmado| Llegó      |
| 11:30 | Pedro Gómez      | Seguimiento cardiológico        | 📅 Agendado | -          |
| 15:00 | Jorge Ramírez    | Electrocardiograma              | 📅 Agendado | -          |

### Citas de HOY - Dra. María García (Pediatra - Consultorio 102)

| Hora  | Paciente         | Motivo                          | Estado      | Recepción  |
|-------|------------------|---------------------------------|-------------|------------|
| 09:30 | Ana Rodríguez    | Consulta pediátrica - vacunación| ✅ Atendido | Atendido   |
| 10:30 | María Sánchez    | Control de niño sano            | ⏰ Confirmado| Llegó      |
| 14:00 | Laura Díaz       | Consulta por fiebre en niño     | 📅 Agendado | -          |
| 16:00 | Carmen López     | Control de desarrollo infantil  | 📅 Agendado | -          |

### Citas de MAÑANA

| Hora  | Médico           | Paciente         | Motivo                    |
|-------|------------------|------------------|---------------------------|
| 09:00 | Dr. Juan Pérez   | Roberto Castro   | Consulta por arritmia     |
| 10:00 | Dra. María García| Patricia Morales | Consulta pediátrica general|

### Datos de Pacientes

Todos los pacientes tienen:
- ✅ Nombre completo realista
- ✅ Teléfono (formato ecuatoriano: 099XXXXXXX)
- ✅ Email
- ✅ Motivo de consulta específico
- ✅ Historial de creación y actualización

### Estados de Citas

- **scheduled** (📅 Agendado): Cita confirmada pero paciente no ha llegado
- **confirmed** (⏰ Confirmado): Cita confirmada y paciente llegó
- **attended** (✅ Atendido): Cita completada
- **cancelled** (❌ Cancelado): Cita cancelada

### Estados de Recepción

- **arrived**: Paciente llegó y está en sala de espera
- **attended**: Paciente fue atendido
- **not_arrived**: Paciente no llegó
- Sin estado: Paciente aún no ha llegado

---

## 💬 2. Mensajes de Recepción

### Archivo: `src/features/clinic-panel/infrastructure/reception-messages.mock.ts`

### Conversación con Dr. Juan Pérez (Cardiólogo)

**Hace 2 horas:**
> 👨‍⚕️ **Dr. Juan Pérez**: Buenos días. El paciente Carlos Mendoza necesita un electrocardiograma urgente.

**Hace 1.5 horas:**
> 🏥 **Recepción**: Entendido doctor. Ya coordiné con el técnico para el electrocardiograma.

**Hace 30 minutos:** 🔴 NO LEÍDO
> 👨‍⚕️ **Dr. Juan Pérez**: Por favor, confirmar si llegó el paciente Luis Torres de las 10:00.

**Hace 25 minutos:** 🔴 NO LEÍDO
> 🏥 **Recepción**: Sí doctor, el paciente Luis Torres ya está en sala de espera.

### Conversación con Dra. María García (Pediatra)

**Hace 3 horas:**
> 👩‍⚕️ **Dra. María García**: Necesito que preparen la sala de vacunación para el siguiente paciente.

**Hace 2.8 horas:**
> 🏥 **Recepción**: Sala de vacunación lista doctora.

**Hace 45 minutos:** 🔴 NO LEÍDO
> 🏥 **Recepción**: Doctora, la mamá de María Sánchez pregunta si puede adelantar la cita 15 minutos.

**Hace 40 minutos:** 🔴 NO LEÍDO
> 👩‍⚕️ **Dra. María García**: Sí, sin problema. Que pase cuando llegue.

**Hace 38 minutos:** 🔴 NO LEÍDO
> 🏥 **Recepción**: Perfecto doctora, ya le avisé a la mamá.

### Mensajes de Ayer

**Ayer 4:00 PM:**
> 👨‍⚕️ **Dr. Juan Pérez**: Mañana necesitaré el equipo de electrocardiograma desde las 9 AM.

**Ayer 4:30 PM:**
> 🏥 **Recepción**: Anotado doctor. El equipo estará listo desde las 8:30 AM.

### Características de los Mensajes

- ✅ **Timestamps realistas**: Hace 2 horas, 30 minutos, etc.
- ✅ **Estado de lectura**: Mensajes leídos y no leídos
- ✅ **Bidireccional**: Mensajes de doctor → recepción y recepción → doctor
- ✅ **Contexto real**: Coordinación de equipos, confirmación de llegadas, cambios de horario
- ✅ **Identificación clara**: Nombre del remitente (Dr./Dra./Recepción)

---

## 🔧 Funciones Disponibles

### Agenda Centralizada

```typescript
// Obtener todas las citas
getClinicAppointmentsMock(clinicId)

// Filtrar por fecha
getClinicAppointmentsMock(clinicId, '2026-02-05')

// Filtrar por médico
getClinicAppointmentsMock(clinicId, undefined, 'doctor-clinic-central-1')

// Actualizar estado de cita
updateAppointmentStatusMock(clinicId, appointmentId, 'attended')

// Actualizar estado de recepción
updateReceptionStatusMock(clinicId, appointmentId, 'arrived', 'Paciente en sala')
```

### Mensajes de Recepción

```typescript
// Obtener todos los mensajes
getReceptionMessagesMock(clinicId)

// Filtrar por médico
getReceptionMessagesMock(clinicId, 'doctor-clinic-central-1')

// Enviar mensaje
sendReceptionMessageMock(clinicId, doctorId, 'Mensaje', 'reception')

// Marcar como leído
markMessagesAsReadMock(clinicId, ['msg-1', 'msg-2'])
```

---

## 📊 Estadísticas de los Mocks

### Agenda Centralizada
- **Total de citas**: 10
- **Citas de hoy**: 8
- **Citas de mañana**: 2
- **Dr. Juan Pérez**: 5 citas
- **Dra. María García**: 5 citas
- **Pacientes únicos**: 10

### Mensajes de Recepción
- **Total de mensajes**: 11
- **Mensajes de hoy**: 9
- **Mensajes de ayer**: 2
- **Con Dr. Juan Pérez**: 6 mensajes
- **Con Dra. María García**: 5 mensajes
- **Mensajes no leídos**: 5

---

## 🎨 Casos de Uso Cubiertos

### Agenda Centralizada
1. ✅ Ver citas de hoy de todos los médicos
2. ✅ Ver citas de mañana
3. ✅ Filtrar por médico específico
4. ✅ Ver estado de recepción (llegó, atendido, no llegó)
5. ✅ Ver motivo de consulta
6. ✅ Ver consultorio asignado
7. ✅ Actualizar estado de cita
8. ✅ Agregar notas de recepción

### Mensajes de Recepción
1. ✅ Ver conversaciones con cada médico
2. ✅ Mensajes bidireccionales (doctor ↔ recepción)
3. ✅ Indicador de mensajes no leídos
4. ✅ Timestamps relativos (hace X minutos/horas)
5. ✅ Contexto realista de coordinación
6. ✅ Historial de mensajes anteriores
7. ✅ Enviar nuevos mensajes
8. ✅ Marcar como leído

---

## 🔄 Integración con Backend

Cuando el backend esté listo, reemplazar:

```typescript
// Agenda
import { getClinicAppointmentsMock } from './appointments.mock';
// Por:
import { getClinicAppointmentsAPI } from './clinic-appointments.api';

// Mensajes
import { getReceptionMessagesMock } from './reception-messages.mock';
// Por:
import { getReceptionMessagesAPI } from './clinic-reception-messages.api';
```

---

## 📝 Archivos Modificados/Creados

1. ✅ `src/features/clinic-panel/infrastructure/appointments.mock.ts` - Actualizado con 10 citas realistas
2. ✅ `src/features/clinic-panel/infrastructure/reception-messages.mock.ts` - Creado con 11 mensajes

---

## 🎉 Resultado Final

✅ **Agenda Centralizada** tiene 10 citas realistas de 2 médicos
✅ **Recepción** tiene 11 mensajes de coordinación realistas
✅ Todos los datos son coherentes con los médicos de Clínica Central
✅ Estados de citas y recepción funcionando
✅ Mensajes con timestamps y estado de lectura
✅ Listo para pruebas y conexión con backend real

---

**Fecha**: 5 de febrero de 2026  
**Estado**: ✅ COMPLETADO  
**Clínica**: Clínica Central (clinic-1)

---

¡Los mocks de agenda y recepción están listos! 🚀
