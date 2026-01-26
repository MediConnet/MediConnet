# 🚀 Endpoints del Backend - MediConnet

Documentación completa de todos los endpoints del backend basado en el schema de Prisma.

## 📋 Índice

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Pacientes](#pacientes)
4. [Proveedores](#proveedores)
5. [Sucursales](#sucursales)
6. [Citas](#citas)
7. [Pagos y Payouts](#pagos-y-payouts)
8. [Reseñas](#reseñas)
9. [Historial Médico](#historial-médico)
10. [Anuncios](#anuncios)
11. [Catálogo](#catálogo)
12. [Horarios](#horarios)
13. [Notificaciones](#notificaciones)
14. [Favoritos](#favoritos)
15. [Ciudades](#ciudades)
16. [Categorías de Servicio](#categorías-de-servicio)
17. [Administración](#administración)

---

## 🔐 Autenticación

### POST `/api/auth/register`
Registrar nuevo usuario

**Request:**
```json
{
  "email": "doctor@example.com",
  "password": "SecurePass123!",
  "role": "provider",
  "profileData": {
    "fullName": "Dr. Juan Pérez",
    "phone": "+593 99 123 4567"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "doctor@example.com",
    "role": "provider",
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### POST `/api/auth/login`
Iniciar sesión

**Request:**
```json
{
  "email": "doctor@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "doctor@example.com",
    "role": "provider",
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### POST `/api/auth/refresh`
Refrescar token

**Request:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token",
    "refreshToken": "new-refresh-token"
  }
}
```

### POST `/api/auth/logout`
Cerrar sesión

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

### GET `/api/auth/me`
Obtener usuario actual

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
    "email": "doctor@example.com",
    "role": "provider",
    "profile": { ... }
  }
}
```

---

## 👤 Usuarios

### GET `/api/users/:id`
Obtener usuario por ID

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
    "email": "user@example.com",
    "role": "provider",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### PUT `/api/users/:id`
Actualizar usuario

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "profilePictureUrl": "https://example.com/avatar.jpg",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "profilePictureUrl": "https://example.com/avatar.jpg",
    "isActive": true
  }
}
```

---

## 🏥 Pacientes

### GET `/api/patients/me`
Obtener perfil del paciente actual

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
    "userId": "uuid",
    "fullName": "Juan Pérez",
    "identification": "1234567890",
    "phone": "+593 99 123 4567",
    "birthDate": "1990-01-01",
    "addressText": "Av. Principal 123"
  }
}
```

### POST `/api/patients`
Crear perfil de paciente

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "fullName": "Juan Pérez",
  "identification": "1234567890",
  "phone": "+593 99 123 4567",
  "birthDate": "1990-01-01",
  "addressText": "Av. Principal 123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Juan Pérez",
    ...
  }
}
```

### PUT `/api/patients/me`
Actualizar perfil de paciente

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "fullName": "Juan Pérez Actualizado",
  "phone": "+593 99 999 9999",
  "addressText": "Nueva dirección 456"
}
```

### GET `/api/patients/:id/appointments`
Obtener citas del paciente

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
      "scheduledFor": "2024-01-15T10:00:00Z",
      "status": "CONFIRMED",
      "reason": "Consulta general",
      "branch": {
        "name": "Clínica Central",
        "provider": {
          "commercialName": "Dr. Juan Pérez"
        }
      }
    }
  ]
}
```

### GET `/api/patients/:id/medical-history`
Obtener historial médico del paciente

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
      "diagnosis": "Hipertensión arterial",
      "date": "2024-01-10T00:00:00Z",
      "treatment": "Medicación antihipertensiva",
      "doctorNameSnapshot": "Dr. Juan Pérez",
      "specialtySnapshot": "Cardiología"
    }
  ]
}
```

### GET `/api/patients/:id/favorites`
Obtener favoritos del paciente

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
      "branch": {
        "id": "uuid",
        "name": "Clínica Central",
        "provider": {
          "commercialName": "Dr. Juan Pérez"
        }
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 🏢 Proveedores

### GET `/api/providers/me`
Obtener perfil del proveedor actual

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
    "userId": "uuid",
    "categoryId": 1,
    "commercialName": "Dr. Juan Pérez",
    "logoUrl": "https://example.com/logo.jpg",
    "description": "Especialista en cardiología",
    "verificationStatus": "APPROVED",
    "commissionPercentage": 15.0,
    "category": {
      "name": "Doctor",
      "slug": "doctor"
    }
  }
}
```

### POST `/api/providers`
Crear perfil de proveedor

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "categoryId": 1,
  "commercialName": "Dr. Juan Pérez",
  "logoUrl": "https://example.com/logo.jpg",
  "description": "Especialista en cardiología"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "commercialName": "Dr. Juan Pérez",
    "verificationStatus": "PENDING",
    ...
  }
}
```

### PUT `/api/providers/me`
Actualizar perfil de proveedor

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "commercialName": "Dr. Juan Pérez Actualizado",
  "description": "Nueva descripción",
  "logoUrl": "https://example.com/new-logo.jpg"
}
```

### GET `/api/providers/:id`
Obtener proveedor por ID (público)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "commercialName": "Dr. Juan Pérez",
    "logoUrl": "https://example.com/logo.jpg",
    "description": "Especialista en cardiología",
    "verificationStatus": "APPROVED",
    "branches": [ ... ],
    "ratingCache": 4.8
  }
}
```

### GET `/api/providers`
Listar proveedores (público)

**Query Parameters:**
- `categoryId` (opcional): Filtrar por categoría
- `cityId` (opcional): Filtrar por ciudad
- `search` (opcional): Búsqueda por nombre
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response:**
```json
{
  "success": true,
  "data": {
    "providers": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### GET `/api/providers/me/dashboard`
Obtener dashboard del proveedor

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAppointments": 150,
    "pendingAppointments": 5,
    "totalRevenue": 7500.00,
    "averageRating": 4.8,
    "totalReviews": 45,
    "upcomingAppointments": [ ... ]
  }
}
```

### GET `/api/providers/me/bank-details`
Obtener detalles bancarios del proveedor

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
    "bankName": "Banco del Pichincha",
    "accountNumber": "1234567890",
    "accountType": "checking",
    "accountHolderName": "Dr. Juan Pérez",
    "holderIdentification": "1234567890",
    "isVerified": true
  }
}
```

### PUT `/api/providers/me/bank-details`
Actualizar detalles bancarios

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "bankName": "Banco del Pichincha",
  "accountNumber": "1234567890",
  "accountType": "checking",
  "accountHolderName": "Dr. Juan Pérez",
  "holderIdentification": "1234567890"
}
```

---

## 🏪 Sucursales

### GET `/api/providers/me/branches`
Obtener sucursales del proveedor

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
      "name": "Clínica Central",
      "description": "Sucursal principal",
      "addressText": "Av. Principal 123",
      "latitude": -0.1807,
      "longitude": -78.4678,
      "phoneContact": "+593 99 123 4567",
      "emailContact": "central@example.com",
      "imageUrl": "https://example.com/branch.jpg",
      "openingHoursText": "Lun-Vie: 9:00-18:00",
      "is24h": false,
      "hasDelivery": true,
      "ratingCache": 4.8,
      "isMain": true,
      "isActive": true,
      "city": {
        "name": "Quito",
        "state": "Pichincha"
      }
    }
  ]
}
```

### POST `/api/providers/me/branches`
Crear sucursal

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "cityId": "uuid",
  "name": "Clínica Norte",
  "description": "Nueva sucursal",
  "addressText": "Av. Norte 456",
  "latitude": -0.1807,
  "longitude": -78.4678,
  "phoneContact": "+593 99 999 9999",
  "emailContact": "norte@example.com",
  "openingHoursText": "Lun-Vie: 9:00-18:00",
  "is24h": false,
  "hasDelivery": true,
  "isMain": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Clínica Norte",
    ...
  }
}
```

