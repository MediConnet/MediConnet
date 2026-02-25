# 🔍 Análisis del Error 404 - Invitación de Médicos

## 📋 Resumen del Problema

Cuando haces clic en "Invitar por Email" en el panel de clínica, obtienes un error 404.

## 🔎 Análisis del Código Frontend

### Endpoint que está llamando el frontend:
```typescript
// Archivo: src/features/clinic-panel/infrastructure/clinic-doctors.api.ts
export const generateInvitationLinkAPI = async (email: string) => {
  const response = await httpClient.post(
    '/clinics/doctors/invite/link',  // ⬅️ Este endpoint
    { email }
  );
  return extractData(response);
};
```

### URL completa que se está llamando:
```
POST http://localhost:3000/api/clinics/doctors/invite/link
```

### Componente que lo usa:
```typescript
// Archivo: src/features/clinic-panel/presentation/components/DoctorsSection.tsx
// Línea ~95
const handleGenerateAndOpenEmail = async () => {
  // ...
  const { invitationLink } = await generateInvitationLinkAPI(doctorEmail);
  // ...
}
```

## ❓ Pregunta para el Backend

**¿Existe el endpoint `POST /api/clinics/doctors/invite/link` en tu backend?**

Según la documentación que me compartiste, deberías tener estos 3 endpoints:

1. ✅ `POST /api/clinics/doctors/invite/link` - Genera link sin enviar email
2. ✅ `POST /api/clinics/doctors/invitation` - Envía invitación por email
3. ✅ `POST /api/clinics/doctors/invite` - Envía invitación por email (ruta alternativa)

## 🔧 Posibles Causas del Error 404

### Causa 1: El endpoint no existe en el backend
- Verifica que el endpoint esté registrado en tu router de Express
- Busca en tu código backend: `router.post('/invite/link', ...)`

### Causa 2: El endpoint tiene un nombre diferente
- Quizás el endpoint se llama `/invitation` en lugar de `/invite/link`
- Verifica la ruta exacta en tu backend

### Causa 3: Falta el prefijo `/api`
- Verifica que tu backend esté escuchando en `/api/clinics/doctors/invite/link`
- No solo en `/clinics/doctors/invite/link`

### Causa 4: El endpoint requiere autenticación y el token no se está enviando
- Verifica en los logs del backend si el request está llegando
- Verifica si hay un error de autenticación (401) en lugar de 404

## 🛠️ Soluciones Propuestas

### Opción A: Si el endpoint `/invite/link` NO existe en el backend

Actualizar el frontend para usar el endpoint `/invitation` que sí existe:

```typescript
// Cambiar en: src/features/clinic-panel/infrastructure/clinic-doctors.api.ts

export const generateInvitationLinkAPI = async (email: string) => {
  const response = await httpClient.post(
    '/clinics/doctors/invitation',  // ⬅️ Cambiar a este endpoint
    { email }
  );
  return extractData(response);
};
```

### Opción B: Si el endpoint existe pero con otro nombre

Dime cuál es el nombre correcto y lo actualizo en el frontend.

### Opción C: Si el endpoint existe pero requiere datos adicionales

Dime qué datos adicionales necesita en el body y los agrego:

```typescript
// Ejemplo si necesita más datos:
export const generateInvitationLinkAPI = async (email: string) => {
  const response = await httpClient.post(
    '/clinics/doctors/invite/link',
    { 
      email,
      // ¿Necesita clinicId?
      // ¿Necesita role?
      // ¿Necesita otros datos?
    }
  );
  return extractData(response);
};
```

## 📊 Cómo Verificar en el Backend

### 1. Verifica que el endpoint esté registrado:
```javascript
// En tu archivo de rutas (ejemplo: routes/clinics.js)
router.post('/doctors/invite/link', authenticateToken, async (req, res) => {
  // ...
});
```

### 2. Verifica los logs del servidor:
Cuando hagas clic en "Invitar por Email", deberías ver en la consola del backend:
```
POST /api/clinics/doctors/invite/link
```

Si NO ves este log, significa que el request no está llegando al backend (problema de red o CORS).

Si ves el log pero con error 404, significa que la ruta no está registrada.

### 3. Verifica el método HTTP:
Asegúrate de que el endpoint sea `POST` y no `GET`.

## 🎯 Siguiente Paso

**Por favor, dime:**

1. ¿Existe el endpoint `POST /api/clinics/doctors/invite/link` en tu backend?
2. Si no existe, ¿cuál es el endpoint correcto que debo usar?
3. ¿Qué datos espera recibir en el body? (actualmente solo envío `{ email }`)
4. ¿Ves algún log en la consola del backend cuando haces clic en "Invitar por Email"?

Con esta información, puedo actualizar el frontend para que funcione correctamente.
