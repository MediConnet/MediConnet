# Adjuntar PDF en Educación y Certificaciones ✅

## Resumen
Se ha agregado la funcionalidad para que los médicos asociados a clínicas puedan adjuntar archivos PDF como respaldo de su educación y certificaciones en su perfil profesional.

## Cambios Realizados

### Archivo Modificado
**`src/features/doctor-panel/presentation/components/ClinicAssociatedProfileSection.tsx`**

## Nuevas Funcionalidades

### 1. Botón "Adjuntar PDF"
- Nuevo botón junto al campo de texto en Educación y Certificaciones
- Icono de clip (📎)
- Abre el explorador de archivos del sistema
- Solo acepta archivos PDF

### 2. Validaciones de Archivos
- **Tipo de archivo:** Solo PDF (`application/pdf`)
- **Tamaño máximo:** 5MB
- Mensajes de error claros si no cumple las validaciones

### 3. Vista Previa del Archivo Seleccionado
- Alert verde mostrando el nombre del archivo seleccionado
- Icono de PDF
- Botón para cancelar/eliminar el archivo antes de agregar

### 4. Visualización de Documentos Adjuntos
- Chip con icono de PDF y nombre del archivo
- Click en el chip para abrir/descargar el PDF
- Se muestra debajo del texto de educación/certificación

### 5. Almacenamiento
- Archivos convertidos a Base64
- Guardados junto con el texto en el perfil
- Persistencia en localStorage (mock) o backend

## Estructura de Datos

### Antes (solo texto):
```typescript
education: string[]
certifications: string[]
```

### Ahora (texto + archivo opcional):
```typescript
education: Array<{
  text: string;
  fileUrl?: string;    // Base64 del PDF
  fileName?: string;   // Nombre del archivo
}>

certifications: Array<{
  text: string;
  fileUrl?: string;    // Base64 del PDF
  fileName?: string;   // Nombre del archivo
}>
```

### Ejemplo de Datos:
```json
{
  "education": [
    {
      "text": "Universidad Central - Medicina",
      "fileUrl": "data:application/pdf;base64,JVBERi0xLjQKJeLjz9...",
      "fileName": "titulo_medicina.pdf"
    },
    {
      "text": "Especialización en Cardiología",
      "fileUrl": "data:application/pdf;base64,JVBERi0xLjQKJeLjz9...",
      "fileName": "certificado_cardiologia.pdf"
    }
  ],
  "certifications": [
    {
      "text": "Certificación en Ecocardiografía",
      "fileUrl": "data:application/pdf;base64,JVBERi0xLjQKJeLjz9...",
      "fileName": "certificado_eco.pdf"
    }
  ]
}
```

## Flujo de Uso

### Agregar Educación/Certificación CON PDF (AUTO-AGREGADO):

1. **Escribir el texto (OPCIONAL):**
   - Ej: "Universidad Central - Medicina"
   - Si no escribes nada, usará el nombre del archivo

2. **Hacer clic en "Adjuntar PDF":**
   - Se abre el explorador de archivos
   - Seleccionar un archivo PDF
   - **¡Se agrega automáticamente!** No hay botón "Agregar"

3. **Ver en la lista:**
   - Se muestra inmediatamente con chip de PDF
   - Si no había texto, usa el nombre del archivo

4. **Ver/Descargar PDF:**
   - Click en el chip del PDF
   - Se abre en nueva pestaña o descarga

### Agregar SIN PDF (solo texto):

1. **Escribir el texto:**
   - Ej: "Curso de Primeros Auxilios"

2. **Presionar Enter:**
   - Se agrega solo el texto
   - No se muestra chip de PDF

## Componentes UI

### Botones:
- **"Adjuntar PDF"** (contained, color teal, icono 📎)
  - Al seleccionar archivo, se agrega automáticamente
  - No hay botón "Agregar" separado

### Chips de PDF:
- Icono de PDF (📄)
- Nombre del archivo
- Color primary, variant outlined
- Clickeable para abrir el documento

