# 📋 Tareas Pendientes del Frontend - MediConnect

Este documento contiene todas las tareas pendientes, mejoras y funcionalidades que faltan por implementar en el frontend de MediConnect.

---

## 📋 Índice

1. [Integración con Backend](#1-integración-con-backend)
2. [Funcionalidades Pendientes](#2-funcionalidades-pendientes)
3. [Mejoras de UX/UI](#3-mejoras-de-uxui)
4. [Validaciones y Manejo de Errores](#4-validaciones-y-manejo-de-errores)
5. [Optimizaciones y Performance](#5-optimizaciones-y-performance)
6. [Testing y Calidad](#6-testing-y-calidad)
7. [Documentación](#7-documentación)
8. [Infraestructura y Configuración](#8-infraestructura-y-configuración)

---

## 1. Integración con Backend

### 1.1. Endpoints Pendientes de Conectar

#### Panel de Médico Asociado a Clínica
- [ ] **GET `/api/doctors/clinic-info`** - Obtener información de clínica asociada
- [ ] **GET `/api/doctors/clinic/profile`** - Obtener perfil del médico asociado
- [ ] **PUT `/api/doctors/clinic/profile`** - Actualizar perfil del médico asociado
- [ ] **GET `/api/doctors/clinic/appointments`** - Obtener citas (sin info financiera)
- [ ] **PATCH `/api/doctors/clinic/appointments/:id/status`** - Actualizar estado de cita
- [ ] **GET `/api/doctors/clinic/reception/messages`** - Obtener mensajes con recepción
- [ ] **POST `/api/doctors/clinic/reception/messages`** - Enviar mensaje a recepción
- [ ] **PATCH `/api/doctors/clinic/reception/messages/read`** - Marcar mensajes como leídos
- [ ] **GET `/api/doctors/clinic/date-blocks`** - Obtener solicitudes de bloqueo
- [ ] **POST `/api/doctors/clinic/date-blocks/request`** - Solicitar bloqueo de fecha
- [ ] **GET `/api/doctors/clinic/notifications`** - Obtener notificaciones (opcional)

#### Panel de Clínica
- [ ] **Notificaciones Automáticas** - Implementar sistema de notificaciones en tiempo real
  - Notificaciones al médico cuando se agenda cita
  - Notificaciones a la clínica cuando hay nueva cita
  - Notificaciones al paciente (email/WhatsApp)

#### Panel de Insumos Médicos
- [ ] **GET `/api/supplies/profile`** - Obtener perfil de insumos médicos
- [ ] **PUT `/api/supplies/profile`** - Actualizar perfil
- [ ] **GET `/api/supplies/products`** - Obtener catálogo de productos
- [ ] **POST `/api/supplies/products`** - Crear producto
- [ ] **PUT `/api/supplies/products/:id`** - Actualizar producto
- [ ] **DELETE `/api/supplies/products/:id`** - Eliminar producto
- [ ] **GET `/api/supplies/orders`** - Obtener pedidos
- [ ] **PATCH `/api/supplies/orders/:id/status`** - Actualizar estado de pedido

#### Panel de Laboratorio
- [ ] **GET `/api/laboratories/profile`** - Obtener perfil de laboratorio
- [ ] **PUT `/api/laboratories/profile`** - Actualizar perfil
- [ ] **GET `/api/laboratories/appointments`** - Obtener citas de laboratorio
- [ ] **PATCH `/api/laboratories/appointments/:id/status`** - Actualizar estado de cita

#### Panel de Ambulancia
- [ ] **GET `/api/ambulances/profile`** - Obtener perfil de ambulancia
- [ ] **PUT `/api/ambulances/profile`** - Actualizar perfil
- [ ] **GET `/api/ambulances/requests`** - Obtener solicitudes de servicio
- [ ] **PATCH `/api/ambulances/requests/:id/status`** - Actualizar estado de solicitud

#### Home y Búsqueda
- [ ] **GET `/api/home/content`** - Obtener contenido dinámico de home
- [ ] **GET `/api/home/features`** - Obtener características de la plataforma
- [ ] **GET `/api/home/featured-services`** - Obtener servicios destacados
- [ ] **GET `/api/search`** - Búsqueda de servicios (médicos, farmacias, etc.)
- [ ] **GET `/api/search/filters`** - Obtener filtros disponibles para búsqueda

### 1.2. Mapeo de Datos del Backend

- [ ] **Normalizar respuestas del backend** - Asegurar que todos los endpoints mapeen correctamente:
  - `snake_case` → `camelCase`
  - Arrays a objetos (ej: `clinic_schedules` → `generalSchedule`)
  - Formato de fechas y horas
  - Valores por defecto para campos opcionales

- [ ] **Manejo de errores del backend** - Implementar manejo consistente de:
  - Errores 400 (Bad Request) con mensajes de validación
  - Errores 401 (Unauthorized) con redirección a login
  - Errores 403 (Forbidden) con mensaje apropiado
  - Errores 404 (Not Found) con mensaje informativo
  - Errores 500 (Server Error) con mensaje genérico

---

## 2. Funcionalidades Pendientes

### 2.1. Panel de Paciente

- [ ] **Dashboard de Paciente** - Crear panel completo para pacientes
  - [ ] Ver citas agendadas
  - [ ] Ver historial médico
  - [ ] Ver favoritos (médicos, farmacias, etc.)
  - [ ] Ver notificaciones
  - [ ] Gestionar perfil personal

- [ ] **Búsqueda y Filtros** - Implementar búsqueda avanzada
  - [ ] Búsqueda por especialidad
  - [ ] Búsqueda por ubicación (mapa)
  - [ ] Filtros por precio, disponibilidad, calificación
  - [ ] Ordenamiento de resultados

- [ ] **Agendamiento de Citas** - Sistema completo de reservas
  - [ ] Selección de fecha y hora disponible
  - [ ] Confirmación de cita
  - [ ] Cancelación de cita
  - [ ] Recordatorios de cita

- [ ] **Sistema de Pagos** - Integración con pasarela de pagos
  - [ ] Selección de método de pago
  - [ ] Procesamiento de pago
  - [ ] Confirmación de pago
  - [ ] Historial de pagos

### 2.2. Panel de Médico

- [ ] **Gestión de Horarios Avanzada** - Mejoras en configuración de horarios
  - [ ] Bloques de tiempo personalizados
  - [ ] Pausas/descansos en horarios
  - [ ] Horarios especiales por fecha
  - [ ] Disponibilidad en tiempo real

- [ ] **Sistema de Diagnósticos Completo** - Expandir funcionalidad de diagnósticos
  - [ ] Plantillas de diagnósticos
  - [ ] Historial de diagnósticos por paciente
  - [ ] Exportar diagnósticos (PDF)
  - [ ] Compartir diagnósticos con otros médicos

- [ ] **Gestión de Pacientes** - Funcionalidades adicionales
  - [ ] Historial médico completo del paciente
  - [ ] Notas privadas sobre pacientes
  - [ ] Recordatorios personalizados
  - [ ] Comunicación directa con pacientes

### 2.3. Panel de Farmacia

- [ ] **Gestión de Inventario** - Sistema de inventario completo
  - [ ] Control de stock
  - [ ] Alertas de stock bajo
  - [ ] Historial de movimientos
  - [ ] Categorización de productos

- [ ] **Gestión de Pedidos** - Mejoras en gestión de pedidos
  - [ ] Asignación de motorizado
  - [ ] Seguimiento de entregas en tiempo real
  - [ ] Notificaciones de estado de pedido
  - [ ] Historial de pedidos

### 2.4. Panel de Clínica

- [ ] **Reportes y Estadísticas** - Dashboard con métricas avanzadas
  - [ ] Reportes de ingresos
  - [ ] Estadísticas de citas por médico
  - [ ] Análisis de ocupación
  - [ ] Exportar reportes (PDF/Excel)

- [ ] **Gestión de Horarios de Médicos** - Mejoras en horarios
  - [ ] Vista de calendario mensual
  - [ ] Conflictos de horarios
  - [ ] Solicitudes de cambio de horario
  - [ ] Aprobación/rechazo de solicitudes

### 2.5. Panel de Administrador

- [ ] **Gestión de Usuarios** - Administración completa de usuarios
  - [ ] Lista de todos los usuarios
  - [ ] Activar/desactivar usuarios
  - [ ] Ver detalles de usuario
  - [ ] Historial de actividad de usuario

- [ ] **Gestión de Categorías de Servicios** - CRUD completo
  - [ ] Crear categorías
  - [ ] Editar categorías
  - [ ] Eliminar categorías
  - [ ] Asignar categorías a servicios

- [ ] **Gestión de Ciudades** - Administración de ubicaciones
  - [ ] Agregar ciudades
  - [ ] Editar ciudades
  - [ ] Eliminar ciudades
  - [ ] Asignar ciudades a servicios

### 2.6. Funcionalidades Generales

- [ ] **Sistema de Notificaciones en Tiempo Real** - Notificaciones push
  - [ ] Integración con servicio de notificaciones push
  - [ ] Notificaciones en navegador
  - [ ] Centro de notificaciones
  - [ ] Configuración de preferencias de notificaciones

- [ ] **Sistema de Mensajería** - Chat entre usuarios
  - [ ] Chat entre paciente y médico
  - [ ] Chat entre médico y clínica
  - [ ] Notificaciones de mensajes nuevos
  - [ ] Historial de conversaciones

- [ ] **Sistema de Reseñas y Calificaciones** - Mejoras
  - [ ] Responder a reseñas
  - [ ] Filtros de reseñas
  - [ ] Estadísticas de reseñas
  - [ ] Moderación de reseñas

---

## 3. Mejoras de UX/UI

### 3.1. Componentes UI

- [ ] **Mapa Interactivo** - Integración real de mapas
  - [ ] Integrar Google Maps o Mapbox
  - [ ] Marcadores de ubicación
  - [ ] Rutas y direcciones
  - [ ] Búsqueda de ubicaciones

- [ ] **Componente de Calendario** - Calendario mejorado
  - [ ] Vista mensual/semanal/diaria
  - [ ] Selección de múltiples fechas
  - [ ] Indicadores visuales de disponibilidad
  - [ ] Integración con horarios

- [ ] **Componente de Búsqueda Avanzada** - Búsqueda mejorada
  - [ ] Autocompletado
  - [ ] Sugerencias de búsqueda
  - [ ] Historial de búsquedas
  - [ ] Filtros visuales

- [ ] **Componente de Carga de Imágenes** - Mejoras en upload
  - [ ] Preview de imágenes
  - [ ] Recorte de imágenes
  - [ ] Compresión automática
  - [ ] Múltiples imágenes

### 3.2. Responsive Design

- [ ] **Optimización Mobile** - Mejoras para dispositivos móviles
  - [ ] Menús adaptativos
  - [ ] Tablas responsivas
  - [ ] Formularios optimizados para móvil
  - [ ] Touch gestures

- [ ] **Tablet Optimization** - Optimización para tablets
  - [ ] Layout adaptativo
  - [ ] Navegación mejorada
  - [ ] Uso eficiente del espacio

### 3.3. Accesibilidad

- [ ] **ARIA Labels** - Agregar etiquetas ARIA
  - [ ] Etiquetas en botones
  - [ ] Etiquetas en formularios
  - [ ] Etiquetas en navegación
  - [ ] Etiquetas en modales

- [ ] **Navegación por Teclado** - Mejoras en navegación
  - [ ] Tab order lógico
  - [ ] Atajos de teclado
  - [ ] Focus visible
  - [ ] Skip links

- [ ] **Contraste de Colores** - Mejoras visuales
  - [ ] Verificar contraste WCAG
  - [ ] Modo de alto contraste
  - [ ] Tamaños de fuente ajustables

### 3.4. Animaciones y Transiciones

- [ ] **Animaciones de Carga** - Mejoras visuales
  - [ ] Skeleton loaders
  - [ ] Spinners mejorados
  - [ ] Transiciones suaves
  - [ ] Feedback visual de acciones

- [ ] **Microinteracciones** - Detalles de UX
  - [ ] Hover effects
  - [ ] Click feedback
  - [ ] Scroll animations
  - [ ] Page transitions

---

## 4. Validaciones y Manejo de Errores

### 4.1. Validaciones de Formularios

- [ ] **Validaciones en Tiempo Real** - Validación mientras el usuario escribe
  - [ ] Validación de email en tiempo real
  - [ ] Validación de teléfono en tiempo real
  - [ ] Validación de contraseña con indicadores
  - [ ] Validación de campos requeridos

- [ ] **Mensajes de Error Mejorados** - Mensajes más claros
  - [ ] Mensajes específicos por tipo de error
  - [ ] Sugerencias de corrección
  - [ ] Ejemplos de formato correcto
  - [ ] Mensajes en español (localización)

- [ ] **Validaciones del Backend** - Sincronizar validaciones
  - [ ] Validaciones de longitud de campos
  - [ ] Validaciones de formato
  - [ ] Validaciones de negocio
  - [ ] Validaciones de unicidad

### 4.2. Manejo de Errores

- [ ] **Error Boundaries** - Captura de errores de React
  - [ ] Error boundary global
  - [ ] Error boundaries por feature
  - [ ] Páginas de error personalizadas
  - [ ] Logging de errores

- [ ] **Manejo de Errores de Red** - Mejoras en errores de conexión
  - [ ] Detección de conexión offline
  - [ ] Reintentos automáticos
  - [ ] Mensajes informativos
  - [ ] Modo offline

- [ ] **Logging y Monitoreo** - Sistema de logging
  - [ ] Integración con servicio de logging (Sentry, LogRocket)
  - [ ] Logging de errores críticos
  - [ ] Tracking de errores de usuario
  - [ ] Analytics de errores

---

## 5. Optimizaciones y Performance

### 5.1. Carga y Rendimiento

- [ ] **Code Splitting** - División de código
  - [ ] Lazy loading de rutas
  - [ ] Lazy loading de componentes pesados
  - [ ] Dynamic imports
  - [ ] Chunk optimization

- [ ] **Optimización de Imágenes** - Mejoras en imágenes
  - [ ] Lazy loading de imágenes
  - [ ] WebP format support
  - [ ] Responsive images
  - [ ] Image compression

- [ ] **Caching** - Sistema de caché
  - [ ] Cache de API responses
  - [ ] Cache de imágenes
  - [ ] Service Workers
  - [ ] LocalStorage optimization

### 5.2. Optimización de Estado

- [ ] **Migración a Zustand** - Completar migración
  - [ ] Migrar auth store a Zustand
  - [ ] Migrar UI store a Zustand
  - [ ] Eliminar stores antiguos
  - [ ] Optimizar selectors

- [ ] **React Query Optimization** - Mejoras en queries
  - [ ] Optimizar cache keys
  - [ ] Implementar prefetching
  - [ ] Optimizar refetch strategies
  - [ ] Implementar optimistic updates

### 5.3. Bundle Size

- [ ] **Tree Shaking** - Eliminar código no usado
  - [ ] Verificar imports
  - [ ] Eliminar dependencias no usadas
  - [ ] Optimizar Material-UI imports
  - [ ] Analizar bundle size

- [ ] **Dependencies Optimization** - Optimizar dependencias
  - [ ] Revisar dependencias pesadas
  - [ ] Buscar alternativas más ligeras
  - [ ] Actualizar dependencias
  - [ ] Eliminar dependencias duplicadas

---

## 6. Testing y Calidad

### 6.1. Testing Unitario

- [ ] **Configurar Testing Framework** - Setup de testing
  - [ ] Configurar Vitest o Jest
  - [ ] Configurar React Testing Library
  - [ ] Configurar coverage reports
  - [ ] Configurar CI/CD para tests

- [ ] **Tests de Componentes** - Tests de UI
  - [ ] Tests de componentes principales
  - [ ] Tests de formularios
  - [ ] Tests de modales
  - [ ] Tests de navegación

- [ ] **Tests de Hooks** - Tests de lógica
  - [ ] Tests de custom hooks
  - [ ] Tests de use cases
  - [ ] Tests de stores
  - [ ] Tests de utilities

### 6.2. Testing de Integración

- [ ] **Tests E2E** - Tests end-to-end
  - [ ] Configurar Playwright o Cypress
  - [ ] Tests de flujos críticos
  - [ ] Tests de autenticación
  - [ ] Tests de paneles principales

- [ ] **Tests de API** - Tests de integración
  - [ ] Tests de endpoints
  - [ ] Tests de mapeo de datos
  - [ ] Tests de manejo de errores
  - [ ] Tests de validaciones

### 6.3. Quality Assurance

- [ ] **Linting y Formatting** - Mejoras en código
  - [ ] Configurar ESLint rules estrictas
  - [ ] Configurar Prettier
  - [ ] Pre-commit hooks
  - [ ] CI/CD checks

- [ ] **Type Safety** - Mejoras en TypeScript
  - [ ] Habilitar strict mode
  - [ ] Eliminar `any` types
  - [ ] Mejorar tipos de API responses
  - [ ] Type guards

---

## 7. Documentación

### 7.1. Documentación de Código

- [ ] **JSDoc Comments** - Documentar funciones
  - [ ] Documentar funciones públicas
  - [ ] Documentar hooks
  - [ ] Documentar componentes
  - [ ] Documentar tipos

- [ ] **README por Feature** - Documentación de features
  - [ ] README para cada feature
  - [ ] Ejemplos de uso
  - [ ] Diagramas de flujo
  - [ ] Guías de desarrollo

### 7.2. Documentación de Usuario

- [ ] **Guías de Usuario** - Documentación para usuarios
  - [ ] Guía de registro
  - [ ] Guía de uso de paneles
  - [ ] FAQ
  - [ ] Video tutorials

- [ ] **Documentación de API** - Documentar integraciones
  - [ ] Documentar todos los endpoints
  - [ ] Ejemplos de requests/responses
  - [ ] Códigos de error
  - [ ] Rate limiting

---

## 8. Infraestructura y Configuración

### 8.1. Variables de Entorno

- [ ] **Configuración de Entornos** - Mejoras en configuración
  - [ ] Variables para desarrollo
  - [ ] Variables para staging
  - [ ] Variables para producción
  - [ ] Validación de variables requeridas

### 8.2. Build y Deploy

- [ ] **Optimización de Build** - Mejoras en build
  - [ ] Optimizar Vite config
  - [ ] Configurar source maps
  - [ ] Configurar environment variables
  - [ ] Optimizar assets

- [ ] **CI/CD Pipeline** - Automatización
  - [ ] Configurar GitHub Actions o similar
  - [ ] Tests automáticos en PR
  - [ ] Build automático
  - [ ] Deploy automático

### 8.3. Seguridad

- [ ] **Seguridad Frontend** - Mejoras de seguridad
  - [ ] Sanitización de inputs
  - [ ] Protección XSS
  - [ ] Protección CSRF
  - [ ] Validación de tokens

- [ ] **Rate Limiting** - Protección contra abuso
  - [ ] Rate limiting en requests
  - [ ] Throttling de acciones
  - [ ] Debouncing de búsquedas
  - [ ] Protección de formularios

---

## 9. Tareas Específicas por Archivo

### 9.1. TODOs en Código

- [ ] **`src/shared/ui/Map.tsx`** - Integrar mapa real (Google Maps/Mapbox)
- [ ] **`src/features/doctor-panel/presentation/hooks/useReceptionMessages.ts`** - Obtener `doctorId` del auth en lugar de hardcode
- [ ] **`src/features/doctor-panel/presentation/hooks/useDateBlockRequests.ts`** - Obtener `doctorId` del auth en lugar de hardcode
- [ ] **`src/features/supplies-panel/infrastructure/supply.api.ts`** - Conectar todos los endpoints con backend real
- [ ] **`src/features/laboratory-panel/infrastructure/laboratories.repository.ts`** - Reemplazar mocks con llamadas reales a API
- [ ] **`src/features/supplies-panel/infrastructure/supplies.repository.ts`** - Reemplazar mocks con llamadas reales a API
- [ ] **`src/shared/layouts/AppLayout.tsx`** - Agregar navegación completa y menú de usuario
- [ ] **`src/shared/components/UserMenu.tsx`** - Agregar más opciones del menú (perfil, configuración, etc.)
- [ ] **`src/shared/components/NavigationBar.tsx`** - Agregar indicador visual de página activa más destacado
- [ ] **`src/features/home/presentation/components/IconMapper.tsx`** - Agregar más íconos según sea necesario
- [ ] **`src/features/home/presentation/components/HeroSection.tsx`** - Agregar animaciones si es necesario
- [ ] **`src/features/supplies-panel/presentation/components/SupplyStoreSearch.tsx`** - Implementar lógica para buscar tienda más cercana

### 9.2. Mejoras de Código

- [ ] **Eliminar código comentado** - Limpiar código no usado
- [ ] **Refactorizar componentes grandes** - Dividir componentes complejos
- [ ] **Estandarizar nombres** - Unificar convenciones de nombres
- [ ] **Eliminar duplicación** - DRY principle
- [ ] **Mejorar tipos TypeScript** - Eliminar `any` y mejorar tipos

---

## 10. Priorización

### 🔴 Alta Prioridad (Crítico para MVP)

1. Integración completa con backend para paneles principales
2. Sistema de notificaciones en tiempo real
3. Manejo robusto de errores
4. Validaciones de formularios completas
5. Optimización de performance básica

### 🟡 Media Prioridad (Importante para UX)

1. Mejoras de UI/UX
2. Sistema de búsqueda avanzada
3. Panel de paciente completo
4. Integración de mapas real
5. Testing básico

### 🟢 Baja Prioridad (Mejoras futuras)

1. Animaciones avanzadas
2. Documentación completa
3. Testing exhaustivo
4. Optimizaciones avanzadas
5. Funcionalidades adicionales

---

## 11. Notas Finales

- Este documento debe actualizarse regularmente conforme se completen tareas
- Las tareas marcadas con ✅ deben moverse a una sección de "Completadas"
- Priorizar tareas según las necesidades del negocio
- Coordinar con el equipo de backend para sincronizar integraciones

---

**Última actualización:** 2025-01-15
**Versión:** 1.0
