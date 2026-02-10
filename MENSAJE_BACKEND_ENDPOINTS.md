# 🚀 ENDPOINTS QUE NECESITAMOS DEL BACKEND

**Fecha:** 9 de Febrero, 2026  
**Prioridad:** 🔴 URGENTE

---

## 📋 RESUMEN

Necesitamos **8 endpoints** para completar el frontend:

---

## 🔴 PRIORIDAD 1: PAGOS DE DOCTORES (2 endpoints)

### 1. GET /api/doctors/payments
**Retorna:** Lista de pagos del doctor (pendientes y pagados)

```json
{
  "success": true,
  "data": [
    {
      "id": "pay-001",
      "amount": 850.00,
      "status": "pending", // o "paid"
      "date": "2026-02-09",
      "source": "admin", // o "clinic"
      "sourceId": "admin-001",
      "sourceName": "MediConnect Admin",
      "description": "Pago por 10 consultas",
      "paidAt": null
    }
  ]
}
```

### 2. GET /api/doctors/payments/:id
**Retorna:** Detalle de un pago específico

```json
{
  "success": true,
  "data": {
    "id": "pay-001",
    "amount": 850.00,
    "status": "pending",
    "date": "2026-02-09",
    "source": "admin",
    "description": "Pago por 10 consultas",
    "appointments": [
      { "id": "apt-001", "patientName": "Juan Pérez", "amount": 85.00 }
    ]
  }
}
```

---

## 🟡 PRIORIDAD 2: PRODUCTOS DE SUPPLIES (3 endpoints)

### 3. POST /api/supplies/products
**Crea** un producto nuevo

```json
// Request
{
  "name": "Silla de ruedas",
  "description": "Silla plegable",
  "type": "Movilidad",
  "price": 450.00,
  "stock": 10,
  "imageUrl": "https://...",
  "isActive": true
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "prod-001",
    "name": "Silla de ruedas",
    // ... resto de campos
    "createdAt": "2026-02-09T10:00:00Z"
  }
}
```

### 4. PUT /api/supplies/products/:id
**Actualiza** un producto (solo campos enviados)

```json
// Request
{
  "price": 550.00,
  "stock": 15
}

// Response (200)
{
  "success": true,
  "data": { /* producto actualizado */ }
}
```

### 5. DELETE /api/supplies/products/:id
**Elimina** un producto (soft delete: `is_active = false`)

```json
// Response (200)
{
  "success": true,
  "message": "Producto eliminado"
}
```

---

## 🟡 PRIORIDAD 3: ÓRDENES DE SUPPLIES (3 endpoints)

### 6. GET /api/supplies/orders
**Lista** órdenes de la tienda

```json
{
  "success": true,
  "data": [
    {
      "id": "order-001",
      "orderNumber": "ORD-2026-001",
      "clientName": "María González",
      "clientEmail": "maria@email.com",
      "clientPhone": "+593 99 111 2222",
      "clientAddress": "Av. Amazonas N28-75",
      "items": [
        {
          "productName": "Silla de ruedas",
          "quantity": 1,
          "unitPrice": 350.00,
          "total": 350.00
        }
      ],
      "totalAmount": 350.00,
      "status": "pending",
      "orderDate": "2026-02-09",
      "deliveryDate": "2026-02-12"
    }
  ]
}
```

### 7. POST /api/supplies/orders
**Crea** una orden nueva

```json
// Request
{
  "clientName": "María González",
  "clientEmail": "maria@email.com",
  "clientPhone": "+593 99 111 2222",
  "clientAddress": "Av. Amazonas N28-75",
  "items": [
    {
      "productId": "prod-001",
      "productName": "Silla de ruedas",
      "quantity": 1,
      "unitPrice": 350.00
    }
  ],
  "deliveryDate": "2026-02-12"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "order-001",
    "orderNumber": "ORD-2026-001",
    "status": "pending",
    "totalAmount": 350.00
  }
}
```

### 8. PUT /api/supplies/orders/:id/status
**Actualiza** estado de una orden

```json
// Request
{
  "status": "confirmed" // pending, confirmed, preparing, shipped, delivered, cancelled
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "order-001",
    "status": "confirmed"
  }
}
```

---

## 📊 TABLAS NECESARIAS

### supply_products
```sql
CREATE TABLE supply_products (
  id VARCHAR(36) PRIMARY KEY,
  supply_store_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supply_store_id) REFERENCES users(id)
);
```

### supply_orders
```sql
CREATE TABLE supply_orders (
  id VARCHAR(36) PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  supply_store_id VARCHAR(36) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  client_address TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  order_date DATE NOT NULL,
  delivery_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supply_store_id) REFERENCES users(id)
);
```

### supply_order_items
```sql
CREATE TABLE supply_order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36),
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES supply_orders(id) ON DELETE CASCADE
);
```

---

## ⏱️ TIMELINE

- **Pagos doctores:** 1 día
- **Productos CRUD:** 1-2 días  
- **Órdenes:** 2-3 días

**Total:** 4-6 días

---

## 📝 NOTAS

1. **Autenticación:** Todos los endpoints requieren Bearer Token (JWT)
2. **Autorización:** 
   - Doctores solo ven sus pagos
   - Supplies solo ven/editan sus productos/órdenes
3. **Validaciones:**
   - Precios > 0
   - Stock >= 0
   - Emails válidos
4. **Soft delete:** Productos usar `is_active = false` en lugar de DELETE

---


