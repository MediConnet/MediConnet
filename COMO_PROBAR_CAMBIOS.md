# 🧪 CÓMO PROBAR LOS CAMBIOS

**Fecha:** 9 de Febrero, 2026  
**Cambios:** FASE 1 - Sistema de Pagos

---

## 🚀 INICIO RÁPIDO

### 1. Verificar que el Backend esté corriendo
```bash
# El backend debe estar en http://localhost:3000
# Verificar en el navegador:
http://localhost:3000/api/health
```

### 2. Iniciar el Frontend
```bash
npm run dev
# o
pnpm dev
```

### 3. Abrir en el navegador
```
http://localhost:5173
```

---

## 🔐 CREDENCIALES DE PRUEBA

### Admin
```
Email: admin@medicones.com
Password: admin123
```

### Clínica
```
Email: clinica@medicones.com
Password: clinica123
```

### Doctor
```
Email: doctor@medicones.com
Password: doctor123
```

---

## ✅ PRUEBAS POR MÓDULO

### 1. ADMIN - Comisiones

**Ruta:** `/admin/commissions`

**Qué probar:**
1. ✅ La página carga sin errores
2. ✅ Muestra un spinner mientras carga
3. ✅ Muestra datos reales de la base de datos
4. ✅ Los totales se calculan correctamente
5. ✅ La tabla muestra comisiones por mes
6. ✅ Si hay error, muestra un mensaje de error

**Pasos:**
```
1. Login como admin
2. Ir a "Comisiones" en el menú
3. Verificar que aparezca el spinner
4. Verificar que carguen datos reales
5. Verificar que los totales sean correctos
```

**Datos esperados:**
- Porcentaje de comisión: 15%
- Total de comisiones: $XXX (de la BD)
- Total procesado: $XXX (de la BD)
- Tabla con comisiones por mes

**Errores comunes:**
- ❌ "Error al cargar pagos" → Backend no está corriendo
- ❌ "Token inválido" → Sesión expirada, hacer login de nuevo
- ❌ Página en blanco → Revisar consola del navegador

---

### 2. CLÍNICA - Pagos

**Ruta:** `/clinic/dashboard` → Sección "Gestión de Pagos"

**Qué probar:**
1. ✅ La sección carga sin errores
2. ✅ Muestra pagos recibidos del administrador
3. ✅ Muestra pagos pendientes a médicos
4. ✅ Puede distribuir un pago entre médicos
5. ✅ Puede marcar un pago a médico como pagado

**Pasos:**
```
1. Login como clínica
2. Ir al Dashboard
3. Scroll hasta "Gestión de Pagos"
4. Verificar que carguen los pagos recibidos
5. Verificar que carguen los pagos a médicos
6. Hacer clic en "Distribuir" en un pago
7. Asignar montos a médicos
8. Guardar distribución
9. Hacer clic en "Pagar" en un pago a médico
10. Verificar que cambie a "Pagado"
```

**Datos esperados:**
- Total recibido: $XXX
- Pendiente: $XXX
- Pagado: $XXX
- Lista de pagos con fechas y montos
- Lista de pagos a médicos

**Errores comunes:**
- ❌ "Error al cargar pagos" → Backend no está corriendo
- ❌ "Error al distribuir pago" → Verificar que los montos sean correctos
- ❌ No aparecen pagos → Puede que no haya pagos en la BD

---

### 3. DOCTOR - Pagos

**Ruta:** `/doctor/dashboard` → Sección "Pagos e Ingresos"

**⚠️ IMPORTANTE:** Este módulo requiere que el backend implemente los endpoints:
- `GET /api/doctors/payments`
- `GET /api/doctors/payments/:id`

**Estado Actual:**
- ✅ Frontend: 100% listo
- ⏳ Backend: Pendiente de implementación

**Qué probar (cuando backend esté listo):**
1. ✅ La sección carga sin errores
2. ✅ Muestra un spinner mientras carga
3. ✅ Muestra pagos del doctor (pendientes y pagados)
4. ✅ Muestra datos bancarios del doctor
5. ✅ Puede editar datos bancarios
6. ✅ Puede filtrar por estado (pendiente/pagado)
7. ✅ Puede buscar por paciente o fecha

**Pasos (cuando backend esté listo):**
```
1. Login como doctor
2. Ir al Dashboard
3. Scroll hasta "Pagos e Ingresos"
4. Verificar que aparezca el spinner
5. Verificar que carguen los pagos
6. Verificar totales (cobrado, comisión, neto)
7. Hacer clic en "Editar" datos bancarios
8. Cambiar banco o cuenta
9. Guardar cambios
10. Filtrar por "Pendientes"
11. Buscar por nombre de paciente
```

**Datos esperados:**
- Total cobrado: $XXX
- Comisión (15%): $XXX
- Total neto: $XXX
- Lista de pagos con pacientes y fechas
- Datos bancarios del doctor

