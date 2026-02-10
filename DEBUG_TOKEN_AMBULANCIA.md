# 🔍 DEBUG - Problema de Token en Ambulancia

## Fecha: 10 de febrero de 2026

---

## 🐛 PROBLEMA REPORTADO

**Síntoma**: Al registrarse como nueva ambulancia e iniciar sesión, el sistema muestra los datos de OTRA ambulancia.

**Diagnóstico del Backend**: El backend está correcto. El endpoint `GET /api/ambulances/profile` busca el provider usando el `user_id` del token JWT que el frontend envía.

**Conclusión**: El token que el frontend está guardando/enviando es incorrecto.

---

## ✅ LOGS DE DEPURACIÓN AGREGADOS

He agregado logs de depuración en puntos clave para identificar el problema:

### 1. **LoginPage.tsx** - Después del Login

Cuando el usuario inicia sesión, ahora se imprimirá en consola:

```javascript
🔍 [DEBUG] Token recibido del backend: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔍 [DEBUG] User ID: uuid-del-usuario
🔍 [DEBUG] Token guardado en localStorage: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔍 [DEBUG] Estado de auth después del login: {
  user: { id: '...', email: '...', role: '...', tipo: '...' },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

### 2. **http.ts** - Antes de Enviar Request

Cuando se hace una petición a `/ambulances/profile`, se imprimirá:

```javascript
🔍 [HTTP] Request a: /ambulances/profile
🔍 [HTTP] Token del store: eyJhbGciOiJIUzI1NiIsInR...
🔍 [HTTP] Token de localStorage: eyJhbGciOiJIUzI1NiIsInR...
🔍 [HTTP] Token que se enviará: eyJhbGciOiJIUzI1NiIsInR...
🔍 [HTTP] User ID del store: uuid-del-usuario
```

---

## 📋 PASOS PARA DEPURAR

### Paso 1: Limpiar Todo
```javascript
// En la consola del navegador (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Paso 2: Registrar Nueva Ambulancia
1. Ir a la página de registro
2. Seleccionar "Ambulancia"
3. Completar el formulario
4. Enviar registro

### Paso 3: Iniciar Sesión
1. Ir a la página de login
2. Ingresar email y contraseña de la ambulancia recién registrada
3. **ABRIR LA CONSOLA (F12)** antes de hacer clic en "Iniciar sesión"
4. Hacer clic en "Iniciar sesión"

### Paso 4: Revisar Logs en Consola

Buscar los logs que empiezan con `🔍 [DEBUG]`:

```
✅ Login Exitoso: { role: 'provider', tipo: 'ambulance' }
🔍 [DEBUG] Token recibido del backend: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔍 [DEBUG] User ID: abc-123-def-456
🔍 [DEBUG] Token guardado en localStorage: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔍 [DEBUG] Estado de auth después del login: {...}
```

### Paso 5: Verificar Token en JWT.io

1. Copiar el token de la consola (el que dice "Token recibido del backend")
2. Ir a https://jwt.io
3. Pegar el token en el campo "Encoded"
4. Verificar el payload (sección "Decoded"):

```json
{
  "userId": "abc-123-def-456",  // ← Debe ser el ID del usuario que se registró
  "email": "ambulancia@ejemplo.com",
  "role": "AMBULANCE",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Paso 6: Verificar Request al Backend

1. Ir a la pestaña "Network" en DevTools (F12)
2. Filtrar por "ambulances"
3. Buscar el request `GET /api/ambulances/profile`
4. Ver el header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Copiar ese token y verificarlo en jwt.io también

---

## 🔍 QUÉ VERIFICAR

### A. ¿El token del backend es correcto?

**Verificar en los logs:**
- `🔍 [DEBUG] Token recibido del backend`
- Decodificar en jwt.io
- Verificar que el `userId` sea el correcto

**Si el userId es incorrecto**: El problema está en el backend (generación del token)

### B. ¿El token se guarda correctamente?

**Verificar en los logs:**
- `🔍 [DEBUG] Token guardado en localStorage`
- Debe ser IGUAL al token recibido del backend

**Si son diferentes**: Hay un problema en el `auth.store.ts`

### C. ¿El token se envía correctamente?

**Verificar en los logs:**
- `🔍 [HTTP] Token que se enviará`
- Debe ser IGUAL al token guardado

**Si son diferentes**: Hay un problema en el `http.ts` interceptor

### D. ¿El User ID es correcto?

**Verificar en los logs:**
- `🔍 [DEBUG] User ID`
- `🔍 [HTTP] User ID del store`
- Deben ser iguales y corresponder al usuario que se registró

---

## 🎯 POSIBLES CAUSAS

### 1. Backend Genera Token Incorrecto
**Síntoma**: El `userId` en el token decodificado no corresponde al usuario que inició sesión

**Solución**: El backend debe verificar que está usando el ID correcto al generar el token:
```javascript
const token = jwt.sign(
  { 
    userId: user.id,  // ← Debe ser el ID del usuario que inició sesión
    email: user.email,
    role: user.role 
  },
  SECRET_KEY
);
```

### 2. Frontend Guarda Token Antiguo
**Síntoma**: El token guardado es diferente al token recibido

**Solución**: Ya está implementado correctamente en `auth.store.ts`, pero verificar que no haya código legacy que sobrescriba el token

### 3. Múltiples Tokens en LocalStorage
**Síntoma**: Hay varios tokens guardados con diferentes keys

**Solución**: Limpiar localStorage antes de cada login:
```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('auth-token');
localStorage.removeItem('token');
```

### 4. Token Expirado
**Síntoma**: El token es válido pero está expirado

**Solución**: Verificar el campo `exp` en jwt.io y comparar con la fecha actual

---

## 📊 CHECKLIST DE VERIFICACIÓN

- [ ] Limpiar localStorage y sessionStorage
- [ ] Registrar nueva ambulancia
- [ ] Iniciar sesión con la nueva ambulancia
- [ ] Verificar logs en consola (🔍 [DEBUG])
- [ ] Copiar token y decodificar en jwt.io
- [ ] Verificar que userId en token = ID del usuario registrado
- [ ] Verificar que token guardado = token recibido
- [ ] Verificar que token enviado = token guardado
- [ ] Verificar request en Network tab
- [ ] Verificar header Authorization en el request

---

## 📝 INFORMACIÓN PARA EL BACKEND

Si después de verificar todos los puntos anteriores, el problema persiste, enviar al backend:

```
🔍 INFORMACIÓN DE DEPURACIÓN:

1. Email usado para registro: _________________
2. Email usado para login: _________________
3. Token recibido del backend (primeros 50 caracteres): _________________
4. User ID en el token decodificado: _________________
5. User ID esperado (del registro): _________________
6. ¿Son iguales? [ ] Sí [ ] No

Si NO son iguales, el problema está en el backend.
Si SÍ son iguales, el problema está en el endpoint /api/ambulances/profile.
```

---

## 🚀 PRÓXIMOS PASOS

1. **Ejecutar el flujo de depuración** siguiendo los pasos anteriores
2. **Capturar screenshots** de los logs en consola
3. **Decodificar el token** en jwt.io y capturar screenshot
4. **Verificar el Network tab** y capturar screenshot del request
5. **Compartir la información** con el equipo de backend si el problema está en el token

---

**Archivos Modificados:**
- `src/features/auth/presentation/pages/LoginPage.tsx` (logs agregados)
- `src/shared/lib/http.ts` (logs agregados en interceptor)

**Build**: ✅ EXITOSO
**Logs**: ✅ AGREGADOS
**Listo para depurar**: ✅ SÍ
