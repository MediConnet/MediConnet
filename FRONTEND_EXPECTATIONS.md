# 📋 Especificación Completa: Lo que el Frontend Espera del Backend

Este documento detalla **TODO** lo que el frontend de MediConnect espera recibir del backend, incluyendo estructuras de datos, formatos de respuesta, endpoints, autenticación, y redirecciones.

---

## 🔐 1. FORMATO ESTÁNDAR DE RESPUESTAS DEL BACKEND

**TODAS** las respuestas del backend deben seguir este formato:

```typescript
{
  success: boolean;
  data: T; // Datos específicos del endpoint
  message?: string; // Mensaje opcional (para errores o confirmaciones)
}
```

### Ejemplo de Respuesta Exitosa:
```json
{
  "success": true,
  "data": {
    // ... datos específicos
  }
}
```

### Ejemplo de Respuesta de Error:
```json
{
  "success": false,
  "message": "Error descriptivo del problema"
}
```

---

## 🔑 2. AUTENTICACIÓN Y TOKENS

### 2.1. Estructura del Token JWT

El frontend espera recibir un **JWT (JSON Web Token)** que debe ser enviado en el header `Authorization` de todas las peticiones autenticadas:

```
Authorization: Bearer <token>
```

### 2.2. Almacenamiento del Token

El frontend guarda el token en `localStorage` bajo estas claves (en orden de prioridad):
1. `accessToken` (prioridad)
2. `auth-token`
3. `token`

### 2.3. Manejo de Errores de Autenticación

- **401 Unauthorized**: El frontend automáticamente:
  - Limpia todos los tokens de `localStorage`
  - Cierra la sesión del usuario
  - NO redirige automáticamente (cada componente maneja su propio logout)

- **403 Forbidden**: El frontend muestra un mensaje de "Acceso denegado"

---

## 🚪 3. LOGIN Y REDIRECCIÓN

### 3.1. Endpoint: `POST /api/auth/login`

**Request:**
```json
{
  "email": "doctor@medicones.com",
  "password": "password123"
}
```

**Response Esperada:**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "uuid-del-usuario",
      "email": "doctor@medicones.com",
      "name": "Dr. Juan Pérez",
      "role": "provider",  // ⚠️ IMPORTANTE: debe ser "provider", "admin", o "patient"
      "serviceType": "doctor"  // ⚠️ IMPORTANTE: solo si role es "provider"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",  // JWT Access Token
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",  // Opcional: si el backend usa este nombre
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."  // Opcional: para refresh
  }
}
```

### 3.2. Lógica de Redirección Después del Login

El frontend redirige según estos valores:

| `role` | `serviceType` | Ruta de Redirección |
|--------|---------------|---------------------|
| `"admin"` | - | `/admin/dashboard` |
| `"provider"` | `"doctor"` | `/doctors/dashboard` |
| `"provider"` | `"pharmacy"` | `/pharmacies/dashboard` |
| `"provider"` | `"laboratory"` o `"lab"` | `/laboratory/dashboard?tab=profile` |
| `"provider"` | `"ambulance"` | `/provider/ambulance/dashboard` |
| `"provider"` | `"supplies"` | `/supply/dashboard?tab=profile` |
| `"patient"` | - | `/patients/dashboard` |
| Cualquier otro | - | `/` (HOME) |

**⚠️ IMPORTANTE:**
- `role` debe estar en **minúsculas**: `"provider"`, `"admin"`, `"patient"`
- `serviceType` debe estar en **minúsculas**: `"doctor"`, `"pharmacy"`, `"laboratory"`, `"lab"`, `"ambulance"`, `"supplies"`
- Si `role` es `"provider"` pero `serviceType` no coincide con ninguno de los valores esperados, el usuario será redirigido a HOME

---

## 📡 4. ENDPOINTS DE AUTENTICACIÓN

### 4.1. Login
- **Endpoint**: `POST /api/auth/login`
- **Request**: `{ email: string, password: string }`
- **Response**: Ver sección 3.1

### 4.2. Registro
- **Endpoint**: `POST /api/auth/register`
- **Request**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nombre Completo",
  "role": "PROVIDER" | "ADMIN" | "PATIENT",
  "serviceType": "doctor" | "pharmacy" | "laboratory" | "ambulance" | "supplies"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "cognitoUserId": "cognito-uuid",
    "email": "user@example.com",
    "name": "Nombre Completo",
    "message": "Usuario registrado exitosamente"
  }
}
```

