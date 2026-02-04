# 📧 Mensaje para el Equipo Frontend - Sistema de Emails con Mailjet

## ✅ Sistema de Emails Implementado

Hola equipo frontend,

El sistema de envío de emails está **completamente implementado y funcionando** con Mailjet. Los correos se envían automáticamente cuando llaman a los endpoints del backend.

---

## 🎯 Lo Más Importante

### ✅ El backend YA envía emails automáticamente

Cuando el frontend llama a ciertos endpoints, **el backend envía emails automáticamente** sin que ustedes tengan que hacer nada especial.

### ✅ No necesitan configurar nada

- ❌ No necesitan configurar Mailjet en el frontend
- ❌ No necesitan manejar el envío de emails
- ❌ No necesitan preocuparse por tokens o autenticación de email
- ✅ Solo llamen al endpoint y el backend se encarga de todo

---

## 📡 Endpoint Principal: Invitar Médico por Email

### POST /api/clinics/doctors/invite

**Cuando usar**: Cuando el usuario de la clínica hace clic en "INVITAR POR EMAIL" y envía el formulario.

**Headers:**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + clinicToken
}
```

**Body:**
```javascript
{
  "email": "doctor@example.com",  // Email del médico a invitar
  "clinicId": "uuid-de-la-clinica" // ID de la clínica actual
}
```

**Ejemplo de código:**
```javascript
const inviteDoctor = async (doctorEmail) => {
  try {
    const response = await fetch('http://localhost:3000/api/clinics/doctors/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${clinicToken}`,
      },
      body: JSON.stringify({
        email: doctorEmail,
        clinicId: currentClinicId,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      // ✅ Email enviado exitosamente
      alert('Invitación enviada exitosamente');
      console.log('Email enviado a:', data.data.email);
      console.log('Link de invitación:', data.data.invitationUrl);
    } else {
      // ❌ Error
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al enviar invitación');
  }
};
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "message": "Invitación enviada exitosamente",
    "email": "doctor@example.com",
    "expiresAt": "2026-02-11T10:30:00.000Z",
    "invitationUrl": "http://localhost:5173/invite/abc123...",
    "emailSent": true
  }
}
```

**Errores Posibles:**
```json
// 400 - Email inválido
{
  "success": false,
  "message": "Formato de email inválido"
}

// 400 - Ya existe invitación pendiente
{
  "success": false,
  "message": "Ya existe una invitación pendiente para este email"
}

// 400 - Médico ya registrado
{
  "success": false,
  "message": "Este médico ya está registrado en la clínica"
}

// 404 - Clínica no encontrada
{
  "success": false,
  "message": "Clínica no encontrada"
}
```

---

## 📧 ¿Qué Pasa Después?

### 1. Backend envía el email automáticamente

El backend usa Mailjet para enviar un correo al email del médico con:
- Nombre de la clínica
- Dirección de la clínica
- Botón "Aceptar Invitación"
- Link de invitación único
- Fecha de expiración (7 días)

### 2. Médico recibe el email

El médico recibe un correo profesional en su bandeja de entrada.

### 3. Médico hace clic en el link

El link redirige a: `http://localhost:5173/invite/{token}`

### 4. Frontend muestra formulario de registro

Ustedes deben tener una página en `/invite/:token` que:
1. Valida el token llamando a: `GET /api/clinics/invite/{token}`
2. Muestra formulario para completar registro (nombre, especialidad, contraseña)
3. Envía el registro a: `POST /api/clinics/invite/{token}/accept`

---

## 🔄 Flujo Completo Visual

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND                                                    │
│  Usuario ingresa email: doctor@example.com                  │
│  Hace clic en "ENVIAR INVITACIÓN"                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ POST /api/clinics/doctors/invite
                   │ { email, clinicId }
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND                                                     │
│  ✅ Valida datos                                             │
│  ✅ Crea invitación en BD                                    │
│  ✅ Envía email con Mailjet 📧                               │
│  ✅ Retorna respuesta                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Response: { success: true, ... }
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND                                                    │
│  Muestra mensaje: "Invitación enviada exitosamente"        │
└─────────────────────────────────────────────────────────────┘

                   📧 Email enviado automáticamente

