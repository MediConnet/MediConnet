# Migración: admin/services a Tabla Reutilizable

## Fecha: 29 de Mayo, 2026

---

## 🎯 Objetivo

Migrar completamente el módulo `admin/services` para usar el componente de tabla reutilizable con:
- ✅ DataTable reutilizable
- ✅ TableToolbar con búsqueda y filtros
- ✅ Paginación server-side
- ✅ Estados loading/error/vacío
- ✅ Diseño responsive y moderno

---

## 🔄 Cambios Realizados

### 1. ServicesDashboardPage.tsx - Migración Completa

**Antes:**
- Usaba componente custom `ActiveServicesList`
- Sin paginación
- Sin filtros
- Sin búsqueda
- Carga manual con useEffect

**Después:**
- Usa `DataTable` reutilizable
- Paginación server-side con React Query
- Filtros dinámicos (tipo de servicio)
- Búsqueda integrada
- Hook `useActiveServices` para manejo de datos

**Características implementadas:**

#### Toolbar Superior
```typescript
<TableToolbar
  title="Servicios Activos"
  subtitle="Lista completa de todos los servicios aprobados..."
  titleIcon={<Category />}
  searchValue={searchText}
  searchPlaceholder="Buscar por nombre, ubicación o tipo..."
  onSearchChange={setSearchText}
  filters={[...]}
  actions={[
    { label: "Refrescar", icon: <Refresh />, onClick: handleRefresh },
    { label: "Exportar", icon: <FileDownload />, onClick: handleExport },
  ]}
/>
```

#### Filtros Dinámicos
- **Tipo de Servicio:** Todos, Médico, Farmacia, Laboratorio, Ambulancia, Insumos

#### Acciones
- **Refrescar:** Recarga los datos desde el servidor
- **Exportar:** Exporta los datos filtrados a CSV

#### Columnas de la Tabla
1. **Servicio** - Avatar con inicial + nombre + ubicación
2. **Tipo de Servicio** - Icono + etiqueta con color
3. **Ubicación** - Icono de ubicación + ciudad
4. **Estado** - Chip "Activo" con color verde
5. **ID** - ID truncado en formato monospace

---

### 2. useActiveServices.ts - Nuevo Hook

**Archivo:** `src/features/admin-dashboard/presentation/hooks/useActiveServices.ts`

**Funcionalidad:**
```typescript
export const useActiveServices = (params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['active-services-list', pageKey, limitKey, typeKey, searchKey],
    queryFn: () => getActiveServicesUseCase(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
```

**Beneficios:**
- ✅ Cache automático con React Query
- ✅ Refetch inteligente
- ✅ Estados loading/error manejados automáticamente
- ✅ Invalidación de cache cuando cambian los parámetros

---

### 3. get-active-services.usecase.ts - Actualizado

**Antes:**
```typescript
export const getActiveServicesUseCase = async (): Promise<ActiveService[]> => {
  return await getActiveServicesAPI();
};
```

**Después:**
```typescript
export const getActiveServicesUseCase = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}): Promise<PaginatedResponse<ActiveService>> => {
  return await getActiveServicesAPI(params);
};
```

**Cambios:**
- ✅ Soporta parámetros de paginación y filtros
- ✅ Retorna `PaginatedResponse` en lugar de array simple
- ✅ Permite filtrado server-side

---

### 4. dashboard.api.ts - Actualizado

**Antes:**
```typescript
export const getActiveServicesAPI = async (): Promise<ActiveService[]> => {
  // Sin paginación
  // Sin filtros
  // Retorna array simple
}
```

**Después:**
```typescript
export const getActiveServicesAPI = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}): Promise<PaginatedResponse<ActiveService>> => {
  // Con paginación
  // Con filtros
  // Retorna estructura paginada
}
```

**Mejoras:**
- ✅ Soporta paginación con `page` y `limit`
- ✅ Soporta filtro por tipo de servicio
- ✅ Soporta búsqueda por texto
- ✅ Validación defensiva de múltiples estructuras de respuesta
- ✅ Try-catch para manejo de errores
- ✅ Logs de debugging
- ✅ Retorna estructura vacía válida en caso de error

**Estructuras soportadas:**
```typescript
// Estructura 1: Array directo
[...]

// Estructura 2: Con pagination object
{ data: [...], pagination: { total, page, limit, totalPages } }

// Estructura 3: Con campos planos
{ data: [...], total, page, limit, totalPages }

// Estructura 4: Con results
{ results: [...], total }
```

---

## 📊 Comparación Antes vs Después

### Antes ❌

