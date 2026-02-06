# 📮 Requests de Insomnia - Agregar Médico a Clínica Central

## 🔐 Prerequisito: Autenticación

Primero debes iniciar sesión como la clínica para obtener el token:

### 1. Login como Clínica Central
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "clinica.central@example.com",
  "password": "clinic123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clinic-1",
      "email": "clinica.central@example.com",
      "role": "clinic"
    }
  }
}
```

**⚠️ IMPORTANTE:** Copia el `token` y agrégalo en el header `Authorization: Bearer {token}` en los siguientes requests.

---

## 👨‍⚕️ Opción 1: Invitar Médico por Email (Recomendado)

### 2. Invitar Médico por Email
```http
POST http://localhost:3000/api/clinics/doctors/invite
Content-Type: application/json
Authorization: Bearer {TU_TOKEN_AQUI}

{
  "email": "dr.nuevo.medico@gmail.com"
}
```

**Response Esperado:**
```json
{
  "success": true,
  "data": {
    "id": "inv-123",
    "clinicId": "clinic-1",
    "email": "dr.nuevo.medico@gmail.com",
    "invitationToken": "token-abc123xyz",
    "expiresAt": "2026-02-13T10:00:00Z",
    "status": "pending",
    "createdAt": "2026-02-06T10:00:00Z"
  }
}
```

**¿Qué pasa después?**
- El médico recibe un email con un link de invitación
- El médico hace clic en el link y completa su registro
- El médico queda asociado automáticamente a la Clínica Central

---

## 🔗 Opción 2: Generar Link de Invitación

### 3. Generar Link de Invitación
```http
POST http://localhost:3000/api/clinics/doctors/invite/link
Content-Type: application/json
Authorization: Bearer {TU_TOKEN_AQUI}

{
  "email": "dr.otro.medico@gmail.com"
}
```

**Response Esperado:**
```json
{
  "success": true,
  "data": {
    "invitationLink": "http://localhost:5173/clinic/invite/token-abc123xyz",
    "expiresAt": "2026-02-13T10:00:00Z"
  }
}
```

**¿Qué hacer con el link?**
- Copiar el link y enviarlo manualmente al médico (WhatsApp, SMS, etc.)
- El médico abre el link y completa su registro
- El médico queda asociado a la Clínica Central

---

## ✅ Opción 3: Aceptar Invitación (Lado del Médico)

### 4. Validar Token de Invitación (Público - No requiere auth)
```http
GET http://localhost:5173/api/clinics/invite/token-abc123xyz
```

**Response Esperado:**
```json
{
  "success": true,
  "data": {
    "clinic": {
      "id": "clinic-1",
      "name": "Clínica Central"
    },
    "email": "dr.nuevo.medico@gmail.com",
    "expiresAt": "2026-02-13T10:00:00Z",
    "isValid": true
  }
}
```

### 5. Aceptar Invitación y Completar Registro (Público - No requiere auth)
```http
POST http://localhost:3000/api/clinics/invite/token-abc123xyz/accept
Content-Type: application/json

{
  "name": "Dr. Pedro Sánchez",
  "specialty": "Traumatología",
  "password": "doctor123",
  "phone": "0993456789",
  "whatsapp": "0993456789"
}
```

**Response Esperado:**
```json
{
  "success": true,
  "data": {
    "userId": "user-doctor-new-1",
    "email": "dr.nuevo.medico@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "doctor": {
      "id": "doctor-clinic-central-new-1",
      "clinicId": "clinic-1",
      "userId": "user-doctor-new-1",
      "email": "dr.nuevo.medico@gmail.com",
      "name": "Dr. Pedro Sánchez",
      "specialty": "Traumatología",
      "isActive": true,
      "isInvited": false,
      "phone": "0993456789",
      "whatsapp": "0993456789"
    }
  }
}
```

---

## 🔧 Gestión de Médicos (Después de Agregar)

### 6. Ver Lista de Médicos de la Clínica
```http
GET http://localhost:3000/api/clinics/doctors
Authorization: Bearer {TU_TOKEN_AQUI}
```

**Con filtro:**
```http
GET http://localhost:3000/api/clinics/doctors?status=active
Authorization: Bearer {TU_TOKEN_AQUI}
```

### 7. Asignar Consultorio
```http
PATCH http://localhost:3000/api/clinics/doctors/doctor-clinic-central-new-1/office
Content-Type: application/json
Authorization: Bearer {TU_TOKEN_AQUI}

