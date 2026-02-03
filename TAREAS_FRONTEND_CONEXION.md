# ✅ Tareas del Frontend para Conectar Backend

## 🎯 Resumen

**Buenas noticias:** La mayoría del trabajo ya está hecho! 🎉

El frontend ya tiene las APIs definidas y listas. Solo necesitas hacer cambios **MÍNIMOS** cuando el backend esté listo.

---

## 📊 Estado Actual del Frontend

### ✅ APIs que YA están listas (no necesitas tocar)
- ✅ **Médico Asociado a Clínica** - `clinic-associated.api.ts` - **100% listo**
- ✅ **Mensajería Clínica** - `clinic-reception-messages.api.ts` - **100% listo**
- ✅ **Home** - `home.api.ts` - **100% listo** (tiene fallback)

### 🔧 APIs que necesitan cambios mínimos
- 🔧 **Insumos** - `supply.api.ts` - Descomentar código
- 🔧 **Laboratorios** - `laboratories.repository.ts` - Descomentar código
- 🔧 **Ambulancias** - Crear archivos API (no existen)

---

## 🔴 FASE 1: Médico Asociado + Mensajería (NO REQUIERE CAMBIOS)

### ✅ Médico Asociado a Clínica
**Archivo:** `src/features/doctor-panel/infrastructure/clinic-associated.api.ts`

**Estado:** ✅ **100% LISTO - No necesitas hacer nada**

El archivo ya tiene:
- ✅ Todas las llamadas a `httpClient` implementadas
- ✅ Manejo de errores correcto
- ✅ Tipos TypeScript definidos
- ✅ Uso de `extractData()` para parsear respuestas

**Endpoints listos:**
```typescript
✅ getClinicInfoAPI()
✅ getClinicAssociatedProfileAPI()
✅ updateClinicAssociatedProfileAPI()
✅ getReceptionMessagesAPI()
✅ sendReceptionMessageAPI()
✅ markMessagesAsReadAPI()
✅ getDateBlockRequestsAPI()
✅ requestDateBlockAPI()
✅ getClinicAssociatedAppointmentsAPI()
✅ updateClinicAppointmentStatusAPI()
```

**Acción requerida:** ❌ NINGUNA - Solo esperar que backend implemente

---

### ✅ Mensajería Clínica-Recepción
**Archivo:** `src/features/clinic-panel/infrastructure/clinic-reception-messages.api.ts`

**Estado:** ✅ **100% LISTO - No necesitas hacer nada**

**Acción requerida:** ❌ NINGUNA - Solo esperar que backend implemente

---

## 🟡 FASE 2: Insumos + Laboratorios (CAMBIOS MÍNIMOS)

### 🔧 Insumos Médicos
**Archivo:** `src/features/supplies-panel/infrastructure/supply.api.ts`

**Estado:** 🔧 Necesita descomentar código

**Cambios necesarios:**

#### 1. Importar httpClient
```typescript
// AGREGAR al inicio del archivo:
import { httpClient, extractData } from '../../../shared/lib/http';
```

#### 2. Reemplazar `getSuppliesAPI`
```typescript
// ANTES (mock):
export const getSuppliesAPI = async (): Promise<SupplyStore[]> => {
  return suppliesMock;
};

// DESPUÉS (API real):
export const getSuppliesAPI = async (): Promise<SupplyStore[]> => {
  const response = await httpClient.get<{ success: boolean; data: SupplyStore[] }>(
    '/supplies'
  );
  return extractData(response);
};
```

#### 3. Reemplazar `getSupplyAPI`
```typescript
// ANTES (mock):
export const getSupplyAPI = async (id: string): Promise<SupplyStore> => {
  const supply = suppliesMock.find(s => s.id === id);
  if (!supply) {
    throw new Error('Tienda de insumos no encontrada');
  }
  return supply;
};

// DESPUÉS (API real):
export const getSupplyAPI = async (id: string): Promise<SupplyStore> => {
  const response = await httpClient.get<{ success: boolean; data: SupplyStore }>(
    `/supplies/${id}`
  );
  return extractData(response);
};
```

