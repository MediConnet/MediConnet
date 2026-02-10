# 🎯 PLAN DE ACCIÓN INMEDIATO - Bug de Ambulancia

## Fecha: 10 de febrero de 2026

---

## ✅ LO QUE HICE EN EL FRONTEND

### 1. Eliminé el Fallback a Mock

**Antes**: Cuando el backend fallaba, el sistema mostraba datos de ejemplo ("Ambulancias VidaRápida")

**Ahora**: Cuando el backend falla, el sistema muestra un mensaje de error claro explicando el problema

### 2. Mejoré el Manejo de Errores

- ✅ Logs detallados en consola para depuración
- ✅ Mensaje de error visible para el usuario
- ✅ Explicación de posibles causas
- ✅ Botón para reintentar

### 3. Pantalla de Error Informativa

Cuando el backend no puede cargar el perfil, el usuario verá:

```
⚠️ Error al Cargar el Perfil

[Mensaje de error del backend]

Posibles causas:
• Tu cuenta de ambulancia no está completamente configurada en el sistema
• El administrador aún no ha completado la aprobación de tu servicio
• Hay un problema de conexión con el servidor

Solución: Contacta al administrador del sistema para verificar el estado de tu cuenta.

[Botón: Reintentar]
```

---

## 🔍 CÓMO DEPURAR AHORA

### Paso 1: Limpiar Todo

```javascript
// En la consola del navegador (F12)
localStorage.clear();
location.reload();
```

### Paso 2: Registrar Nueva Ambulancia

1. Ir a `/register`
2. Seleccionar "Ambulancia"
3. Completar el formulario
4. Enviar

### Paso 3: Aprobar desde Admin

1. Iniciar sesión como admin
2. Ir a "Solicitudes"
3. Aprobar la ambulancia

### Paso 4: Iniciar Sesión con la Ambulancia

1. **ABRIR LA CONSOLA (F12)** antes de iniciar sesión
2. Iniciar sesión con la ambulancia
3. Observar los logs en consola

### Paso 5: Ver el Error

Si el backend falla, verás en consola:

```
🔍 [AMBULANCE] Obteniendo perfil de ambulancia desde el backend...
❌ [AMBULANCE] Error al obtener perfil del backend: [Error]
❌ [AMBULANCE] Detalles del error: {
  message: "Error al obtener ambulancia",
  response: { ... },
  status: 404 o 500,
  url: "/api/ambulances/profile"
}
```

Y en la pantalla verás el mensaje de error informativo.

---

## 📋 INFORMACIÓN PARA EL BACKEND

He creado el archivo `MENSAJE_CORTO_BACKEND.md` con toda la información que necesitan:

### Resumen del Problema

El endpoint `GET /api/ambulances/profile` no funciona porque:

**Opción A**: No se crean los registros en `providers` y `ambulances` cuando el admin aprueba

**Opción B**: El endpoint no busca correctamente usando el `user_id` del token

### Lo Que Deben Verificar

1. **¿Se crea el provider al aprobar?**
   ```sql
   SELECT * FROM providers WHERE user_id = 'USER_ID_DEL_TOKEN';
   ```

2. **¿Se crea la ambulancia al aprobar?**
   ```sql
   SELECT * FROM ambulances WHERE provider_id = 'PROVIDER_ID';
   ```

3. **¿El endpoint busca correctamente?**
   - Debe obtener `user_id` del token
   - Buscar `provider` por `user_id`
   - Buscar `ambulance` por `provider_id`
   - Devolver el perfil

### Logs Recomendados

```javascript
console.log('🔍 [AMBULANCE PROFILE] 1. User ID del token:', userId);
console.log('🔍 [AMBULANCE PROFILE] 2. Provider encontrado:', provider);
console.log('🔍 [AMBULANCE PROFILE] 3. Ambulancia encontrada:', ambulance);
```

---

## 🎯 PRÓXIMOS PASOS

### Para Ti (Frontend)

1. ✅ **HECHO**: Eliminar fallback a mock
2. ✅ **HECHO**: Agregar manejo de errores
3. ✅ **HECHO**: Crear mensaje informativo
4. ✅ **HECHO**: Documentar para backend
5. ⏳ **ESPERAR**: Que backend corrija el endpoint

### Para Backend

1. ⏳ Leer `MENSAJE_CORTO_BACKEND.md`
2. ⏳ Verificar creación de registros al aprobar
3. ⏳ Verificar lógica del endpoint
4. ⏳ Agregar logs de depuración
5. ⏳ Probar con una ambulancia de prueba
6. ⏳ Confirmar que funciona

---

## 🧪 CÓMO PROBAR CUANDO BACKEND ESTÉ LISTO

### Test 1: Ambulancia Nueva

1. Limpiar localStorage
2. Registrar nueva ambulancia
3. Admin aprueba
4. Iniciar sesión
5. **Verificar**: Dashboard muestra datos correctos (no "Ambulancias VidaRápida")

### Test 2: Múltiples Ambulancias

1. Registrar ambulancia A
2. Registrar ambulancia B
3. Admin aprueba ambas
4. Iniciar sesión con A → Ver datos de A
5. Cerrar sesión
6. Iniciar sesión con B → Ver datos de B
7. **Verificar**: Cada ambulancia ve sus propios datos

### Test 3: Logs en Consola

1. Abrir consola (F12)
2. Iniciar sesión
3. **Verificar logs**:
   ```
   ✅ [AMBULANCE] Perfil recibido del backend: {
     id: "...",
     commercialName: "MI_AMBULANCIA",  // ← No "VidaRápida"
     ...
   }
   ```

---

## 📊 ARCHIVOS MODIFICADOS

1. ✅ `src/features/ambulance-panel/application/get-ambulance-profile.usecase.ts`
   - Eliminado fallback a mock
   - Agregados logs detallados
   - Re-lanza el error para que el componente lo maneje

2. ✅ `src/features/ambulance-panel/presentation/hooks/useAmbulanceProfile.ts`
   - Agregado estado de error
   - Captura y expone el mensaje de error

3. ✅ `src/features/ambulance-panel/presentation/pages/AmbulanceDashboardPage.tsx`
   - Agregada pantalla de error informativa
   - Explicación de posibles causas
   - Botón para reintentar

4. ✅ `MENSAJE_CORTO_BACKEND.md`
   - Documentación completa para el backend
   - Pasos de verificación
   - Código de ejemplo
   - Logs recomendados

---

## ✅ BUILD

```
✓ built in 26.79s
```

Todo compila correctamente. El frontend está listo y esperando que el backend corrija el endpoint.

---

## 🚨 ESTADO ACTUAL

- ✅ **Frontend**: Listo y funcionando correctamente
- ❌ **Backend**: Endpoint `GET /api/ambulances/profile` devuelve error
- 🔴 **Urgencia**: CRÍTICA - Los usuarios no pueden usar la app

---

## 📞 SIGUIENTE ACCIÓN

**Enviar al backend**: `MENSAJE_CORTO_BACKEND.md`

Este archivo tiene toda la información que necesitan para corregir el problema.

---

**Fecha**: 10 de febrero de 2026
**Status**: ⏳ Esperando corrección del backend
**Build**: ✅ EXITOSO
