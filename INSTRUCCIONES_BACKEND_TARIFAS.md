# 📋 Instrucciones Backend - Tarifas de Consulta por Especialidad

**Fecha:** 20 de febrero de 2026  
**Estado Frontend:** ✅ COMPLETADO Y FUNCIONANDO

---

## 🎯 ¿Qué Implementamos?

Creamos una nueva pestaña en el panel de médicos llamada **"Tarifas de Consulta"** que permite:

- Ver todas las especialidades del médico en una tabla
- Configurar un precio diferente para cada especialidad
- Editar los precios de forma individual
- Solo visible para médicos independientes (no para médicos asociados a clínicas)

---

## 🔧 Lo Que Necesitamos del Backend

### 1️⃣ Endpoint para Guardar Precios

```http
PUT /api/doctors/consultation-prices
Authorization: Bearer {token}
Content-Type: application/json

{
  "prices": {
    "Cardiología": 50.00,
    "Medicina General": 30.00,
    "Dermatología": 45.00
  }
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Precios actualizados correctamente"
}
```

**Validaciones:**
- ✅ Usuario debe ser médico (role = 'DOCTOR')
- ✅ Precio debe ser >= 0
- ✅ Token válido

---

### 2️⃣ Endpoint para Obtener Precios

Crear un nuevo endpoint para obtener los precios de consulta:

```http
GET /api/doctors/consultation-prices
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "Cardiología": 50.00,
    "Medicina General": 30.00,
    "Dermatología": 45.00
  }
}
```

**Si el médico no tiene precios configurados:**
```json
{
  "success": true,
  "data": {}
}
```

---

## 🗄️ Base de Datos

### Opción Recomendada: Tabla Separada

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

**¿Por qué esta opción?**
- Más fácil de consultar y mantener
- Mejor para reportes
- Validaciones a nivel de BD

---

### Alternativa: Campo JSON

Si prefieren algo más simple:

```sql
ALTER TABLE providers 
ADD COLUMN consultation_prices JSONB DEFAULT '{}';
```

---

## 💻 Lógica de Implementación

### Al Guardar (PUT /api/doctors/consultation-prices):

```typescript
// 1. Obtener doctor_id del token JWT
const doctorId = req.user.providerId;

// 2. Validar que sea médico
if (req.user.serviceType !== 'doctor') {
  return res.status(403).json({
    success: false,
    message: 'Solo los médicos pueden configurar precios'
  });
}

// 3. Validar precios
const { prices } = req.body;
for (const [specialty, price] of Object.entries(prices)) {
  if (price < 0) {
    return res.status(400).json({
      success: false,
      message: 'Los precios deben ser mayores o iguales a 0'
    });
  }
}

// 4. Guardar en BD (UPSERT)
for (const [specialty, price] of Object.entries(prices)) {
  await db.query(`
    INSERT INTO doctor_specialty_prices (doctor_id, specialty_name, price)
    VALUES ($1, $2, $3)
    ON CONFLICT (doctor_id, specialty_name)
    DO UPDATE SET price = $3, updated_at = CURRENT_TIMESTAMP
  `, [doctorId, specialty, price]);
}

// 5. Retornar éxito
return res.json({
  success: true,
  message: 'Precios actualizados correctamente'
});
```

---

### Al Obtener (GET /api/doctors/consultation-prices):

```typescript
// 1. Obtener doctor_id del token
const doctorId = req.user.providerId;

// 2. Validar que sea médico
if (req.user.serviceType !== 'doctor') {
  return res.status(403).json({
    success: false,
    message: 'Solo los médicos pueden consultar precios'
  });
}

// 3. Consultar precios
const pricesResult = await db.query(`
  SELECT specialty_name, price 
  FROM doctor_specialty_prices 
  WHERE doctor_id = $1
`, [doctorId]);

// 4. Formatear como objeto
const consultationPrices = {};
pricesResult.rows.forEach(row => {
  consultationPrices[row.specialty_name] = parseFloat(row.price);
});

// 5. Retornar precios
return res.json({
  success: true,
  data: consultationPrices
});
```

---

## 📝 Casos de Uso

### Caso 1: Primera vez configurando precios
```json
Request: {
  "prices": {
    "Cardiología": 50.00,
    "Medicina General": 30.00
  }
}
→ INSERT nuevos registros
```

### Caso 2: Actualizando un precio existente
```json
Request: {
  "prices": {
    "Cardiología": 60.00,  // Cambió de 50 a 60
    "Medicina General": 30.00
  }
}
→ UPDATE registro de Cardiología
```

### Caso 3: Agregando nueva especialidad
```json
Request: {
  "prices": {
    "Cardiología": 50.00,
    "Medicina General": 30.00,
    "Dermatología": 45.00  // Nueva
  }
}
→ INSERT nuevo registro para Dermatología
```

---

## ✅ Checklist

- [ ] Crear tabla `doctor_specialty_prices`
- [ ] Implementar `PUT /api/doctors/consultation-prices`
- [ ] Implementar `GET /api/doctors/consultation-prices`
- [ ] Agregar validaciones (precio >= 0, usuario es médico)
- [ ] Probar con Postman
- [ ] Avisar a frontend cuando esté listo

---

## 📞 Preguntas Frecuentes

**P: ¿Qué pasa si una especialidad no tiene precio configurado?**  
R: Retornar el objeto sin esa especialidad, o con valor `0`. El frontend lo manejará.

**P: ¿Validamos que la especialidad exista en la lista del médico?**  
R: No es necesario, el frontend ya envía solo las especialidades válidas.

**P: ¿Qué pasa con el campo `consultation_fee` que ya existe?**  
R: Pueden mantenerlo como precio por defecto. Los precios por especialidad tienen prioridad.

---

## 📄 Documentos Adicionales

Si necesitan más detalles:
- `MENSAJE_BACKEND_TARIFAS.md` - Documentación completa
- `RESUMEN_BACKEND_TARIFAS.md` - Resumen ejecutivo

---

**¿Dudas?** Contacten al equipo frontend 📞