### GET `/api/branches/:id`
Obtener sucursal por ID (público)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Clínica Central",
    "provider": {
      "commercialName": "Dr. Juan Pérez",
      "logoUrl": "https://example.com/logo.jpg"
    },
    "addressText": "Av. Principal 123",
    "ratingCache": 4.8,
    "schedules": [ ... ],
    "catalog": [ ... ]
  }
}
```

### PUT `/api/branches/:id`
Actualizar sucursal

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "Clínica Central Actualizada",
  "description": "Nueva descripción",
  "openingHoursText": "Lun-Vie: 8:00-20:00"
}
```

### DELETE `/api/branches/:id`
Eliminar sucursal

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Sucursal eliminada exitosamente"
}
```

### GET `/api/branches`
Listar sucursales (público)

**Query Parameters:**
- `providerId` (opcional): Filtrar por proveedor
- `cityId` (opcional): Filtrar por ciudad
- `categoryId` (opcional): Filtrar por categoría
- `search` (opcional): Búsqueda
- `latitude` (opcional): Latitud para búsqueda por proximidad
- `longitude` (opcional): Longitud para búsqueda por proximidad
- `radius` (opcional): Radio en km (default: 10)
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response:**
```json
{
  "success": true,
  "data": {
    "branches": [ ... ],
    "pagination": { ... }
  }
}
```

---

## 📅 Citas

### GET `/api/appointments`
Obtener citas (filtrado según rol)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (opcional): Filtrar por estado (CONFIRMED, CANCELLED, COMPLETED)
- `branchId` (opcional): Filtrar por sucursal
- `patientId` (opcional): Filtrar por paciente (solo providers)
- `providerId` (opcional): Filtrar por proveedor (solo patients)
- `startDate` (opcional): Fecha inicio (ISO 8601)
- `endDate` (opcional): Fecha fin (ISO 8601)
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response (Provider):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "scheduledFor": "2024-01-15T10:00:00Z",
      "status": "CONFIRMED",
      "reason": "Consulta general",
      "isPaid": false,
      "patient": {
        "id": "uuid",
        "fullName": "María García",
        "phone": "+593 99 123 4567"
      },
      "branch": {
        "id": "uuid",
        "name": "Clínica Central"
      }
    }
  ]
}
```

