import {
  ShoppingCart,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getOrdersMock } from "../../infrastructure/orders.mock";
import type { SupplyOrder } from "../../domain/Order.entity";


export const OrdersSection = () => {
  const [orders, setOrders] = useState<SupplyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Cargar pedidos al montar el componente
  useEffect(() => {
    getOrdersMock().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleStatusChange = (orderId: string, newStatus: SupplyOrder["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // Aquí se podría hacer una llamada a la API para actualizar el estado
  };

  const toggleRowExpansion = (orderId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Pedidos de Clientes</h3>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona los pedidos de insumos médicos realizados por tus clientes
        </p>
      </div>

      {orders.length > 0 ? (
        <TableContainer component={Paper} elevation={0} className="border border-gray-200">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-semibold">N° Pedido</TableCell>
                <TableCell className="font-semibold">Cliente</TableCell>
                <TableCell className="font-semibold">Contacto</TableCell>
                <TableCell className="font-semibold">Dirección</TableCell>
                <TableCell className="font-semibold">Productos</TableCell>
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell className="font-semibold">Fecha</TableCell>
                <TableCell className="font-semibold">Estado</TableCell>
                <TableCell className="font-semibold">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const isExpanded = expandedRows.has(order.id);
                return (
                  <>
                    <TableRow key={order.id} hover className="border-b border-gray-200">
                      <TableCell>
                        <Typography variant="body2" className="font-medium">
                          {order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="font-medium">
                          {order.clientName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="text-gray-600">
                          {order.clientEmail}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {order.clientPhone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="text-gray-600 text-sm">
                          {order.clientAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="text-gray-600">
                          {order.items.length} producto{order.items.length > 1 ? "s" : ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="font-bold text-gray-800">
                          {formatCurrency(order.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="text-gray-600">
                          {formatDate(order.orderDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" className="min-w-[140px]">
                          <Select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as SupplyOrder["status"])
                            }
                            className="text-sm"
                          >
                            <MenuItem value="pending">Pendiente</MenuItem>
                            <MenuItem value="confirmed">Confirmado</MenuItem>
                            <MenuItem value="preparing">En Proceso</MenuItem>
                            <MenuItem value="shipped">Enviado</MenuItem>
                            <MenuItem value="delivered">Entregado</MenuItem>
                            <MenuItem value="cancelled">Cancelado</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpansion(order.id)}
                          className="text-gray-600"
                        >
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={9} className="bg-gray-50 p-4">
                          <Box className="space-y-4">
                            {/* Productos */}
                            <div>
                              <Typography variant="subtitle2" className="font-semibold mb-2">
                                Productos del Pedido
                              </Typography>
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200"
                                  >
                                    <div className="flex-1">
                                      <Typography variant="body2" className="font-medium">
                                        {item.productName}
                                      </Typography>
                                      <Typography variant="caption" className="text-gray-500">
                                        Cantidad: {item.quantity} | Precio unitario:{" "}
                                        {formatCurrency(item.unitPrice)}
                                      </Typography>
                                    </div>
                                    <Typography variant="body2" className="font-bold">
                                      {formatCurrency(item.total)}
                                    </Typography>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Información adicional */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                              <div>
                                <Typography variant="caption" className="text-gray-500">
                                  Fecha de pedido
                                </Typography>
                                <Typography variant="body2" className="font-medium">
                                  {formatDate(order.orderDate)}
                                </Typography>
                              </div>
                              {order.deliveryDate && (
                                <div>
                                  <Typography variant="caption" className="text-gray-500">
                                    Fecha de entrega
                                  </Typography>
                                  <Typography variant="body2" className="font-medium">
                                    {formatDate(order.deliveryDate)}
                                  </Typography>
                                </div>
                              )}
                              {order.notes && (
                                <div className="md:col-span-2">
                                  <Typography variant="caption" className="text-gray-500">
                                    Notas
                                  </Typography>
                                  <Typography variant="body2" className="italic">
                                    {order.notes}
                                  </Typography>
                                </div>
                              )}
                            </div>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="text-gray-400 text-3xl" />
          </div>
          <p className="text-gray-500 text-sm font-medium">
            No hay pedidos registrados
          </p>
        </div>
      )}
    </div>
  );
};

