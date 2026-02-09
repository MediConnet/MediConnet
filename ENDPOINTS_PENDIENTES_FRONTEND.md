# 🔴 ENDPOINTS PENDIENTES POR CONECTAR EN EL FRONTEND

**Fecha:** 9 de Febrero, 2026  
**Estado Actual:** 70% conectado, 30% usando mocks

---

## 📊 RESUMEN EJECUTIVO

El frontend tiene **26 endpoints pendientes** de conectar con el backend. Los archivos API ya están creados pero los **use cases y componentes siguen usando mocks**.

### Prioridad de Implementación:
1. **🔴 CRÍTICO** - Pagos (Admin, Clínica, Doctor)
2. **🟡 IMPORTANTE** - Productos e Inventario (Insumos)
3. **🟢 MEJORAS** - Reportes y Estadísticas

---

## 🔴 PRIORIDAD CRÍTICA - PAGOS

> **⚠️ IMPORTANTE:** Los pagos son **EXTERNOS** (transferencias bancarias). La web solo:
> - Muestra montos pendientes y datos bancarios
> - Permite marcar como "pagado" después de hacer la transferencia externa
> - **NO procesa pagos dentro de la plataforma**

### 1. ADMIN - Pagos a Clínicas y Médicos

**Archivos Afectados:**
- ✅ `src/features/admin-dashboard/infrastructure/admin-payments.api.ts` - **API CREADA**
- ✅ `src/features/admin-dashboard/presentation/pages/PaymentsPage.tsx` - **USA API** ✅
- ❌ `src/features/admin-dashboard/presentation/pages/CommissionsPage.tsx` - **USA MOCKS** ❌

**Endpoints Disponibles (YA IMPLEMENTADOS):**
```typescript
✅ GET /api/admin/payments/clinics - Lista pagos pendientes a clínicas
✅ GET /api/admin/payments/doctors - Lista pagos pendientes a médicos
✅ POST /api/admin/payments/doctors/:doctorId/mark-paid - Marca como pagado (después de transferencia)
✅ POST /api/admin/payments/clinics/:clinicPaymentId/mark-paid - Marca como pagado (después de transferencia)
✅ GET /api/admin/payments/history - Historial de pagos realizados
```

**Flujo de Pago:**
1. Admin ve lista de pagos pendientes con datos bancarios del médico/clínica
2. Admin hace transferencia bancaria **FUERA de la plataforma**
3. Admin marca el pago como "pagado" en la web (botón "Marcar como Pagado")
4. El sistema actualiza el estado a "paid"

**Problema:**
- `PaymentsPage.tsx` - **YA ESTÁ CONECTADO** ✅
- `CommissionsPage.tsx` - **SIGUE USANDO MOCK** ❌
  ```typescript
  // Línea 20
  import { getPaymentsMock } from "../../../doctor-panel/infrastructure/payments.mock";
  ```

**Solución:**
```typescript
// CommissionsPage.tsx - Cambiar de:
import { getPaymentsMock } from "../../../doctor-panel/infrastructure/payments.mock";
const [payments] = useState(getPaymentsMock());

// A:
import { getAdminDoctorPaymentsAPI } from "../../infrastructure/admin-payments.api";
const [payments, setPayments] = useState([]);
useEffect(() => {
  const loadPayments = async () => {
    const data = await getAdminDoctorPaymentsAPI();
    setPayments(data);
  };
  loadPayments();
}, []);
```

---

### 2. CLÍNICA - Gestión de Pagos

**Archivos Afectados:**
- ✅ `src/features/clinic-panel/infrastructure/clinic-payments.api.ts` - **API CREADA**
- ❌ `src/features/clinic-panel/application/get-clinic-payments.usecase.ts` - **USA MOCKS**
- ❌ `src/features/clinic-panel/application/get-clinic-to-doctor-payments.usecase.ts` - **USA MOCKS**
- ❌ `src/features/clinic-panel/application/distribute-payment.usecase.ts` - **USA MOCKS**
- ❌ `src/features/clinic-panel/application/pay-doctor.usecase.ts` - **USA MOCKS**