### 4.3. Obtener Usuario Actual
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Misma estructura que el login (ver 3.1)

### 4.4. Refrescar Token
- **Endpoint**: `POST /api/auth/refresh`
- **Request**: `{ refreshToken: string }`
- **Response**:
```json
{
  "success": true,
  "data": {
    "token": "nuevo-jwt-token",
    "refreshToken": "nuevo-refresh-token"
  }
}
```

### 4.5. Olvidé mi Contraseña
- **Endpoint**: `POST /api/auth/forgot-password`
- **Request**: `{ email: string }`
- **Response**:
```json
{
  "success": true,
  "data": {
    "message": "Se ha enviado un enlace de restablecimiento a tu correo"
  }
}
```

### 4.6. Resetear Contraseña
- **Endpoint**: `POST /api/auth/reset-password`
- **Request**: `{ token: string, newPassword: string }`
- **Response**:
```json
{
  "success": true,
  "data": {
    "message": "Contraseña restablecida exitosamente"
  }
}
```

---

## 👨‍⚕️ 5. ENDPOINTS DE DOCTORES

### 5.1. Obtener Dashboard del Doctor
- **Endpoint**: `GET /api/doctors/dashboard?userId={userId}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": {
    "visits": 150,
    "contacts": 89,
    "reviews": 45,
    "rating": 4.8,
    "doctor": {
      "name": "Dr. Juan Pérez",
      "specialty": "Cardiología",
      "email": "doctor@medicones.com",
      "whatsapp": "+51987654321",
      "address": "Av. Principal 123, Lima",
      "price": 150.00,
      "description": "Cardiólogo con 15 años de experiencia",
      "experience": 15,
      "workSchedule": [
        {
          "day": "monday",
          "enabled": true,
          "startTime": "09:00",
          "endTime": "18:00",
          "timeSlots": [
            { "startTime": "09:00", "endTime": "10:00", "available": true }
          ],
          "blockedHours": []
        }
      ],
      "isActive": true,
      "profileStatus": "published",
      "paymentMethods": "both",
      "consultationDuration": 30,
      "blockedDates": ["2024-12-25", "2025-01-01"],
      "bankAccount": {
        "bankName": "Banco de Crédito",
        "accountNumber": "1234567890",
        "accountType": "checking",
        "accountHolder": "Dr. Juan Pérez"
      }
    }
  }
}
```

### 5.2. Obtener Perfil del Doctor
- **Endpoint**: `GET /api/doctors/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Misma estructura que `doctor` en el dashboard (ver 5.1)

### 5.3. Actualizar Perfil del Doctor
- **Endpoint**: `PUT /api/doctors/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Request**:
```json
{
  "name": "Dr. Juan Pérez",
  "specialty": "Cardiología",
  "email": "doctor@medicones.com",
  "whatsapp": "+51987654321",
  "address": "Av. Principal 123",
  "price": 150.00,
  "description": "Descripción actualizada",
  "experience": 15,
  "workSchedule": [...],
  "profileStatus": "published",
  "paymentMethods": "both",
  "consultationDuration": 30,
  "blockedDates": ["2024-12-25"],
  "bankAccount": {
    "bankName": "Banco de Crédito",
    "accountNumber": "1234567890",
    "accountType": "checking",
    "accountHolder": "Dr. Juan Pérez"
  }
}
```
- **Response**: Misma estructura que el perfil completo