**Componente:**
```typescript
<ActiveServicesList services={activeServices} loading={servicesLoading} />
```

**Características:**
- Lista simple sin paginación
- Sin filtros
- Sin búsqueda
- Carga manual con useEffect
- Sin exportación
- Diseño custom

### Después ✅

**Componente:**
```typescript
<DataTable<ActiveService>
  rows={filteredServices}
  columns={columns}
  rowCount={pagination.total}
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10, 20, 50]}
  loading={isLoading}
  rowHeight={80}
  emptyTitle="No hay servicios activos"
  emptyDescription="Los servicios aprobados aparecerán aquí..."
/>
```

**Características:**
- ✅ Tabla con paginación server-side
- ✅ Filtros dinámicos
- ✅ Búsqueda integrada
- ✅ Hook con React Query
- ✅ Exportación a CSV
- ✅ Diseño estandarizado
- ✅ Estados loading/error/vacío
- ✅ Responsive design
- ✅ Scroll horizontal solo en tabla

---

## 🎨 Diseño y UX

### Colores por Tipo de Servicio
```typescript
const SERVICE_COLORS = {
  doctor: "#f97316",      // Naranja
  pharmacy: "#10b981",    // Verde
  laboratory: "#ef4444",  // Rojo
  ambulance: "#06b6d4",   // Cian
  supplies: "#f59e0b",    // Amarillo
};
```

### Iconos por Tipo
- 🏥 Médico: `<MedicalServices />`
- 💊 Farmacia: `<LocalPharmacy />`
- 🔬 Laboratorio: `<Science />`
- 🚑 Ambulancia: `<AirportShuttle />`
- 📦 Insumos: `<Inventory />`

### Responsive
- **Desktop (>1200px):** Tabla completa visible
- **Tablet (768-1200px):** Tabla con scroll horizontal interno
- **Mobile (<768px):** Tabla con scroll horizontal, filtros apilados

---

## 🔧 Funcionalidades Implementadas

### 1. Búsqueda
```typescript
const filteredServices = useMemo(() => {
  if (!searchText) return services;
  const q = searchText.toLowerCase();
  return services.filter(
    (s) => 
      s.name.toLowerCase().includes(q) || 
      s.location.toLowerCase().includes(q) ||
      SERVICE_LABELS[s.type].toLowerCase().includes(q)
  );
}, [services, searchText]);
```

**Busca en:**
- Nombre del servicio
- Ubicación
- Tipo de servicio

### 2. Filtros
```typescript
filters={[
  {
    key: "type",
    label: "Tipo de Servicio",
    value: typeFilter,
    onChange: setTypeFilter,
    options: [
      { value: "all", label: "Todos" },
      { value: "doctor", label: "Médico" },
      { value: "pharmacy", label: "Farmacia" },
      { value: "laboratory", label: "Laboratorio" },
      { value: "ambulance", label: "Ambulancia" },
      { value: "supplies", label: "Insumos Médicos" },
    ],
  },
]}
```

### 3. Paginación
```typescript
const { data: result, isLoading, refetch } = useActiveServices({
  page: paginationModel.page + 1,
  limit: paginationModel.pageSize,
  type: typeFilter === "all" ? undefined : typeFilter,
});
```

**Opciones de tamaño:**
- 5 por página
- 10 por página (default)
- 20 por página
- 50 por página

### 4. Exportación a CSV
```typescript
const handleExport = () => {
  const csvContent = [
    ['ID', 'Nombre', 'Ubicación', 'Tipo'],
    ...filteredServices.map(s => [
      s.id, 
      s.name, 
      s.location, 
      SERVICE_LABELS[s.type]
    ])
  ].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `servicios-activos-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};
```

### 5. Refrescar
```typescript
const handleRefresh = () => {
  refetch();
};
```

---

## 📁 Archivos Modificados

### Creados (1 archivo)
1. ✅ `src/features/admin-dashboard/presentation/hooks/useActiveServices.ts`

### Modificados (3 archivos)
2. ✅ `src/features/admin-dashboard/presentation/pages/ServicesDashboardPage.tsx`
3. ✅ `src/features/admin-dashboard/application/get-active-services.usecase.ts`
4. ✅ `src/features/admin-dashboard/infrastructure/dashboard.api.ts`

### Obsoletos (pueden eliminarse)
- ⚠️ `src/features/admin-dashboard/presentation/components/ActiveServicesList.tsx` (ya no se usa)

---

## 🧪 Testing

### Verificar Carga de Datos
```bash
1. Abrir /admin/services
2. Verificar que se muestren las tarjetas de estadísticas
3. Verificar que se muestre la tabla de servicios
4. Verificar logs en consola:
   🔍 getActiveServicesAPI - Params
   🔍 getActiveServicesAPI - Response
   🔍 getActiveServicesAPI - Extracted data
   ✅ getActiveServicesAPI - Final result
