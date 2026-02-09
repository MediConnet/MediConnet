import { httpClient, extractData } from '../../../shared/lib/http';
import type { SupplyOrder } from '../domain/Order.entity';

// ============================================================================
// ÓRDENES - ✅ IMPLEMENTADO POR BACKEND
// ============================================================================

/**
 * API: Obtener órdenes de la tienda de insumos
 * Endpoint: GET /api/supplies/orders
 * Query params opcionales: ?status=pending
 */
export const getOrdersAPI = async (status?: string): Promise<SupplyOrder[]> => {
  const url = status ? `/supplies/orders?status=${status}` : '/supplies/orders';
  const response = await httpClient.get<{ success: boolean; data: SupplyOrder[] }>(url);
  return extractData(response);
};

/**
 * API: Obtener detalle de una orden específica
 * Endpoint: GET /api/supplies/orders/:id
 */
export const getOrderByIdAPI = async (orderId: string): Promise<SupplyOrder> => {
  const response = await httpClient.get<{ success: boolean; data: SupplyOrder }>(
    `/supplies/orders/${orderId}`
  );
  return extractData(response);
};

/**
 * API: Crear una nueva orden
 * Endpoint: POST /api/supplies/orders
 * 
 * IMPORTANTE: NO enviar orderNumber ni totalAmount (se generan automáticamente)
 */
export const createOrderAPI = async (order: Partial<SupplyOrder>): Promise<SupplyOrder> => {
  // Preparar datos para el backend (sin orderNumber ni totalAmount)
  const orderData = {
    clientName: order.clientName,
    clientEmail: order.clientEmail,
    clientPhone: order.clientPhone,
    clientAddress: order.clientAddress,
    items: order.items,
    deliveryDate: order.deliveryDate,
    notes: order.notes,
  };

  const response = await httpClient.post<{ success: boolean; data: SupplyOrder }>(
    '/supplies/orders',
    orderData
  );
  return extractData(response);
};

/**
 * API: Actualizar estado de una orden
 * Endpoint: PUT /api/supplies/orders/:id/status
 * 
 * Estados válidos: pending, confirmed, preparing, shipped, delivered, cancelled
 */
export const updateOrderStatusAPI = async (
  orderId: string,
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<SupplyOrder> => {
  const response = await httpClient.put<{ success: boolean; data: SupplyOrder }>(
    `/supplies/orders/${orderId}/status`,
    { status }
  );
  return extractData(response);
};
