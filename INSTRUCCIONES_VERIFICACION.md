# 🧪 Instrucciones de Verificación - Panel Admin

## Guía paso a paso para verificar las correcciones

---

## 📋 Pre-requisitos

1. ✅ Servidor backend corriendo
2. ✅ Frontend corriendo (`npm run dev` o similar)
3. ✅ Navegador con DevTools abierto (F12)
4. ✅ Usuario admin con permisos completos

---

## 🔍 Verificación 1: Solicitudes de Anuncios

### Paso 1: Acceder a la página
```
1. Iniciar sesión como admin
2. Navegar a: Panel Admin → Solicitudes de Anuncios
3. URL esperada: /admin/ad-requests
```

### Paso 2: Verificar filtro inicial
```
✅ El filtro de estado debe mostrar "Todos" por defecto
✅ La tabla debe mostrar solicitudes de todos los estados:
   - PENDING (Pendiente)
   - APPROVED (Aprobado)
   - REJECTED (Rechazado)
```

### Paso 3: Verificar consola
```
1. Abrir DevTools → Console (F12)
2. Buscar logs con emojis:
   🔍 getAdRequestsAPI - Params
   🔍 getAdRequestsAPI - Response
   🔍 getAdRequestsAPI - Extracted data
   ✅ getAdRequestsAPI - Final result

3. Verificar que NO haya errores rojos
4. Verificar que el array de datos tenga elementos
```

### Paso 4: Probar filtros
```
1. Cambiar filtro a "Pendiente"
   ✅ Solo debe mostrar solicitudes PENDING

2. Cambiar filtro a "Aprobado"
   ✅ Solo debe mostrar solicitudes APPROVED

3. Cambiar filtro a "Rechazado"
   ✅ Solo debe mostrar solicitudes REJECTED

4. Cambiar filtro a "Todos"
   ✅ Debe mostrar todas las solicitudes
```

### Paso 5: Probar búsqueda
```
1. Escribir nombre de proveedor en búsqueda
   ✅ Debe filtrar resultados

2. Escribir email en búsqueda
   ✅ Debe filtrar resultados

3. Borrar búsqueda
   ✅ Debe mostrar todos los resultados del filtro actual
```

### Paso 6: Probar paginación
```
1. Cambiar a página 2
   ✅ Debe cargar nuevos datos

2. Cambiar tamaño de página (10 → 20)
   ✅ Debe mostrar más resultados por página

3. Verificar contador de total
   ✅ Debe mostrar el total correcto
```

---

## 🔍 Verificación 2: Servicios Activos

### Paso 1: Acceder a la página
```
1. Navegar a: Panel Admin → Dashboard / Servicios
2. URL esperada: /admin/services o /admin/dashboard
```

### Paso 2: Verificar carga de servicios
```
✅ Debe mostrar tarjetas de estadísticas:
   - Médico
   - Farmacia
   - Laboratorio
   - Ambulancia
   - Insumos Médicos

✅ Debe mostrar lista de "Servicios Activos"
✅ Cada servicio debe tener:
   - Icono del tipo de servicio
   - Nombre del proveedor
   - Ubicación
   - Badge "Activo"
```

### Paso 3: Verificar consola
```
1. Buscar logs:
   🔄 Cargando servicios activos...
   🔍 getActiveServicesAPI - Respuesta completa
   🔍 getActiveServicesAPI - Datos extraídos
   🔍 getActiveServicesAPI - Array de servicios
   ✅ Servicios activos cargados

2. Verificar que NO haya:
   ❌ Error al cargar servicios activos
   ❌ data.map is not a function
```

### Paso 4: Verificar estados
```
Si hay servicios:
✅ Debe mostrar lista con servicios

Si NO hay servicios:
✅ Debe mostrar mensaje:
   "No hay servicios activos"
   "Los servicios aprobados aparecerán aquí"

Si hay error:
✅ Debe mostrar mensaje de error con opción de reintentar
```

---

## 🔍 Verificación 3: Historial de Solicitudes

### Paso 1: Acceder a la página
```
1. Navegar a: Panel Admin → Historial
2. URL esperada: /admin/history
```

### Paso 2: Verificar pestañas
```
✅ Debe haber 2 pestañas:
   - Solicitudes de Proveedores
   - Solicitudes de Anuncios
```

### Paso 3: Verificar filtros
```
1. Verificar filtro de estado:
   - Todos
   - Aprobados
   - Rechazados
   - Pendientes

2. Verificar búsqueda funciona

3. Verificar estadísticas:
   ✅ Total de aprobados
   ✅ Total de rechazados
   ✅ Total de pendientes
   ✅ Total general
```

### Paso 4: Verificar consola
```
1. Buscar logs:
   🔍 getProviderHistoryAPI - Params
   🔍 getProviderHistoryAPI - Response
   ✅ getProviderHistoryAPI - Final result

2. Verificar que NO haya:
   ❌ TextField is not defined
   ❌ Errores de imports
```

---

## 🔍 Verificación 4: Manejo de Errores

### Paso 1: Simular error de red
```
1. Abrir DevTools → Network
2. Activar "Offline" mode
3. Recargar página
4. Verificar que:
   ✅ No hay pantalla blanca
   ✅ Se muestra mensaje de error amigable
   ✅ Hay opción de reintentar
```