#### 4. Reemplazar `getSupplyReviewsAPI`
```typescript
// ANTES (mock con localStorage):
export const getSupplyReviewsAPI = async (supplyStoreId: string): Promise<Review[]> => {
  const storedReviews = localStorage.getItem(`supply-reviews_${supplyStoreId}`);
  if (storedReviews) {
    return JSON.parse(storedReviews);
  }
  return [];
};

// DESPUÉS (API real):
export const getSupplyReviewsAPI = async (supplyStoreId: string): Promise<Review[]> => {
  const response = await httpClient.get<{ success: boolean; data: Review[] }>(
    `/supplies/${supplyStoreId}/reviews`
  );
  return extractData(response);
};
```

#### 5. Reemplazar `createReviewAPI`
```typescript
// ANTES (mock con localStorage):
export const createReviewAPI = async (params: { supplyStoreId: string; rating: number; comment?: string }): Promise<Review> => {
  // ... código largo con localStorage ...
};

// DESPUÉS (API real):
export const createReviewAPI = async (params: { supplyStoreId: string; rating: number; comment?: string }): Promise<Review> => {
  const response = await httpClient.post<{ success: boolean; data: Review }>(
    `/supplies/${params.supplyStoreId}/reviews`,
    { rating: params.rating, comment: params.comment }
  );
  return extractData(response);
};
```

#### 6. Eliminar imports de mocks
```typescript
// ELIMINAR esta línea:
import { suppliesMock } from '../application/supplies.mock';
```

---

### 🔧 Laboratorios
**Archivo:** `src/features/laboratory-panel/infrastructure/laboratories.repository.ts`

**Estado:** 🔧 Necesita reemplazar mock

**Cambios necesarios:**

#### 1. Importar httpClient
```typescript
// AGREGAR al inicio del archivo:
import { httpClient, extractData } from '../../../shared/lib/http';
```

#### 2. Reemplazar `getLaboratoryDashboardAPI`
```typescript
// ANTES (mock con localStorage):
export const getLaboratoryDashboardAPI = async (_userId: string): Promise<LaboratoryDashboard> => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        try {
          const saved = localStorage.getItem(`laboratory-profile-${_userId}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            resolve(parsed);
          } else {
            resolve(mockLaboratoryDashboard);
          }
        } catch (error) {
          console.error('Error loading laboratory dashboard from localStorage:', error);
          resolve(mockLaboratoryDashboard);
        }
      }, 500);
    } catch (error) {
      console.error('Error in getLaboratoryDashboardAPI:', error);
      reject(error);
    }
  });
};

// DESPUÉS (API real):
export const getLaboratoryDashboardAPI = async (userId: string): Promise<LaboratoryDashboard> => {
  const response = await httpClient.get<{ success: boolean; data: LaboratoryDashboard }>(
    `/laboratories/${userId}/dashboard`
  );
  return extractData(response);
};
```

#### 3. Eliminar mock data
```typescript
// ELIMINAR todo el objeto mockLaboratoryDashboard (líneas 3-110 aprox)
```

---

## 🟢 FASE 3: Home + Ambulancias

### ✅ Home
**Archivo:** `src/features/home/infrastructure/home.api.ts`

**Estado:** ✅ **100% LISTO - No necesitas hacer nada**

Ya tiene:
- ✅ Llamadas a httpClient implementadas
- ✅ Fallback a mocks si el backend no responde
- ✅ Try-catch para manejo de errores

**Acción requerida:** ❌ NINGUNA - Ya funciona con fallback

---

### 🔧 Ambulancias
**Archivos:** `src/features/ambulance-panel/infrastructure/*.mock.ts`

**Estado:** 🔧 Necesita crear archivos API (actualmente solo hay mocks)

**Cambios necesarios:**

#### 1. Crear `ambulance.api.ts`
```typescript
// CREAR: src/features/ambulance-panel/infrastructure/ambulance.api.ts

import { httpClient, extractData } from '../../../shared/lib/http';
import type { AmbulanceProfile } from '../domain/ambulance-profile.entity';

/**
 * API: Obtener perfil de ambulancia
 * Endpoint: GET /api/ambulances/profile
 */
