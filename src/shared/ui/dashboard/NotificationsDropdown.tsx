import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AccessTime, Person, Close, CalendarToday, ShoppingCart, StarRate } from "@mui/icons-material";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
}

interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  orderDate: string;
  status: string;
  totalAmount?: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface NotificationsDropdownProps {
  open: boolean;
  onClose: () => void;
  appointments: Appointment[];
  orders?: Order[];
  reviews?: Review[];
  notificationType?: "appointments" | "orders" | "reviews";
  viewedNotifications?: Set<string>;
  onMarkAllAsRead?: () => void;
  viewAllPath?: string;
}

export const NotificationsDropdown = ({
  open,
  onClose,
  appointments,
  orders = [],
  reviews = [],
  notificationType = "appointments",
  viewedNotifications = new Set(),
  onMarkAllAsRead,
  viewAllPath,
}: NotificationsDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ✅ Guard runtime: si por alguna razón llega un objeto (backend shape inesperado),
  // evitamos crashear el Header/Dropdown.
  const safeReviews: Review[] = Array.isArray(reviews) ? reviews : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  // Obtener solo las citas o pedidos de hoy (mostrar todas, no solo las no vistas)
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments
    .filter((apt) => apt.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));
  const todayOrders = orders
    .filter((order) => order.orderDate === today)
    .sort((a, b) => a.orderNumber.localeCompare(b.orderNumber));

  // Para reseñas: mostrar las más recientes (no limitar solo a hoy)
  const recentReviews = safeReviews
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  // Contar cuántas no están vistas
  const unreadCount = notificationType === "reviews"
    ? recentReviews.filter((review) => !viewedNotifications.has(review.id)).length
    : notificationType === "orders"
    ? todayOrders.filter((order) => !viewedNotifications.has(order.id)).length
    : todayAppointments.filter((apt) => !viewedNotifications.has(apt.id)).length;

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {notificationType === "reviews" 
                ? "Nuevas Reseñas" 
                : notificationType === "orders" 
                ? "Pedidos de Hoy" 
                : "Citas de Hoy"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <Close className="text-sm" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-500">
            {notificationType === "reviews"
              ? `${recentReviews.length} reseña${recentReviews.length !== 1 ? "s" : ""} reciente${recentReviews.length !== 1 ? "s" : ""}`
              : notificationType === "orders"
              ? `${todayOrders.length} pedido${todayOrders.length !== 1 ? "s" : ""} recibido${todayOrders.length !== 1 ? "s" : ""} hoy`
              : `${todayAppointments.length} cita${todayAppointments.length !== 1 ? "s" : ""} programada${todayAppointments.length !== 1 ? "s" : ""} para hoy`}
          </p>
          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium underline"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[500px]">
        {notificationType === "reviews" ? (
          recentReviews.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentReviews.map((review) => {
                const isRead = viewedNotifications.has(review.id);
                return (
                <div
                  key={review.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !isRead ? "bg-blue-50 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                      <StarRate className="text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800 text-base">
                          {review.userName}
                        </h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarRate
                              key={i}
                              className={`text-sm ${
                                i < review.rating ? "text-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarRate className="text-gray-400 text-3xl" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                No hay reseñas recientes
              </p>
              <p className="text-gray-400 text-xs">
                Las reseñas aparecerán aquí
              </p>
            </div>
          )
        ) : notificationType === "orders" ? (
          todayOrders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {todayOrders.map((order) => {
                const isRead = viewedNotifications.has(order.id);
                return (
                <div
                  key={order.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !isRead ? "bg-blue-50 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                      <ShoppingCart className="text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800 text-base">
                          {order.orderNumber}
                        </h4>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold">
                          {order.status === "pending" ? "Pendiente" : order.status === "confirmed" ? "Confirmado" : order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Cliente: {order.clientName}
                      </p>
                      {order.totalAmount && (
                        <p className="text-xs text-gray-500 mt-1">
                          Total: {new Intl.NumberFormat("es-EC", {
                            style: "currency",
                            currency: "USD",
                          }).format(order.totalAmount)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="text-gray-400 text-3xl" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                No hay pedidos recibidos hoy
              </p>
              <p className="text-gray-400 text-xs">
                Los pedidos de hoy aparecerán aquí
              </p>
            </div>
          )
        ) : todayAppointments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {todayAppointments.map((apt) => {
              const isRead = viewedNotifications.has(apt.id);
              return (
              <div
                key={apt.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !isRead ? "bg-blue-50 border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                    <Person className="text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800 text-base">
                        {apt.patientName}
                      </h4>
                      <div className="flex items-center gap-2 px-2 py-1 bg-teal-50 rounded-lg">
                        <AccessTime className="text-teal-600 text-sm" />
                        <span className="font-semibold text-teal-700 text-sm">{apt.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {apt.reason}
                    </p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarToday className="text-gray-400 text-3xl" />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              No hay citas programadas para hoy
            </p>
            <p className="text-gray-400 text-xs">
              Tus citas de hoy aparecerán aquí
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => {
            onClose();
            if (viewAllPath) {
              navigate(viewAllPath);
              return;
            }
            if (notificationType === "reviews") {
              navigate("/supply/dashboard?tab=reviews");
            } else if (notificationType === "orders") {
              navigate("/supply/dashboard?tab=orders");
            } else {
              navigate("/doctor/dashboard?tab=appointments");
            }
          }}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm"
        >
          {notificationType === "reviews"
            ? recentReviews.length > 0
              ? "Ver todas las reseñas"
              : "Ver reseñas"
            : notificationType === "orders"
            ? todayOrders.length > 0
              ? "Ver todos los pedidos"
              : "Ver pedidos"
            : todayAppointments.length > 0
            ? "Ver calendario completo"
            : "Ver todas las citas"}
        </button>
      </div>
    </div>
  );
};

