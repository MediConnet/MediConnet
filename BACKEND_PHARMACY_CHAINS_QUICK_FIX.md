# ⚡ Quick Fix: Endpoint Cadenas de Farmacias

**Para:** Equipo Backend  
**Urgencia:** 🔴 Alta  
**Tiempo estimado:** 10 minutos

---

## 🎯 Qué Implementar

Crear endpoint público para obtener cadenas de farmacias activas.

```
GET /api/pharmacy-chains
```

**Características:**
- ✅ Público (sin autenticación)
- ✅ Solo cadenas activas (`is_active = true`)
- ✅ Formato camelCase
- ✅ Respuesta: `{ success: true, data: [...] }`

---

## 💻 Código a Implementar

### 1. Crear archivo de rutas

**Archivo:** `routes/pharmacy-chains.js` (o similar)

```javascript
const express = require('express');
const router = express.Router();
const { PharmacyChain } = require('../models'); // Ajustar según tu estructura

/**
 * GET /api/pharmacy-chains
 * Obtener cadenas de farmacias activas (público)
 */
router.get('/pharmacy-chains', async (req, res) => {
  try {
    // Obtener cadenas activas de la BD
    const chains = await PharmacyChain.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'logo_url', 'is_active', 'created_at', 'updated_at'],
      order: [['name', 'ASC']]
    });
    
    // Transformar a camelCase
    const data = chains.map(chain => ({
      id: chain.id,
      name: chain.name,
      logoUrl: chain.logo_url,
      isActive: chain.is_active,
      createdAt: chain.created_at,
      updatedAt: chain.updated_at
    }));
    
    // Retornar respuesta
    res.json({ success: true, data });
    
  } catch (error) {
    console.error('Error fetching pharmacy chains:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener cadenas de farmacias' 
    });
  }
});

module.exports = router;
```

### 2. Registrar en el servidor principal

**Archivo:** `app.js` o `server.js`

```javascript
// Importar rutas
const pharmacyChainsRoutes = require('./routes/pharmacy-chains');

// Registrar rutas (ANTES de las rutas protegidas)
app.use('/api', pharmacyChainsRoutes);
```

### 3. Verificar datos en BD

```sql
-- Ver estado actual
SELECT id, name, is_active FROM pharmacy_chains;

-- Activar todas las cadenas
UPDATE pharmacy_chains SET is_active = true;
```

---

## 🧪 Probar

### Con curl:
```bash
curl http://localhost:3000/api/pharmacy-chains
```

### Respuesta esperada:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "Farmaciasss metropolitanas",
      "logoUrl": "https://...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid-2",
      "name": "MegaFarmacias",
      "logoUrl": "https://...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid-3",
      "name": "Pharmacy's",
      "logoUrl": "https://...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid-4",
      "name": "Sana Sana",
      "logoUrl": "https://...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## ✅ Checklist

- [ ] Crear archivo `routes/pharmacy-chains.js`
- [ ] Implementar endpoint `GET /pharmacy-chains`
- [ ] Registrar ruta en `app.js`
- [ ] Verificar `is_active = true` en BD
- [ ] Probar con curl
- [ ] Verificar en frontend (http://localhost:5173/register?tipo=pharmacy)

---

## 🚨 Importante

- **NO requiere autenticación** - Es público para registro
- **Debe ir ANTES de rutas protegidas** - Para que no sea bloqueado por middleware de auth
- **Formato camelCase** - El frontend espera `logoUrl`, no `logo_url`
- **Solo activas** - Filtrar `is_active = true`

---

## 📞 Verificación Final

Una vez implementado, el dropdown en el registro debería mostrar:

```
Cadena de Farmacias
├─ No pertenezco a ninguna cadena
├─ 🏥 Farmaciasss metropolitanas
├─ 🏥 MegaFarmacias
├─ 🏥 Pharmacy's
└─ 🏥 Sana Sana
```

---

**Tiempo estimado:** 10 minutos  
**Prioridad:** 🔴 Alta  
**Frontend:** ✅ Ya está listo, solo espera este endpoint

