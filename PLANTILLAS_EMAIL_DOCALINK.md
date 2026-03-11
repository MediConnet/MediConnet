# 📧 Plantillas de Email para DOCALINK

## 🎯 Resumen

Este documento contiene plantillas HTML profesionales para todos los emails de DOCALINK.

## 📋 Índice de Plantillas

1. **Invitación a Médico** - Cuando una clínica invita a un médico
2. **Confirmación de Cita** - Cuando un paciente agenda una cita
3. **Recordatorio de Cita** - 24 horas antes de la cita
4. **Recuperación de Contraseña** - Cuando el usuario olvida su contraseña
5. **Bienvenida** - Cuando un usuario se registra
6. **Cancelación de Cita** - Cuando se cancela una cita

---

## 🎨 Colores Corporativos

- **Principal**: `#14b8a6` (Turquesa)
- **Hover**: `#0d9488` (Turquesa oscuro)
- **Texto**: `#1f2937` (Gris oscuro)
- **Texto secundario**: `#6b7280` (Gris)
- **Fondo**: `#f9fafb` (Gris claro)

---

## 📝 Instrucciones de Uso

### Para el Backend:

1. Copia el HTML de la plantilla que necesites
2. Reemplaza las variables `{{variable}}` con datos reales
3. Envía el email usando tu servicio (AWS SES, SendGrid, etc.)

### Variables Comunes:

- `{{clinicName}}` - Nombre de la clínica
- `{{doctorName}}` - Nombre del médico
- `{{patientName}}` - Nombre del paciente
- `{{invitationLink}}` - Link de invitación
- `{{appointmentDate}}` - Fecha de la cita
- `{{appointmentTime}}` - Hora de la cita
- `{{resetLink}}` - Link para restablecer contraseña

---

Ver archivos HTML individuales para cada plantilla:
- `PLANTILLA_1_INVITACION_MEDICO.html`
- `PLANTILLA_2_CONFIRMACION_CITA.html`
- `PLANTILLA_3_RECORDATORIO_CITA.html`
- `PLANTILLA_4_RECUPERACION_PASSWORD.html`
- `PLANTILLA_5_BIENVENIDA.html`
- `PLANTILLA_6_CANCELACION_CITA.html`