**Response (Patient):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "scheduledFor": "2024-01-15T10:00:00Z",
      "status": "CONFIRMED",
      "reason": "Consulta general",
      "isPaid": false,
      "branch": {
        "id": "uuid",
        "name": "Clínica Central",
        "provider": {
          "commercialName": "Dr. Juan Pérez",
          "logoUrl": "https://example.com/logo.jpg"
        }
      }
    }
  ]
}
```

### POST `/api/appointments`
Crear cita

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "branchId": "uuid",
  "scheduledFor": "2024-01-15T10:00:00Z",
  "reason": "Consulta general"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "scheduledFor": "2024-01-15T10:00:00Z",
    "status": "CONFIRMED",
    "reason": "Consulta general",
    "isPaid": false
  }
}
```

### GET `/api/appointments/:id`
Obtener cita por ID

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
    "scheduledFor": "2024-01-15T10:00:00Z",
    "status": "CONFIRMED",
    "reason": "Consulta general",
    "isPaid": false,
    "patient": { ... },
    "branch": { ... },
    "provider": { ... },
    "payment": { ... }
  }
}
```

### PUT `/api/appointments/:id`
Actualizar cita

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "scheduledFor": "2024-01-16T10:00:00Z",
  "status": "CONFIRMED",
  "reason": "Consulta actualizada"
}
```

### PUT `/api/appointments/:id/status`
Actualizar estado de cita

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "COMPLETED"
}
```

### DELETE `/api/appointments/:id`
Cancelar cita

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cita cancelada exitosamente"
}
```

---

## 💳 Pagos y Payouts

