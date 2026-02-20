# ✅ Nueva Funcionalidad: Tarifas de Consulta por Especialidad

**Fecha:** 20 de febrero de 2026  
**Funcionalidad:** Pestaña de "Tarifas de Consulta" para médicos

---

## 🎯 Objetivo

Permitir que los médicos configuren precios diferentes para cada una de sus especialidades, en lugar de tener un solo precio general de consulta.

---

## ✅ Implementación Completada

### 1. Nuevo Componente Creado

**Archivo:** `src/features/doctor-panel/presentation/components/ConsultationPricesSection.tsx`

**Características:**
- ✅ Tabla con todas las especialidades del médico
- ✅ Edición inline de precios (clic en ícono de editar)
- ✅ Validación de precios (solo números positivos)
- ✅ Botones de guardar/cancelar por especialidad
- ✅ Feedback visual con Snackbar
- ✅ Formato de moneda con símbolo de dólar
- ✅ Alert informativo sobre la moneda (USD)

**Interfaz:**
```typescript
interface Props {
  specialties: string[];  // Especialidades del médico
  currentPrices?: Record<string, number>;  // Precios actuales
  onSave: (prices: Record<string, number>) => Promise<void>;
}
```

---

### 2. Pestaña Agregada al Dashboard

**Archivo:** `src/features/doctor-panel/presentation/pages/DoctorDashboardPage.tsx`

**Cambios:**
- ✅ Agregado tipo `"consultation-prices"` a `TabType`
- ✅ Importado componente `ConsultationPricesSection`
- ✅ Agregada renderización condicional para la nueva pestaña
- ✅ Solo visible para médicos independientes (no para médicos asociados a clínicas)

**Código agregado:**
```typescript
{currentTab === "consultation-prices" && (
  <ConsultationPricesSection
    specialties={displayData?.doctor?.specialties || []}
    currentPrices={displayData?.doctor?.consultationPrices || {}}
    onSave={async (prices) => {
      // TODO: Implementar API para guardar precios
      console.log("Guardando precios:", prices);
      refetchProfile();
    }}
  />
)}
```

---

### 3. Opción de Menú Agregada

**Archivo:** `src/shared/config/navigation.config.tsx`

**Cambios:**
- ✅ Agregada opción "Tarifas de Consulta" en `DOCTOR_MENU`
- ✅ Posicionada después de "Mi Perfil"
- ✅ Ícono: `<AttachMoney />`
- ✅ Path: `/doctor/dashboard?tab=consultation-prices`
- ✅ Cambiado ícono de "Pagos e Ingresos" a `<Receipt />` para evitar duplicación

**Orden del menú:**
1. Dashboard
2. Mi Perfil
3. **Tarifas de Consulta** ← NUEVO
4. Anuncios
5. Reseñas
6. Citas
7. Pacientes
8. Pagos e Ingresos
9. Reportes
10. Configuración

---

## 📊 Estructura de Datos

### Formato de Precios

```typescript
// Ejemplo de datos esperados
{
  specialties: ["Cardiología", "Medicina General"],
  currentPrices: {
    "Cardiología": 50.00,
    "Medicina General": 30.00
  }
}
```

### Formato de Guardado

```typescript
// Al guardar, se envía un objeto con los precios
{
  "Cardiología": 50.00,
  "Medicina General": 30.00,
  "Dermatología": 45.00
}
```

---

## 🎨 Interfaz de Usuario

### Vista de la Tabla

```
┌─────────────────────────────────────────────────────────┐
│ Tarifas de Consulta                                     │
│ Configura el precio de consulta para cada especialidad │
├─────────────────────────────────────────────────────────┤
│ Especialidad      │ Precio de Consulta │ Acciones      │
├───────────────────┼────────────────────┼───────────────┤
│ Cardiología       │ $ 50.00            │ [Editar]      │
│ Medicina General  │ $ 30.00            │ [Editar]      │
│ Dermatología      │ $ 45.00            │ [Editar]      │
└─────────────────────────────────────────────────────────┘
```

### Modo Edición

