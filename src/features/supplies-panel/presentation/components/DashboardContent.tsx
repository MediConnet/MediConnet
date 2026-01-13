import { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import {
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  Inventory,
} from "@mui/icons-material";
import { mockOrders } from "../../infrastructure/orders.mock";
import { formatMoney } from "../../../../shared/lib/formatMoney";

interface DashboardContentProps {
  visits: number;
  contacts: number;
  reviews: number;
  rating: number;
}

export const DashboardContent = ({}: DashboardContentProps) => {
  const orders = useMemo(() => mockOrders, []);

  // Datos para gráfico de pedidos por semana
  const ordersByWeek = useMemo(() => {
    const weekData = [0, 0, 0, 0]; // Últimas 4 semanas
    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const weekAgo = Math.floor(
        (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );
      if (weekAgo >= 0 && weekAgo < 4) {
        weekData[weekAgo] = (weekData[weekAgo] || 0) + 1;
      }
    });
    return weekData.reverse(); // Más reciente primero
  }, [orders]);

  // Datos para gráfico de ingresos
  const incomeByWeek = useMemo(() => {
    const weekData = [0, 0, 0, 0];
    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const weekAgo = Math.floor(
        (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );
      if (weekAgo >= 0 && weekAgo < 4) {
        weekData[weekAgo] = (weekData[weekAgo] || 0) + order.totalAmount;
      }
    });
    return weekData.reverse();
  }, [orders]);

  // Distribución de estados de pedidos
  const orderStatus = useMemo(() => {
    const statusCount = {
      delivered: 0,
      shipped: 0,
      preparing: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      if (order.status === "delivered") statusCount.delivered++;
      else if (order.status === "shipped") statusCount.shipped++;
      else if (order.status === "preparing") statusCount.preparing++;
      else if (order.status === "confirmed") statusCount.confirmed++;
      else if (order.status === "pending") statusCount.pending++;
      else if (order.status === "cancelled") statusCount.cancelled++;
    });
    return statusCount;
  }, [orders]);

  const maxOrders = Math.max(...ordersByWeek, 1);
  const maxIncome = Math.max(...incomeByWeek, 1);

  // Pedidos recientes
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 5);
  }, [orders]);

  return (
    <Box sx={{ mt: 4 }}>
      <Grid2 container spacing={3}>
        {/* Gráfico de Pedidos por Semana */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid #e5e7eb", height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <ShoppingCart sx={{ color: "#14b8a6", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Pedidos por Semana
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Últimas 4 semanas
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ position: "relative", height: 200 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="flex-end"
                  sx={{ height: "100%" }}
                >
                  {ordersByWeek.map((count, index) => (
                    <Box key={index} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: `${(count / maxOrders) * 160}px`,
                          bgcolor: "#14b8a6",
                          borderRadius: "4px 4px 0 0",
                          minHeight: count > 0 ? "8px" : "0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: "#0d9488",
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 1, fontWeight: 600 }}>
                        {count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                        Sem {4 - index}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Gráfico de Ingresos */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid #e5e7eb", height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <AttachMoney sx={{ color: "#10b981", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Ingresos por Semana
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Últimas 4 semanas
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ position: "relative", height: 200 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="flex-end"
                  sx={{ height: "100%" }}
                >
                  {incomeByWeek.map((income, index) => (
                    <Box key={index} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: `${(income / maxIncome) * 160}px`,
                          bgcolor: "#10b981",
                          borderRadius: "4px 4px 0 0",
                          minHeight: income > 0 ? "8px" : "0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: "#059669",
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 1, fontWeight: 600 }}>
                        {formatMoney(income)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                        Sem {4 - index}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Gráfico de Estados de Pedidos */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: "1px solid #e5e7eb", height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <TrendingUp sx={{ color: "#3b82f6", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Estado de Pedidos
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Distribución actual
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#10b981",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight={600}>
                      Entregados: {orderStatus.delivered}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#3b82f6",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight={600}>
                      Enviados: {orderStatus.shipped}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#f59e0b",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight={600}>
                      Preparando: {orderStatus.preparing}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#8b5cf6",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight={600}>
                      Confirmados: {orderStatus.confirmed}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#ef4444",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight={600}>
                      Pendientes: {orderStatus.pending}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Pedidos Recientes */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card elevation={0} sx={{ border: "1px solid #e5e7eb", height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Inventory sx={{ color: "#8b5cf6", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Pedidos Recientes
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Últimos 5 pedidos
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                {recentOrders.map((order) => (
                  <Paper
                    key={order.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "#f9fafb",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {order.clientName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.items.length} producto(s)
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" fontWeight={600} color="#10b981">
                          {formatMoney(order.totalAmount)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {new Date(order.orderDate).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </Typography>
                        <Box
                          sx={{
                            mt: 0.5,
                            display: "inline-block",
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor:
                              order.status === "delivered"
                                ? "#d1fae5"
                                : order.status === "shipped"
                                ? "#dbeafe"
                                : order.status === "preparing"
                                ? "#fef3c7"
                                : order.status === "confirmed"
                                ? "#ede9fe"
                                : order.status === "pending"
                                ? "#fee2e2"
                                : "#fee2e2",
                            color:
                              order.status === "delivered"
                                ? "#065f46"
                                : order.status === "shipped"
                                ? "#1e40af"
                                : order.status === "preparing"
                                ? "#92400e"
                                : order.status === "confirmed"
                                ? "#5b21b6"
                                : order.status === "pending"
                                ? "#991b1b"
                                : "#991b1b",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                          }}
                        >
                          {order.status === "delivered"
                            ? "Entregado"
                            : order.status === "shipped"
                            ? "Enviado"
                            : order.status === "preparing"
                            ? "Preparando"
                            : order.status === "confirmed"
                            ? "Confirmado"
                            : order.status === "pending"
                            ? "Pendiente"
                            : "Cancelado"}
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

