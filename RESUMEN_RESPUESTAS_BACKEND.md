# 🚀 Respuestas Rápidas - Funcionalidades Frontend

## 1. ✅ Bloquear horarios (médicos independientes)

**Respuesta:** SÍ, tenemos la interfaz lista.

**Endpoint que llamamos:**
```
POST /api/doctors/clinic/date-blocks/request
```

**Datos que enviamos:**
```json
{
  "startDate": "2026-03-15",
  "endDate": "2026-03-20",
  "reason": "Vacaciones programadas"
}
```

**NOTA:** Esta funcionalidad es para médicos ASOCIADOS a clínicas, no independientes. Los médicos independientes manejan su horario directamente.

---

## 2. ⚠️ Selector de horarios

**Respuesta:** Actualmente permite CUALQUIER minuto.

**Problema:** Los inputs `type="time"` no tienen restricción.

**Solución:** Agregar `step="1800"` a todos los selectores:
```tsx
<input type="time" step="1800" ... />
```

**Acción:** Frontend lo corregirá en todos los paneles.

---

## 3. ⚠️ Anuncios vencidos

**Respuesta:** El frontend verifica cada 60 segundos, PERO depende del backend.

**Problema:** Si el backend no filtra por fecha, los anuncios vencidos seguirán apareciendo.

**Solución requerida del backend:**
```sql
WHERE 
  status = 'ACTIVE'
  AND (end_date IS NULL OR end_date >= CURRENT_DATE)
  AND start_date <= CURRENT_DATE
```

**Acción:** Backend debe filtrar anuncios expirados en el endpoint.

---

## 4. ⚠️ Campos de ambulancias

**Respuesta:** Implementados en el PERFIL, faltan en el REGISTRO.

### ✅ En el perfil (EditProfileModal):
- Tipo de ambulancia: `basic`, `advanced`, `mobile-icu`
- Zona de cobertura: texto libre
- Disponibilidad: `24/7` o `scheduled` (con horarios)
- Traslados interprovinciales: sí/no

### ❌ En el registro:
NO están estos campos. Solo pide datos básicos.

### Recomendación:
Usar valores por defecto en el registro:
```typescript
{
  ambulanceType: "basic",
  availability: "24/7",
  interprovincialTransfers: false,
  coverageZone: null
}
```

El usuario los completa después en su perfil.

---

## 📋 Checklist para Backend

- [ ] Verificar endpoint `POST /api/doctors/clinic/date-blocks/request`
- [ ] Filtrar anuncios por `end_date >= CURRENT_DATE`
- [ ] Confirmar si la tabla `ambulances` tiene los campos:
  - `ambulance_type`
  - `coverage_zone`
  - `availability`
  - `interprovincial_transfers`
- [ ] Si faltan campos, crear migración

---

## 📄 Documento Completo

Ver `REPORTE_FUNCIONALIDADES_FRONTEND.md` para detalles técnicos completos.