```
┌─────────────────────────────────────────────────────────┐
│ Especialidad      │ Precio de Consulta │ Acciones      │
├───────────────────┼────────────────────┼───────────────┤
│ Cardiología       │ [$ 50.00]          │ [✓] [✗]       │
│                   │  ↑ Input activo    │  ↑   ↑        │
│                   │                    │ Guardar Cancelar│
└─────────────────────────────────────────────────────────┘
```

---

## ⚠️ Pendiente: Integración con Backend

### Endpoint Requerido

```typescript
// PUT /api/doctors/consultation-prices
// Authorization: Bearer {token}

// Request Body:
{
  "prices": {
    "Cardiología": 50.00,
    "Medicina General": 30.00,
    "Dermatología": 45.00
  }
}

// Response:
{
  "success": true,
  "message": "Precios actualizados correctamente"
}
```

### Estructura en Base de Datos

**Opción 1: Tabla separada (Recomendado)**
```sql
CREATE TABLE doctor_specialty_prices (
  id UUID PRIMARY KEY,
  doctor_id UUID REFERENCES providers(id),
  specialty_name VARCHAR(100),
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, specialty_name)
);
```

**Opción 2: Campo JSON en providers**
```sql
ALTER TABLE providers 
ADD COLUMN consultation_prices JSONB;

-- Ejemplo de datos:
{
  "Cardiología": 50.00,
  "Medicina General": 30.00
}
```

---

## 🔧 Integración Pendiente

### En el Frontend:

**Archivo:** `src/features/doctor-panel/infrastructure/doctors.api.ts`

Agregar función:
```typescript
export const updateConsultationPricesAPI = async (
  prices: Record<string, number>
): Promise<void> => {
  await httpClient.put('/doctors/consultation-prices', { prices });
};
```

**Archivo:** `src/features/doctor-panel/presentation/pages/DoctorDashboardPage.tsx`

Reemplazar el TODO:
```typescript
{currentTab === "consultation-prices" && (
  <ConsultationPricesSection
    specialties={displayData?.doctor?.specialties || []}
    currentPrices={displayData?.doctor?.consultationPrices || {}}
    onSave={async (prices) => {
      await updateConsultationPricesAPI(prices);
      refetchProfile();
    }}
  />
)}
```

---

## ✅ Verificación

### Build:
```bash
npm run build
✓ built in 33.73s
```

### Diagnostics:
- ✅ Sin errores
- ✅ Sin warnings críticos

---

## 📝 Casos de Uso

### Caso 1: Médico con múltiples especialidades
```
Dr. Juan Pérez
- Cardiología: $50.00
- Medicina General: $30.00
- Medicina Interna: $40.00
```

### Caso 2: Médico con una especialidad
```
Dra. María López
- Dermatología: $45.00
```

### Caso 3: Médico sin especialidades
```
Muestra mensaje:
"No tienes especialidades registradas. 
Actualiza tu perfil para agregar especialidades."
```

---

## 🎯 Beneficios

1. **Flexibilidad de Precios:**
   - Cada especialidad puede tener su propio precio
   - Refleja mejor el valor de servicios especializados

2. **Mejor Experiencia de Usuario:**
   - Edición inline (no necesita modal)
   - Feedback inmediato
   - Interfaz intuitiva

3. **Transparencia:**
   - Los pacientes ven precios específicos por especialidad
   - Evita confusiones sobre tarifas

4. **Escalabilidad:**
   - Fácil agregar más especialidades
   - Estructura de datos flexible

---

## 🚀 Próximos Pasos

1. **Backend:**
   - [ ] Crear endpoint `PUT /api/doctors/consultation-prices`
   - [ ] Decidir estructura de BD (tabla separada vs JSON)
   - [ ] Implementar lógica de guardado
   - [ ] Retornar precios en `GET /api/doctors/profile`

2. **Frontend:**
   - [x] ✅ Crear componente
   - [x] ✅ Agregar pestaña al dashboard
   - [x] ✅ Agregar opción al menú
   - [ ] Conectar con API real
   - [ ] Agregar tests unitarios

3. **Testing:**
   - [ ] Probar con médico con múltiples especialidades
   - [ ] Probar con médico con una especialidad
   - [ ] Probar validaciones de precios
   - [ ] Probar guardado y recarga de datos

---

**Estado:** ✅ FRONTEND COMPLETADO  
**Pendiente:** Backend API  
**Listo para:** Integración con backend
