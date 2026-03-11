# ✅ Logs de Debug Agregados

## 🎯 Cambios Realizados

He agregado logs detallados en `src/features/auth/application/register-professional.usecase.ts` para debuggear el problema del email.

---

## 📊 Logs Agregados

### 1. Antes de Procesar (Línea ~10)

```typescript
console.log('🔍 cleanData completo:', cleanData);
console.log('📧 cleanData.email:', cleanData.email);
console.log('📧 Email es undefined?', cleanData.email === undefined);
console.log('📧 Email es null?', cleanData.email === null);
console.log('📧 Email es string vacío?', cleanData.email === '');
```

**Qué muestra:** Los datos que llegan del formulario ANTES de crear el FormData.

### 2. Verificación de Archivos (Línea ~16)

```typescript
console.log('📁 Tiene archivos?', hasFiles);
```

**Qué muestra:** Si el usuario subió archivos (médicos) o no (farmacias/labs).

### 3. Contenido del FormData (Línea ~45)

```typescript
console.log('📦 FormData entries:');
for (let [key, value] of formData.entries()) {
  console.log(`  ${key}:`, value);
}

const emailValue = formData.get('email');
console.log('📧 Email en FormData:', emailValue);
console.log('📧 Email en FormData es undefined?', emailValue === undefined);
console.log('📧 Email en FormData es null?', emailValue === null);
```

**Qué muestra:** TODO lo que hay en el FormData, incluyendo el email específicamente.

### 4. Datos JSON (Línea ~60)

```typescript
console.log('📤 Enviando JSON (sin archivos):', cleanData);
```

**Qué muestra:** Los datos que se envían cuando NO hay archivos (farmacias, labs, etc.).

---

## 🧪 Cómo Probar

### Prueba 1: Registro de Médico (CON archivos)

1. Abre la consola del navegador (F12 → Console)
2. Ve a: `http://localhost:5173/register?tipo=doctor`
3. Llena el formulario:
   - Nombre: Juan Pérez
   - Email: test@example.com
   - Teléfono: 0987654321
   - WhatsApp: 0987654321
   - Contraseña: 123456
   - Confirmar: 123456
4. Continúa al paso 2
5. Llena la información del servicio
6. **IMPORTANTE:** Sube al menos un archivo (licencia, certificado o título)
7. Envía el formulario
8. Revisa la consola

**Logs esperados:**

```
🔍 cleanData completo: {
  email: "test@example.com",
  password: "123456",
  firstName: "Juan",
  lastName: "Pérez",
  ...
}
📧 cleanData.email: test@example.com
📧 Email es undefined? false
📧 Email es null? false
📧 Email es string vacío? false
📁 Tiene archivos? true
📦 FormData entries:
  email: test@example.com
  password: 123456
  firstName: Juan
  lastName: Pérez
  ...
  licenses: [object File]
📧 Email en FormData: test@example.com
📧 Email en FormData es undefined? false
📧 Email en FormData es null? false
```

### Prueba 2: Registro de Farmacia (SIN archivos)

1. Abre la consola del navegador (F12 → Console)
2. Ve a: `http://localhost:5173/register?tipo=pharmacy`
3. Llena el formulario (igual que antes)
4. Continúa al paso 2
5. Llena la información del servicio
6. **NO subas archivos**
7. Envía el formulario
8. Revisa la consola

**Logs esperados:**

```
🔍 cleanData completo: {
  email: "test@example.com",
  password: "123456",
  ...
}
📧 cleanData.email: test@example.com
📧 Email es undefined? false
📧 Email es null? false
📧 Email es string vacío? false
📁 Tiene archivos? false
📤 Enviando JSON (sin archivos): {
  email: "test@example.com",
  password: "123456",
  ...
}
```

---

## 🔍 Qué Buscar en los Logs

### ✅ Si el email está presente:

```
📧 cleanData.email: test@example.com
📧 Email es undefined? false
```

**Significa:** El email SÍ está llegando al usecase. El problema está en el backend.

### ❌ Si el email NO está presente:

```
📧 cleanData.email: undefined
📧 Email es undefined? true
```

**Significa:** El email NO está llegando al usecase. El problema está en el formulario.

---

## 📸 Captura de Pantalla

Cuando hagas la prueba:

1. Abre la consola (F12)
2. Haz el registro
3. Toma captura de pantalla de TODOS los logs
4. Envía la captura al backend

---

## 📞 Qué Decirle al Backend

Después de hacer las pruebas, envíale esto:

---

"Hola, he agregado logs de debug en el frontend. Aquí están los resultados:

**Prueba 1: Médico (con archivos)**
[Pega los logs aquí o adjunta captura]

**Prueba 2: Farmacia (sin archivos)**
[Pega los logs aquí o adjunta captura]

Como puedes ver en los logs:
- ✅ El email SÍ está en cleanData
- ✅ El email SÍ está en el FormData
- ✅ El email NO es undefined

El email se está enviando correctamente desde el frontend. El problema debe estar en cómo el backend está parseando el request."

---

## 🎯 Próximo Paso

1. Haz las dos pruebas (médico y farmacia)
2. Captura los logs de la consola
3. Envía los logs al backend
4. Espera su respuesta

Con estos logs, el backend podrá ver exactamente qué está pasando y dónde está el problema.

---

## 🔧 Remover los Logs Después

Una vez que se resuelva el problema, puedes remover los logs para limpiar el código:

```typescript
// Busca y elimina todas las líneas que empiezan con:
console.log('🔍 ...
console.log('📧 ...
console.log('📁 ...
console.log('📦 ...
console.log('📤 ...
```

O déjalos comentados por si necesitas debuggear en el futuro:

```typescript
// console.log('🔍 cleanData completo:', cleanData);
```

---

¡Listo! Ahora puedes hacer las pruebas y ver exactamente qué está pasando con el email.