┌─────────────────────────────────────────────────────────────┐
│  EMAIL DEL MÉDICO                                           │
│  Recibe correo con link de invitación                       │
│  Hace clic en "Aceptar Invitación"                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Redirige a: /invite/{token}
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND                                                    │
│  Página /invite/:token                                       │
│  1. Valida token: GET /api/clinics/invite/{token}          │
│  2. Muestra formulario de registro                          │
│  3. Envía registro: POST /api/clinics/invite/{token}/accept│
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Ejemplo de Componente React

```jsx
import React, { useState } from 'react';

const InviteDoctorModal = ({ clinicId, clinicToken, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/api/clinics/doctors/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clinicToken}`,
        },
        body: JSON.stringify({
          email: email,
          clinicId: clinicId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setEmail('');
        // Opcional: cerrar modal después de 2 segundos
        setTimeout(() => onClose(), 2000);
      } else {
        setError(data.message || 'Error al enviar invitación');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h2>Invitar Médico por Email</h2>
      
      {success && (
        <div className="alert alert-success">
          ✅ Invitación enviada exitosamente
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email del médico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        
        <div className="buttons">
          <button type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Invitación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InviteDoctorModal;
```

---

## 📝 Otros Endpoints que Envían Emails (Futuros)

El backend está preparado para enviar emails automáticamente en estos casos:

### 1. Confirmación de Cita (Paciente)
```
POST /api/appointments
→ Envía email al paciente confirmando la cita
```

### 2. Notificación de Cita (Doctor)
```
POST /api/appointments
→ Envía email al doctor notificando nueva cita
```

### 3. Recordatorio de Cita (24h antes)
```
Job automático (cron)
→ Envía email al paciente recordando la cita
```

### 4. Cancelación de Cita
```
PUT /api/appointments/:id/cancel
→ Envía email al paciente y doctor notificando cancelación
```

### 5. Registro de Usuario
```
POST /api/auth/register
→ Envía email de verificación (cuando se implemente)
```

### 6. Recuperación de Contraseña
```
POST /api/auth/forgot-password
→ Envía email con link de reset (cuando se implemente)
```

---

## ⚙️ Configuración del Backend

**No necesitan hacer nada**, pero para su información:

```env
# Mailjet (ya configurado en el backend)
MAILJET_API_KEY=52310994faddce84d73669abd3935985
MAILJET_API_SECRET=6347b69ec2d17372d2eb8c62c7c1b3e0
MAILJET_FROM_EMAIL=noreply@mediconnect.com
MAILJET_FROM_NAME=MediConnect

# URL del frontend (para generar links)
FRONTEND_URL=http://localhost:5173
```

---

## 🧪 Cómo Probar

### 1. Desde el frontend

Simplemente usen el formulario de invitación que ya tienen implementado.

### 2. Desde Postman

```
POST http://localhost:3000/api/clinics/doctors/invite
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_CLINIC_TOKEN
Body:
  {
    "email": "tu-email@example.com",
    "clinicId": "clinic-id"
  }
```

### 3. Verificar que llegó el email

Revisen la bandeja de entrada del email que usaron en la prueba.

---

## ❓ Preguntas Frecuentes

### ¿Necesitamos configurar algo en el frontend?
**No.** El backend se encarga de todo el envío de emails.

### ¿Qué pasa si el email falla?
El backend registra el error pero no falla la operación. La invitación se crea en la BD y pueden reenviarla manualmente si es necesario.

### ¿Podemos personalizar el contenido del email?
Sí, pero eso se hace en el backend. Si necesitan cambios en el template del email, avísennos.

### ¿Cuántos emails se pueden enviar?
Mailjet permite 200 correos/día en el plan gratuito. Si necesitan más, hay que actualizar el plan.

### ¿El email se envía en tiempo real?
Sí, el email se envía inmediatamente cuando llaman al endpoint. Tarda 1-2 segundos.

---

## 📞 Soporte

Si tienen problemas:
1. Verifiquen que el servidor del backend esté corriendo
2. Verifiquen que el token de autorización sea válido
3. Revisen la consola del navegador para ver errores
4. Revisen los logs del backend

---

## ✅ Resumen para el Frontend

1. **Llamen al endpoint** `POST /api/clinics/doctors/invite` con el email del médico
2. **El backend envía el email automáticamente** usando Mailjet
3. **Muestren un mensaje de éxito** al usuario
4. **Eso es todo** - No necesitan hacer nada más

El sistema está listo y funcionando. ¡Pueden empezar a usarlo! 🚀

---

**Fecha**: 4 de febrero de 2026  
**Estado**: ✅ Funcionando perfectamente  
**Contacto**: Backend Team
