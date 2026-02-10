# 🐛 FIX CRÍTICO: Ambulancia Usaba Mock en Vez del Backend

## Fecha: 10 de febrero de 2026

---

## 🎯 PROBLEMA REAL IDENTIFICADO

**Síntoma**: Al registrar una nueva ambulancia e iniciar sesión, el sistema mostraba los datos de "Ambulancias VidaRápida" (datos hardcodeados).

**Causa Real**: El `getAmbulanceProfileUseCase` estaba usando el **MOCK** en lugar del API real del backend.

---

## 🔍 DIAGNÓSTICO

### Archivo Problemático
`src/features/ambulance-panel/application/get-ambulance-profile.usecase.ts`

### Código Incorrecto (ANTES)
```typescript
import type { AmbulanceProfile } from "../domain/ambulance-profile.entity";
import { getAmbulanceProfileMock } from "../infrastructure/ambulance.mock";

export const getAmbulanceProfileUseCase = async (): Promise<AmbulanceProfile> => {
  return await getAmbulanceProfileMock();  // ❌ Siempre devuelve datos hardcodeados
};
```

### Mock Hardcodeado
```typescript
export const MOCK_AMBULANCE_PROFILE: AmbulanceProfile = {
  id: "amb-123",
  commercialName: "Ambulancias VidaRápida",  // ← Siempre estos datos
  email: "ambulancia@medicones.com",
  whatsapp: "0998765432",
  // ... más datos hardcodeados
};
```

---

## ✅ SOLUCIÓN IMPLEMENTADA

### Código Correcto (DESPUÉS)
```typescript
import type { AmbulanceProfile } from "../domain/ambulance-profile.entity";
import { getAmbulanceProfileAPI } from "../infrastructure/ambulance.api";

export const getAmbulanceProfileUseCase = async (): Promise<AmbulanceProfile> => {
  console.log("🔍 [AMBULANCE] Obteniendo perfil de ambulancia desde el backend...");
  const profile = await getAmbulanceProfileAPI();
  console.log("🔍 [AMBULANCE] Perfil recibido:", profile);
  return profile;
};
```

### API Real
```typescript
export const getAmbulanceProfileAPI = async (): Promise<AmbulanceProfile> => {
  const response = await httpClient.get<{ success: boolean; data: AmbulanceProfile }>(
    '/ambulances/profile'  // ← Usa el token JWT para obtener el perfil correcto
  );
  return extractData(response);
};
```

---

## 🔄 FLUJO CORRECTO AHORA

1. **Usuario inicia sesión** → Backend genera token JWT con `userId` correcto
2. **Frontend guarda el token** en localStorage y Zustand store
3. **Usuario navega al dashboard** → Se llama `getAmbulanceProfileUseCase()`
4. **Use case llama al API** → `GET /api/ambulances/profile` con Bearer token
5. **Backend usa el token** → Busca el provider por `user_id` del token
6. **Backend devuelve el perfil correcto** → Del usuario que inició sesión
7. **Frontend muestra los datos correctos** → De la ambulancia del usuario

---

## 📊 COMPARACIÓN: ANTES vs DESPUÉS

### ANTES (Con Mock)
```
Usuario inicia sesión → Token correcto ✅
Frontend llama getAmbulanceProfileUseCase() → Devuelve MOCK ❌
Dashboard muestra "Ambulancias VidaRápida" ❌
```

### DESPUÉS (Con API Real)
```
Usuario inicia sesión → Token correcto ✅
Frontend llama getAmbulanceProfileUseCase() → Llama al backend ✅
Backend usa el token para buscar el provider correcto ✅
Dashboard muestra los datos del usuario que inició sesión ✅
```

---

## 🎯 POR QUÉ PASÓ ESTO

El use case probablemente se creó inicialmente con el mock para desarrollo, y nunca se actualizó para usar el API real cuando el backend estuvo listo.

---

## ✅ VERIFICACIÓN

### Cómo Probar

1. **Limpiar localStorage**:
   ```javascript
   localStorage.clear()
   ```

2. **Registrar nueva ambulancia** con datos únicos

3. **Admin aprueba** la solicitud

4. **Iniciar sesión** con la nueva ambulancia

5. **Abrir consola** (F12) y verificar los logs:
   ```
   🔍 [AMBULANCE] Obteniendo perfil de ambulancia desde el backend...
   🔍 [AMBULANCE] Perfil recibido: { id: '...', commercialName: 'TU_AMBULANCIA', ... }
   ```

6. **Verificar el dashboard** → Debe mostrar TUS datos, no "Ambulancias VidaRápida"

---

## 📝 LOGS AGREGADOS

### En LoginPage.tsx
```javascript
console.log("🔍 [LOGIN] Respuesta completa del backend:", response);
console.log("🔍 [LOGIN] User recibido:", user);
console.log("🔍 [LOGIN] Token recibido:", token?.substring(0, 30) + "...");
console.log("✅ Login Exitoso:", {
  role: roleForStore,
  tipo: tipoForStore,
  userId: user.userId,
  email: user.email,
});
```

### En get-ambulance-profile.usecase.ts
```javascript
console.log("🔍 [AMBULANCE] Obteniendo perfil de ambulancia desde el backend...");
console.log("🔍 [AMBULANCE] Perfil recibido:", profile);
```

---

## 🚨 IMPORTANTE

Este mismo problema puede existir en otros paneles. Verificar que todos los use cases usen el API real y no mocks:

### Paneles a Verificar

- [ ] **Farmacia**: `get-pharmacy-profile.usecase.ts`
- [ ] **Laboratorio**: `get-laboratory-dashboard.usecase.ts`
- [ ] **Insumos**: `get-supply-dashboard.usecase.ts`
- [ ] **Clínica**: `get-clinic-profile.usecase.ts`
- [ ] **Doctor**: `get-doctor-dashboard.usecase.ts`

### Patrón a Buscar

❌ **INCORRECTO**:
```typescript
import { getSomethingMock } from "../infrastructure/something.mock";
return await getSomethingMock();
```

✅ **CORRECTO**:
```typescript
import { getSomethingAPI } from "../infrastructure/something.api";
return await getSomethingAPI();
```

---

## 📊 ARCHIVOS MODIFICADOS

1. `src/features/ambulance-panel/application/get-ambulance-profile.usecase.ts` (cambiado de mock a API)
2. `src/features/auth/presentation/pages/LoginPage.tsx` (logs agregados)

---

## ✅ RESULTADO

- ✅ Build exitoso
- ✅ Ambulancia ahora usa el API real
- ✅ Cada usuario ve sus propios datos
- ✅ Logs agregados para depuración

---

**Estado**: ✅ RESUELTO
**Build**: ✅ EXITOSO
**Próximo paso**: Verificar otros paneles para el mismo problema