export const getAmbulanceProfileAPI = async (): Promise<AmbulanceProfile> => {
  const response = await httpClient.get<{ success: boolean; data: AmbulanceProfile }>(
    '/ambulances/profile'
  );
  return extractData(response);
};

/**
 * API: Actualizar perfil de ambulancia
 * Endpoint: PUT /api/ambulances/profile
 */
export const updateAmbulanceProfileAPI = async (
  profile: Partial<AmbulanceProfile>
): Promise<AmbulanceProfile> => {
  const response = await httpClient.put<{ success: boolean; data: AmbulanceProfile }>(
    '/ambulances/profile',
    profile
  );
  return extractData(response);
};
```

#### 2. Crear `ambulance-reviews.api.ts`
```typescript
// CREAR: src/features/ambulance-panel/infrastructure/ambulance-reviews.api.ts

import { httpClient, extractData } from '../../../shared/lib/http';
import type { Review } from '../domain/review.entity';

/**
 * API: Obtener reseñas de ambulancia
 * Endpoint: GET /api/ambulances/reviews
 */
export const getAmbulanceReviewsAPI = async (): Promise<Review[]> => {
  const response = await httpClient.get<{ success: boolean; data: Review[] }>(
    '/ambulances/reviews'
  );
  return extractData(response);
};
```

#### 3. Crear `ambulance-settings.api.ts`
```typescript
// CREAR: src/features/ambulance-panel/infrastructure/ambulance-settings.api.ts

import { httpClient, extractData } from '../../../shared/lib/http';
import type { AmbulanceSettings } from '../domain/ambulance-settings.entity';

/**
 * API: Obtener configuración de ambulancia
 * Endpoint: GET /api/ambulances/settings
 */
export const getAmbulanceSettingsAPI = async (): Promise<AmbulanceSettings> => {
  const response = await httpClient.get<{ success: boolean; data: AmbulanceSettings }>(
    '/ambulances/settings'
  );
  return extractData(response);
};

/**
 * API: Actualizar configuración de ambulancia
 * Endpoint: PUT /api/ambulances/settings
 */
