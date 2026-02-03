# 🔴 PROBLEMA: Cadenas de Farmacias No Aparecen

## Lo que está pasando:

```
Usuario en página de registro
    ↓
Selecciona "Farmacia"
    ↓
Frontend llama: GET /api/pharmacy-chains
    ↓
Backend responde: 404 Not Found (probablemente)
    ↓
Frontend recibe error → retorna array vacío
    ↓
Dropdown solo muestra: "No pertenezco a ninguna cadena"
```

## Lo que DEBERÍA pasar:

```
Usuario en página de registro
    ↓
Selecciona "Farmacia"
    ↓
Frontend llama: GET /api/pharmacy-chains
    ↓
Backend responde: 200 OK con 4 cadenas
    ↓
Frontend filtra las activas
    ↓
Dropdown muestra:
  - No pertenezco a ninguna cadena
  - Farmaciasss metropolit...
  - MegaFarmacias
  - Pharmacy's
  - Sana Sana
```

## 🎯 SOLUCIÓN RÁPIDA (Backend)

### Paso 1: Crear el endpoint
```javascript
// GET /api/pharmacy-chains (PÚBLICO - sin autenticación)
router.get('/pharmacy-chains', async (req, res) => {
  const chains = await PharmacyChain.findAll({
    where: { is_active: true }
  });
  
  const data = chains.map(c => ({
    id: c.id,
    name: c.name,
    logoUrl: c.logo_url,
    isActive: c.is_active,
    createdAt: c.created_at,
    updatedAt: c.updated_at
  }));
  
  res.json({ success: true, data });
});
```

### Paso 2: Activar las cadenas en la BD
```sql
UPDATE pharmacy_chains SET is_active = true;
```

### Paso 3: Probar
```bash
curl http://localhost:3000/api/pharmacy-chains
```

## ✅ Frontend ya está correcto
No necesitas cambiar nada en el frontend. El código ya está bien implementado.

---

**Resumen**: El backend necesita crear el endpoint público `/api/pharmacy-chains` que retorne las cadenas activas.