**Endpoints Disponibles (YA IMPLEMENTADOS):**
```typescript
✅ GET /api/clinics/payments - Pagos recibidos del admin
✅ GET /api/clinics/payments/:id - Detalle de un pago
✅ POST /api/clinics/payments/:id/distribute - Distribuir pago entre médicos
✅ GET /api/clinics/doctors/payments - Pagos pendientes a médicos
✅ POST /api/clinics/doctors/:doctorId/pay - Marcar pago a médico como realizado
✅ GET /api/clinics/payments/:id/distribution - Ver distribución de un pago
```

**Flujo de Pago:**
1. Clínica recibe pago del admin (marcado como "paid" por el admin)
2. Clínica distribuye el monto entre sus médicos (asigna cuánto le toca a cada uno)
3. Clínica hace transferencias bancarias **FUERA de la plataforma** a cada médico
4. Clínica marca cada pago como "pagado" en la web

**Problema:**
Los **use cases** tienen la API importada pero comentada:
```typescript
// get-clinic-payments.usecase.ts - Línea 2-3
import { getClinicPaymentsMock } from '../infrastructure/clinic-payments.mock';
// import { getClinicPaymentsAPI } from '../infrastructure/clinic-payments.api';

// Línea 9-10
// return await getClinicPaymentsAPI();
return getClinicPaymentsMock(clinicId);
```

**Solución:**
Descomentar las APIs en 4 archivos:

1. **get-clinic-payments.usecase.ts**
```typescript
import { getClinicPaymentsAPI } from '../infrastructure/clinic-payments.api';

export const getClinicPaymentsUseCase = async (clinicId: string): Promise<ClinicPayment[]> => {
  return await getClinicPaymentsAPI();
};
```

2. **get-clinic-to-doctor-payments.usecase.ts**
```typescript
import { getClinicToDoctorPaymentsAPI } from '../infrastructure/clinic-payments.api';

export const getClinicToDoctorPaymentsUseCase = async (clinicId: string): Promise<ClinicToDoctorPayment[]> => {
  return await getClinicToDoctorPaymentsAPI();
};
```

3. **distribute-payment.usecase.ts**
```typescript
import { distributePaymentAPI } from '../infrastructure/clinic-payments.api';

export const distributePaymentUseCase = async (
  paymentId: string,
  distribution: { doctorId: string; amount: number }[]
): Promise<PaymentDistribution> => {
  return await distributePaymentAPI(paymentId, distribution);
};
```

4. **pay-doctor.usecase.ts**
```typescript
import { payDoctorAPI } from '../infrastructure/clinic-payments.api';

export const payDoctorUseCase = async (doctorId: string, paymentId: string): Promise<ClinicToDoctorPayment> => {
  return await payDoctorAPI(doctorId, paymentId);
};
```

---

### 3. DOCTOR - Pagos Recibidos

**Archivos Afectados:**
- ❌ `src/features/doctor-panel/presentation/components/PaymentsSection.tsx` - **USA MOCKS**
- ❌ `src/features/doctor-panel/presentation/components/DashboardContent.tsx` - **USA MOCKS**
- ❌ `src/features/doctor-panel/presentation/components/ReportsSection.tsx` - **USA MOCKS**

**Endpoint Necesario:**
```typescript
❌ GET /api/doctors/payments - NO EXISTE EN EL BACKEND
```

**Flujo de Pago:**
1. Doctor ve lista de pagos pendientes (de admin o de clínica)
2. Doctor ve sus datos bancarios registrados
3. Doctor espera recibir transferencia bancaria **EXTERNA**
4. Cuando el admin/clínica marca como "pagado", el doctor ve el estado actualizado

**Problema:**
```typescript
// PaymentsSection.tsx - Línea 31
import { getPaymentsMock } from "../../infrastructure/payments.mock";
const [payments] = useState<Payment[]>(() => getPaymentsMock(doctorName));
```

**Solución:**
1. **Backend debe crear:** `GET /api/doctors/payments` (retorna pagos pendientes y pagados)
2. **Frontend debe crear:** `src/features/doctor-panel/infrastructure/payments.api.ts`
3. **Actualizar componentes** para usar la API

```typescript
// payments.api.ts (NUEVO ARCHIVO)
import { httpClient, extractData } from '../../../shared/lib/http';
import type { Payment } from '../domain/Payment.entity';

export const getDoctorPaymentsAPI = async (): Promise<Payment[]> => {
  const response = await httpClient.get<{ success: boolean; data: Payment[] }>(
    '/doctors/payments'
  );
  return extractData(response);
};
```

---

