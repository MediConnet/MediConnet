# 📚 Endpoints de Invitación - Documentación Completa

## 🎯 Contexto

Según la información que me compartiste, el backend tiene 3 endpoints para invitaciones de médicos. Aquí está la documentación completa de cada uno.

## 📋 Endpoints Disponibles

### 1️⃣ Generar Link SIN Enviar Email

**Endpoint:** `POST /api/clinics/doctors/invite/link`

**Propósito:** Genera un link de invitación pero NO envía el email automáticamente. La clínica debe copiar el link y enviarlo manualmente.

**Request:**
```http
POST /api/clinics/doctors/invite/link
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "doctor@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invitationLink": "/clinic/invite/abc123...",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

**Flujo:**
1. Clínica ingresa email del médico
2. Backend genera token de invitación
3. Backend retorna el link
4. Clínica copia el link manualmente
5. Clínica envía el link por email/WhatsApp/etc.

---

### 2️⃣ Enviar Invitación por Email (Ruta Principal)

**Endpoint:** `POST /api/clinics/doctors/invitation`

**Propósito:** Genera el link Y envía el email automáticamente al médico.

**Request:**
```http
POST /api/clinics/doctors/invitation
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "doctor@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invitationLink": "/clinic/invite/abc123...",
    "expiresAt": "2024-12-31T23:59:59Z",
    "emailSent": true
  }
}
```

**Flujo:**
1. Clínica ingresa email del médico
2. Backend genera token de invitación
3. Backend envía email automáticamente
4. Backend retorna confirmación
5. Médico recibe el email con el link

---

### 3️⃣ Enviar Invitación por Email (Ruta Alternativa)

**Endpoint:** `POST /api/clinics/doctors/invite`

**Propósito:** Igual que el anterior, pero con una ruta más corta.

**Request:**
```http
POST /api/clinics/doctors/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "doctor@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invitationLink": "/clinic/invite/abc123...",
    "expiresAt": "2024-12-31T23:59:59Z",
    "emailSent": true
  }
}
```

**Flujo:** Igual que el endpoint #2

---

## 🔧 Cambio Aplicado en el Frontend

### Antes (causaba error 404):
```typescript
// Usaba: POST /api/clinics/doctors/invite/link
export const generateInvitationLinkAPI = async (email: string) => {
  const response = await httpClient.post(
    '/clinics/doctors/invite/link',  // ❌ Este endpoint no existe
    { email }
  );
  return extractData(response);
};
```

### Ahora (debería funcionar):
```typescript
// Usa: POST /api/clinics/doctors/invitation
export const generateInvitationLinkAPI = async (email: string) => {
  const response = await httpClient.post(
    '/clinics/doctors/invitation',  // ✅ Este endpoint existe
    { email }
  );
  return extractData(response);
};
```

---

## 🤔 ¿Cuál Endpoint Usar?

### Usa `/invite/link` si:
- Quieres que la clínica copie el link manualmente
- No tienes configurado el servicio de email (SES, SendGrid, etc.)
- Quieres más control sobre cuándo se envía el email

### Usa `/invitation` o `/invite` si:
- Quieres que el email se envíe automáticamente
- Tienes configurado el servicio de email
- Quieres un flujo más automatizado

---

## 🎨 Comportamiento Actual del Frontend

El componente `DoctorsSection.tsx` hace lo siguiente:

1. Usuario hace clic en "Invitar por Email"
2. Usuario ingresa el email del médico
3. Frontend llama a `generateInvitationLinkAPI(email)`
4. Backend genera el link (y opcionalmente envía email)
5. Frontend copia el link al portapapeles
6. Frontend abre el cliente de correo del usuario
7. Usuario pega el link en el email y lo envía

**Nota:** Actualmente el frontend NO envía el email automáticamente, solo genera el link y lo copia al portapapeles.

---

## 🔄 Opciones de Mejora

### Opción A: Envío Automático de Email
Si el backend ya envía el email automáticamente con `/invitation`, podemos simplificar el flujo:

```typescript
// No necesitamos abrir el cliente de correo
// Solo mostrar un mensaje de confirmación
setSnackbar({
  message: "Invitación enviada exitosamente a " + email,
  severity: 'success'
});
```

### Opción B: Mantener Flujo Manual
Si prefieres que la clínica envíe el email manualmente, podemos usar `/invite/link`:

```typescript
// Generar link sin enviar email
// Copiar al portapapeles
// Abrir cliente de correo
```

---

## ✅ Verificación para el Backend

Por favor, verifica en tu código backend:

### 1. ¿Qué endpoints tienes registrados?

Busca en tu código:
```javascript
// ¿Tienes esto?
router.post('/doctors/invite/link', ...)

// ¿O esto?
router.post('/doctors/invitation', ...)

// ¿O esto?
router.post('/doctors/invite', ...)
```

### 2. ¿Cuál envía email automáticamente?

Busca en el controlador:
```javascript
// ¿Hay algo así?
await sendInvitationEmail(email, invitationLink);
```

### 3. ¿Qué respuesta retorna cada uno?

Verifica que retornen:
```javascript
res.json({
  success: true,
  data: {
    invitationLink: '...',
    expiresAt: '...',
    emailSent: true/false  // Opcional
  }
});
```

---

## 📞 Siguiente Paso

**Dime:**

1. ¿Cuál de los 3 endpoints SÍ existe en tu backend?
2. ¿Ese endpoint envía el email automáticamente o solo genera el link?
3. ¿Qué respuesta retorna exactamente?

Con esta información, puedo:
- Actualizar el frontend para usar el endpoint correcto
- Ajustar el flujo según si el email se envía automáticamente o no
- Mejorar los mensajes de confirmación para el usuario