### 5.4. Obtener Citas del Doctor
- **Endpoint**: `GET /api/doctors/appointments`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "appointment-uuid",
      "patientName": "María González",
      "patientEmail": "maria@example.com",
      "patientPhone": "+51987654321",
      "date": "2024-12-20",
      "time": "10:00",
      "reason": "Consulta general",
      "notes": "Primera consulta",
      "status": "pending" | "paid" | "completed" | "cancelled" | "no-show",
      "paymentMethod": "card" | "cash",
      "price": 150.00
    }
  ]
}
```

**Estados de Cita:**
- `"pending"`: Cita programada, pendiente de pago/atención
- `"paid"`: Cita pagada, pendiente de atención
- `"completed"`: Cita atendida (el doctor puede crear diagnóstico)
- `"cancelled"`: Cita cancelada
- `"no-show"`: Paciente no se presentó

### 5.5. Actualizar Estado de Cita
- **Endpoint**: `PUT /api/doctors/appointments/{appointmentId}/status`
- **Headers**: `Authorization: Bearer <token>`
- **Request**:
```json
{
  "status": "completed"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "appointment-uuid",
    "status": "completed"
  }
}
```

### 5.6. Crear Diagnóstico
- **Endpoint**: `POST /api/doctors/appointments/{appointmentId}/diagnosis`
- **Headers**: `Authorization: Bearer <token>`
- **Request**:
```json
{
  "diagnosis": "Hipertensión arterial",
  "treatment": "Medicación y dieta",
  "indications": "Tomar medicamento cada 8 horas",
  "observations": "Seguimiento en 1 mes"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "diagnosis-uuid",
    "appointmentId": "appointment-uuid",
    "diagnosis": "Hipertensión arterial",
    "treatment": "Medicación y dieta",
    "indications": "Tomar medicamento cada 8 horas",
    "observations": "Seguimiento en 1 mes",
    "createdAt": "2024-12-20T10:30:00Z"
  }
}
```

### 5.7. Obtener Pagos del Doctor
- **Endpoint**: `GET /api/doctors/payments`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "payment-uuid",
      "appointmentId": "appointment-uuid",
      "patientName": "María González",
      "date": "2024-12-20",
      "amount": 150.00,
      "commission": 22.50,
      "netAmount": 127.50,
      "status": "pending" | "paid",
      "paymentMethod": "card" | "cash",
      "createdAt": "2024-12-20T10:00:00Z"
    }
  ]
}
```

**⚠️ IMPORTANTE:**
- El frontend filtra los pagos para mostrar solo los del doctor autenticado
- El campo `patientName` debe ser el nombre del paciente que atendió el doctor, NO el nombre del doctor

### 5.8. Obtener Horario del Doctor
- **Endpoint**: `GET /api/doctors/schedule`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "day": "monday",
      "enabled": true,
      "startTime": "09:00",
      "endTime": "18:00",
      "timeSlots": [
        { "startTime": "09:00", "endTime": "10:00", "available": true }
      ],
      "blockedHours": []
    }
  ]
}
```

### 5.9. Actualizar Horario del Doctor
- **Endpoint**: `PUT /api/doctors/schedule`
- **Headers**: `Authorization: Bearer <token>`
- **Request**:
```json
{
  "schedule": [
    {
      "day": "monday",
      "enabled": true,
      "startTime": "09:00",
      "endTime": "18:00",
      "timeSlots": [...],
      "blockedHours": []
    }
  ]
}
```
- **Response**: Misma estructura que GET

---

## 💊 6. ENDPOINTS DE FARMACIAS

### 6.1. Obtener Perfil de Farmacia
- **Endpoint**: `GET /api/pharmacies/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "pharmacy-uuid",
    "commercialName": "Farmacia Central",
    "logoUrl": "https://example.com/logo.png",
    "ruc": "20123456789",
    "description": "Farmacia con más de 20 años de experiencia",
    "websiteUrl": "https://farmaciacentral.com",
    "address": "Av. Principal 456, Lima",
    "status": "draft" | "published" | "suspended",
    "whatsapp": "+51987654321",
    "chainId": "chain-uuid",  // Opcional: si pertenece a una cadena
    "location": {
      "latitude": -12.0464,
      "longitude": -77.0428,
      "address": "Av. Principal 456, Lima"
    },
    "schedule": [
      {
        "day": "monday",
        "isOpen": true,
        "startTime": "08:00",
        "endTime": "22:00"
      }
    ],
    "stats": {
      "profileViews": 1250,
      "contactClicks": 89,
      "totalReviews": 45,
      "averageRating": 4.7
    },
    "isActive": true
  }
}
```

### 6.2. Actualizar Perfil de Farmacia
- **Endpoint**: `PUT /api/pharmacies/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Request**: Cualquier campo del perfil (parcial)
- **Response**: Perfil completo actualizado