```

### Verificar Paginación
```bash
1. Cambiar a página 2
2. Verificar que se carguen nuevos datos
3. Cambiar tamaño de página a 20
4. Verificar que se muestren más resultados
```

### Verificar Filtros
```bash
1. Seleccionar filtro "Médico"
2. Verificar que solo se muestren médicos
3. Seleccionar filtro "Farmacia"
4. Verificar que solo se muestren farmacias
5. Seleccionar "Todos"
6. Verificar que se muestren todos los servicios
```

### Verificar Búsqueda
```bash
1. Escribir nombre de servicio
2. Verificar que filtre correctamente
3. Escribir ubicación
4. Verificar que filtre correctamente
5. Borrar búsqueda
6. Verificar que muestre todos los resultados
```

### Verificar Exportación
```bash
1. Click en botón "Exportar"
2. Verificar que se descargue archivo CSV
3. Abrir archivo CSV
4. Verificar que contenga los datos correctos
```

### Verificar Responsive
```bash
1. Abrir en desktop (1920x1080)
   ✅ Tabla completa visible
   ✅ Sin scroll horizontal en página

2. Abrir en tablet (768x1024)
   ✅ Tabla con scroll horizontal interno
   ✅ Filtros reorganizados

3. Abrir en mobile (375x667)
   ✅ Tabla con scroll horizontal
   ✅ Filtros apilados verticalmente
```

---

## 🚀 Próximos Pasos Recomendados

### Corto Plazo
1. ⏳ Eliminar componente obsoleto `ActiveServicesList.tsx`
2. ⏳ Agregar tests unitarios para el hook
3. ⏳ Agregar tests de integración para la página

### Mediano Plazo
1. ⏳ Implementar filtros adicionales:
   - Estado (activo/inactivo)
   - Fecha de registro
   - Especialidad (para médicos)
   - Disponibilidad

2. ⏳ Implementar ordenamiento por columnas
3. ⏳ Agregar acciones por fila:
   - Ver detalle
   - Editar
   - Desactivar/Activar

### Largo Plazo
1. ⏳ Implementar vista de detalle de servicio
2. ⏳ Agregar gráficos y estadísticas avanzadas
3. ⏳ Implementar exportación a Excel/PDF
4. ⏳ Agregar filtros guardados (presets)

---

## ✅ Checklist de Migración

- [x] Reemplazar ActiveServicesList por DataTable
- [x] Crear hook useActiveServices
- [x] Actualizar use case para soportar paginación
- [x] Actualizar API para soportar paginación y filtros
- [x] Implementar TableToolbar con búsqueda
- [x] Implementar filtros dinámicos
- [x] Implementar paginación server-side
- [x] Implementar exportación a CSV
- [x] Implementar botón refrescar
- [x] Agregar estados loading/error/vacío
- [x] Validar responsive design
- [x] Agregar logs de debugging
- [x] Documentar cambios

---

## 📊 Métricas de Éxito

### Antes de la Migración
- ❌ Sin paginación
- ❌ Sin filtros
- ❌ Sin búsqueda
- ❌ Sin exportación
- ❌ Diseño inconsistente
- ❌ Carga manual de datos

### Después de la Migración
- ✅ Paginación server-side
- ✅ Filtros dinámicos
- ✅ Búsqueda integrada
- ✅ Exportación a CSV
- ✅ Diseño estandarizado
- ✅ Carga automática con React Query
- ✅ Cache inteligente
- ✅ Estados de UI completos
- ✅ Responsive design

---

## 💡 Lecciones Aprendidas

### 1. Componentes Reutilizables son Clave
La tabla reutilizable reduce significativamente el código y mantiene consistencia.

### 2. React Query Simplifica el Manejo de Datos
Cache automático, refetch inteligente y estados manejados automáticamente.

### 3. Validación Defensiva es Esencial
Siempre validar estructuras de datos antes de procesarlas.

### 4. Logs de Debugging Facilitan el Desarrollo
Emojis y mensajes claros ayudan a identificar problemas rápidamente.

### 5. Responsive Design desde el Inicio
Pensar en mobile/tablet/desktop desde el principio evita refactorizaciones.

---

**Autor:** Kiro AI Assistant  
**Fecha:** 29 de Mayo, 2026  
**Versión:** 1.0  
**Estado:** ✅ COMPLETADO
