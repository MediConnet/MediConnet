# 🔌 Guía de Integración con el Backend

Este documento describe cómo el frontend está configurado para conectarse al backend serverless de MediConnet.

## 📋 Configuración Inicial

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```env
VITE_API_URL=https://api.mediconnet.com/v1
VITE_APP_NAME=MediConnet
VITE_NODE_ENV=development
```

Para desarrollo local, puedes usar:
```env
VITE_API_URL=http://localhost:3000/api
```

### Cliente HTTP

El cliente HTTP está configurado en `src/shared/lib/http.ts` y:

- ✅ Agrega automáticamente el token JWT en el header `Authorization: Bearer <token>`
- ✅ Maneja errores 401 (no autorizado) y 403 (prohibido)
- ✅ Extrae datos de respuestas del backend (formato: `{ success: true, data: ... }`)
- ✅ Timeout de 30 segundos

## 🔐 Autenticación

### Login

```typescript
import { loginAPI } from '@/features/auth/infrastructure/auth.api';

const response = await loginAPI({
  email: 'doctor@example.com',
  password: 'password123'
});

// Response contiene: { userId, cognitoUserId, email, name, role, serviceType, token, refreshToken }
// Guardar el token en el auth store
authStore.login(response, response.token);
```

### Registro

```typescript
import { registerAPI } from '@/features/auth/infrastructure/auth.api';

const response = await registerAPI({
  email: 'doctor@example.com',
  password: 'password123',
  name: 'Dr. Juan Pérez',
  role: 'PROFESIONAL',
  serviceType: 'doctor'
});
```

### Obtener Usuario Actual

```typescript
import { getCurrentUserAPI } from '@/features/auth/infrastructure/auth.api';

const user = await getCurrentUserAPI();
```

## 📡 Estructura de Respuestas del Backend

El backend retorna todas las respuestas en el siguiente formato:

```typescript
// Respuesta exitosa
{
  success: true,
  data: { ... } // Datos de la respuesta
}

// Respuesta de error
{
  success: false,
  message: "Mensaje de error",
  errors?: { ... } // Errores de validación (opcional)
}
```

### Helper `extractData`

Usa el helper `extractData` para extraer los datos de las respuestas:

```typescript
import { httpClient, extractData } from '@/shared/lib/http';

const response = await httpClient.get<{ success: boolean; data: DoctorDashboard }>(
  '/doctors/profile'
);
const dashboard = extractData(response); // Retorna directamente el objeto DoctorDashboard
```

## 🏥 APIs por Servicio

### Doctores (`/api/doctors`)

```typescript
import {
  getDoctorProfileAPI,
  updateDoctorProfileAPI,
  getDoctorAppointmentsAPI,
  createDiagnosisAPI,
  getDoctorPaymentsAPI
} from '@/features/doctor-panel/infrastructure/doctors.api';

// Obtener perfil
const profile = await getDoctorProfileAPI();

// Actualizar perfil
const updated = await updateDoctorProfileAPI({
  name: 'Dr. Juan Pérez',
  specialty: 'Cardiología',
  price: 50
});

// Obtener citas
const appointments = await getDoctorAppointmentsAPI();

// Crear diagnóstico
const diagnosis = await createDiagnosisAPI(appointmentId, {
  diagnosis: 'Hipertensión arterial',
  symptoms: 'Dolor de cabeza',
  treatment: 'Medicación antihipertensiva'
});
```

### Farmacias (`/api/pharmacies`)

```typescript
import {
  getPharmacyProfileAPI,
  updatePharmacyProfileAPI,
  getPharmacyBranchesAPI,
  createPharmacyBranchAPI
} from '@/features/pharmacy-panel/infrastructure/pharmacy.api';

// Obtener perfil
const profile = await getPharmacyProfileAPI();

// Obtener sucursales
const branches = await getPharmacyBranchesAPI();

// Crear sucursal
const branch = await createPharmacyBranchAPI({
  name: 'Sucursal Centro',
  address: 'Av. Principal 123',
  phone: '+593 99 123 4567',
  // ...
});
```

### Administración (`/api/admin`)

```typescript
import {
  getDashboardStatsAPI,
  getProviderRequestsAPI,
  approveProviderRequestAPI,
  getAdRequestsAPI,
  approveAdRequestAPI
} from '@/features/admin-dashboard/infrastructure';

// Obtener estadísticas
const stats = await getDashboardStatsAPI();

// Obtener solicitudes de proveedores
const requests = await getProviderRequestsAPI();

// Aprobar solicitud
await approveProviderRequestAPI(requestId);

// Obtener solicitudes de anuncios
const adRequests = await getAdRequestsAPI();
```

## 🔄 Manejo de Errores

El cliente HTTP maneja automáticamente:

- **401 Unauthorized**: Cierra sesión automáticamente
- **403 Forbidden**: Muestra advertencia en consola
- **Otros errores**: Retorna el mensaje del backend si está disponible

Ejemplo de manejo de errores:

```typescript
try {
  const data = await getDoctorProfileAPI();
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    // Mostrar mensaje al usuario
  }
}
```

## 🔑 Autenticación con Tokens

El token JWT se almacena en el `authStore` y se agrega automáticamente a todas las peticiones mediante el interceptor de Axios.

Para refrescar el token:

```typescript
import { refreshTokenAPI } from '@/features/auth/infrastructure/auth.api';

const newTokens = await refreshTokenAPI(refreshToken);
authStore.login(user, newTokens.token);
```

## 📝 Notas Importantes

1. **Todas las APIs requieren autenticación** excepto:
   - `/api/auth/login`
   - `/api/auth/register`
   - `/api/auth/forgot-password`
   - `/api/home/*` (público)

2. **El token se obtiene del `authStore`** y se agrega automáticamente a cada petición.

3. **Las respuestas del backend siempre tienen el formato** `{ success: boolean, data: ... }`.

4. **Usa `extractData()`** para extraer los datos de las respuestas exitosas.

5. **Los errores se propagan** como excepciones, úsalos con `try/catch`.

## 🚀 Migración de Mocks a APIs Reales

Para migrar código que usa mocks:

1. Reemplaza las llamadas a funciones mock con las APIs correspondientes
2. Usa `extractData()` para extraer los datos de las respuestas
3. Agrega manejo de errores con `try/catch`
4. Actualiza los tipos TypeScript si es necesario

Ejemplo:

```typescript
// Antes (mock)
const profile = await getPharmacyProfileMock();

// Después (API real)
const profile = await getPharmacyProfileAPI();
```

## 🔍 Debugging

Para ver las peticiones HTTP en la consola del navegador:

1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Filtra por "XHR" o "Fetch"
4. Revisa las peticiones y respuestas

Para ver los logs del cliente HTTP, revisa la consola del navegador donde se muestran advertencias y errores.
