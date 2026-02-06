# Mensaje para Backend: Ver Perfil Médico desde Clínica

## Resumen
Se implementó en el frontend la funcionalidad para que la clínica pueda ver el perfil completo de sus médicos asociados, incluyendo los documentos PDF que el médico haya subido.

## Lo que necesita el Backend

### 1. Endpoint para Obtener Perfil Completo del Médico

**Endpoint:**
```
GET /api/clinics/{clinicId}/doctors/{doctorId}/profile
```

**Descripción:**
Retorna toda la información del perfil profesional del médico, incluyendo educación y certificaciones con sus documentos adjuntos.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Exitoso (200):**
```json
{
  "id": "doctor-1",
  "clinicId": "clinic-1",
  "userId": "user-123",
  "email": "dr.juan.perez@clinicacentral.com",
  "name": "Dr. Juan Pérez",
  "specialty": "Cardiología",
  "isActive": true,
  "officeNumber": "101",
  "consultationFee": 50.00,
  "profileImageUrl": "https://s3.amazonaws.com/bucket/profiles/doctor-1.jpg",
  "phone": "0991234567",
  "whatsapp": "0991234567",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-02-06T15:30:00Z",
  "professionalProfile": {
    "bio": "Cardiólogo con más de 15 años de experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares.",
    "experience": 15,
    "education": [
      {
        "text": "Universidad Central del Ecuador - Medicina",
        "fileUrl": "https://s3.amazonaws.com/bucket/documents/titulo_medicina.pdf",
        "fileName": "titulo_medicina.pdf"
      },
      {
        "text": "Especialización en Cardiología - Hospital Metropolitano"
      }
    ],
    "certifications": [
      {
        "text": "Certificación en Ecocardiografía",
        "fileUrl": "https://s3.amazonaws.com/bucket/documents/certificado_eco.pdf",
        "fileName": "certificado_eco.pdf"
      },
      {
        "text": "Certificación en Cardiología Intervencionista"
      }
    ]
  }
}
```

**Notas sobre la estructura:**
- `education` y `certifications` son arrays que pueden contener:
  - **Strings simples:** `"Universidad Central del Ecuador"`
  - **Objetos con PDF:** `{ text: "...", fileUrl: "...", fileName: "..." }`
- Los campos `fileUrl` y `fileName` son **opcionales**
- Si no hay PDF adjunto, solo enviar el string o el objeto sin `fileUrl`/`fileName`

**Response Error (404):**
```json
{
  "error": "Doctor not found",
  "message": "El médico no existe o no pertenece a esta clínica"
}
```

**Response Error (403):**
```json
{
  "error": "Forbidden",
  "message": "No tienes permiso para ver este perfil"
}
```

### 2. Validaciones de Seguridad

El backend debe verificar:
1. ✅ El usuario autenticado es una clínica
2. ✅ El médico pertenece a esa clínica (`doctor.clinicId === clinicId`)
3. ✅ El token de autenticación es válido
4. ✅ La clínica tiene permisos para ver perfiles de médicos

### 3. Estructura de Base de Datos