### Paso 2: Verificar ErrorBoundary
```
1. Si hay un error de React:
   ✅ ErrorBoundary debe capturarlo
   ✅ Debe mostrar UI de error
   ✅ Debe tener botón "Intentar de nuevo"
   ✅ Debe tener botón "Recargar página"
```

---

## 🔍 Verificación 5: Responsive Design

### Paso 1: Desktop (1920x1080)
```
✅ Tabla debe verse completa
✅ No debe haber scroll horizontal en la página
✅ Scroll horizontal solo dentro de la tabla si es necesario
```

### Paso 2: Tablet (768x1024)
```
✅ Tabla debe adaptarse
✅ Filtros deben reorganizarse
✅ Todo debe ser usable
```

### Paso 3: Mobile (375x667)
```
✅ Tabla debe tener scroll horizontal interno
✅ Filtros deben apilarse verticalmente
✅ Botones deben ser táctiles
```

---

## ✅ Checklist de Verificación Completa

### Solicitudes de Anuncios
- [ ] Filtro inicial en "Todos"
- [ ] Todas las solicitudes visibles
- [ ] Filtros funcionan correctamente
- [ ] Búsqueda funciona
- [ ] Paginación funciona
- [ ] Sin errores en consola
- [ ] Logs de debugging visibles

### Servicios Activos
- [ ] Servicios se cargan correctamente
- [ ] Lista muestra todos los servicios aprobados
- [ ] Estado vacío funciona
- [ ] Estado de error funciona
- [ ] Sin error "data.map is not a function"
- [ ] Logs de debugging visibles

### Historial
- [ ] Ambas pestañas funcionan
- [ ] Filtros funcionan
- [ ] Búsqueda funciona
- [ ] Estadísticas correctas
- [ ] Sin error "TextField is not defined"
- [ ] Logs de debugging visibles

### Manejo de Errores
- [ ] ErrorBoundary captura errores
- [ ] Mensajes de error amigables
- [ ] Opciones de reintentar
- [ ] No hay pantallas blancas

### Responsive
- [ ] Desktop funciona correctamente
- [ ] Tablet funciona correctamente
- [ ] Mobile funciona correctamente
- [ ] Sin scroll horizontal global

---

## 🐛 Problemas Comunes y Soluciones

### Problema: "No se muestran solicitudes"
```
Solución:
1. Verificar que el backend esté corriendo
2. Verificar en Network tab que la petición se haga
3. Verificar la respuesta del backend
4. Revisar logs en consola
```

### Problema: "Error 401 Unauthorized"
```
Solución:
1. Verificar que estés logueado como admin
2. Verificar token en localStorage
3. Reloguear si es necesario
```

### Problema: "Filtros no funcionan"
```
Solución:
1. Verificar en Network tab los query params
2. Verificar que el backend soporte los filtros
3. Revisar logs de debugging
```

### Problema: "Paginación no funciona"
```
Solución:
1. Verificar que el backend devuelva pagination object
2. Verificar estructura de respuesta en logs
3. Verificar que total sea correcto
```

---

## 📸 Screenshots Esperados

### Solicitudes de Anuncios - Vista Normal
```
┌─────────────────────────────────────────────────┐
│ Solicitudes de Anuncios                         │
│ Gestiona las solicitudes de permisos...        │
│                                                 │
│ [Buscar...] [Estado: Todos ▼] [Limpiar Todo]  │
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ Proveedor │ Tipo │ Fecha │ Estado │ Acciones││
│ ├─────────────────────────────────────────────┤│
│ │ Dr. Juan  │ 🏥   │ 01/05 │ ⏳     │ [Ver]   ││
│ │ Farmacia  │ 💊   │ 02/05 │ ✅     │ [Ver]   ││
│ │ Lab XYZ   │ 🔬   │ 03/05 │ ❌     │ [Ver]   ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ Mostrando 1-10 de 50 [< 1 2 3 4 5 >]          │
└─────────────────────────────────────────────────┘
```

### Servicios Activos - Vista Normal
```
┌─────────────────────────────────────────────────┐
│ Servicios Activos                               │
│ Lista de todos los servicios aprobados          │
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ 🏥 Dr. Juan Pérez                           ││
│ │    Quito, Ecuador              [Activo]     ││
│ ├─────────────────────────────────────────────┤│
│ │ 💊 Farmacia Cruz Azul                       ││
│ │    Guayaquil, Ecuador          [Activo]     ││
│ ├─────────────────────────────────────────────┤│
│ │ 🔬 Laboratorio Clínico ABC                  ││
│ │    Cuenca, Ecuador             [Activo]     ││
│ └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

---

## 📞 Soporte

Si encuentras algún problema durante la verificación:

1. **Captura de pantalla** del error
2. **Logs de consola** completos
3. **Pasos para reproducir** el problema
4. **Navegador y versión** utilizada

Enviar toda la información al equipo de desarrollo.

---

## ✅ Firma de Verificación

Una vez completada la verificación, llenar:

```
Verificado por: _______________________
Fecha: _______________________
Navegador: _______________________
Resultado: [ ] ✅ Aprobado  [ ] ❌ Rechazado

Comentarios:
_________________________________________
_________________________________________
_________________________________________
```

---

**Última actualización:** 29 de Mayo, 2026  
**Versión:** 1.0
