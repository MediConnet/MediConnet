# ✅ Frontend Listo - Esperando Endpoints de Productos y Órdenes

## 📋 RESUMEN
El frontend de Supplies ya está 100% funcional usando localStorage como fallback. Cuando implementen los endpoints, se conectará automáticamente al backend.

## 🎯 ENDPOINTS QUE NECESITAMOS

### 1. Productos (CRUD Completo)

#### GET /api/supplies/products
**Descripción:** Obtener todos los productos de un proveedor
**Headers:** `Authorization: Bearer {token}`
**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-001",
      "name": "Silla de Ruedas Estándar",
      "description": "Silla de ruedas plegable con frenos",
      "type": "Movilidad",
      "price": 250.00,
      "stock": 15,
      "imageUrl": "https://...",
      "isActive": true
    }
  ]
}
```

#### POST /api/supplies/products
**Descripción:** Crear un nuevo producto
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "name": "Silla de Ruedas Estándar",
  "description": "Silla de ruedas plegable con frenos",
  "type": "Movilidad",
  "price": 250.00,
  "stock": 15,
  "imageUrl": "https://...",
  "isActive": true
}
```
**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "prod-001",
    "name": "Silla de Ruedas Estándar",
    "description": "Silla de ruedas plegable con frenos",
    "type": "Movilidad",
    "price": 250.00,
    "stock": 15,
    "imageUrl": "https://...",
    "isActive": true,
    "createdAt": "2026-02-10T10:00:00Z",
    "updatedAt": "2026-02-10T10:00:00Z"
  }
}
```

#### PUT /api/supplies/products/:id
**Descripción:** Actualizar un producto existente
**Headers:** `Authorization: Bearer {token}`
**Body:** (mismo que POST, todos los campos opcionales)
**Respuesta esperada:** (mismo formato que POST)

#### DELETE /api/supplies/products/:id
**Descripción:** Eliminar un producto (soft delete recomendado)
**Headers:** `Authorization: Bearer {token}`
**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Producto eliminado correctamente"
}
```

---

### 2. Órdenes/Pedidos

#### GET /api/supplies/orders
**Descripción:** Obtener todas las órdenes de un proveedor
**Headers:** `Authorization: Bearer {token}`
**Query params opcionales:** `?status=pending` (pending, confirmed, preparing, shipped, delivered, cancelled)
**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order-001",
      "orderNumber": "ORD-2026-001",
      "clientName": "Dr. Carlos Mendoza",
      "clientEmail": "carlos@example.com",
      "clientPhone": "+593 99 123 4567",
      "clientAddress": "Av. Principal 123, Quito",
      "orderDate": "2026-02-10",
      "deliveryDate": null,
      "status": "pending",
      "totalAmount": 450.00,
      "notes": "Entrega urgente",
      "items": [
        {
          "productId": "prod-001",
          "productName": "Silla de Ruedas Estándar",
          "quantity": 2,
          "unitPrice": 250.00,
          "total": 500.00
        }
      ]
    }
  ]
}
```

#### POST /api/supplies/orders
**Descripción:** Crear una nueva orden
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "clientName": "Dr. Carlos Mendoza",
  "clientEmail": "carlos@example.com",
  "clientPhone": "+593 99 123 4567",
  "clientAddress": "Av. Principal 123, Quito",
  "notes": "Entrega urgente",
  "items": [
    {
      "productId": "prod-001",
      "quantity": 2
    }
  ]
}
```
**NOTA:** 
- `orderNumber` y `totalAmount` se generan automáticamente en el backend
- `orderDate` se establece automáticamente
- `status` por defecto es "pending"

**Respuesta esperada:** (mismo formato que GET)

#### PUT /api/supplies/orders/:id/status
**Descripción:** Actualizar el estado de una orden
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "status": "confirmed"
}
```
**Estados válidos:** pending, confirmed, preparing, shipped, delivered, cancelled

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "order-001",
    "status": "confirmed",
    "updatedAt": "2026-02-10T10:30:00Z"
  }
}
```

---

## 📝 NOTAS IMPORTANTES

### Categorías de Productos
El frontend usa estas categorías (campo `type` en backend):
- Movilidad
- Ortopedia
- Rehabilitación
- Ayudas Técnicas
- Otros

### Estados de Órdenes
- **pending**: Orden recibida, esperando confirmación
- **confirmed**: Orden confirmada por el proveedor
- **preparing**: Preparando el pedido
- **shipped**: Pedido enviado
- **delivered**: Pedido entregado
- **cancelled**: Orden cancelada

### Autenticación
Todos los endpoints requieren el token JWT en el header:
```
Authorization: Bearer {token}
```

El `providerId` se obtiene del token, no se envía en el body.

---

## ✅ LO QUE YA ESTÁ LISTO EN FRONTEND

1. ✅ Interfaz completa de productos (crear, editar, eliminar, listar)
2. ✅ Interfaz completa de órdenes (listar, crear, cambiar estado)
3. ✅ Dashboard con gráficos de órdenes e ingresos
4. ✅ Manejo de errores y estados de carga
5. ✅ Fallback a localStorage si backend no está disponible
6. ✅ Validaciones de formularios
7. ✅ Notificaciones de éxito/error

---

## 🚀 CUANDO IMPLEMENTEN LOS ENDPOINTS

1. El frontend detectará automáticamente que el backend está disponible
2. Dejará de usar localStorage y usará el backend
3. Los datos se sincronizarán automáticamente
4. No necesitan cambiar nada en el frontend

---

## 📊 PRIORIDAD

**Alta prioridad:**
1. GET /api/supplies/products (para mostrar productos existentes)
2. POST /api/supplies/products (para crear nuevos productos)
3. GET /api/supplies/orders (para mostrar órdenes en dashboard)

**Media prioridad:**
4. PUT /api/supplies/products/:id (para editar productos)
5. DELETE /api/supplies/products/:id (para eliminar productos)
6. POST /api/supplies/orders (para crear órdenes)

**Baja prioridad:**
7. PUT /api/supplies/orders/:id/status (para cambiar estado de órdenes)

---

## ❓ DUDAS O CAMBIOS

Si necesitan cambiar alguna estructura de datos o agregar campos, avisen para ajustar el frontend.

**Frontend Team**
10 de febrero de 2026
