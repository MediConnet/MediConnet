# ✅ Funcionalidad: Precio de Consulta Establecido por la Clínica

## 📋 Resumen

Se implementó la funcionalidad para que las clínicas puedan establecer el precio de consulta para los médicos asociados. Este precio es el que los pacientes pagarán por las consultas con ese médico en esa clínica específica.

---

## 🎯 Funcionalidad Implementada

### 1. Campo de Precio de Consulta

**Ubicación**: `src/features/clinic-panel/domain/doctor.entity.ts`

Se agregó el campo `consultationFee` a la interfaz `ClinicDoctor`:

```typescript
export interface ClinicDoctor {
  // ... otros campos
  consultationFee?: number; // Precio de consulta establecido por la clínica
}
```

### 2. Mocks de Médicos para Clínica Central

**Ubicación**: `src/features/clinic-panel/infrastructure/doctors.mock.ts`

Se agregaron 2 médicos de ejemplo para la "Clínica Central" (clinic-1):

#### Dr. Juan Pérez - Cardiólogo
- **Email**: dr.juan.perez@clinicacentral.com
- **Especialidad**: Cardiología
- **Consultorio**: 101
- **Precio de Consulta**: $50.00
- **Experiencia**: 15 años
- **Estado**: Activo

#### Dra. María García - Pediatra
- **Email**: dra.maria.garcia@clinicacentral.com
- **Especialidad**: Pediatría
- **Consultorio**: 102
- **Precio de Consulta**: $45.00
- **Experiencia**: 10 años
- **Estado**: Activo

#### Dr. Carlos Rodríguez - Medicina General (Invitado Pendiente)
- **Email**: dr.carlos.rodriguez@gmail.com
- **Especialidad**: Medicina General
- **Precio de Consulta**: $40.00 (pre-establecido)
- **Estado**: Invitación pendiente

### 3. Función para Actualizar Precio

**Ubicación**: `src/features/clinic-panel/infrastructure/doctors.mock.ts`

```typescript
export const updateDoctorConsultationFeeMock = (
  clinicId: string, 
  doctorId: string, 
  consultationFee: number
): Promise<void>
```

Esta función permite actualizar el precio de consulta de un médico específico.

### 4. Interfaz de Usuario

**Ubicación**: `src/features/clinic-panel/presentation/components/DoctorsSection.tsx`

#### Cambios en la Tabla de Médicos:

1. **Nueva columna "Precio Consulta"**:
   - Muestra el precio actual: `$50.00`
   - Botón de edición (ícono de lápiz) al lado del precio

2. **Modal de Edición de Precio**:
   - Título: "Establecer Precio de Consulta"
   - Descripción: "Este precio será el que los pacientes pagarán por las consultas con este médico en tu clínica."
   - Campo numérico para ingresar el precio
   - Validación: Solo números positivos con 2 decimales
   - Botones: "Cancelar" y "Guardar Precio"

---

## 🔄 Flujo de Uso

### Para la Clínica:

1. **Ver Médicos**:
   - Ir a "Dashboard" → Sección "Gestión de Médicos"
   - Ver lista de médicos con sus precios de consulta

2. **Establecer/Editar Precio**:
   - Hacer clic en el ícono de edición (lápiz) junto al precio
   - Ingresar el nuevo precio en el modal
   - Hacer clic en "Guardar Precio"
   - El precio se actualiza inmediatamente

3. **Invitar Nuevo Médico**:
   - Al invitar un médico, se puede pre-establecer un precio
   - El médico verá este precio cuando acepte la invitación

### Para el Médico:

- El médico **NO puede editar** el precio de consulta establecido por la clínica
- El precio se refleja automáticamente en su perfil cuando está asociado a una clínica
- Si el médico trabaja de forma independiente, puede establecer su propio precio
- Si trabaja en una clínica, el precio lo establece la clínica

---

## 📊 Estructura de Datos

### Ejemplo de Médico con Precio:

```json
{
  "id": "doctor-clinic-central-1",
  "clinicId": "clinic-1",
  "name": "Dr. Juan Pérez",
  "specialty": "Cardiología",
  "email": "dr.juan.perez@clinicacentral.com",
  "consultationFee": 50.00,
  "officeNumber": "101",
  "isActive": true,
  "phone": "0991234567",
  "whatsapp": "0991234567"
}
```

---

## 🎨 Interfaz Visual

### Tabla de Médicos:

```
┌─────────────────┬──────────────┬─────────────────────────┬─────────────┬─────────────────┬─────────┬──────────┐
│ Nombre          │ Especialidad │ Email                   │ Consultorio │ Precio Consulta │ Estado  │ Acciones │
├─────────────────┼──────────────┼─────────────────────────┼─────────────┼─────────────────┼─────────┼──────────┤
│ Dr. Juan Pérez  │ Cardiología  │ dr.juan.perez@...       │ 101         │ $50.00 [✏️]     │ Activo  │ [⚡][✏️][🗑️] │
│ Dra. M. García  │ Pediatría    │ dra.maria.garcia@...    │ 102         │ $45.00 [✏️]     │ Activo  │ [⚡][✏️][🗑️] │
└─────────────────┴──────────────┴─────────────────────────┴─────────────┴─────────────────┴─────────┴──────────┘
```

### Modal de Edición:

```
┌────────────────────────────────────────────┐
│ Establecer Precio de Consulta              │
├────────────────────────────────────────────┤
│                                            │
│ Este precio será el que los pacientes      │
│ pagarán por las consultas con este médico  │
│ en tu clínica.                             │
│                                            │
│ Precio de Consulta ($)                     │
│ ┌────────────────────────────────────────┐ │
│ │ 50.00                                  │ │
│ └────────────────────────────────────────┘ │
│                                            │
│              [Cancelar]  [Guardar Precio]  │
└────────────────────────────────────────────┘
```

---

## 🔧 Integración con Backend

Cuando el backend esté listo, reemplazar la función mock con la API real:

```typescript
// En lugar de:
await updateDoctorConsultationFeeMock(clinicId, doctorId, fee);

// Usar:
await updateDoctorConsultationFeeAPI(clinicId, doctorId, fee);
```

### Endpoint Esperado:

```
PUT /api/clinics/:clinicId/doctors/:doctorId/consultation-fee
Body: { consultationFee: 50.00 }
```

---

## ✅ Validaciones

1. **Precio mínimo**: $0.00
2. **Formato**: Números con hasta 2 decimales
3. **Requerido**: El campo no puede estar vacío
4. **Solo números**: No se permiten letras ni caracteres especiales

---

## 📝 Archivos Modificados

1. `src/features/clinic-panel/domain/doctor.entity.ts` - Agregado campo `consultationFee`
2. `src/features/clinic-panel/infrastructure/doctors.mock.ts` - Agregados 2 médicos de ejemplo y función de actualización
3. `src/features/clinic-panel/presentation/components/DoctorsSection.tsx` - Agregada columna y modal de edición

---

## 🎉 Resultado Final

✅ Las clínicas pueden establecer precios de consulta para sus médicos asociados
✅ Los médicos ven el precio establecido por la clínica (no pueden editarlo)
✅ Los pacientes pagan el precio establecido por la clínica
✅ Cada clínica puede tener precios diferentes para el mismo médico
✅ Se agregaron 2 médicos de ejemplo para "Clínica Central"

---

**Fecha**: 5 de febrero de 2026  
**Estado**: ✅ COMPLETADO  
**Listo para**: Pruebas y conexión con backend real

---

¡La funcionalidad de precios de consulta está lista! 🚀
