import { httpClient, extractData } from '../../../shared/lib/http';
import { ROUTES } from '../../../app/config/constants';
import type { Feature } from '../domain/Feature.entity';
import type { FeaturedService } from '../domain/FeaturedService.entity';
import type { HomeContent } from '../domain/HomeContent.entity';
import type { ServiceCategory } from '../domain/ServiceCategory.entity';

/**
 * API: Obtener contenido principal de la página home
 * Endpoint: GET /api/home/content
 */
export const getHomeContentAPI = async (): Promise<HomeContent> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: HomeContent }>(
      '/home/content'
    );
    return extractData(response);
  } catch (error) {
    // Fallback a datos mock si el endpoint no está disponible
    console.warn('Home content endpoint not available, using mock data');
    return {
      hero: {
        title: 'Tu Salud es Nuestra Prioridad',
        subtitle: 'Encuentra médicos, farmacias, laboratorios y servicios de salud cerca de ti',
        ctaText: 'Explora Nuestros Servicios',
        ctaLink: '/services',
      },
      features: {
        title: '¿Por Qué Elegirnos?',
        subtitle: 'La mejor plataforma para conectar con servicios de salud',
      },
      featuredServices: {
        title: 'Profesionales Premium',
        subtitle: 'Servicios verificados con la mejor calidad y atención',
        rotationInterval: 5,
      },
      joinSection: {
        title: 'Únete a Medify',
        subtitle: 'La plataforma que conecta a pacientes y profesionales de la salud',
        ctaText: '¡Regístrate ahora!',
        ctaLink: '/register',
      },
      footer: {
        copyright: 'Conectando salud y bienestar | Medify © 2025',
        links: [
          { label: 'Política de privacidad', url: '/privacy' },
          { label: 'Términos y condiciones', url: '/terms' },
        ],
      },
    };
  }
};

/**
 * API: Obtener características de la plataforma
 * Endpoint: GET /api/home/features
 */
export const getFeaturesAPI = async (): Promise<Feature[]> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: Feature[] }>(
      '/home/features'
    );
    return extractData(response);
  } catch (error) {
    // Fallback a datos mock
    console.warn('Features endpoint not available, using mock data');
    return [
      {
        id: '1',
        icon: 'LocationOn',
        title: 'Encuentra servicios cercanos',
        description: 'Localiza médicos, farmacias y laboratorios en tu zona',
        order: 1,
      },
      {
        id: '2',
        icon: 'AccessTime',
        title: 'Disponible 24/7',
        description: 'Accede a servicios de salud en cualquier momento',
        order: 2,
      },
      {
        id: '3',
        icon: 'Verified',
        title: 'Profesionales verificados',
        description: 'Todos nuestros proveedores están certificados',
        order: 3,
      },
      {
        id: '4',
        icon: 'Security',
        title: 'Seguro y confiable',
        description: 'Tu información de salud está protegida',
        order: 4,
      },
    ];
  }
};

/**
 * API: Obtener servicios destacados
 * Endpoint: GET /api/home/featured-services
 */
export const getFeaturedServicesAPI = async (): Promise<FeaturedService[]> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: FeaturedService[] }>(
      '/home/featured-services'
    );
    return extractData(response);
  } catch (error) {
    // Fallback a array vacío
    console.warn('Featured services endpoint not available, using empty array');
    return [];
  }
};

/**
 * API: Obtener catálogo de servicios
 * Endpoint: GET /api/home/service-categories
 * Nota: Este endpoint puede no existir en el backend, por lo que retorna datos estáticos
 */
export const getServiceCategoriesAPI = async (): Promise<ServiceCategory[]> => {
  // Este es un catálogo estático que no requiere backend
  return [
    {
      id: '1',
      title: 'Médicos',
      description: 'Encuentra especialistas médicos',
      icon: 'LocalHospital',
      route: ROUTES.SPECIALTIES,
      color: '#3b82f6',
      shadowColor: 'rgba(59, 130, 246, 0.4)',
    },
    {
      id: '2',
      title: 'Farmacias',
      description: 'Farmacias y medicamentos',
      icon: 'Business',
      route: ROUTES.PHARMACIES,
      color: '#22c55e',
      shadowColor: 'rgba(34, 197, 94, 0.4)',
    },
    {
      id: '3',
      title: 'Laboratorios',
      description: 'Exámenes y análisis clínicos',
      icon: 'Science',
      route: ROUTES.LABORATORIES,
      color: '#a855f7',
      shadowColor: 'rgba(168, 85, 247, 0.4)',
    },
    {
      id: '4',
      title: 'Ambulancias',
      description: 'Servicios de emergencia',
      icon: 'LocalShipping',
      route: ROUTES.AMBULANCES,
      color: '#ef4444',
      shadowColor: 'rgba(239, 68, 68, 0.4)',
    },
    {
      id: '5',
      title: 'Insumos Médicos',
      description: 'Equipos y suministros médicos',
      icon: 'Inventory',
      route: ROUTES.SUPPLIES,
      color: '#f97316',
      shadowColor: 'rgba(249, 115, 22, 0.4)',
    },
  ];
};
