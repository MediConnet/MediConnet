import { httpClient, extractData } from '../../../shared/lib/http';
import type { Product } from '../domain/Product.entity';
import type { SupplyStore, SupplyStoreProduct } from '../domain/SupplyStore.entity';

/**
 * Helper: Mapear producto del backend a estructura del frontend
 */
const mapBackendProductToFrontend = (backendProduct: SupplyStoreProduct): Product => {
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    description: backendProduct.description || '',
    category: backendProduct.type, // Backend usa "type", frontend usa "category"
    price: backendProduct.price,
    stock: backendProduct.stock || 0,
    image: backendProduct.imageUrl,
    isActive: backendProduct.isActive !== false, // Default true si no viene
    createdAt: new Date().toISOString(), // Backend no retorna esto aún
    updatedAt: new Date().toISOString(), // Backend no retorna esto aún
  };
};

/**
 * API: Obtener productos de una tienda específica
 * Endpoint: GET /api/supplies/:storeId
 * 
 * NOTA: El backend retorna la tienda completa con sus productos.
 * Esta función extrae solo los productos.
 */
export const getProductsAPI = async (storeId: string): Promise<Product[]> => {
  const response = await httpClient.get<{ success: boolean; data: SupplyStore }>(
    `/supplies/${storeId}`
  );
  const store = extractData(response);
  
  // Mapear productos del backend a estructura del frontend
  return store.products.map(mapBackendProductToFrontend);
};

/**
 * API: Obtener un producto específico por ID
 * Endpoint: GET /api/supplies/:storeId
 * 
 * NOTA: El backend no tiene endpoint individual de producto,
 * así que obtenemos todos y filtramos.
 */
export const getProductByIdAPI = async (storeId: string, productId: string): Promise<Product | null> => {
  const products = await getProductsAPI(storeId);
  const product = products.find(p => p.id === productId);
  return product || null;
};

// ============================================================================
// CRUD DE PRODUCTOS - ✅ IMPLEMENTADO POR BACKEND
// ============================================================================

/**
 * API: Crear un nuevo producto
 * Endpoint: POST /api/supplies/products
 */
export const createProductAPI = async (product: Partial<Product>): Promise<Product> => {
  // Mapear de frontend a backend
  const backendProduct = {
    name: product.name,
    description: product.description,
    type: product.category, // Frontend usa "category", backend usa "type"
    price: product.price,
    stock: product.stock,
    imageUrl: product.image,
    isActive: product.isActive !== false,
  };

  const response = await httpClient.post<{ success: boolean; data: any }>(
    '/supplies/products',
    backendProduct
  );
  const data = extractData(response);
  
  // Mapear respuesta del backend a frontend
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    category: data.type,
    price: data.price,
    stock: data.stock || 0,
    image: data.imageUrl,
    isActive: data.isActive !== false,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
};

/**
 * API: Actualizar un producto existente
 * Endpoint: PUT /api/supplies/products/:id
 */
export const updateProductAPI = async (id: string, product: Partial<Product>): Promise<Product> => {
  // Mapear de frontend a backend (solo campos que vienen)
  const backendProduct: any = {};
  if (product.name !== undefined) backendProduct.name = product.name;
  if (product.description !== undefined) backendProduct.description = product.description;
  if (product.category !== undefined) backendProduct.type = product.category;
  if (product.price !== undefined) backendProduct.price = product.price;
  if (product.stock !== undefined) backendProduct.stock = product.stock;
  if (product.image !== undefined) backendProduct.imageUrl = product.image;
  if (product.isActive !== undefined) backendProduct.isActive = product.isActive;

  const response = await httpClient.put<{ success: boolean; data: any }>(
    `/supplies/products/${id}`,
    backendProduct
  );
  const data = extractData(response);
  
  // Mapear respuesta del backend a frontend
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    category: data.type,
    price: data.price,
    stock: data.stock || 0,
    image: data.imageUrl,
    isActive: data.isActive !== false,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
};

/**
 * API: Eliminar un producto (soft delete)
 * Endpoint: DELETE /api/supplies/products/:id
 */
export const deleteProductAPI = async (id: string): Promise<void> => {
  await httpClient.delete(`/supplies/products/${id}`);
};