#### Tabla: `doctors` o `clinic_doctors`
```sql
CREATE TABLE clinic_doctors (
  id SERIAL PRIMARY KEY,
  clinic_id INTEGER REFERENCES clinics(id),
  user_id INTEGER REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  specialty VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  office_number VARCHAR(50),
  consultation_fee DECIMAL(10, 2),
  profile_image_url TEXT,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `doctor_profiles` (perfil profesional)
```sql
CREATE TABLE doctor_profiles (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES clinic_doctors(id),
  bio TEXT,
  experience INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `doctor_education` (educación)
```sql
CREATE TABLE doctor_education (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES clinic_doctors(id),
  text VARCHAR(500) NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `doctor_certifications` (certificaciones)
```sql
CREATE TABLE doctor_certifications (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES clinic_doctors(id),
  text VARCHAR(500) NOT NULL,
  file_url TEXT,
  file_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Almacenamiento de PDFs

**Recomendación:** Usar AWS S3 o similar

#### Cuando el médico sube un PDF:
1. Recibir el archivo en el endpoint del médico
2. Validar el archivo (tipo, tamaño)
3. Subir a S3 con nombre único: `documents/{doctorId}/{timestamp}_{filename}.pdf`
4. Guardar la URL de S3 en la base de datos
5. Configurar permisos de S3 para que solo usuarios autenticados puedan acceder

#### Ejemplo de URL de S3:
```
https://mediconnect-documents.s3.amazonaws.com/documents/doctor-123/1707234567_titulo_medicina.pdf
```

### 5. Permisos de Acceso a PDFs

**Opción 1: URLs firmadas (Recomendado)**
```javascript
// Generar URL firmada con expiración de 1 hora
const signedUrl = s3.getSignedUrl('getObject', {
  Bucket: 'mediconnect-documents',
  Key: 'documents/doctor-123/titulo.pdf',
  Expires: 3600 // 1 hora
});
```

**Opción 2: Proxy a través del backend**
```
GET /api/documents/{documentId}
```
El backend verifica permisos y retorna el archivo.

### 6. Endpoint Relacionado (Ya implementado en frontend)

El frontend ya tiene implementado:
- ✅ Actualizar perfil del médico (desde panel del médico)
- ✅ Subir PDFs de educación y certificaciones (desde panel del médico)

El backend necesita:
- [ ] Endpoint para que el médico actualice su perfil
- [ ] Endpoint para que el médico suba PDFs
- [ ] Endpoint para que la clínica vea el perfil (este documento)

## Flujo Completo

### Desde el Panel del Médico:
1. Médico completa su perfil profesional
2. Médico sube PDFs de títulos y certificaciones
3. Backend guarda en S3 y almacena URLs en BD

### Desde el Panel de la Clínica:
1. Clínica hace click en "Ver Perfil" (ícono de ojo)
2. Frontend llama a `GET /api/clinics/{clinicId}/doctors/{doctorId}/profile`
3. Backend verifica permisos
4. Backend retorna perfil completo con URLs de PDFs
5. Frontend muestra modal con toda la información
6. Clínica puede hacer click en los PDFs para verlos

## Testing del Endpoint

### Request de Ejemplo:
```bash
curl -X GET \
  'http://localhost:3000/api/clinics/clinic-1/doctors/doctor-1/profile' \
  -H 'Authorization: Bearer {token_de_clinica}'
```

### Response Esperado:
Ver el JSON de ejemplo en la sección 1.

## Consideraciones Importantes

1. **Privacidad:** Solo la clínica dueña puede ver los perfiles de sus médicos
2. **Seguridad:** Los PDFs deben estar protegidos (URLs firmadas o proxy)
3. **Performance:** Considerar caché para perfiles que no cambian frecuentemente
4. **Tamaño:** Los PDFs no deben exceder 5MB (validar en el upload)
5. **Formato:** Solo permitir PDFs (validar MIME type)

## Datos de Prueba

### Clínica de Prueba:
```
ID: clinic-1
Email: clinic@medicones.com
Password: clinic123
```

### Médicos de Prueba:
```
1. Dr. Juan Pérez
   ID: doctor-clinic-central-1
   Email: dr.juan.perez@clinicacentral.com
   Specialty: Cardiología
   Tiene: 2 educaciones (1 con PDF), 2 certificaciones (1 con PDF)

2. Dra. María García
   ID: doctor-clinic-central-2
   Email: dra.maria.garcia@clinicacentral.com
   Specialty: Pediatría
   Tiene: 2 educaciones (1 con PDF), 2 certificaciones (1 con PDF)
```

## Preguntas Frecuentes

**P: ¿La clínica puede editar el perfil del médico?**
R: No, solo puede verlo. El médico es el único que puede editar su perfil.

**P: ¿Qué pasa si el médico no ha completado su perfil?**
R: Retornar `professionalProfile: null` o un objeto vacío. El frontend maneja este caso.

**P: ¿Los PDFs son obligatorios?**
R: No, son opcionales. Un ítem puede tener solo texto sin PDF.

**P: ¿Cómo se manejan los PDFs antiguos si el médico sube uno nuevo?**
R: Depende de tu lógica. Puedes:
- Reemplazar el PDF anterior
- Mantener historial de versiones
- Permitir múltiples PDFs por ítem

---

**Prioridad:** Media
**Complejidad:** Media
**Tiempo estimado:** 4-6 horas (incluyendo S3 setup)
**Dependencias:** Sistema de autenticación, S3 o almacenamiento de archivos
