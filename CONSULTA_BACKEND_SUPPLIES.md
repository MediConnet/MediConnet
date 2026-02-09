# ❓ CONSULTA: Endpoints de Supplies (Insumos Médicos)

**Para:** Equipo Backend  
**De:** Frontend Team  
**Fecha:** 9 de Febrero, 2026

---

## 🎯 PREGUNTA

¿El backend tiene implementados los endpoints para **productos** y **órdenes** de insumos médicos?

---

## 📋 ENDPOINTS QUE NECESITAMOS

### Productos (Products)

#### 1. GET /api/supplies/products
Listar todos los productos de la tienda de insumos

#### 2. GET /api/supplies/products/:id
Obtener detalle de un producto específico

#### 3. POST /api/supplies/products
Crear un nuevo producto

#### 4. PUT /api/supplies/products/:id
Actualizar un producto existente

#### 5. DELETE /api/supplies/products/:id
Eliminar un producto

---

### Órdenes (Orders)

#### 6. GET /api/supplies/orders
Listar todas las órdenes de la tienda

#### 7. GET /api/supplies/orders/:id
Obtener detalle de una orden específica

#### 8. POST /api/supplies/orders
Crear una nueva orden

#### 9. PUT /api/supplies/orders/:id/status
Actualizar estado de una orden

---

## 🔍 ESTADO ACTUAL DEL FRONTEND

### ✅ Ya Implementado:
- `GET /api/supplies` - Listar tiendas ✅
- `GET /api/supplies/:id` - Detalle de tienda ✅
- `GET /api/supplies/:id/reviews` - Reviews ✅
- `POST /api/supplies/:id/reviews` - Crear review ✅

### ⏳ Usando Mocks:
- Productos (CRUD completo)
- Órdenes (listado y actualización)

---

## 📊 ESTRUCTURA DE DATOS

### Product
```typescript
{
  id: string;
  name: string;
  description?: string;
  category: string; // "Movilidad", "Ortopedia", etc.
  price: number;
  stock: number;
  isActive: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Order
```typescript
{
  id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  deliveryDate?: string;
  notes?: string;
}
```

---

## 🚦 OPCIONES

### Opción A: Backend YA tiene los endpoints
✅ Perfecto! Solo necesitamos:
1. Confirmar las rutas exactas
2. Confirmar la estructura de datos
3. Actualizar el frontend (2-3 horas)

### Opción B: Backend NO tiene los endpoints
⏳ Necesitamos:
1. Backend crea los 9 endpoints (2-3 días)
2. Frontend actualiza cuando estén listos (2-3 horas)

---

## 📝 RESPUESTA ESPERADA

Por favor responder con:

```
PRODUCTOS:
[ ] GET /api/supplies/products - ✅ Existe / ❌ No existe
[ ] GET /api/supplies/products/:id - ✅ Existe / ❌ No existe
[ ] POST /api/supplies/products - ✅ Existe / ❌ No existe
[ ] PUT /api/supplies/products/:id - ✅ Existe / ❌ No existe
[ ] DELETE /api/supplies/products/:id - ✅ Existe / ❌ No existe

ÓRDENES:
[ ] GET /api/supplies/orders - ✅ Existe / ❌ No existe
[ ] GET /api/supplies/orders/:id - ✅ Existe / ❌ No existe
[ ] POST /api/supplies/orders - ✅ Existe / ❌ No existe
[ ] PUT /api/supplies/orders/:id/status - ✅ Existe / ❌ No existe
```

---

**Generado:** 9 de Febrero, 2026  
**Esperando respuesta del backend...**
