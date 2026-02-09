/**
 * Entidad SupplyStore - Tienda de insumos médicos
 */

// Producto dentro de la tienda (estructura del backend)
export interface SupplyStoreProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  type: string; // "Movilidad", "Ortopedia", etc. (se mapea a category)
  stock?: number;
  isActive?: boolean;
}

export interface SupplyStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  schedule: string;
  image: string;
  products: SupplyStoreProduct[]; // Cambiado de string[] a SupplyStoreProduct[]
  hasDelivery?: boolean;
  sponsored?: boolean;
}

