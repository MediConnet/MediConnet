import { httpClient } from '../../../shared/lib/http';
import type { HomeContent } from '../domain/HomeContent.entity';
import type { Feature } from '../domain/Feature.entity';
import type { FeaturedService } from '../domain/FeaturedService.entity';

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
      ctaLink: '/search',
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

