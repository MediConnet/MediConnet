import { httpClient } from '../../../shared/lib/http';
import type { Pharmacy } from '../domain/Pharmacy.entity';
import type { PharmacyBranch } from '../domain/PharmacyBranch.entity';
import type { Review } from '../domain/Review.entity';

/**
 * API: Obtener lista de farmacias
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/pharmacies
 */
export const getPharmaciesAPI = async (): Promise<Pharmacy[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<Pharmacy[]>('/pharmacies');
  // return response.data;

  // NOTE: Datos mock por ahora - remover cuando se implemente el backend
  return [
    {
      id: '1',
      name: 'Farmacias Medicity',
      logo: 'https://via.placeholder.com/300x200/06b6d4/ffffff?text=Medicity',
      description: 'Farmacia de confianza',
      totalBranches: 3,
      rating: 4.5,
      totalReviews: 120,
    },
    {
      id: '2',
      name: 'Farmacias Fybeca',
      logo: 'https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Fybeca',
      description: 'Somos parte de tu vida',
      totalBranches: 5,
      rating: 4.8,
      totalReviews: 250,
    },
    {
      id: '3',
      name: 'Farmacias Comunitarias',
      logo: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Comunitarias',
      description: 'Salud para tu comunidad',
      totalBranches: 8,
      rating: 4.6,
      totalReviews: 180,
    },
    {
      id: '4',
      name: 'Farmacias Económicas',
      logo: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Económicas',
      description: 'Precios accesibles',
      totalBranches: 12,
      rating: 4.4,
      totalReviews: 320,
    },
    {
      id: '5',
      name: "Pharmacy's",
      logo: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=Pharmacy',
      description: 'Ideas llenas de salud',
      totalBranches: 6,
      rating: 4.7,
      totalReviews: 150,
    },
    {
      id: '6',
      name: 'Farmacia El Descuento',
      logo: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Descuento',
      description: 'Los mejores precios',
      totalBranches: 4,
      rating: 4.5,
      totalReviews: 95,
    },
    {
      id: '7',
      name: 'Farmacias Sana Sana',
      logo: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Sana+Sana',
      description: 'Tu salud es nuestra prioridad',
      totalBranches: 7,
      rating: 4.6,
      totalReviews: 210,
    },
    {
      id: '8',
      name: 'Farmacias El Cisne',
      logo: 'https://via.placeholder.com/300x200/2563eb/ffffff?text=El+Cisne',
      description: 'Medicina de especialidad',
      totalBranches: 5,
      rating: 4.8,
      totalReviews: 175,
    },
    {
      id: '9',
      name: 'Farmayor',
      logo: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Farmayor',
      description: 'Tu Farmacéutica',
      totalBranches: 9,
      rating: 4.7,
      totalReviews: 280,
    },
    {
      id: '10',
      name: 'Farmacias Cruz Azul',
      logo: 'https://via.placeholder.com/300x200/2563eb/ffffff?text=Cruz+Azul',
      description: 'Me cuida',
      totalBranches: 6,
      rating: 4.5,
      totalReviews: 140,
    },
    {
      id: '11',
      name: 'Farmacias San Gregorio',
      logo: 'https://via.placeholder.com/300x200/991b1b/ffffff?text=San+Gregorio',
      description: 'Tradición y confianza',
      totalBranches: 4,
      rating: 4.6,
      totalReviews: 110,
    },
    {
      id: '12',
      name: 'Farmacias Salud Total',
      logo: 'https://via.placeholder.com/300x200/06b6d4/ffffff?text=Salud+Total',
      description: 'Cuidamos tu bienestar',
      totalBranches: 10,
      rating: 4.7,
      totalReviews: 290,
    },
  ];
};

/**
 * API: Obtener detalle de una farmacia
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/pharmacies/:id
 */
export const getPharmacyAPI = async (id: string): Promise<Pharmacy> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<Pharmacy>(`/pharmacies/${id}`);
  // return response.data;

  // NOTE: Datos mock por ahora - buscar en la lista de farmacias
  const pharmacies = await getPharmaciesAPI();
  const pharmacy = pharmacies.find((p) => p.id === id);
  
  if (pharmacy) {
    return pharmacy;
  }

  // Fallback si no se encuentra
  return {
    id,
    name: 'Farmacia',
    logo: 'https://via.placeholder.com/300x200/06b6d4/ffffff?text=Farmacia',
    description: 'Farmacia de confianza',
    totalBranches: 0,
    rating: 0,
    totalReviews: 0,
  };
};

