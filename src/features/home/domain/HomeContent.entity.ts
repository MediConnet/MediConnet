/**
 * Entidad HomeContent - Contenido principal de la página home
 */
export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
  };
  features: {
    title: string;
    subtitle: string;
  };
  featuredServices: {
    title: string;
    subtitle: string;
    rotationInterval?: number; // Segundos para rotar anuncios
  };
  joinSection: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
  };
  footer: {
    copyright: string;
    links: {
      label: string;
      url: string;
    }[];
  };
}