{
  "officeNumber": "103"
}
```

### 8. Activar/Desactivar Médico
```http
PATCH http://localhost:3000/api/clinics/doctors/doctor-clinic-central-new-1/status
Content-Type: application/json
Authorization: Bearer {TU_TOKEN_AQUI}

{
  "isActive": false
}
```

### 9. Eliminar Médico de la Clínica
```http
DELETE http://localhost:3000/api/clinics/doctors/doctor-clinic-central-new-1
Authorization: Bearer {TU_TOKEN_AQUI}
```

---

## 📋 Colección Completa para Insomnia

Copia y pega esto en Insomnia (Import > From Clipboard):

```json
{
  "name": "Clínica Central - Gestión de Médicos",
  "requests": [
    {
      "name": "1. Login Clínica Central",
      "method": "POST",
      "url": "http://localhost:3000/api/auth/login",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"email\": \"clinica.central@example.com\",\n  \"password\": \"clinic123\"\n}"
      }
    },
    {
      "name": "2. Invitar Médico por Email",
      "method": "POST",
      "url": "http://localhost:3000/api/clinics/doctors/invite",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        },
        {
          "name": "Authorization",
          "value": "Bearer {{token}}"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"email\": \"dr.nuevo.medico@gmail.com\"\n}"
      }
    },
    {
      "name": "3. Generar Link de Invitación",
      "method": "POST",
      "url": "http://localhost:3000/api/clinics/doctors/invite/link",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        },
        {
          "name": "Authorization",
          "value": "Bearer {{token}}"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"email\": \"dr.otro.medico@gmail.com\"\n}"
      }
    },
    {
      "name": "4. Validar Token de Invitación",
      "method": "GET",
      "url": "http://localhost:3000/api/clinics/invite/{{invitationToken}}"
    },
    {
      "name": "5. Aceptar Invitación",
      "method": "POST",
      "url": "http://localhost:3000/api/clinics/invite/{{invitationToken}}/accept",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"name\": \"Dr. Pedro Sánchez\",\n  \"specialty\": \"Traumatología\",\n  \"password\": \"doctor123\",\n  \"phone\": \"0993456789\",\n  \"whatsapp\": \"0993456789\"\n}"
      }
    },
    {
      "name": "6. Listar Médicos",
      "method": "GET",
      "url": "http://localhost:3000/api/clinics/doctors",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{token}}"
        }
      ]
    },
    {
      "name": "7. Asignar Consultorio",
      "method": "PATCH",
      "url": "http://localhost:3000/api/clinics/doctors/{{doctorId}}/office",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        },
        {
          "name": "Authorization",
          "value": "Bearer {{token}}"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"officeNumber\": \"103\"\n}"
      }
    },
    {
      "name": "8. Cambiar Estado Médico",
      "method": "PATCH",
      "url": "http://localhost:3000/api/clinics/doctors/{{doctorId}}/status",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        },
        {
          "name": "Authorization",
          "value": "Bearer {{token}}"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"isActive\": false\n}"
      }
    },
    {
      "name": "9. Eliminar Médico",
      "method": "DELETE",
      "url": "http://localhost:3000/api/clinics/doctors/{{doctorId}}",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{token}}"
        }
      ]
    }
  ]
}
```

---

## 🎯 Flujo Completo Recomendado

1. **Login como Clínica** → Obtener token
2. **Invitar Médico** → Enviar email con invitación
3. **Médico Acepta** → Completa su registro
4. **Asignar Consultorio** → Darle un consultorio
5. **Listo!** → El médico puede iniciar sesión y ver sus citas

---

## 📝 Notas

- Todos los endpoints requieren autenticación excepto los de invitación pública (validar y aceptar)
- Los tokens de invitación expiran en 7 días
- El email del médico debe ser único en el sistema
- La contraseña debe tener mínimo 6 caracteres

---

**Fecha:** 2026-02-06  
**Base URL:** http://localhost:3000/api
