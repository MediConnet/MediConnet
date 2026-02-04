# 🔍 Resumen: Problema Cadenas de Farmacias

**Fecha:** Febrero 2026  
**Estado:** ⚠️ Requiere acción en BACKEND

---

## 🎯 Problema Identificado

El dropdown de "Cadena de Farmacias" en el registro solo muestra:
```
"No pertenezco a ninguna cadena"
```

Pero en la base de datos existen **4 cadenas activas**:
- Farmaciasss metropolitanas
- MegaFarmacias  
- Pharmacy's
- Sana Sana

---

## ✅ Estado del Frontend

**El frontend está 100% correcto y NO necesita cambios:**

### 1. Archivo API ✅
```typescript
// src/features/admin-dashboard/infrastructure/pharmacy-chains.api.ts
export const getActivePharmacyChainsAPI = async (): Promise<PharmacyChain[]> => {
  const response = await httpClient.get<{ success: boolean; data: PharmacyChain[] }>(
    '/pharmacy-chains'  // ✅ Endpoint correcto
  );
  return extractData(response);
};
```

### 2. Función Helper ✅
```typescript
// src/shared/lib/pharmacy-chains.ts
export const getPharmacyChains = async (): Promise<PharmacyChain[]> => {
  try {
    return await getActivePharmacyChainsAPI();  // ✅ Llama a la API
  } catch (error) {
    console.error('Error loading pharmacy chains:', error);
    return [];  // ✅ Manejo de errores
  }
};
```

### 3. Componente RegisterPage ✅
```typescript
// src/features/auth/presentation/pages/RegisterPage.tsx (líneas 147-156)
useEffect(() => {
  if (selectedType === "pharmacy") {
    const loadChains = async () => {
      try {
        const chains = await getPharmacyChains();  // ✅ Llama correctamente
        setPharmacyChains(chains.filter((c) => c.isActive));  // ✅ Filtra activas
      } catch (error) {
        console.error("Error loading pharmacy chains:", error);
      }
    };
    loadChains();
  }
}, [selectedType]);
```

### 4. Renderizado del Dropdown ✅
```typescript
// Líneas 800-830 aprox
<Select
  name="chainId"
  value={formik.values.chainId}
  label="Cadena de Farmacias"
  onChange={(e) => formik.setFieldValue("chainId", e.target.value)}
>
  <MenuItem value="">No pertenezco a ninguna cadena</MenuItem>
  {pharmacyChains.map((chain) => (  // ✅ Itera correctamente
    <MenuItem key={chain.id} value={chain.id}>
      <Stack direction="row" spacing={2} alignItems="center">
        {chain.logoUrl && (
          <Box component="img" src={chain.logoUrl} alt={chain.name} />
        )}
        <Typography>{chain.name}</Typography>
      </Stack>
    </MenuItem>
  ))}
</Select>
```

---

## ❌ Problema en el Backend

**El endpoint público NO existe:**

```
GET http://localhost:3000/api/pharmacy-chains
```

Este endpoint es necesario porque:
- ✅ Es público (sin autenticación)
- ✅ Se usa en la página de registro
- ✅ El usuario aún no está autenticado

**Endpoint que SÍ existe (pero no sirve para registro):**
```
GET http://localhost:3000/api/admin/pharmacy-chains
```
❌ Requiere autenticación de admin  
❌ No se puede usar en registro público

---

## 🛠️ Solución (Solo Backend)

### 1. Crear el endpoint público

```javascript
// En tu archivo de rutas del backend (routes/pharmacy-chains.js)

// GET /api/pharmacy-chains - Público (sin autenticación)
router.get('/pharmacy-chains', async (req, res) => {
  try {
    const chains = await PharmacyChain.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'logo_url', 'is_active', 'created_at', 'updated_at'],
      order: [['name', 'ASC']]
    });
    
    // Transformar a camelCase para el frontend
    const data = chains.map(chain => ({
      id: chain.id,
      name: chain.name,
      logoUrl: chain.logo_url,
      isActive: chain.is_active,
      createdAt: chain.created_at,
      updatedAt: chain.updated_at
    }));
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching pharmacy chains:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener cadenas de farmacias' 
    });
  }
});
```

### 2. Registrar la ruta en el servidor

```javascript
// En tu app.js o server.js
const pharmacyChainsRoutes = require('./routes/pharmacy-chains');

// IMPORTANTE: Esta ruta debe ir ANTES de las rutas protegidas
app.use('/api', pharmacyChainsRoutes);
```

### 3. Verificar que las cadenas estén activas

```sql
-- Verificar estado actual
SELECT id, name, is_active FROM pharmacy_chains;

-- Activar todas las cadenas
UPDATE pharmacy_chains SET is_active = true;
```

---

## 🧪 Cómo Probar

### Opción 1: Con curl
```bash
curl http://localhost:3000/api/pharmacy-chains
```

**Respuesta esperada:**
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

### Opción 2: En el navegador
1. Abrir http://localhost:5173/register?tipo=pharmacy
2. Abrir DevTools → Network
3. Buscar petición a `pharmacy-chains`
4. Verificar que retorna las 4 cadenas

### Opción 3: Con Postman
```
GET http://localhost:3000/api/pharmacy-chains
Headers: (ninguno necesario, es público)
```

---

## 📋 Checklist Backend

- [ ] Crear endpoint `GET /api/pharmacy-chains` (público, sin auth)
- [ ] Filtrar solo cadenas con `is_active = true`
- [ ] Transformar campos de snake_case a camelCase
- [ ] Retornar formato: `{ success: true, data: [...] }`
- [ ] Registrar ruta en el servidor principal
- [ ] Verificar que las cadenas en BD tengan `is_active = true`
- [ ] Probar endpoint con curl/Postman
- [ ] Verificar en el frontend que aparezcan las cadenas

---

## 🎯 Resumen

| Componente | Estado | Acción Requerida |
|------------|--------|------------------|
| Frontend API | ✅ Correcto | Ninguna |
| Frontend Helper | ✅ Correcto | Ninguna |
| Frontend Component | ✅ Correcto | Ninguna |
| Backend Endpoint | ❌ Falta | Crear `/api/pharmacy-chains` |
| Base de Datos | ✅ Tiene datos | Verificar `is_active = true` |

---

## 📚 Documentación Relacionada

- **Solución Detallada:** `SOLUCION_PHARMACY_CHAINS.md`
- **Diagnóstico:** `DIAGNOSTICO_PHARMACY_CHAINS.md`
- **Backend Endpoints:** `SOLICITUD_BACKEND_ENDPOINTS.md`

---

**Conclusión:** El frontend está perfecto. Solo falta implementar el endpoint público en el backend.