### GET `/api/payments`
Obtener pagos

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `appointmentId` (opcional): Filtrar por cita
- `status` (opcional): Filtrar por estado
- `startDate` (opcional): Fecha inicio
- `endDate` (opcional): Fecha fin
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response (Provider):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "appointmentId": "uuid",
      "amountTotal": 50.00,
      "platformFee": 7.50,
      "providerAmount": 42.50,
      "status": "completed",
      "createdAt": "2024-01-15T10:00:00Z",
      "appointment": {
        "scheduledFor": "2024-01-15T10:00:00Z",
        "patient": {
          "fullName": "María García"
        }
      }
    }
  ]
}
```

### POST `/api/payments`
Crear pago

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "appointmentId": "uuid",
  "stripePaymentIntentId": "pi_xxxxx",
  "amountTotal": 50.00,
  "platformFee": 7.50,
  "providerAmount": 42.50,
  "status": "pending"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "appointmentId": "uuid",
    "amountTotal": 50.00,
    "status": "pending"
  }
}
```

### PUT `/api/payments/:id/status`
Actualizar estado de pago

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "completed"
}
```

### GET `/api/providers/me/payouts`
Obtener payouts del proveedor

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (opcional): Filtrar por estado
- `startDate` (opcional): Fecha inicio
- `endDate` (opcional): Fecha fin
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "totalAmount": 4250.00,
      "currency": "USD",
      "status": "pending",
      "referenceNumber": "PAY-2024-001",
      "periodStart": "2024-01-01T00:00:00Z",
      "periodEnd": "2024-01-31T23:59:59Z",
      "createdAt": "2024-02-01T00:00:00Z",
      "payments": [ ... ]
    }
  ]
}
```

### POST `/api/providers/me/payouts/request`
Solicitar payout

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "periodStart": "2024-01-01T00:00:00Z",
  "periodEnd": "2024-01-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "totalAmount": 4250.00,
    "status": "pending",
    "referenceNumber": "PAY-2024-001"
  }
}
```

---

## ⭐ Reseñas

### GET `/api/reviews`
Obtener reseñas

**Query Parameters:**
- `branchId` (opcional): Filtrar por sucursal
- `providerId` (opcional): Filtrar por proveedor
- `patientId` (opcional): Filtrar por paciente
- `appointmentId` (opcional): Filtrar por cita
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Excelente atención",
      "createdAt": "2024-01-15T10:00:00Z",
      "patient": {
        "fullName": "María García"
      },
      "branch": {
        "name": "Clínica Central",
        "provider": {
          "commercialName": "Dr. Juan Pérez"
        }
      }
    }
  ]
}
```

### POST `/api/reviews`
Crear reseña

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "appointmentId": "uuid",
  "branchId": "uuid",
  "rating": 5,
  "comment": "Excelente atención"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Excelente atención",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### PUT `/api/reviews/:id`
Actualizar reseña

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "rating": 4,
  "comment": "Muy buena atención"
}
```

### DELETE `/api/reviews/:id`
Eliminar reseña

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Reseña eliminada exitosamente"
}
```

---

## 📋 Historial Médico

### GET `/api/medical-history`
Obtener historial médico

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `patientId` (opcional): Filtrar por paciente
- `providerId` (opcional): Filtrar por proveedor
- `startDate` (opcional): Fecha inicio
- `endDate` (opcional): Fecha fin
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "diagnosis": "Hipertensión arterial",
      "date": "2024-01-10T00:00:00Z",
      "treatment": "Medicación antihipertensiva",
      "indications": "Tomar medicamento cada 12 horas",
      "observations": "Paciente responde bien al tratamiento",
      "doctorNameSnapshot": "Dr. Juan Pérez",
      "specialtySnapshot": "Cardiología",
      "provider": {
        "commercialName": "Dr. Juan Pérez"
      }
    }
  ]
}
```

### POST `/api/medical-history`
Crear entrada de historial médico

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "patientId": "uuid",
  "diagnosis": "Hipertensión arterial",
  "date": "2024-01-10T00:00:00Z",
  "treatment": "Medicación antihipertensiva",
  "indications": "Tomar medicamento cada 12 horas",
  "observations": "Paciente responde bien al tratamiento"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "diagnosis": "Hipertensión arterial",
    "date": "2024-01-10T00:00:00Z",
    ...
  }
}
```

