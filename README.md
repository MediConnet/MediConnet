# MediConnect

Plataforma para conectar pacientes con profesionales de la salud y servicios de ambulancia.

## 🏗️ Estructura del Proyecto

Este proyecto sigue una arquitectura basada en **Clean Architecture** y **Feature-Sliced Design**, organizando el código por features independientes.

```
src/
├── app/                              # Configuración global y arranque
│   ├── providers/                    # Providers de React (Query, Auth, Theme)
│   ├── router/                       # Configuración de rutas y guards
│   ├── store/                        # Stores de Zustand (auth, UI)
│   ├── config/                       # Variables de entorno y constantes
│   └── index.tsx                     # Entry point de la aplicación
│
├── shared/                           # Código reutilizable (sin lógica de negocio)
│   ├── ui/                           # Componentes UI reutilizables
│   ├── layouts/                      # Layouts de la aplicación
│   ├── hooks/                        # Hooks compartidos
│   ├── lib/                          # Utilidades (HTTP, formateo, etc.)
│   └── types/                        # Tipos compartidos
│
└── features/                         # Features del negocio
    ├── auth/                         # 🔐 Autenticación (login, register)
    ├── search/                       # 🔍 Búsqueda de médicos/ambulancias
    ├── doctors/                      # 👨‍⚕️ Gestión de médicos
    ├── ambulance/                    # 🚑 Gestión de ambulancias
    └── booking/                      # 📅 Reservas y pagos
```

Cada feature sigue la estructura:
- `domain/` - Entidades y reglas de negocio
- `application/` - Casos de uso
- `infrastructure/` - APIs y repositorios
- `presentation/` - Componentes, páginas y hooks de React

## 🚀 Inicio Rápido

### Instalación

```bash
pnpm install
```

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=MediConnect
```

### Desarrollo

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## 📦 Dependencias Principales

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **React Router** - Enrutamiento
- **React Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP
- **Material UI** - Librería de componentes UI
- **Zustand** - Gestión de estado del cliente (TODO: configurar)

## 🎯 Features Implementadas

### ✅ Estructura Base
- [x] Configuración de providers (Query, Auth, Theme, MUI Theme)
- [x] Sistema de rutas con guards (ProtectedRoute, RoleRoute)
- [x] Stores temporales (auth, UI) - TODO: Migrar a Zustand
- [x] Cliente HTTP configurado con interceptors
- [x] Página de Login con Material UI
- [x] Componentes UI base (Button, Input, Modal, Map)

### 🔨 En Desarrollo
- [ ] Feature de búsqueda completa
- [ ] Feature de doctores completa
- [ ] Feature de ambulancias completa
- [ ] Feature de reservas completa
- [ ] Autenticación completa
- [ ] Integración con mapas (Google Maps/Mapbox)

## 📝 Convenciones

- **Features**: Cada feature es independiente y autocontenida
- **Shared**: Solo código reutilizable, sin lógica de negocio
- **Types**: Usar TypeScript estricto
- **Imports**: Usar imports de tipo cuando sea necesario (`import type`)

## 🤝 Contribuir

1. Crea una rama para tu feature
2. Implementa siguiendo la estructura de carpetas
3. Asegúrate de que el código compile sin errores
4. Crea un PR con una descripción clara

## 📄 Licencia

MIT