export const updateAmbulanceSettingsAPI = async (
  settings: Partial<AmbulanceSettings>
): Promise<AmbulanceSettings> => {
  const response = await httpClient.put<{ success: boolean; data: AmbulanceSettings }>(
    '/ambulances/settings',
    settings
  );
  return extractData(response);
};
```

#### 4. Actualizar hooks para usar las nuevas APIs
Reemplazar imports de mocks por imports de APIs en los hooks correspondientes.

---

## 📋 Checklist de Tareas Frontend

### Fase 1: Crítico (NO REQUIERE CAMBIOS)
- [ ] ✅ Médico Asociado - **Ya está listo**
- [ ] ✅ Mensajería Clínica - **Ya está listo**

### Fase 2: Importante (CAMBIOS MÍNIMOS)
- [ ] 🔧 Insumos - Descomentar código en `supply.api.ts`
  - [ ] Importar `httpClient` y `extractData`
  - [ ] Reemplazar `getSuppliesAPI`
  - [ ] Reemplazar `getSupplyAPI`
  - [ ] Reemplazar `getSupplyReviewsAPI`
  - [ ] Reemplazar `createReviewAPI`
  - [ ] Eliminar import de `suppliesMock`
  
- [ ] 🔧 Laboratorios - Reemplazar mock en `laboratories.repository.ts`
  - [ ] Importar `httpClient` y `extractData`
  - [ ] Reemplazar `getLaboratoryDashboardAPI`
  - [ ] Eliminar `mockLaboratoryDashboard`

### Fase 3: Mejoras
- [ ] ✅ Home - **Ya está listo** (tiene fallback)

- [ ] 🔧 Ambulancias - Crear archivos API
  - [ ] Crear `ambulance.api.ts`
  - [ ] Crear `ambulance-reviews.api.ts`
  - [ ] Crear `ambulance-settings.api.ts`
  - [ ] Actualizar hooks para usar APIs

---

## 🚀 Flujo de Trabajo Recomendado

### Cuando Backend implemente Fase 1 (Crítico):
1. ✅ **NO hacer nada** - El código ya está listo
2. 🧪 Probar en el navegador
3. ✅ Verificar que no hay errores en consola
4. ✅ Marcar como completado

### Cuando Backend implemente Fase 2 (Importante):
1. 🔧 Abrir `supply.api.ts`
2. 🔧 Descomentar código (copiar/pegar del checklist arriba)
3. 🔧 Abrir `laboratories.repository.ts`
4. 🔧 Reemplazar función (copiar/pegar del checklist arriba)
5. 🧪 Probar en el navegador
6. ✅ Verificar que no hay errores en consola

### Cuando Backend implemente Fase 3 (Mejoras):
1. ✅ Home ya funciona - No hacer nada
2. 🔧 Crear archivos API para Ambulancias (copiar/pegar del checklist arriba)
3. 🔧 Actualizar hooks
4. 🧪 Probar en el navegador

---

## 🧪 Cómo Probar

### 1. Verificar que el backend está corriendo
```bash
# Probar endpoint con curl o Postman
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/doctors/clinic-info
```

### 2. Abrir el navegador
- Abrir DevTools (F12)
- Ir a la pestaña "Network"
- Filtrar por "XHR" o "Fetch"

### 3. Navegar a la página correspondiente
- Médico Asociado: `/doctor/dashboard?tab=clinic-profile`
- Insumos: `/supplies`
- Laboratorios: `/laboratory/dashboard`
- etc.

### 4. Verificar en Network
- ✅ Status: 200 OK
- ✅ Response: `{ success: true, data: {...} }`
- ❌ Si hay error: Ver mensaje en consola

---

## 📊 Resumen Visual

```
┌─────────────────────────────────────────────────────────┐
│ TRABAJO FRONTEND POR FASE                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Fase 1 (Crítico):                                       │
│ ├─ Médico Asociado:     ✅ 0 cambios (ya está listo)   │
│ └─ Mensajería Clínica:  ✅ 0 cambios (ya está listo)   │
│                                                         │
│ Fase 2 (Importante):                                    │
│ ├─ Insumos:             🔧 5 funciones (descomentar)   │
│ └─ Laboratorios:        🔧 1 función (reemplazar)      │
│                                                         │
│ Fase 3 (Mejoras):                                       │
│ ├─ Home:                ✅ 0 cambios (ya está listo)   │
│ └─ Ambulancias:         🔧 3 archivos (crear)          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Tips

1. **No toques nada hasta que backend esté listo** - El código ya funciona con mocks
2. **Prueba por fases** - No cambies todo de una vez
3. **Usa Git** - Haz commit antes de cada cambio
4. **Verifica en Network** - Asegúrate que las peticiones lleguen al backend
5. **Revisa la consola** - Los errores aparecerán ahí

---

## 📚 Archivos de Referencia

- **Análisis Completo:** `ANALISIS_APIS_FRONTEND.md`
- **Solicitud Backend:** `SOLICITUD_BACKEND_ENDPOINTS.md`
- **Checklist Backend:** `CHECKLIST_IMPLEMENTACION.md`

---

**Última actualización:** Enero 2025  
**Tiempo estimado:** 2-3 horas de trabajo frontend total
