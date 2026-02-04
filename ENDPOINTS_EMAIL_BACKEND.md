# 📧 Endpoints de Email que Necesita el Backend

## 🎯 Resumen

Tu frontend usa la API de Gmail (o servicio de email) en **2 lugares**:

## 1️⃣ Envío Manual de Correos (Panel Admin)

**Ubicación Frontend**: `/admin/send-email` (SendEmailPage)

**Endpoint Backend Necesario**:
```
POST /send-email
```

**Body que envía el frontend**:
```json
{
  "from": "ejemplo@correo.com",
  "to": "destinatario@correo.com",
  "subject": "Asunto del correo",
  "htmlContent": "<h1>Título</h1><p>Contenido...</p>"
}
```

**Respuesta esperada**:
```json
{
  "success": true,
  "message": "Correo enviado exitosamente"
}
```

**Uso**: 
- Panel de administración
- Permite al admin enviar correos personalizados manualmente
- Formulario con campos: from, to, subject, htmlContent

---

## 2️⃣ Recuperación de Contraseña (Forgot Password)

**Ubicación Frontend**: `/forgot-password` (ForgotPasswordPage)

**Endpoint Backend Necesario**:
```
POST /api/auth/forgot-password
```

**Body que envía el frontend**:
```json
{
  "email": "usuario@correo.com"
}
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "message": "Se ha enviado un correo con instrucciones para restablecer tu contraseña"
  }
}
```

**Uso**:
- Página pública (sin autenticación)
- Usuario olvidó su contraseña
- Backend debe:
  1. Verificar que el email existe en la BD
  2. Generar un token de recuperación
  3. Enviar email con link: `http://frontend.com/reset-password?token=xxx`
  4. El token debe expirar en X tiempo (ej: 1 hora)

---

## 📋 Implementación Backend Recomendada

### Configuración Gmail API (usando Nodemailer)

```javascript
// config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,      // tu-email@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // App Password de Gmail
  }
});

module.exports = transporter;
```

### Variables de Entorno (.env)
```env
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**Nota**: Necesitas crear un "App Password" en tu cuenta de Gmail:
1. Ir a Google Account → Security
2. Activar 2-Step Verification
3. Crear App Password para "Mail"

---

### Endpoint 1: Envío Manual

```javascript
// routes/email.js
const express = require('express');
const router = express.Router();
const transporter = require('../config/email');

// POST /send-email
router.post('/send-email', async (req, res) => {
  try {
    const { from, to, subject, htmlContent } = req.body;
    
    // Validar campos
    if (!from || !to || !subject || !htmlContent) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }
    
    // Enviar email
    await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: htmlContent
    });
    
    res.json({
      success: true,
      message: 'Correo enviado exitosamente'
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el correo'
    });
  }
});

module.exports = router;
```

---

### Endpoint 2: Forgot Password

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const transporter = require('../config/email');
const User = require('../models/User');

// POST /api/auth/forgot-password
router.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No existe una cuenta con ese correo electrónico'
      });
    }
    
    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora
    
    // Guardar token en BD
    await user.update({
      reset_password_token: resetToken,
      reset_password_expires: resetTokenExpiry
    });
    
    // URL del frontend para resetear contraseña
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    // Enviar email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Recuperación de Contraseña - MediConnect',
      html: `
        <h2>Recuperación de Contraseña</h2>
        <p>Hola ${user.full_name},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #1976d2;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 16px 0;
        ">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
        <p>Saludos,<br>Equipo MediConnect</p>
      `
    });
    
    res.json({
      success: true,
      data: {
        message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña'
      }
    });
    
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud'
    });
  }
});

module.exports = router;
```

---

## 🔒 Consideraciones de Seguridad

1. **Rate Limiting**: Limitar intentos de forgot-password (ej: 3 por hora por IP)
2. **Validar Emails**: Usar regex o librería para validar formato
3. **App Password**: NUNCA usar tu contraseña real de Gmail
4. **HTTPS**: En producción, usar HTTPS para los links de reset
5. **Token Único**: Cada token debe usarse solo una vez
6. **Expiración**: Los tokens deben expirar (1 hora recomendado)

---

## 📊 Tabla de Migración (si no existe)

```sql
-- Agregar campos para reset password en tabla users
ALTER TABLE users 
ADD COLUMN reset_password_token VARCHAR(255),
ADD COLUMN reset_password_expires TIMESTAMP;
```

---

## ✅ Checklist Backend

- [ ] Instalar nodemailer: `npm install nodemailer`
- [ ] Crear App Password en Gmail
- [ ] Configurar variables de entorno (GMAIL_USER, GMAIL_APP_PASSWORD)
- [ ] Crear transporter de nodemailer
- [ ] Implementar `POST /send-email`
- [ ] Implementar `POST /api/auth/forgot-password`
- [ ] Implementar `POST /api/auth/reset-password` (para completar el flujo)
- [ ] Agregar campos reset_password_token y reset_password_expires a tabla users
- [ ] Probar envío de emails
- [ ] Configurar rate limiting

---

## 🎯 Resumen para tu Backend

**Necesitas implementar 2 endpoints que usen Gmail API**:

1. **POST /send-email** - Para que el admin envíe correos manualmente
2. **POST /api/auth/forgot-password** - Para recuperación de contraseña

Ambos usan Nodemailer con Gmail. El primero es simple (envía lo que le mandes), el segundo genera tokens y envía links de recuperación.