## 🟡 PRIORIDAD IMPORTANTE - INSUMOS MÉDICOS

### 4. SUPPLIES - Productos e Inventario

**Archivos Afectados:**
- ❌ `src/features/supplies-panel/presentation/components/ProductsSection.tsx` - **USA MOCKS**
- ❌ `src/features/supplies-panel/presentation/components/OrdersSection.tsx` - **USA MOCKS**
- ❌ `src/features/supplies-panel/presentation/components/DashboardContent.tsx` - **USA MOCKS**

**Endpoints Necesarios:**
```typescript
❌ GET /api/supplies/products - NO EXISTE
❌ POST /api/supplies/products - NO EXISTE
❌ PUT /api/supplies/products/:id - NO EXISTE
❌ DELETE /api/supplies/products/:id - NO EXISTE
❌ GET /api/supplies/orders - NO EXISTE
```

**Problema:**
```typescript
// ProductsSection.tsx - Línea 33
import { getProductsMock, saveProductsMock } from "../../infrastructure/products.mock";

// OrdersSection.tsx - Línea 22
import { getOrdersMock } from "../../infrastructure/orders.mock";

// DashboardContent.tsx - Línea 17
import { mockOrders } from "../../infrastructure/orders.mock";
```

**Solución:**
1. **Backend debe crear** los 5 endpoints de productos y órdenes
2. **Frontend debe crear** `products.api.ts` y `orders.api.ts`
3. **Actualizar componentes** para usar las APIs

---

## 🟢 PRIORIDAD MEJORAS - LABORATORIOS

### 5. LABORATORY - Citas y Dashboard

**Archivos Afectados:**
- ❌ `src/features/laboratory-panel/presentation/components/AppointmentsSection.tsx` - **USA MOCKS**
- ❌ `src/features/laboratory-panel/presentation/components/DashboardContent.tsx` - **USA MOCKS**

**Endpoints Necesarios:**
```typescript
❌ GET /api/laboratories/appointments - NO EXISTE
```

**Problema:**
```typescript
// AppointmentsSection.tsx - Línea 3
import { generateMockAppointments, type LaboratoryAppointment } from "../../infrastructure/appointments.mock";

// DashboardContent.tsx - Línea 16
import { generateMockAppointments } from "../../../laboratory-panel/infrastructure/appointments.mock";
```

**Solución:**
1. **Backend debe crear:** `GET /api/laboratories/appointments`
2. **Frontend debe crear:** `laboratory-appointments.api.ts`
3. **Actualizar componentes**

---

## 🟢 PRIORIDAD MEJORAS - DIAGNÓSTICOS

### 6. PATIENT - Historial Médico

**Archivos Afectados:**
- ❌ `src/features/patient/presentation/components/MedicalHistorySection.tsx` - **USA MOCKS**

**Endpoint Necesario:**
```typescript
❌ GET /api/patients/:patientId/diagnoses - NO EXISTE
```

**Problema:**
```typescript
// MedicalHistorySection.tsx - Línea 24
import { getDiagnosesByPatientMock } from "../../../doctor-panel/infrastructure/diagnoses.api";
```

**Solución:**
1. **Backend debe crear:** `GET /api/patients/:patientId/diagnoses`
2. **Frontend debe actualizar:** `diagnoses.api.ts` para usar endpoint real

---

## 🟢 PRIORIDAD MEJORAS - ADMIN ESTADÍSTICAS

### 7. ADMIN - Dashboard de Servicios

**Archivos Afectados:**
- ❌ `src/features/admin-dashboard/presentation/pages/ServicesDashboardPage.tsx` - **USA MOCKS**

**Endpoint Necesario:**
```typescript
❌ GET /api/admin/services/active - NO EXISTE
```

**Problema:**
```typescript
// ServicesDashboardPage.tsx - Línea 13
import { getActiveServicesMock } from "../../infrastructure/stats.mock";
```

**Solución:**
1. **Backend debe crear:** `GET /api/admin/services/active`
2. **Frontend debe crear:** `services.api.ts`

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### ✅ FASE 1 - PAGOS (CRÍTICO) - **COMPLETADA** 🎉
- [x] **Admin - CommissionsPage.tsx** - ✅ Cambiado de mock a `getAdminDoctorPaymentsAPI()`
- [x] **Clínica - 4 use cases** - ✅ APIs descomentadas:
  - [x] `get-clinic-payments.usecase.ts`
  - [x] `get-clinic-to-doctor-payments.usecase.ts`
  - [x] `distribute-payment.usecase.ts`
  - [x] `pay-doctor.usecase.ts`
