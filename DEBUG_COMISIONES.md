# 🔍 Debug - Sistema de Comisiones

## Logs Agregados

He agregado logs detallados en toda la cadena de llamadas para identificar el problema:

### 1. API Client (`dashboard.api.ts`)
- 🌐 Logs al hacer GET y PUT
- 🌐 Logs de respuesta recibida
- 🌐 Logs de datos extraídos

### 2. Use Cases
- 🔵 Logs en `getAdminSettingsUseCase`
- 🟢 Logs en `updateAdminSettingsUseCase`

### 3. Hook (`useAdminSettings.ts`)
- 🎣 Logs al cargar settings
- 💾 Logs al guardar settings

### 4. Página (`CommissionsPage.tsx`)
- 🎬 Logs al renderizar
- 📊 Logs de settings actuales

## 📋 Pasos para Debuggear

1. **Abre la consola del navegador** (F12 → Console)

2. **Refresca la página** (F5)

3. **Busca estos logs en orden:**
   ```
   🎬 CommissionsPage renderizado
   🎣 useAdminSettings: Iniciando fetchSettings...
   🔵 getAdminSettingsUseCase: Llamando al backend...
   🌐 getAdminSettingsAPI: Haciendo GET /admin/settings
   🌐 getAdminSettingsAPI: Respuesta recibida: {...}
   🌐 getAdminSettingsAPI: Datos extraídos: {...}
   🔵 getAdminSettingsUseCase: Respuesta del backend: {...}
   🎣 useAdminSettings: Datos recibidos: {...}
   ```

4. **Cambia un valor** (ej: Médicos de 15% a 25%)

5. **Haz clic en "Guardar Cambios"**

6. **Busca estos logs:**
   ```
   💾 useAdminSettings: Guardando settings: {...}
   🟢 updateAdminSettingsUseCase: Enviando al backend: {...}
   🌐 updateAdminSettingsAPI: Haciendo PUT /admin/settings con: {...}
   🌐 updateAdminSettingsAPI: Respuesta recibida: {...}
   🌐 updateAdminSettingsAPI: Datos extraídos: {...}
   🟢 updateAdminSettingsUseCase: Respuesta del backend: {...}
   💾 useAdminSettings: Settings guardados exitosamente: {...}
   ```

7. **Refresca la página** (F5)

8. **Verifica los logs de carga nuevamente**

## 🎯 Qué Buscar

### Si el problema es del FRONTEND:
- ❌ No aparecen los logs 🌐 (no está llamando al backend)
- ❌ Los logs muestran valores del mock (15, 10, 12, 8, 10, 15)
- ❌ Error en la consola al hacer GET o PUT

### Si el problema es del BACKEND:
- ✅ Aparecen todos los logs 🌐
- ✅ El PUT se ejecuta correctamente
- ✅ El GET después de refrescar trae los valores viejos (no guardó en BD)

## 📸 Captura de Pantalla

Por favor, toma una captura de pantalla de la consola mostrando:
1. Los logs al cargar la página
2. Los logs al guardar
3. Los logs al refrescar

Esto me ayudará a identificar exactamente dónde está el problema.

## 🔧 Verificación Adicional

También verifica en la pestaña **Network** del navegador:

1. Busca la petición `GET /api/admin/settings`
   - ¿Qué responde? ¿Los valores del mock o del backend?

2. Busca la petición `PUT /api/admin/settings`
   - ¿Se envía correctamente?
   - ¿Qué responde el backend?

3. Después de refrescar, busca nuevamente `GET /api/admin/settings`
   - ¿Trae los valores que guardaste o los viejos?

---

**Siguiente paso:** Ejecuta estos pasos y comparte los logs de la consola.