**Errores esperados (mientras backend no esté listo):**
```
❌ "Error al cargar pagos"
Mensaje: "Cannot GET /api/doctors/payments"
```

**Solución temporal:**
El componente mostrará un mensaje de error hasta que el backend implemente los endpoints.

---

## 🐛 DEBUGGING

### Abrir DevTools
```
F12 o Ctrl+Shift+I (Windows/Linux)
Cmd+Option+I (Mac)
```

### Ver Requests de Red
```
1. Abrir DevTools
2. Ir a la pestaña "Network"
3. Recargar la página
4. Ver los requests a /api/*
```

### Ver Errores en Consola
```
1. Abrir DevTools
2. Ir a la pestaña "Console"
3. Ver errores en rojo
```

### Verificar Token JWT
```
1. Abrir DevTools
2. Ir a "Application" → "Local Storage"
3. Buscar "accessToken" o "auth-token"
4. Copiar el token
5. Ir a https://jwt.io
6. Pegar el token para ver su contenido
```

---

## 🔍 VERIFICAR REQUESTS

### Request Exitoso
```
Status: 200 OK
Response:
{
  "success": true,
  "data": [...]
}
```

### Request con Error
```
Status: 401 Unauthorized
Response:
{
  "success": false,
  "message": "Token inválido o expirado"
}
```

### Request Pendiente (Backend no implementado)
```
Status: 404 Not Found
Response:
{
  "success": false,
  "message": "Cannot GET /api/doctors/payments"
}
```

---

## 📊 CHECKLIST DE PRUEBAS

### Admin - Comisiones
- [ ] Página carga sin errores
- [ ] Muestra spinner mientras carga
- [ ] Muestra datos reales
- [ ] Totales son correctos
- [ ] Tabla muestra comisiones por mes
- [ ] Maneja errores correctamente

### Clínica - Pagos
- [ ] Sección carga sin errores
- [ ] Muestra pagos recibidos
- [ ] Muestra pagos a médicos
- [ ] Puede distribuir pagos
- [ ] Puede marcar como pagado
- [ ] Totales son correctos

### Doctor - Pagos (cuando backend esté listo)
- [ ] Sección carga sin errores
- [ ] Muestra spinner mientras carga
- [ ] Muestra pagos del doctor
- [ ] Muestra datos bancarios
- [ ] Puede editar datos bancarios
- [ ] Puede filtrar por estado
- [ ] Puede buscar pagos
- [ ] Totales son correctos

---

## 🚨 PROBLEMAS COMUNES

### 1. "Error al cargar pagos"
**Causa:** Backend no está corriendo o no responde  
**Solución:**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000/api/health

# Si no responde, iniciar el backend
cd ../backend
npm run dev
```

### 2. "Token inválido o expirado"
**Causa:** Sesión expirada  
**Solución:**
```
1. Hacer logout
2. Hacer login de nuevo
3. Intentar de nuevo
```

### 3. "Cannot GET /api/doctors/payments"
**Causa:** Backend no tiene implementado el endpoint  
**Solución:**
```
Esto es esperado para los endpoints de doctor.
El backend debe implementarlos según:
SOLICITUD_BACKEND_DOCTOR_PAYMENTS.md
```

### 4. Página en blanco
**Causa:** Error de JavaScript  
**Solución:**
```
1. Abrir DevTools (F12)
2. Ver errores en Console
3. Reportar el error con el stack trace
```

### 5. CORS Error
**Causa:** Backend no permite requests desde el frontend  
**Solución:**
```
Verificar que el backend tenga CORS habilitado:
app.use(cors({ origin: 'http://localhost:5173' }))
```

---

## 📝 REPORTAR BUGS

Si encuentras un bug, reporta con:

1. **Descripción:** Qué estabas haciendo
2. **Pasos para reproducir:** Cómo llegaste al error
3. **Error esperado:** Qué esperabas que pasara
4. **Error actual:** Qué pasó realmente
5. **Screenshots:** Captura de pantalla del error
6. **Console:** Errores en la consola del navegador
7. **Network:** Requests fallidos en la pestaña Network

**Ejemplo:**
```
Descripción: Error al distribuir pago en clínica

Pasos:
1. Login como clínica
2. Ir a Dashboard
3. Hacer clic en "Distribuir" en un pago
4. Asignar $100 a Dr. Juan
5. Hacer clic en "Guardar"

Error esperado: Pago distribuido correctamente

Error actual: "Error al distribuir pago"

Console:
Error: Cannot POST /api/clinics/payments/123/distribute
Status: 404

Network:
POST /api/clinics/payments/123/distribute
Status: 404 Not Found
```

---

## ✅ PRUEBAS EXITOSAS

Si todas las pruebas pasan:

```
✅ Admin - Comisiones funcionando
✅ Clínica - Pagos funcionando
⏳ Doctor - Pagos esperando backend

FASE 1: COMPLETADA 🎉
```

---

**Generado:** 9 de Febrero, 2026  
**Próxima actualización:** Después de implementar endpoints de doctor