- [x] **Doctor - Crear API** - ✅ `payments.api.ts` creado (esperando endpoint backend)
- [x] **Doctor - Actualizar componentes** - ✅ 3 archivos actualizados:
  - [x] `PaymentsSection.tsx`
  - [x] `DashboardContent.tsx`
  - [x] `ReportsSection.tsx`

**Estado:** ✅ Frontend 100% listo | ⏳ Backend debe crear 2 endpoints

### 🟡 FASE 2 - INSUMOS (IMPORTANTE)
- [ ] **Backend** - Crear 5 endpoints de productos/órdenes
- [ ] **Frontend** - Crear `products.api.ts` y `orders.api.ts`
- [ ] **Frontend** - Actualizar 3 componentes de supplies

### 🟢 FASE 3 - MEJORAS (OPCIONAL)
- [ ] **Laboratorios** - Endpoint + API + 2 componentes
- [ ] **Diagnósticos** - Endpoint + actualizar API
- [ ] **Admin Stats** - Endpoint + API + componente

---

## 🎯 RESUMEN DE ARCHIVOS A MODIFICAR

### Archivos que SOLO necesitan cambio de import (5 min c/u):
1. `CommissionsPage.tsx` - Cambiar mock por API
2. `get-clinic-payments.usecase.ts` - Descomentar API
3. `get-clinic-to-doctor-payments.usecase.ts` - Descomentar API
4. `distribute-payment.usecase.ts` - Descomentar API
5. `pay-doctor.usecase.ts` - Descomentar API

### Archivos que necesitan crear API nueva:
6. `payments.api.ts` (doctor) - **Requiere endpoint backend**
7. `products.api.ts` (supplies) - **Requiere endpoint backend**
8. `orders.api.ts` (supplies) - **Requiere endpoint backend**
9. `laboratory-appointments.api.ts` - **Requiere endpoint backend**

### Total de Componentes a Actualizar:
- **8 componentes** que usan mocks
- **5 use cases** que tienen API comentada
- **4 APIs nuevas** por crear (requieren backend)

---

## 🚀 TIEMPO ESTIMADO

- **Fase 1 (Pagos):** 2-3 horas
- **Fase 2 (Insumos):** 4-5 horas (incluye backend)
- **Fase 3 (Mejoras):** 3-4 horas (incluye backend)

**Total:** 9-12 horas de trabajo

---

## 📝 NOTAS IMPORTANTES

1. **PaymentsPage.tsx del Admin YA ESTÁ CONECTADO** ✅
2. **Las APIs de clínica YA ESTÁN CREADAS**, solo falta descomentar en use cases
3. **Los endpoints de doctor/payments NO EXISTEN en el backend** - Prioridad alta
4. **Los endpoints de supplies NO EXISTEN en el backend** - Prioridad media
5. **Todos los mocks se pueden eliminar DESPUÉS de conectar las APIs**

### 💰 Flujo Completo de Pagos (EXTERNO):

```
PACIENTE paga cita con tarjeta
    ↓
PLATAFORMA cobra $100 (ejemplo)
    ↓
PLATAFORMA retiene comisión 15% = $15
    ↓
PLATAFORMA debe pagar $85 al proveedor
    ↓
┌─────────────────────────────────────────┐
│ ADMIN ve en la web:                     │
│ - Debe pagar $85 a Dr. Juan Pérez       │
│ - Datos bancarios: Banco Pichincha      │
│   Cuenta: 2100123456789                 │
└─────────────────────────────────────────┘
    ↓
ADMIN hace transferencia EXTERNA (banco)
    ↓
ADMIN marca como "pagado" en la web
    ↓
DOCTOR ve en la web: "Pago recibido: $85"
```

**La web NO procesa pagos, solo:**
- ✅ Registra quién debe cuánto a quién
- ✅ Muestra datos bancarios
- ✅ Permite marcar como "pagado" manualmente
- ❌ NO hace transferencias automáticas
- ❌ NO integra con pasarelas de pago para estos pagos

---

**Generado:** 9 de Febrero, 2026  
**Autor:** Kiro AI Assistant