### PUT `/api/medical-history/:id`
Actualizar entrada de historial médico

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "diagnosis": "Hipertensión arterial controlada",
  "treatment": "Continuar con medicación actual"
}
```

### DELETE `/api/medical-history/:id`
Eliminar entrada de historial médico

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Entrada eliminada exitosamente"
}
```

---

## 📢 Anuncios

### GET `/api/providers/me/ads`
Obtener anuncios del proveedor

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `isActive` (opcional): Filtrar por estado activo
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "badgeText": "PRIMERA CITA",
      "title": "20% OFF",
      "subtitle": "En tu primera consulta general",
      "imageUrl": "https://example.com/ad.jpg",
      "actionText": "Canjear Ahora",
      "bgColorHex": "#3b82f6",
      "accentColorHex": "#1e40af",
      "targetScreen": "booking",
      "targetId": "uuid",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z",
      "isActive": true,
      "priorityOrder": 1
    }
  ]
}
```

### POST `/api/providers/me/ads`
Crear anuncio

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "badgeText": "PRIMERA CITA",
  "title": "20% OFF",
  "subtitle": "En tu primera consulta general",
  "imageUrl": "https://example.com/ad.jpg",
  "actionText": "Canjear Ahora",
  "bgColorHex": "#3b82f6",
  "accentColorHex": "#1e40af",
  "targetScreen": "booking",
  "targetId": "uuid",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "priorityOrder": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "badgeText": "PRIMERA CITA",
    "isActive": true,
    ...
  }
}
```

### GET `/api/ads/active`
Obtener anuncios activos (público)

**Query Parameters:**
- `providerId` (opcional): Filtrar por proveedor
- `categoryId` (opcional): Filtrar por categoría
- `targetScreen` (opcional): Filtrar por pantalla objetivo

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "badgeText": "PRIMERA CITA",
      "title": "20% OFF",
      "subtitle": "En tu primera consulta general",
      "imageUrl": "https://example.com/ad.jpg",
      "actionText": "Canjear Ahora",
      "provider": {
        "commercialName": "Dr. Juan Pérez",
        "logoUrl": "https://example.com/logo.jpg"
      },
      "endDate": "2024-01-31T23:59:59Z"
    }
  ]
}
```

### PUT `/api/ads/:id`
Actualizar anuncio

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "isActive": false,
  "priorityOrder": 2
}
```

### DELETE `/api/ads/:id`
Eliminar anuncio

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Anuncio eliminado exitosamente"
}
```

---

## 📦 Catálogo

### GET `/api/providers/me/catalog`
Obtener catálogo del proveedor

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (opcional): Filtrar por tipo
- `isAvailable` (opcional): Filtrar por disponibilidad
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "service",
      "name": "Consulta General",
      "description": "Consulta médica general",
      "price": 50.00,
      "isAvailable": true,
      "imageUrl": "https://example.com/service.jpg"
    }
  ]
}
```

### POST `/api/providers/me/catalog`
Crear item en catálogo

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "type": "service",
  "name": "Consulta General",
  "description": "Consulta médica general",
  "price": 50.00,
  "isAvailable": true,
  "imageUrl": "https://example.com/service.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "service",
    "name": "Consulta General",
    "price": 50.00,
    ...
  }
}
```

### GET `/api/branches/:id/catalog`
Obtener catálogo de sucursal (público)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "service",
      "name": "Consulta General",
      "description": "Consulta médica general",
      "price": 50.00,
      "isAvailable": true,
      "imageUrl": "https://example.com/service.jpg"
    }
  ]
}
```

