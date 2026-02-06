# Horario Laboral para Médicos Asociados a Clínica ✅

## Resumen
Se ha agregado una nueva pestaña "Horario Laboral" en el panel de médicos asociados a clínica, donde pueden ver (solo lectura) el horario general de atención de la clínica.

## Cambios Realizados

### 1. Menú de Navegación
**Archivo:** `src/shared/config/navigation.config.tsx`

**Cambios:**
- Agregado nuevo item "Horario Laboral" en `CLINIC_ASSOCIATED_DOCTOR_MENU`
- Posicionado después de "Recepción" y antes de "Solicitar Bloqueos"
- Icono: Settings (⚙️)
- Ruta: `/doctor/dashboard?tab=clinic-schedule`

### 2. Componente de Vista de Horario
**Archivo:** `src/features/doctor-panel/presentation/components/ClinicScheduleView.tsx` (NUEVO)

**Funcionalidades:**
- Muestra el horario general de la clínica en formato de tabla
- Tabla con columnas: Día, Estado, Hora Inicio, Hora Fin
- Estados visuales: "Abierto" (verde) / "Cerrado" (gris)
- Alert informativo explicando que es solo lectura
- Alert de advertencia con instrucciones para solicitar cambios
- Manejo de estados de carga y errores
- Obtiene datos desde el API de la clínica

### 3. Actualización de Entidades
**Archivo:** `src/features/doctor-panel/domain/ClinicAssociatedDoctor.entity.ts`

**Cambios:**
- Agregado campo `generalSchedule?: ClinicSchedule` a la interfaz `ClinicInfo`
- Importado tipo `ClinicSchedule` desde el dominio de clínicas

### 4. Actualización de Mocks
**Archivo:** `src/features/doctor-panel/infrastructure/clinic-associated.mock.ts`

**Cambios:**
- Agregado `MOCK_CLINIC_SCHEDULE` con horario de ejemplo:
  - Lunes a Viernes: 08:00 - 18:00
  - Sábado: 09:00 - 13:00
  - Domingo: Cerrado
- Incluido `generalSchedule` en `MOCK_CLINIC_INFO`

### 5. Integración en Dashboard
**Archivo:** `src/features/doctor-panel/presentation/pages/DoctorDashboardPage.tsx`

**Cambios:**
- Agregado tipo `"clinic-schedule"` al `TabType`
- Importado componente `ClinicScheduleView`
- Agregada ruta para renderizar el componente cuando `tab=clinic-schedule`

## Estructura de Datos