### 6.3. Obtener Sucursales
- **Endpoint**: `GET /api/pharmacies/branches`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "branch-uuid",
      "name": "Sucursal Centro",
      "address": "Av. Principal 456",
      "openingHours": "Lun-Dom: 08:00 - 22:00",
      "phone": "+51987654321",
      "whatsapp": "+51987654321",
      "hasHomeDelivery": true,
      "isActive": true
    }
  ]
}
```

### 6.4. Crear Sucursal
- **Endpoint**: `POST /api/pharmacies/branches`
- **Headers**: `Authorization: Bearer <token>`
- **Request**: Todos los campos excepto `id`
- **Response**: Sucursal creada

### 6.5. Actualizar Sucursal
- **Endpoint**: `PUT /api/pharmacies/branches/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Request**: Campos a actualizar (parcial)
- **Response**: Sucursal actualizada

### 6.6. Eliminar Sucursal
- **Endpoint**: `DELETE /api/pharmacies/branches/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "message": "Sucursal eliminada exitosamente"
}
```

### 6.7. Obtener Reseñas de Farmacia
- **Endpoint**: `GET /api/pharmacies/reviews`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "review-uuid",
      "patientName": "María González",
      "rating": 5,
      "comment": "Excelente atención",
      "createdAt": "2024-12-20T10:00:00Z"
    }
  ]
}
```

---

## 🏠 7. ENDPOINTS DE HOME (PÁGINA PRINCIPAL)

### 7.1. Obtener Contenido Principal
- **Endpoint**: `GET /api/home/content`
- **Headers**: No requiere autenticación
- **Response**:
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "Tu Salud es Nuestra Prioridad",
      "subtitle": "Encuentra médicos, farmacias, laboratorios y servicios de salud cerca de ti",
      "ctaText": "Explora Nuestros Servicios",
      "ctaLink": "/services"
    },
    "features": {
      "title": "¿Por Qué Elegirnos?",
      "subtitle": "La mejor plataforma para conectar con servicios de salud"
    },
    "featuredServices": {
      "title": "Profesionales Premium",
      "subtitle": "Servicios verificados con la mejor calidad y atención",
      "rotationInterval": 5
    },
    "joinSection": {
      "title": "Únete a Medify",
      "subtitle": "La plataforma que conecta a pacientes y profesionales de la salud",
      "ctaText": "¡Regístrate ahora!",
      "ctaLink": "/register"
    },
    "footer": {
      "copyright": "Conectando salud y bienestar | Medify © 2025",
      "links": [
        { "label": "Política de privacidad", "url": "/privacy" },
        { "label": "Términos y condiciones", "url": "/terms" }
      ]
    }
  }
}
```

### 7.2. Obtener Características
- **Endpoint**: `GET /api/home/features`
- **Headers**: No requiere autenticación
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "feature-uuid",
      "icon": "LocationOn",
      "title": "Encuentra servicios cercanos",
      "description": "Localiza médicos, farmacias y laboratorios en tu zona",
      "order": 1
    }
  ]
}
```

### 7.3. Obtener Servicios Destacados
- **Endpoint**: `GET /api/home/featured-services`
- **Headers**: No requiere autenticación
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "service-uuid",
      "name": "Dr. Juan Pérez",
      "description": "Cardiólogo con 15 años de experiencia",
      "imageUrl": "https://example.com/image.jpg",
      "rating": 4.8,
      "totalReviews": 120,
      "category": "doctor",
      "location": {
        "address": "Av. Principal 123",
        "city": "Lima"
      },
      "isPremium": true,
      "order": 1
    }
  ]
}
```

