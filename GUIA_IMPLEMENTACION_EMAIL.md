# 📧 Guía de Implementación - Email de Invitación

## 📋 Variables a Reemplazar

Todas las plantillas usan estas variables que debes reemplazar dinámicamente:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{CLINIC_NAME}}` | Nombre de la clínica que invita | "Clínica San Rafael" |
| `{{INVITATION_LINK}}` | URL completa de invitación | "https://docalink.com/clinic/invite/abc123..." |
| `{{EXPIRATION_DATE}}` | Fecha de expiración legible | "31 de diciembre de 2024" |
| `{{DOCTOR_EMAIL}}` | Email del médico invitado | "doctor@example.com" |

## 🎨 Plantillas Disponibles

### 1. PLANTILLA_EMAIL_INVITACION.html (Completa y Profesional)
- ✅ Diseño moderno con gradientes
- ✅ Responsive (se adapta a móviles)
- ✅ Lista de beneficios destacada
- ✅ Botón CTA llamativo
- ✅ Link alternativo por si el botón no funciona
- ✅ Footer con redes sociales
- ✅ Información de expiración
- **Recomendada para:** Producción, emails importantes

### 2. PLANTILLA_EMAIL_SIMPLE.html (Minimalista)
- ✅ Diseño limpio y simple
- ✅ Menos código, carga más rápida
- ✅ Fácil de mantener
- ✅ Compatible con todos los clientes de email
- **Recomendada para:** Desarrollo, testing, emails transaccionales

### 3. PLANTILLA_EMAIL_TEXTO.txt (Solo Texto)
- ✅ Sin HTML, solo texto plano
- ✅ Compatible con cualquier cliente de email
- ✅ Accesible para lectores de pantalla
- ✅ Fallback si el HTML no se renderiza
- **Recomendada para:** Fallback, clientes de email antiguos

## 🛠️ Implementación en el Backend

### Opción A: Usando Nodemailer (Recomendado)

```javascript
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configurar transporter (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Función para enviar invitación
async function sendInvitationEmail(clinicName, doctorEmail, invitationToken) {
  try {
    // Leer plantilla HTML
    const templatePath = path.join(__dirname, 'templates', 'PLANTILLA_EMAIL_INVITACION.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    
    // Construir URL completa
    const invitationLink = `${process.env.FRONTEND_URL}/clinic/invite/${invitationToken}`;
    
    // Calcular fecha de expiración (7 días)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    const formattedDate = expirationDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Reemplazar variables
    htmlTemplate = htmlTemplate
      .replace(/{{CLINIC_NAME}}/g, clinicName)
      .replace(/{{INVITATION_LINK}}/g, invitationLink)
      .replace(/{{EXPIRATION_DATE}}/g, formattedDate);
    
    // Configurar email
    const mailOptions = {
      from: '"DOCALINK" <noreply@docalink.com>',
      to: doctorEmail,
      subject: `Invitación para unirte a ${clinicName} en DOCALINK`,
      html: htmlTemplate,
      // Texto plano como fallback
      text: `Has sido invitado a unirte a ${clinicName} en DOCALINK. 
             Visita este enlace para aceptar: ${invitationLink}
             Esta invitación expira el ${formattedDate}.`
    };
    
    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
}

// Uso en el controlador
router.post('/doctors/invitation', authenticateToken, async (req, res) => {
  try {
    const { email } = req.body;
    const clinicId = req.user.id;
    
    // Obtener nombre de la clínica
    const clinic = await db.clinics.findById(clinicId);
    
    // Generar token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Guardar invitación en BD
    await db.invitations.create({
      clinicId,
      email,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    // Enviar email
    await sendInvitationEmail(clinic.name, email, token);
    
    res.json({
      success: true,
      data: {
        invitationLink: `/clinic/invite/${token}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar invitación'
    });
  }
});
```

### Opción B: Usando AWS SES

```javascript
const AWS = require('aws-sdk');

// Configurar SES
const ses = new AWS.SES({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

async function sendInvitationEmail(clinicName, doctorEmail, invitationToken) {
  // Leer y procesar plantilla (igual que arriba)
  const htmlTemplate = processTemplate(clinicName, invitationToken);
  
  const params = {
    Source: 'DOCALINK <noreply@docalink.com>',
    Destination: {
      ToAddresses: [doctorEmail]
    },
    Message: {
      Subject: {
        Data: `Invitación para unirte a ${clinicName} en DOCALINK`,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: htmlTemplate,
          Charset: 'UTF-8'
        },
        Text: {
          Data: `Has sido invitado a unirte a ${clinicName}...`,
          Charset: 'UTF-8'
        }
      }
    }
  };
  
  try {
    const result = await ses.sendEmail(params).promise();
    console.log('✅ Email enviado:', result.MessageId);
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
}
```

### Opción C: Usando SendGrid

```javascript
const sgMail = require('@sendgrid/mail');

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendInvitationEmail(clinicName, doctorEmail, invitationToken) {
  const htmlTemplate = processTemplate(clinicName, invitationToken);
  
  const msg = {
    to: doctorEmail,
    from: 'noreply@docalink.com',
    subject: `Invitación para unirte a ${clinicName} en DOCALINK`,
    html: htmlTemplate,
    text: `Has sido invitado a unirte a ${clinicName}...`
  };
  
  try {
    await sgMail.send(msg);
    console.log('✅ Email enviado');
    return { success: true };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
}
```

## 🎯 Función Helper para Procesar Plantilla

```javascript
function processEmailTemplate(templateName, variables) {
  const fs = require('fs');
  const path = require('path');
  
  // Leer plantilla
  const templatePath = path.join(__dirname, 'templates', templateName);
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Reemplazar todas las variables
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, variables[key]);
  });
  
  return template;
}

// Uso:
const html = processEmailTemplate('PLANTILLA_EMAIL_INVITACION.html', {
  CLINIC_NAME: 'Clínica San Rafael',
  INVITATION_LINK: 'https://docalink.com/clinic/invite/abc123',
  EXPIRATION_DATE: '31 de diciembre de 2024'
});
```

## 📦 Estructura de Carpetas Recomendada

```
backend/
├── src/
│   ├── templates/
│   │   ├── emails/
│   │   │   ├── invitation/
│   │   │   │   ├── invitation.html          (plantilla completa)
│   │   │   │   ├── invitation-simple.html   (plantilla simple)
│   │   │   │   └── invitation.txt           (texto plano)
│   │   │   ├── welcome/
│   │   │   ├── reset-password/
│   │   │   └── ...
│   ├── services/
│   │   ├── email.service.js                 (lógica de envío)
│   │   └── template.service.js              (procesamiento de plantillas)
│   └── controllers/
│       └── invitation.controller.js
```

## 🧪 Testing

### Test Manual con Nodemailer

```javascript
// test-email.js
const sendInvitationEmail = require('./services/email.service');

async function test() {
  try {
    await sendInvitationEmail(
      'Clínica de Prueba',
      'tu-email@example.com',
      'test-token-123'
    );
    console.log('✅ Email de prueba enviado');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
```

Ejecutar:
```bash
node test-email.js
```

## 🔒 Variables de Entorno Necesarias

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion

# O para AWS SES
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key

# O para SendGrid
SENDGRID_API_KEY=tu-api-key

# Frontend URL
FRONTEND_URL=http://localhost:5173
# En producción: https://docalink.com
```

## 📝 Asuntos de Email Recomendados

```javascript
// Formal
`Invitación para unirte a ${clinicName} en DOCALINK`

// Amigable
`${clinicName} te invita a unirte a DOCALINK`

// Urgente
`⏰ Invitación pendiente de ${clinicName} - DOCALINK`

// Personalizado
`Dr./Dra., ${clinicName} quiere trabajar contigo en DOCALINK`
```

## ✅ Checklist de Implementación

- [ ] Elegir servicio de email (Nodemailer/SES/SendGrid)
- [ ] Configurar credenciales en .env
- [ ] Copiar plantilla HTML al proyecto
- [ ] Crear función de procesamiento de plantillas
- [ ] Crear función de envío de email
- [ ] Integrar con endpoint de invitación
- [ ] Probar con email real
- [ ] Verificar que el link funcione
- [ ] Verificar diseño en diferentes clientes (Gmail, Outlook, etc.)
- [ ] Configurar dominio de email (noreply@docalink.com)
- [ ] Configurar SPF, DKIM, DMARC para evitar spam

## 🎨 Personalización

### Cambiar Colores

En las plantillas HTML, busca y reemplaza:

```css
/* Color principal (verde azulado) */
#14b8a6 → TU_COLOR_PRINCIPAL

/* Color hover */
#0d9488 → TU_COLOR_HOVER

/* Gradiente */
linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)
```

### Agregar Logo

Reemplaza:
```html
<img src="https://tu-dominio.com/docalink-logo.png" alt="DOCALINK">
```

Con la URL de tu logo (debe estar alojado en un servidor público).

## 📊 Métricas Recomendadas

```javascript
// Guardar en BD para tracking
await db.emailLogs.create({
  type: 'invitation',
  to: doctorEmail,
  clinicId: clinicId,
  invitationId: invitation.id,
  sentAt: new Date(),
  status: 'sent',
  messageId: emailResult.messageId
});

// Tracking de apertura (opcional)
// Agregar pixel de tracking en el HTML
```

## 🚀 Siguiente Paso

1. Elige una plantilla (recomiendo la completa para producción)
2. Copia el código de implementación según tu servicio de email
3. Configura las variables de entorno
4. Prueba con tu email personal
5. Verifica que el link funcione correctamente
6. ¡Listo para producción!
