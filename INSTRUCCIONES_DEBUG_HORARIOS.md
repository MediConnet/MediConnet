# 🔍 Instrucciones para Debug de Horarios

## ✅ SERVIDOR CORRIENDO
El servidor de desarrollo está corriendo en: **http://localhost:5174/**

## 🔧 CAMBIOS REALIZADOS
He agregado logs detallados en el componente `SchedulesSection.tsx` para identificar dónde está el problema.

## 📋 PASOS PARA DEBUGGEAR

### 1. Abre la aplicación
- Ve a: http://localhost:5174/
- Inicia sesión como clínica
- Ve a la sección de "Configuración de Horarios"

### 2. Abre la consola del navegador
- **Chrome/Edge**: Presiona `F12` o `Ctrl+Shift+I`
- **Firefox**: Presiona `F12`
- Ve a la pestaña "Console"

### 3. Verifica los logs iniciales
Deberías ver estos logs cuando cargue la página:
```
🎬 SchedulesSection renderizado - clinicId: [tu-clinic-id]
🔄 useEffect - profile cambió: { hasProfile: true, hasGeneralSchedule: true, hasUnsavedChanges: false }
📥 Cargando schedule del profile: [objeto con horarios]
```

**Si NO ves estos logs:**
- El componente no se está renderizando
- Verifica que estés en la página correcta
- Recarga la página con `Ctrl+F5` (recarga forzada)

### 4. Edita un horario
- Activa un día (ej: Lunes)
- Cambia la hora de inicio (ej: 10:00)
- Cambia la hora de fin (ej: 17:00)

Deberías ver:
```
🔍 Cambiando monday.enabled a: true
🔍 Cambiando monday.startTime a: 10:00
🔍 Cambiando monday.endTime a: 17:00
```

**Si NO ves estos logs:**
- Los inputs no están conectados correctamente
- Toma screenshot y envíamelo

### 5. Haz clic en "Guardar Horarios"
Deberías ver esta secuencia de logs:
```
🔘 BOTÓN GUARDAR PRESIONADO - INICIO
📊 Estado actual: { hasSaving: false, hasProfile: true, scheduleKeys: [...] }
✅ Profile existe, continuando...
🔍 VALORES A ENVIAR: { monday: {...}, tuesday: {...}, ... }
💾 Llamando a updateClinicScheduleAPI...
📤 Enviando horario al backend: [objeto]
📥 Respuesta RAW del backend: [objeto]
✅ RESPUESTA DEL BACKEND: [objeto]
🎉 Guardado exitoso
🏁 handleSave finalizado
```

### 6. Identifica dónde se detiene

**CASO A: No aparece "🔘 BOTÓN GUARDAR PRESIONADO"**
- El onClick no se está disparando
- Posible causa: Error de JavaScript que bloquea el evento
- Busca errores en rojo en la consola

**CASO B: Aparece "❌ No hay profile, abortando"**
- El perfil de la clínica no se cargó
- Verifica que estés autenticado correctamente
- Verifica el endpoint GET /api/clinics/profile

**CASO C: Se detiene en "💾 Llamando a updateClinicScheduleAPI..."**
- El request al backend está fallando
- Ve a la pestaña "Network" en DevTools
- Busca el request `PUT /api/clinics/schedule`
- Verifica el status code (200, 400, 500, etc.)
- Verifica la respuesta del servidor

**CASO D: Aparece "❌ ERROR AL GUARDAR"**
- El backend respondió con error
- Copia el mensaje de error completo
- Verifica el Network tab para ver la respuesta exacta

## 🚨 PROBLEMAS COMUNES

### Problema 1: Consola vacía (no hay logs)
**Causa:** El código no se está ejecutando
**Solución:**
1. Verifica que el servidor esté corriendo (debe estar en puerto 5174)
2. Recarga la página con `Ctrl+F5`
3. Limpia la caché del navegador
4. Cierra y abre el navegador

### Problema 2: "Network error" o "Failed to fetch"
**Causa:** El backend no está corriendo o no responde
**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica la URL del backend en `.env` o `.env.local`
3. Verifica que el token de autenticación sea válido

### Problema 3: Los horarios se guardan pero aparecen diferentes
**Causa:** El backend está transformando los horarios
**Solución:**
1. Compara los logs "🔍 VALORES A ENVIAR" vs "✅ RESPUESTA DEL BACKEND"
2. Si son diferentes, el backend está modificando los valores
3. Contacta al backend para que retorne exactamente lo que recibe

## 📸 INFORMACIÓN NECESARIA

Si el problema persiste, envíame:

1. **Screenshot de la consola completa** (todos los logs)
2. **Screenshot del Network tab** mostrando el request `PUT /api/clinics/schedule`
3. **Respuesta del servidor** (clic derecho en el request → Copy → Copy response)
4. **Valores que intentaste guardar** (ej: "Lunes 10:00-17:00")
5. **Valores que aparecieron después** (ej: "Lunes 09:00-18:00")

## 🎯 SIGUIENTE PASO

**Abre la aplicación, sigue los pasos 1-5, y dime en qué paso se detiene.**

Ejemplo de respuesta:
- "Se detiene en el paso 3, no veo los logs iniciales"
- "Se detiene en el paso 5, aparece el error: [copia el error]"
- "Llega hasta 🎉 Guardado exitoso pero los horarios no cambian"
