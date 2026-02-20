# 📢 Mensaje para el Equipo de Backend

Hola equipo,

Hemos completado la funcionalidad de **Tarifas de Consulta por Especialidad** en el frontend. Ahora necesitamos que implementen el backend.

---

## 🎯 ¿Qué necesitamos?

### 1. Crear tabla en la base de datos:

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

CREATE INDEX idx_doctor_specialty_prices_doctor ON doctor_specialty_prices(doctor_id);
```

---

### 2. Implementar endpoint GET:

```
GET /api/doctors/consultation-prices
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "Cardiología": 50.00,
    "Medicina General": 30.00
  }
}
```

**Lógica:**
- Obtener `doctor_id` del token JWT
- Consultar precios de la tabla `doctor_specialty_prices`
- Retornar objeto con especialidades y precios
- Si no tiene precios, retornar objeto vacío `{}`

---

### 3. Implementar endpoint PUT:

```
PUT /api/doctors/consultation-prices
Authorization: Bearer {token}

Body:
{
  "prices": {
    "Cardiología": 50.00,
    "Medicina General": 30.00
  }
}

Response:
{
  "success": true,
  "message": "Precios actualizados correctamente"
}
```

**Lógica:**
- Obtener `doctor_id` del token JWT
- Validar que el usuario sea médico
- Validar que los precios sean >= 0
- Hacer UPSERT (INSERT ... ON CONFLICT UPDATE) para cada especialidad
- Retornar confirmación

---

## 📋 Validaciones Requeridas:

1. ✅ Usuario debe ser médico (role = 'DOCTOR')
2. ✅ Precio debe ser >= 0
3. ✅ Token válido

---

## 📄 Documentación Completa:

Revisen el archivo **`INSTRUCCIONES_BACKEND_TARIFAS.md`** que tiene:
- Código de ejemplo completo
- Casos de uso
- Lógica de negocio detallada
- Ejemplos de queries SQL

---

## ⏰ Prioridad:

**MEDIA** - El frontend está listo y esperando. Cuando terminen, avisen para probar la integración.

---

**¿Dudas?** Estamos disponibles para aclarar cualquier cosa.

Gracias! 🚀