---

## 👨‍💼 8. ENDPOINTS DE ADMINISTRACIÓN

### 8.1. Obtener Estadísticas del Dashboard
- **Endpoint**: `GET /api/admin/dashboard/stats`
- **Headers**: `Authorization: Bearer <token>` (solo admin)
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalServices": {
      "value": 150,
      "trend": "+12%"
    },
    "usersInApp": {
      "value": 5000,
      "trend": "+8%"
    },
    "monthlyContacts": 1250,
    "totalCities": 25,
    "requestStatus": {
      "pending": 15,
      "approved": 120,
      "rejected": 5
    },
    "servicesByType": {
      "doctors": 50,
      "pharmacies": 40,
      "laboratories": 30,
      "ambulances": 20,
      "supplies": 10
    },
    "recentActivity": [
      {
        "id": "activity-uuid",
        "type": "info" | "success" | "warning" | "error",
        "message": "Nuevo servicio registrado",
        "timestamp": "2024-12-20T10:00:00Z"
      }
    ]
  }
}
```

**⚠️ IMPORTANTE:**
- Todos los campos numéricos deben tener valores por defecto (0) si no hay datos
- `recentActivity` debe ser un array (puede estar vacío `[]`)
- Si algún campo está `undefined` o `null`, el frontend mostrará un error

### 8.2. Obtener Solicitudes de Proveedores
- **Endpoint**: `GET /api/admin/requests`
- **Headers**: `Authorization: Bearer <token>` (solo admin)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "request-uuid",
      "providerName": "Dr. Juan Pérez",
      "email": "doctor@medicones.com",
      "avatarUrl": "https://example.com/avatar.png",
      "serviceType": "doctor" | "pharmacy" | "laboratory" | "ambulance" | "supplies",
      "submissionDate": "2024-12-20T10:00:00Z",
      "documentsCount": 3,
      "status": "pending" | "approved" | "rejected",
      "rejectionReason": "Motivo de rechazo",  // Solo si status es "rejected"
      "phone": "+51987654321",
      "whatsapp": "+51987654321",
      "city": "Lima",
      "address": "Av. Principal 123",
      "description": "Descripción del servicio",
      "documents": [
        {
          "id": "doc-uuid",
          "name": "Cédula Profesional.pdf",
          "type": "pdf" | "image",
          "url": "https://example.com/document.pdf"
        }
      ]
    }
  ]
}
```

### 8.3. Aprobar Solicitud de Proveedor
- **Endpoint**: `PUT /api/admin/requests/{id}/approve`
- **Headers**: `Authorization: Bearer <token>` (solo admin)
- **Response**:
```json
{
  "success": true,
  "message": "Solicitud aprobada exitosamente"
}
```

### 8.4. Rechazar Solicitud de Proveedor
- **Endpoint**: `PUT /api/admin/requests/{id}/reject`
- **Headers**: `Authorization: Bearer <token>` (solo admin)
- **Request**:
```json
{
  "reason": "Documentación incompleta"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Solicitud rechazada exitosamente"
}
```