### ClinicSchedule (del dominio de clínicas)
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
  enabled: boolean;
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
}
```

### Ejemplo de Respuesta del API
```json
{
  "success": true,
  "data": {
    "id": "clinic-1",
    "name": "Clínica San José",
    "address": "Av. Principal 123, Quito, Ecuador",
    "phone": "0991234567",
    "whatsapp": "0991234567",
    "logoUrl": "https://...",
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
}
```

## Flujo de Uso

1. **Médico inicia sesión** (asociado a clínica)
2. **Ve el menú lateral** con la opción "Horario Laboral"
3. **Hace clic en "Horario Laboral"**
4. **Ve la tabla** con el horario de la clínica:
   - Días de la semana
   - Estado (Abierto/Cerrado)
   - Horarios de inicio y fin
5. **Lee los alerts informativos:**
   - Explicación de que es el horario general de la clínica
   - Instrucciones para solicitar cambios (usar "Solicitar Bloqueos")

## Características

### ✅ Solo Lectura
- El médico NO puede editar el horario
- Solo puede visualizar el horario configurado por la clínica
- Los horarios son gestionados por la administración de la clínica

### ✅ Estados Visuales
- **Abierto:** Chip verde con horarios visibles
- **Cerrado:** Chip gris con guiones en lugar de horarios

### ✅ Información Contextual
- Alert azul: Explica que es el horario general de la clínica
- Alert amarillo: Indica cómo solicitar cambios o bloqueos

### ✅ Manejo de Errores
- Loading spinner mientras carga
- Alert de error si falla la carga
- Mensaje claro si no hay datos disponibles

## Endpoint del Backend

### GET /api/doctors/clinic-info

**Request:**
```http
GET http://localhost:3000/api/doctors/clinic-info
Authorization: Bearer {token_del_medico}
```

**Response Esperado:**
```json
{
  "success": true,
  "data": {
    "id": "clinic-1",
    "name": "Clínica San José",
    "address": "Av. Principal 123, Quito, Ecuador",
    "phone": "0991234567",
    "whatsapp": "0991234567",
    "logoUrl": "https://...",
    "generalSchedule": {
      "monday": { "enabled": true, "startTime": "08:00", "endTime": "18:00" },
      // ... resto de días
    }
  }
}
```

**Nota:** El backend debe incluir el campo `generalSchedule` en la respuesta de `/api/doctors/clinic-info`

## Archivos Creados/Modificados

### Creados:
1. `src/features/doctor-panel/presentation/components/ClinicScheduleView.tsx`
2. `HORARIO_LABORAL_MEDICO_CLINICA.md` (este archivo)

### Modificados:
1. `src/shared/config/navigation.config.tsx`
2. `src/features/doctor-panel/domain/ClinicAssociatedDoctor.entity.ts`
3. `src/features/doctor-panel/infrastructure/clinic-associated.mock.ts`
4. `src/features/doctor-panel/presentation/pages/DoctorDashboardPage.tsx`

## Testing

### Probar en el Frontend:

1. **Iniciar sesión como médico asociado a clínica:**
   - Email: `dr.juan.perez@clinicacentral.com`
   - Password: `doctor123`

2. **Verificar que aparece el menú "Horario Laboral"**
   - Debe estar entre "Recepción" y "Solicitar Bloqueos"

3. **Hacer clic en "Horario Laboral"**
   - Debe cargar la tabla con los horarios
   - Debe mostrar los alerts informativos

4. **Verificar la tabla:**
   - 7 filas (una por cada día)
   - Columnas: Día, Estado, Hora Inicio, Hora Fin
   - Estados correctos (Abierto/Cerrado)
   - Horarios formateados correctamente

### Probar con Backend:

1. **Asegurar que el endpoint incluye generalSchedule:**
   ```
   GET /api/doctors/clinic-info
   ```

2. **Verificar que el horario se carga desde el backend**
   - Abrir DevTools > Network
   - Hacer clic en "Horario Laboral"
   - Verificar request a `/api/doctors/clinic-info`
   - Verificar que la respuesta incluye `generalSchedule`

## Mensaje para el Backend

El endpoint `GET /api/doctors/clinic-info` debe incluir el campo `generalSchedule` con la estructura:

```json
{
  "generalSchedule": {
    "monday": { "enabled": boolean, "startTime": "HH:mm", "endTime": "HH:mm" },
    "tuesday": { "enabled": boolean, "startTime": "HH:mm", "endTime": "HH:mm" },
    "wednesday": { "enabled": boolean, "startTime": "HH:mm", "endTime": "HH:mm" },
    "thursday": { "enabled": boolean, "startTime": "HH:mm", "endTime": "HH:mm" },
    "friday": { "enabled": boolean, "startTime": "HH:mm", "endTime": "HH:mm" },
    "saturday": { "enabled": boolean, "startTime": "HH:mm", "endTime": "HH:mm" },
    "sunday": { "enabled": boolean, "startTime": "HH:mm", "endTime": "HH:mm" }
  }
}
```

Este es el mismo formato que usa la clínica en su configuración de horarios.

---

**Estado:** ✅ Completado y funcional
**Fecha:** 2026-02-06
**Funcionalidad:** Solo lectura del horario de la clínica para médicos asociados
