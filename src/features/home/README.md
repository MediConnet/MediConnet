# Feature: Home

Este feature contiene la página principal (home) de la aplicación Medify.

## 📁 Estructura

```
home/
├── domain/                    # Entidades y tipos
│   ├── Feature.entity.ts      # Entidad de características
│   ├── FeaturedService.entity.ts  # Entidad de servicios destacados
│   └── HomeContent.entity.ts  # Entidad de contenido principal
├── application/               # Casos de uso
│   ├── get-home-content.usecase.ts
│   ├── get-features.usecase.ts
│   └── get-featured-services.usecase.ts
├── infrastructure/            # APIs y repositorios
│   ├── home.api.ts           # Llamadas al backend
│   └── home.repository.ts    # Repositorio
└── presentation/              # Componentes y hooks
    ├── components/
    │   ├── HeroSection.tsx
    │   └── IconMapper.tsx
    ├── hooks/
    │   └── useHome.ts        # Hooks de React Query
    └── pages/
        └── HomePage.tsx
```

## 🔌 Conexión con Backend

### Endpoints Esperados

Cuando el backend esté listo, deberás actualizar los siguientes archivos:

#### 1. `home.api.ts`

Descomentar las llamadas reales y remover los datos mock:

```typescript
// Endpoint: GET /api/home/content
export const getHomeContentAPI = async (): Promise<HomeContent> => {
  const response = await httpClient.get<HomeContent>('/home/content');
  return response.data;
};

// Endpoint: GET /api/home/features
export const getFeaturesAPI = async (): Promise<Feature[]> => {
  const response = await httpClient.get<Feature[]>('/home/features');
  return response.data;
};

// Endpoint: GET /api/home/featured-services
export const getFeaturedServicesAPI = async (): Promise<FeaturedService[]> => {
  const response = await httpClient.get<FeaturedService[]>('/home/featured-services');
  return response.data;
};
```

### Estructura de Respuesta Esperada

#### GET /api/home/content
```json
{
  "hero": {
    "title": "Tu Salud es Nuestra Prioridad",
    "subtitle": "Encuentra médicos, farmacias, laboratorios y servicios de salud cerca de ti",
    "ctaText": "Explora Nuestros Servicios",
    "ctaLink": "/search"
  },
  "features": {
    "title": "¿Por Qué Elegirnos?",
    "subtitle": "La mejor plataforma para conectar con servicios de salud"
  },
  "featuredServices": {
    "title": "Profesionales Premium",
    "subtitle": "Servicios verificados con la mejor calidad y atención",
    "rotationInterval": 5
  },
  "joinSection": {
    "title": "Únete a Medify",
    "subtitle": "La plataforma que conecta a pacientes y profesionales de la salud",
    "ctaText": "¡Regístrate ahora!",
    "ctaLink": "/register"
  },
  "footer": {
    "copyright": "Conectando salud y bienestar | Medify © 2025",
    "links": [
      { "label": "Política de privacidad", "url": "/privacy" },
      { "label": "Términos y condiciones", "url": "/terms" }
    ]
  }
}
```

#### GET /api/home/features
```json
[
  {
    "id": "1",
    "icon": "LocationOn",
    "title": "Encuentra servicios cercanos",
    "description": "Localiza médicos, farmacias y laboratorios en tu zona",
    "order": 1
  },
  {
    "id": "2",
    "icon": "AccessTime",
    "title": "Disponible 24/7",
    "description": "Accede a servicios de salud en cualquier momento",
    "order": 2
  }
]
```

#### GET /api/home/featured-services
```json
[
  {
    "id": "1",
    "name": "Dr. Juan Pérez",
    "description": "Cardiólogo con 15 años de experiencia",
    "imageUrl": "https://example.com/image.jpg",
    "rating": 4.8,
    "totalReviews": 120,
    "category": "doctor",
    "location": {
      "address": "Av. Principal 123",
      "city": "Lima"
    },
    "isPremium": true,
    "order": 1
  }
]
```

## 📝 Notas

- Los datos mock están en `home.api.ts` y se usarán hasta que el backend esté disponible
- Los hooks (`useHomeContent`, `useFeatures`, `useFeaturedServices`) ya están configurados con React Query
- El componente `IconMapper` mapea nombres de íconos a componentes de Material UI
- Los servicios destacados se refrescan automáticamente cada 5 segundos (configurable)

## ✅ Estado Actual

- ✅ Estructura completa de Clean Architecture
- ✅ Entidades del dominio definidas
- ✅ Casos de uso implementados
- ✅ APIs preparadas (con datos mock)
- ✅ Hooks de React Query configurados
- ✅ Componentes actualizados para usar datos dinámicos
- ⏳ Pendiente: Conectar con endpoints reales del backend

