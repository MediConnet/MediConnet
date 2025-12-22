/**
 * Entidad SupplyStore - Tienda de insumos médicos
 */
export interface SupplyStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  schedule: string;
  image: string;
  products: string[];
  hasDelivery?: boolean;
  sponsored?: boolean;
}

