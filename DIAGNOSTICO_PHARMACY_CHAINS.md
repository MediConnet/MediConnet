# 🔍 Diagnóstico: Problema con Cadenas de Farmacias

## 📊 Situación Actual

**Problema reportado**: El dropdown de cadenas de farmacias en el registro muestra solo "No pertenezco a ninguna cadena" pero no las cadenas disponibles.

**Base de datos**: Tiene 4 registros en `pharmacy_chains`:
- Farmaciasss metropolit...
- MegaFarmacias
- Pharmacy's
- Sana Sana

## 🔧 Implementación Frontend

### 1. API Endpoint Correcto ✅
```typescript
// src/features/admin-dashboard/infrastructure/pharmacy-chains.api.ts
export const getActivePharmacyChainsAPI = async (): Promise<PharmacyChain[]> => {
  const response = await httpClient.get<{ success: boolean; data: PharmacyChain[] }>(
    '/pharmacy-chains'  // ✅ Endpoint público correcto
  );
  return extractData(response);
};
```

### 2. Función Helper ✅
```typescript
// src/shared/lib/pharmacy-chains.ts
export const getPharmacyChains = async (): Promise<PharmacyChain[]> => {
  try {
    return await getActivePharmacyChainsAPI();
  } catch (error) {
    console.error('Error loading pharmacy chains:', error);
    return []; // ⚠️ Retorna array vacío en caso de error
  }
};
```

### 3. Uso en RegisterPage ✅
```typescript
// src/features/auth/presentation/pages/RegisterPage.tsx
useEffect(() => {
  if (selectedType === "pharmacy") {
    const loadChains = async () => {
      try {
        const chains = await getPharmacyChains();
        setPharmacyChains(chains.filter((c) => c.isActive)); // ⚠️ Filtra solo activas
      } catch (error) {
        console.error('Error loading pharmacy chains:', error);
      }
    };
    loadChains();
  }
}, [selectedType]);
```

### 4. Renderizado del Dropdown ✅
```tsx
<Select name="chainId" value={formik.values.chainId} label="Cadena de Farmacias">
  <MenuItem value="">No pertenezco a ninguna cadena</MenuItem>
  {pharmacyChains.map((chain) => (
    <MenuItem key={chain.id} value={chain.id}>
      {/* Logo y nombre de la cadena */}
    </MenuItem>
  ))}
</Select>
```

## 🎯 Posibles Causas del Problema

### Causa 1: Backend no tiene el endpoint `/api/pharmacy-chains` ⚠️
**Probabilidad**: ALTA

El frontend está llamando a `GET /api/pharmacy-chains` (público) pero el backend podría solo tener implementado `GET /api/admin/pharmacy-chains` (requiere autenticación admin).

**Solución Backend**: Crear endpoint público `/api/pharmacy-chains` que retorne solo cadenas activas.

### Causa 2: Campo `is_active` en base de datos es `false` ⚠️
**Probabilidad**: MEDIA

El código filtra por `isActive: true`. Si los registros en la base de datos tienen `is_active = false`, no se mostrarán.

**Verificación**: 
```sql
SELECT id, name, is_active FROM pharmacy_chains;
```

**Solución**: Actualizar registros a `is_active = true`:
```sql
UPDATE pharmacy_chains SET is_active = true WHERE id IN (...);
```

### Causa 3: Estructura de respuesta del backend incorrecta ⚠️
**Probabilidad**: MEDIA

El frontend espera:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Fybeca",
      "logoUrl": "https://...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Nota**: El campo debe ser `isActive` (camelCase) no `is_active` (snake_case).

### Causa 4: Error de CORS o red ⚠️
**Probabilidad**: BAJA

Si hay error de CORS o el backend no está corriendo, la petición falla silenciosamente y retorna array vacío.

## 📝 Pasos para Diagnosticar

### Paso 1: Verificar si el endpoint existe en el backend
```bash
# Probar directamente con curl o Postman
curl http://localhost:3000/api/pharmacy-chains
```

**Respuesta esperada**: 
- ✅ Status 200 con array de cadenas
- ❌ Status 404 = endpoint no existe
- ❌ Status 500 = error en el backend

### Paso 2: Verificar datos en la base de datos
```sql
SELECT id, name, logo_url, is_active, created_at, updated_at 
FROM pharmacy_chains;
```

**Verificar**:
- ¿Existen registros?
- ¿Tienen `is_active = true`?
- ¿Los campos están completos?

### Paso 3: Verificar en el navegador (DevTools)
1. Abrir página de registro
2. Seleccionar tipo "Farmacia"
3. Abrir DevTools → Network
4. Buscar petición a `/pharmacy-chains`
5. Ver:
   - ¿Se hace la petición?
   - ¿Qué status code retorna?
   - ¿Qué datos retorna?
6. Abrir Console
7. Ver si hay errores de JavaScript

### Paso 4: Verificar transformación de datos
El backend usa snake_case pero el frontend espera camelCase. Verificar que el backend esté transformando:
- `is_active` → `isActive`
- `logo_url` → `logoUrl`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

## 🔨 Soluciones Según la Causa

### Si el endpoint no existe (Causa 1):
**Backend debe crear**:
```javascript
// GET /api/pharmacy-chains (público, sin autenticación)
router.get('/pharmacy-chains', async (req, res) => {
  const chains = await PharmacyChain.findAll({
    where: { is_active: true },
    attributes: ['id', 'name', 'logo_url', 'is_active', 'created_at', 'updated_at']
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
  
  res.json({ success: true, data });
});
```

### Si los registros no están activos (Causa 2):
**SQL**:
```sql
UPDATE pharmacy_chains SET is_active = true;
```

### Si la estructura es incorrecta (Causa 3):
**Backend debe usar transformación camelCase** en todas las respuestas.

### Si hay error de CORS (Causa 4):
**Backend debe configurar CORS**:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Puerto de Vite
  credentials: true
}));
```

## 🎬 Próximos Pasos

1. **Ejecutar Paso 1**: Probar endpoint con curl/Postman
2. **Ejecutar Paso 2**: Verificar datos en base de datos
3. **Ejecutar Paso 3**: Verificar en navegador
4. **Reportar resultados** para identificar la causa exacta
5. **Aplicar solución** correspondiente

## 📌 Información Adicional

- **URL del backend**: `http://localhost:3000/api`
- **Endpoint esperado**: `GET /api/pharmacy-chains`
- **Autenticación**: NO requerida (endpoint público)
- **Respuesta esperada**: Array de objetos PharmacyChain con `isActive: true`