### PUT `/api/catalog/:id`
Actualizar item del catálogo

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "Consulta General Actualizada",
  "price": 55.00,
  "isAvailable": false
}
```

### DELETE `/api/catalog/:id`
Eliminar item del catálogo

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Item eliminado exitosamente"
}
```

---

## 🕐 Horarios

### GET `/api/branches/:id/schedules`
Obtener horarios de sucursal

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "dayOfWeek": 1,
      "startTime": "09:00:00",
      "endTime": "18:00:00"
    }
  ]
}
```

### POST `/api/branches/:id/schedules`
Crear horario

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "dayOfWeek": 1,
  "startTime": "09:00:00",
  "endTime": "18:00:00"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "dayOfWeek": 1,
    "startTime": "09:00:00",
    "endTime": "18:00:00"
  }
}
```

### PUT `/api/schedules/:id`
Actualizar horario

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "startTime": "08:00:00",
  "endTime": "20:00:00"
}
```

### DELETE `/api/schedules/:id`
Eliminar horario

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Horario eliminado exitosamente"
}
```

---

## 🔔 Notificaciones

### GET `/api/notifications`
Obtener notificaciones del paciente

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (opcional): Filtrar por tipo (REMINDER, SYSTEM, BOOKING, etc.)
- `isRead` (opcional): Filtrar por leídas/no leídas
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "REMINDER",
      "title": "Recordatorio de cita",
      "body": "Tienes una cita mañana a las 10:00",
      "isRead": false,
      "data": {
        "appointmentId": "uuid"
      },
      "createdAt": "2024-01-14T10:00:00Z"
    }
  ]
}
```

### PUT `/api/notifications/:id/read`
Marcar notificación como leída

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
    "isRead": true
  }
}
```

### PUT `/api/notifications/read-all`
Marcar todas las notificaciones como leídas

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Todas las notificaciones marcadas como leídas"
}
```

### GET `/api/notifications/unread-count`
Obtener conteo de notificaciones no leídas

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

## ❤️ Favoritos

### GET `/api/patients/me/favorites`
Obtener favoritos del paciente

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
      "branch": {
        "id": "uuid",
        "name": "Clínica Central",
        "provider": {
          "commercialName": "Dr. Juan Pérez",
          "logoUrl": "https://example.com/logo.jpg"
        },
        "ratingCache": 4.8
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST `/api/patients/me/favorites`
Agregar a favoritos

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "branchId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "branchId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### DELETE `/api/favorites/:id`
Eliminar de favoritos

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Eliminado de favoritos exitosamente"
}
```

---

## 🏙️ Ciudades

### GET `/api/cities`
Listar ciudades

**Query Parameters:**
- `state` (opcional): Filtrar por estado
- `country` (opcional): Filtrar por país
- `search` (opcional): Búsqueda por nombre
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Quito",
      "state": "Pichincha",
      "country": "Ecuador"
    }
  ]
}
```

### GET `/api/cities/:id`
Obtener ciudad por ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Quito",
    "state": "Pichincha",
    "country": "Ecuador"
  }
}
```

---

## 🏷️ Categorías de Servicio

### GET `/api/service-categories`
Listar categorías de servicio

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Doctor",
      "slug": "doctor",
      "defaultColorHex": "#3b82f6",
      "allowsBooking": true
    },
    {
      "id": 2,
      "name": "Farmacia",
      "slug": "pharmacy",
      "defaultColorHex": "#22c55e",
      "allowsBooking": false
    }
  ]
}
```

### GET `/api/service-categories/:id`
Obtener categoría por ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Doctor",
    "slug": "doctor",
    "defaultColorHex": "#3b82f6",
    "allowsBooking": true
  }
}
```

---

## 👨‍💼 Administración