### 8.5. Obtener Solicitudes de Anuncios
- **Endpoint**: `GET /api/admin/ad-requests`
- **Headers**: `Authorization: Bearer <token>` (solo admin)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "ad-request-uuid",
      "providerId": "provider-uuid",
      "providerName": "Dr. Juan Pérez",
      "providerEmail": "doctor@medicones.com",
      "serviceType": "doctor" | "pharmacy" | "laboratory" | "ambulance" | "supplies",
      "submissionDate": "2024-12-20T10:00:00Z",
      "status": "pending" | "approved" | "rejected",
      "rejectionReason": "Motivo de rechazo",  // Solo si status es "rejected"
      "approvedAt": "2024-12-20T11:00:00Z",  // Solo si status es "approved"
      "rejectedAt": "2024-12-20T11:00:00Z",  // Solo si status es "rejected"
      "hasActiveAd": false,  // Si ya tiene un anuncio activo
      "adContent": {
        "label": "PRIMERA CITA",
        "discount": "20% OFF",
        "description": "En tu primera consulta general con profesionales verificados.",
        "buttonText": "Canjear Ahora",
        "imageUrl": "https://example.com/banner.jpg",
        "startDate": "2024-12-20T00:00:00Z",
        "endDate": "2025-01-20T23:59:59Z"
      }
    }
  ]
}
```

### 8.6. Aprobar Solicitud de Anuncio
- **Endpoint**: `PUT /api/admin/ad-requests/{id}/approve`
- **Headers**: `Authorization: Bearer <token>` (solo admin)
- **Response**:
```json
{
  "success": true,
  "message": "Anuncio aprobado exitosamente"
}
```

### 8.7. Rechazar Solicitud de Anuncio
- **Endpoint**: `PUT /api/admin/ad-requests/{id}/reject`
- **Headers**: `Authorization: Bearer <token>` (solo admin)
- **Request**:
```json
{
  "reason": "Contenido no apropiado"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Anuncio rechazado exitosamente"
}
```

### 8.8. Obtener Historial de Actividad
- **Endpoint**: `GET /api/admin/activity`
- **Headers**: `Authorization: Bearer <token>` (solo admin)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "activity-uuid",
      "title": "Nuevo servicio registrado",
      "actor": "Dr. Juan Pérez",
      "date": "2024-12-20T10:00:00Z",
      "type": "REGISTRATION" | "APPROVAL" | "REJECTION" | "ANNOUNCEMENT" | "UPDATE"
    }
  ]
}
```

---

## 📦 9. ENDPOINTS DE INSUMOS MÉDICOS

### 9.1. Obtener Lista de Tiendas
- **Endpoint**: `GET /api/supplies`
- **Headers**: No requiere autenticación
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "supply-uuid",
      "name": "Insumos Médicos Central",
      "description": "Equipos y suministros médicos",
      "imageUrl": "https://example.com/image.jpg",
      "rating": 4.5,
      "totalReviews": 30,
      "address": "Av. Principal 789",
      "phone": "+51987654321",
      "isActive": true
    }
  ]
}
```

### 9.2. Obtener Detalle de Tienda
- **Endpoint**: `GET /api/supplies/{id}`
- **Headers**: No requiere autenticación
- **Response**: Objeto completo de la tienda

### 9.3. Obtener Reseñas de Tienda
- **Endpoint**: `GET /api/supplies/{id}/reviews`
- **Headers**: No requiere autenticación
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "review-uuid",
      "supplyStoreId": "supply-uuid",
      "userId": "user-uuid",
      "userName": "María González",
      "rating": 5,
      "comment": "Excelente servicio",
      "createdAt": "2024-12-20T10:00:00Z"
    }
  ]
}
```

### 9.4. Crear Reseña
- **Endpoint**: `POST /api/supplies/{id}/reviews`
- **Headers**: `Authorization: Bearer <token>`
- **Request**:
```json
{
  "rating": 5,
  "comment": "Excelente servicio"
}
```
- **Response**: Reseña creada

---

## 🔬 10. ENDPOINTS DE LABORATORIOS

### 10.1. Obtener Perfil de Laboratorio
- **Endpoint**: `GET /api/laboratories/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Similar a farmacia (ver sección 6.1)

### 10.2. Actualizar Perfil de Laboratorio
- **Endpoint**: `PUT /api/laboratories/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Request**: Campos del perfil
- **Response**: Perfil actualizado

---

## 🚑 11. ENDPOINTS DE AMBULANCIAS

