# 🚀 Resumen Rápido - Tarifas por Especialidad

**Para:** Backend  
**Estado Frontend:** ✅ LISTO

---

## 🎯 Qué Necesitamos

Implementar endpoint para que los médicos configuren **precios diferentes por cada especialidad**.

---

## 📋 Endpoints Requeridos

### 1. Guardar Precios
```http
PUT /api/doctors/consultation-prices
Authorization: Bearer {token}

Body:
{
  "prices": {
    "Cardiología": 50.00,
    "Medicina General": 30.00,
    "Dermatología": 45.00
  }
}

Response:
{
  "success": true,
  "message": "Precios actualizados correctamente"
}
```

### 2. Obtener Precios (Modificar endpoint existente)
```http
GET /api/doctors/profile
Authorization: Bearer {token}

Response (agregar campo):
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "specialties": ["Cardiología", "Medicina General"],
    "consultationPrices": {  // ← AGREGAR ESTE CAMPO
      "Cardiología": 50.00,
      "Medicina General": 30.00
    },
    // ... otros campos
  }
}
```

---

## 🗄️ Base de Datos (Opción Recomendada)

```sql
CREATE TABLE doctor_specialty_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  specialty_name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_doctor_specialty UNIQUE (doctor_id, specialty_name)
);
```

---

## ✅ Validaciones

1. ✅ Usuario debe ser médico
2. ✅ Precio >= 0
3. ✅ Token válido

---

## 📄 Documento Completo

Ver `MENSAJE_BACKEND_TARIFAS.md` para:
- Lógica de negocio detallada
- Casos de uso
- Ejemplos de código
- Testing
- Migración de datos

---

**¿Dudas?** Contactar al equipo frontend 📞