### GET `/api/admin/dashboard/stats`
Obtener estadísticas del dashboard

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProviders": 156,
    "totalPatients": 12500,
    "totalAppointments": 3420,
    "totalCities": 28,
    "requestStatus": {
      "pending": 5,
      "approved": 12,
      "rejected": 2
    },
    "servicesByCategory": {
      "doctors": 68,
      "pharmacies": 42,
      "laboratories": 25,
      "ambulances": 8,
      "supplies": 13
    },
    "recentActivity": [ ... ]
  }
}
```

### GET `/api/admin/providers`
Listar proveedores (admin)

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Query Parameters:**
- `verificationStatus` (opcional): Filtrar por estado de verificación
- `categoryId` (opcional): Filtrar por categoría
- `search` (opcional): Búsqueda
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

**Response:**
```json
{
  "success": true,
  "data": {
    "providers": [ ... ],
    "pagination": { ... }
  }
}
```

### PUT `/api/admin/providers/:id/verify`
Verificar proveedor

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Request:**
```json
{
  "verificationStatus": "APPROVED",
  "rejectionReason": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "verificationStatus": "APPROVED"
  }
}
```

### PUT `/api/admin/providers/:id/reject`
Rechazar proveedor

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Request:**
```json
{
  "verificationStatus": "REJECTED",
  "rejectionReason": "Documentos incompletos"
}
```

### GET `/api/admin/appointments`
Listar todas las citas (admin)

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Query Parameters:**
- `status` (opcional): Filtrar por estado
- `providerId` (opcional): Filtrar por proveedor
- `patientId` (opcional): Filtrar por paciente
- `startDate` (opcional): Fecha inicio
- `endDate` (opcional): Fecha fin
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

### GET `/api/admin/payments`
Listar todos los pagos (admin)

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Query Parameters:**
- `status` (opcional): Filtrar por estado
- `providerId` (opcional): Filtrar por proveedor
- `startDate` (opcional): Fecha inicio
- `endDate` (opcional): Fecha fin
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

### GET `/api/admin/payouts`
Listar todos los payouts (admin)

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Query Parameters:**
- `status` (opcional): Filtrar por estado
- `providerId` (opcional): Filtrar por proveedor
- `startDate` (opcional): Fecha inicio
- `endDate` (opcional): Fecha fin
- `page` (opcional): Número de página
- `limit` (opcional): Límite de resultados

### PUT `/api/admin/payouts/:id/process`
Procesar payout

**Headers:**
```
Authorization: Bearer <token>
Role: admin
```

**Request:**
```json
{
  "status": "processed",
  "referenceNumber": "PAY-2024-001"
}
```

---

## 📝 Notas de Implementación

### Autenticación
- Todos los endpoints (excepto los marcados como públicos) requieren el header `Authorization: Bearer <token>`
- El token JWT se obtiene del endpoint `/api/auth/login`
- Los tokens tienen expiración, usar `/api/auth/refresh` para renovarlos

### Paginación
- Todos los endpoints de listado soportan paginación con `page` y `limit`
- La respuesta incluye un objeto `pagination` con información de paginación

### Filtros de Fecha
- Usar formato ISO 8601: `2024-01-15T10:00:00Z`
- Para rangos, usar `startDate` y `endDate`

### Estados de Cita
- `CONFIRMED`: Cita confirmada
- `CANCELLED`: Cita cancelada
- `COMPLETED`: Cita completada

### Estados de Verificación
- `PENDING`: Pendiente de revisión
- `APPROVED`: Aprobado
- `REJECTED`: Rechazado

### Roles
- `admin`: Administrador del sistema
- `provider`: Proveedor de servicios
- `patient`: Paciente
- `user`: Usuario genérico

### Códigos de Estado HTTP
- `200`: Éxito
- `201`: Creado exitosamente
- `400`: Error de validación
- `401`: No autorizado
- `403`: Prohibido
- `404`: No encontrado
- `500`: Error del servidor

### Formato de Respuesta
Todas las respuestas siguen el formato:
```json
{
  "success": true,
  "data": { ... }
}
```

En caso de error:
```json
{
  "success": false,
  "message": "Mensaje de error",
  "errors": { ... } // Opcional, para errores de validación
}
```

---

**Última actualización:** 2024-01-XX