### 11.1. Obtener Perfil de Ambulancia
- **Endpoint**: `GET /api/ambulances/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Similar a farmacia (ver sección 6.1)

### 11.2. Actualizar Perfil de Ambulancia
- **Endpoint**: `PUT /api/ambulances/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Request**: Campos del perfil
- **Response**: Perfil actualizado

---

## 📝 12. ESTRUCTURAS DE DATOS DETALLADAS

### 12.1. WorkSchedule (Horario de Trabajo)
```typescript
interface WorkSchedule {
  day: string;  // "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
  enabled: boolean;
  startTime: string;  // Formato "HH:mm" (ej: "09:00")
  endTime: string;  // Formato "HH:mm" (ej: "18:00")
  timeSlots?: Array<{
    startTime: string;
    endTime: string;
    available: boolean;
  }>;
  blockedHours?: string[];  // Array de horas bloqueadas ["09:00", "10:00"]
}
```

### 12.2. PaymentMethod (Método de Pago)
```typescript
type PaymentMethod = "card" | "cash" | "both";
```

### 12.3. ProfileStatus (Estado del Perfil)
```typescript
type ProfileStatus = "draft" | "published" | "suspended";
```

### 12.4. AppointmentStatus (Estado de Cita)
```typescript
type AppointmentStatus = "pending" | "paid" | "completed" | "cancelled" | "no-show";
```

### 12.5. RequestStatus (Estado de Solicitud)
```typescript
type RequestStatus = "pending" | "approved" | "rejected";
```

### 12.6. ServiceType (Tipo de Servicio)
```typescript
type ServiceType = "doctor" | "pharmacy" | "laboratory" | "lab" | "ambulance" | "supplies";
```

### 12.7. Role (Rol de Usuario)
```typescript
type Role = "admin" | "provider" | "patient";
```

---

## ⚠️ 13. CONSIDERACIONES IMPORTANTES

### 13.1. Formato de Fechas
- **ISO 8601**: Todas las fechas deben estar en formato ISO 8601: `"2024-12-20T10:00:00Z"`
- **Fechas simples**: Para campos de fecha sin hora, usar formato: `"2024-12-20"`

### 13.2. Formato de Horas
- **24 horas**: Todas las horas deben estar en formato 24 horas: `"09:00"`, `"18:00"`

### 13.3. Valores por Defecto
- **Arrays vacíos**: Si no hay datos, retornar `[]` en lugar de `null` o `undefined`
- **Números**: Si no hay valor numérico, retornar `0` en lugar de `null` o `undefined`
- **Strings**: Si no hay texto, retornar `""` en lugar de `null` o `undefined`

### 13.4. Manejo de Errores
- **Códigos HTTP**:
  - `200`: Éxito
  - `201`: Creado exitosamente
  - `400`: Error de validación
  - `401`: No autorizado (token inválido o expirado)
  - `403`: Acceso denegado (sin permisos)
  - `404`: Recurso no encontrado
  - `500`: Error interno del servidor

### 13.5. Validación de Datos
- El frontend valida que `success` sea `true` antes de procesar `data`
- Si `success` es `false`, el frontend muestra el `message` como error

### 13.6. Paginación (Futuro)
- Si un endpoint retorna muchos resultados, considerar implementar paginación:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

---

## 🔍 14. ENDPOINTS ADICIONALES (Futuros)

Estos endpoints pueden no estar implementados aún, pero el frontend los esperará en el futuro:

- `GET /api/patients/dashboard` - Dashboard del paciente
- `GET /api/patients/appointments` - Citas del paciente
- `GET /api/patients/medical-history` - Historial médico del paciente
- `GET /api/search` - Búsqueda de servicios
- `GET /api/cities` - Lista de ciudades
- `GET /api/service-categories` - Categorías de servicios

---

## 📞 15. CONTACTO Y SOPORTE

Si el backend necesita aclaraciones sobre algún endpoint o estructura de datos, puede referirse a este documento o contactar al equipo de frontend.

**Última actualización**: Diciembre 2024