### Iconos:
- `AttachFile` - Botón adjuntar
- `PictureAsPdf` - Chip de PDF
- `Delete` - Eliminar item de la lista

## Validaciones Implementadas

### Tipo de Archivo:
```typescript
if (file.type !== 'application/pdf') {
  alert('Solo se permiten archivos PDF');
  return;
}
```

### Tamaño de Archivo:
```typescript
if (file.size > 5 * 1024 * 1024) {
  alert('El archivo es demasiado grande. Máximo 5MB');
  return;
}
```

## Conversión a Base64

```typescript
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

## Visualización de Documentos

```typescript
const handleViewDocument = (fileUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.target = '_blank';
  link.download = fileName;
  link.click();
};
```

## Backend (Futuro)

Cuando el backend esté listo, necesitará:

### Opción 1: Guardar Base64 en JSON
```sql
ALTER TABLE doctor_profiles
ADD COLUMN education JSONB,
ADD COLUMN certifications JSONB;
```

### Opción 2: Tabla separada para documentos
```sql
CREATE TABLE doctor_documents (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id),
  document_type VARCHAR(50), -- 'education' o 'certification'
  text VARCHAR(500),
  file_url TEXT, -- Base64 o URL de S3
  file_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Opción 3: Almacenamiento en S3 (Recomendado)
```typescript
// En lugar de Base64, subir a S3 y guardar URL
{
  "text": "Universidad Central - Medicina",
  "fileUrl": "https://s3.amazonaws.com/bucket/documents/doc123.pdf",
  "fileName": "titulo_medicina.pdf"
}
```

## Ventajas

✅ **Respaldo documental:** Los médicos pueden probar su educación y certificaciones
✅ **Súper fácil de usar:** Solo 1 click para adjuntar un PDF (auto-agrega)
✅ **Validación automática:** Solo acepta PDFs de máximo 5MB
✅ **Auto-agregado:** No necesita botón "Agregar" separado
✅ **Opcional:** No es obligatorio adjuntar PDF
✅ **Visualización:** Click en el chip para ver el documento
✅ **Nombre automático:** Si no hay texto, usa el nombre del archivo

## Limitaciones Actuales

⚠️ **Tamaño:** Base64 aumenta el tamaño del archivo en ~33%
⚠️ **Almacenamiento:** localStorage tiene límite de ~5-10MB
⚠️ **Performance:** Archivos grandes pueden ser lentos

## Recomendaciones para Producción

1. **Usar S3 o similar:** En lugar de Base64, subir a almacenamiento en la nube
2. **Endpoint de upload:** `POST /api/doctors/documents/upload`
3. **Límite de archivos:** Máximo 3-5 documentos por sección
4. **Compresión:** Comprimir PDFs antes de subir
5. **CDN:** Servir documentos desde CDN para mejor performance

## Testing

### Probar en el Frontend:

1. **Iniciar sesión como médico asociado:**
   ```
   Email: dr.juan.perez@clinicacentral.com
   Password: doctor123
   ```

2. **Ir a "Mi Perfil"**

3. **Scroll hasta "Educación"**

4. **Agregar educación CON PDF:**
   - Escribir (opcional): "Universidad Central - Medicina"
   - Click en "Adjuntar PDF"
   - Seleccionar un PDF de prueba
   - **Verificar que se agrega automáticamente** con chip de PDF

5. **Ver el PDF:**
   - Click en el chip del PDF
   - Verificar que se abre/descarga

6. **Agregar educación SIN PDF:**
   - Escribir: "Curso de Primeros Auxilios"
   - Presionar Enter
   - Verificar que se agrega sin chip

7. **Repetir para "Certificaciones"**

8. **Guardar cambios:**
   - Click en "Guardar Cambios"
   - Recargar página
   - Verificar que los PDFs se mantienen

---

**Estado:** ✅ Completado y funcional
**Fecha:** 2026-02-06
**Funcionalidad:** Adjuntar archivos PDF en Educación y Certificaciones del perfil del médico
