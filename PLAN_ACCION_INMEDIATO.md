# 🎯 PLAN DE ACCIÓN INMEDIATO

**Fecha:** 9 de Febrero, 2026  
**Objetivo:** Continuar conectando endpoints mientras esperamos respuesta del backend

---

## 📊 SITUACIÓN ACTUAL

### ✅ Completado Hoy (FASE 1):
- Admin - Comisiones ✅
- Clínica - Pagos (4 use cases) ✅
- Doctor - Pagos (frontend listo) ✅

### ⏳ Esperando Backend:
- Doctor - Pagos (2 endpoints)
- Supplies - Productos y Órdenes (9 endpoints)

---

## 🎯 LO QUE PODEMOS HACER AHORA

### Opción 1: Limpiar Código (30 min)
Eliminar imports de mocks que ya no se usan:
- `clearClinicMocks` en DoctorsSection
- `clearAdsFromStorage` y `clearAdRequests` en AdRequestsPage

### Opción 2: Documentar Endpoints Faltantes (1 hora)
Crear specs detallados para backend:
- Laboratorios - Citas
- Diagnósticos - Historial
- Admin - Servicios activos

### Opción 3: Optimizar Componentes Existentes (1-2 horas)
Mejorar componentes que ya están conectados:
- Agregar paginación
- Mejorar filtros
- Optimizar performance

### Opción 4: Preparar Supplies (Anticipado) (2 horas)
Crear las APIs de supplies AHORA (aunque backend no esté listo):
- `products.api.ts`
- `orders.api.ts`
- Actualizar componentes
- Cuando backend esté listo, solo activar

---

## 💡 RECOMENDACIÓN

**Opción 4: Preparar Supplies (Anticipado)**

**Ventajas:**
- ✅ Frontend 100% listo cuando backend termine
- ✅ Podemos probar la estructura de datos
- ✅ Identificar problemas temprano
- ✅ Avanzar sin bloqueos

**Desventajas:**
- ⚠️ Si backend cambia estructura, hay que ajustar
- ⚠️ No podemos probar con datos reales aún

**Estrategia:**
1. Crear APIs con la estructura esperada
2. Actualizar componentes para usar APIs
3. Dejar comentado el código de mocks como fallback
4. Cuando backend esté listo, solo descomentar

---

## 📋 PLAN DETALLADO - OPCIÓN 4

### Paso 1: Crear products.api.ts (15 min)
```typescript
// src/features/supplies-panel/infrastructure/products.api.ts
export const getProductsAPI = async (): Promise<Product[]> => { ... }
export const getProductByIdAPI = async (id: string): Promise<Product> => { ... }
export const createProductAPI = async (product: Partial<Product>): Promise<Product> => { ... }
export const updateProductAPI = async (id: string, product: Partial<Product>): Promise<Product> => { ... }
export const deleteProductAPI = async (id: string): Promise<void> => { ... }
```

### Paso 2: Crear orders.api.ts (15 min)
```typescript
// src/features/supplies-panel/infrastructure/orders.api.ts
export const getOrdersAPI = async (): Promise<SupplyOrder[]> => { ... }
export const getOrderByIdAPI = async (id: string): Promise<SupplyOrder> => { ... }
export const createOrderAPI = async (order: Partial<SupplyOrder>): Promise<SupplyOrder> => { ... }
export const updateOrderStatusAPI = async (id: string, status: string): Promise<SupplyOrder> => { ... }
```

### Paso 3: Actualizar ProductsSection.tsx (30 min)
- Reemplazar `getProductsMock` por `getProductsAPI`
- Agregar loading y error states
- Mantener mock comentado como fallback

### Paso 4: Actualizar OrdersSection.tsx (30 min)
- Reemplazar `getOrdersMock` por `getOrdersAPI`
- Agregar loading y error states
- Mantener mock comentado como fallback

### Paso 5: Actualizar DashboardContent.tsx (15 min)
- Reemplazar `mockOrders` por `getOrdersAPI`
- Agregar loading state

### Paso 6: Documentar para Backend (15 min)
- Crear `SOLICITUD_BACKEND_SUPPLIES.md`
- Incluir estructura de datos
- Incluir ejemplos de request/response

**Tiempo Total:** ~2 horas

---

## 🚀 ALTERNATIVA RÁPIDA

Si prefieres algo más rápido, podemos hacer **Opción 1 + Opción 2**:

### Opción 1: Limpiar Código (30 min)
- Eliminar imports innecesarios
- Limpiar código comentado
- Optimizar imports

### Opción 2: Documentar (1 hora)
- Crear specs para laboratorios
- Crear specs para diagnósticos
- Crear specs para admin stats

**Tiempo Total:** ~1.5 horas

---

## ❓ ¿QUÉ PREFIERES?

1. **Opción 4:** Preparar Supplies anticipadamente (2 horas)
2. **Opción 1+2:** Limpiar y documentar (1.5 horas)
3. **Otra cosa:** Dime qué prefieres hacer

---

**Esperando tu decisión...** 🤔