/**
 * API: Obtener sucursales de una farmacia
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/pharmacies/:id/branches
 */
export const getPharmacyBranchesAPI = async (pharmacyId: string): Promise<PharmacyBranch[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<PharmacyBranch[]>(`/pharmacies/${pharmacyId}/branches`);
  // return response.data;

  // NOTE: Datos mock por ahora
  return [
    {
      id: '1',
      pharmacyId,
      name: 'Medicity El Condado',
      address: 'Av. Mariana de Jesús E7-50 y Alemania',
      phone: '+593987660042',
      schedule: 'Lun-Dom 8:30-21:00',
      hasDelivery: true,
      image: 'https://via.placeholder.com/400x300',
      rating: 4.5,
      totalReviews: 45,
    },
    {
      id: '2',
      pharmacyId,
      name: 'Medicity Cumbayá',
      address: 'Vía Interoceánica Km 12.5',
      phone: '+593987660042',
      schedule: 'Lun-Dom 8:30-21:00',
      hasDelivery: true,
      image: 'https://via.placeholder.com/400x300',
      rating: 4.7,
      totalReviews: 38,
    },
    {
      id: '3',
      pharmacyId,
      name: 'Medicity La Prensa',
      address: 'Av. La Prensa N58-125 y Galo Plaza',
      phone: '+593987660042',
      schedule: 'Lun-Dom 8:30-21:00',
      hasDelivery: true,
      image: 'https://via.placeholder.com/400x300',
      rating: 4.6,
      totalReviews: 37,
    },
  ];
};

/**
 * API: Obtener detalle de una sucursal
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/pharmacy-branches/:id
 */
export const getBranchAPI = async (branchId: string): Promise<PharmacyBranch> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<PharmacyBranch>(`/pharmacy-branches/${branchId}`);
  // return response.data;

  // NOTE: Datos mock por ahora
  return {
    id: branchId,
    pharmacyId: '1',
    name: 'Medicity Cumbayá',
    address: 'Vía Interoceánica Km 12.5',
    phone: '+593987660042',
    schedule: 'Lun-Dom 8:30-21:00',
    hasDelivery: true,
    image: 'https://via.placeholder.com/800x600',
    rating: 4.7,
    totalReviews: 38,
  };
};

/**
 * API: Obtener reseñas de una sucursal
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: GET /api/pharmacy-branches/:id/reviews
 */
export const getBranchReviewsAPI = async (branchId: string): Promise<Review[]> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.get<Review[]>(`/pharmacy-branches/${branchId}/reviews`);
  // return response.data;

  // NOTE: Datos mock por ahora - almacenar en localStorage para persistencia
  const storedReviews = localStorage.getItem(`reviews_${branchId}`);
  if (storedReviews) {
    return JSON.parse(storedReviews);
  }
  return [];
};

/**
 * API: Crear una reseña
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: POST /api/pharmacy-branches/:id/reviews
 */
export const createReviewAPI = async (params: { branchId: string; rating: number; comment?: string }): Promise<Review> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.post<Review>(`/pharmacy-branches/${params.branchId}/reviews`, params);
  // return response.data;

  // NOTE: Datos mock por ahora - guardar en localStorage
  const existingReviews = await getBranchReviewsAPI(params.branchId);
  
  // Obtener usuario desde localStorage
  const savedUser = localStorage.getItem('auth-user');
  let userId = 'user_1';
  let userName = 'Usuario';
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      userId = user.id || userId;
      userName = user.name || userName;
    } catch (error) {
      console.error('Error al parsear usuario:', error);
    }
  }
  
  const newReview: Review = {
    id: `review_${Date.now()}`,
    branchId: params.branchId,
    userId,
    userName,
    rating: params.rating,
    comment: params.comment,
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [...existingReviews, newReview];
  localStorage.setItem(`reviews_${params.branchId}`, JSON.stringify(updatedReviews));

  return newReview;
};

