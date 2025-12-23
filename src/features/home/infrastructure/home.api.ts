import { ROUTES } from '../../../app/config/constants';
import type { Feature } from '../domain/Feature.entity';
import type { FeaturedService } from '../domain/FeaturedService.entity';
import type { HomeContent } from '../domain/HomeContent.entity';
import type { ServiceCategory } from '../domain/ServiceCategory.entity';

/**
 * API: Obtener contenido principal de la página home
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/home/content
 */
export const getHomeContentAPI = async (): Promise<HomeContent> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<HomeContent>('/home/content');
  // return response.data;

  // NOTE: Datos mock por ahora - remover cuando se implemente el backend
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
};

/**
 * API: Obtener características de la plataforma
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/home/features
 */
export const getFeaturesAPI = async (): Promise<Feature[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<Feature[]>('/home/features');
  // return response.data;

  // NOTE: Datos mock por ahora - remover cuando se implemente el backend
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
};

/**
 * API: Obtener servicios destacados
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/home/featured-services
 */
export const getFeaturedServicesAPI = async (): Promise<FeaturedService[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<FeaturedService[]>('/home/featured-services');
  // return response.data;

  // NOTE: Datos mock por ahora - remover cuando se implemente el backend
  return [];
};

/**
 * API: Obtener catálogo de servicios
 */
export const getServiceCategoriesAPI = async (): Promise<ServiceCategory[]> => {
  // Simulamos delay
  // await new Promise(resolve => setTimeout(resolve, 300));

  return [
    {
      id: '1',
      title: 'Médicos',
      description: 'Encuentra especialistas médicos',
      icon: 'LocalHospital', // Mapea a DoctorsIcon
      route: ROUTES.SPECIALTIES,
      color: '#3b82f6', // Azul brillante
      shadowColor: 'rgba(59, 130, 246, 0.4)',
    },
    {
      id: '2',
      title: 'Farmacias',
      description: 'Farmacias y medicamentos',
      icon: 'Business', // Mapea a PharmacyIcon
      route: ROUTES.PHARMACIES,
      color: '#22c55e', // Verde vibrante
      shadowColor: 'rgba(34, 197, 94, 0.4)',
    },
    {
      id: '3',
      title: 'Laboratorios',
      description: 'Exámenes y análisis clínicos',
      icon: 'Science', // Mapea a LabIcon
      route: ROUTES.LABORATORIES,
      color: '#a855f7', // Morado
      shadowColor: 'rgba(168, 85, 247, 0.4)',
    },
    {
      id: '4',
      title: 'Ambulancias',
      description: 'Servicios de emergencia',
      icon: 'LocalShipping', // Mapea a AmbulanceIcon
      route: ROUTES.AMBULANCES,
      color: '#ef4444', // Rojo
      shadowColor: 'rgba(239, 68, 68, 0.4)',
    },
    {
      id: '5',
      title: 'Insumos Médicos',
      description: 'Equipos y suministros médicos',
      icon: 'Inventory', // Asegúrate de tener este ícono mapeado o usa uno similar
      route: ROUTES.SUPPLIES,
      color: '#f97316', // Naranja
      shadowColor: 'rgba(249, 115, 22, 0.4)',
    },
  ];
};
