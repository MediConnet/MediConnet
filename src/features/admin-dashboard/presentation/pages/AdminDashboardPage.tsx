import {
  AccessTime,
  AirportShuttle,
  Biotech,
  ChatBubbleOutline,
  CheckCircleOutline,
  HighlightOff,
  Inventory,
  LocalPharmacy,
  LocationOn,
  MedicalServices,
  TrendingUp,
} from "@mui/icons-material";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { StatCard } from "../components/StatCard";
import { StatusCard } from "../components/StatusCard";
import { useDashboardStats } from "../hooks/useDashboardStats";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

export const AdminDashboardPage = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading || !stats)
    return <div className="p-8">Cargando dashboard...</div>;

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      {/* FILA 1: Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Servicios"
          value={stats.totalServices.value}
          trend={stats.totalServices.trend}
          icon={<MedicalServices fontSize="large" />}
          iconColorClass="text-teal-600 bg-teal-50"
        />
        <StatCard
          title="Usuarios en App"
          value={stats.usersInApp.value}
          trend={stats.usersInApp.trend}
          icon={<TrendingUp fontSize="large" />}
          iconColorClass="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Contactos del Mes"
          value={stats.monthlyContacts}
          icon={<ChatBubbleOutline fontSize="large" />}
          iconColorClass="text-orange-600 bg-orange-50"
        />
        <StatCard
          title="Ciudades"
          value={stats.totalCities}
          icon={<LocationOn fontSize="large" />}
          iconColorClass="text-amber-500 bg-amber-50"
        />
      </div>

      {/* FILA 2: Estados de Solicitudes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatusCard
          label="Pendientes"
          count={stats.requestStatus.pending}
          colorClass="text-amber-500"
          bgClass="bg-amber-50"
          icon={<AccessTime />}
        />
        <StatusCard
          label="Aprobados"
          count={stats.requestStatus.approved}
          colorClass="text-emerald-500"
          bgClass="bg-emerald-50"
          icon={<CheckCircleOutline />}
        />
        <StatusCard
          label="Rechazados"
          count={stats.requestStatus.rejected}
          colorClass="text-red-500"
          bgClass="bg-red-50"
          icon={<HighlightOff />}
        />
      </div>

      {/* FILA 3: Gráficas y Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUMNA IZQ: Servicios por Tipo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            Servicios por Tipo
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Distribución de servicios activos
          </p>

          <div className="space-y-6">
            <ServiceBar
              label="Médicos"
              count={stats.servicesByType.doctors}
              total={200}
              icon={<MedicalServices />}
              color="text-teal-600"
              barColor="bg-teal-500"
            />
            <ServiceBar
              label="Farmacias"
              count={stats.servicesByType.pharmacies}
              total={200}
              icon={<LocalPharmacy />}
              color="text-emerald-600"
              barColor="bg-emerald-500"
            />
            <ServiceBar
              label="Laboratorios"
              count={stats.servicesByType.laboratories}
              total={200}
              icon={<Biotech />}
              color="text-orange-500"
              barColor="bg-orange-500"
            />
            <ServiceBar
              label="Ambulancias"
              count={stats.servicesByType.ambulances}
              total={200}
              icon={<AirportShuttle />}
              color="text-red-500"
              barColor="bg-red-500"
            />
            <ServiceBar
              label="Insumos"
              count={stats.servicesByType.supplies}
              total={200}
              icon={<Inventory />}
              color="text-amber-500"
              barColor="bg-amber-500"
            />
          </div>
        </div>

        {/* COLUMNA DER: Actividad Reciente */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            Actividad Reciente
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Últimas acciones en la plataforma
          </p>

          <div className="space-y-6">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div
                  className={`mt-1 min-w-[32px] h-8 rounded-full flex items-center justify-center 
                  ${activity.type === "info" ? "bg-blue-50 text-blue-500" : ""}
                  ${
                    activity.type === "success"
                      ? "bg-emerald-50 text-emerald-500"
                      : ""
                  }
                  ${
                    activity.type === "warning"
                      ? "bg-orange-50 text-orange-500"
                      : ""
                  }
                  ${activity.type === "error" ? "bg-red-50 text-red-500" : ""}
                `}
                >
                  {/* Ícono simple según tipo */}
                  {activity.type === "success" ? (
                    <CheckCircleOutline fontSize="small" />
                  ) : (
                    <AccessTime fontSize="small" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Componente Helper para las barras
const ServiceBar = ({ label, count, total, icon, color, barColor }: any) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className={`${color} bg-gray-50 p-1 rounded`}>{icon}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-sm text-gray-500">{count}</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className={`${barColor} h-1.5 rounded-full`}
        style={{ width: `${(count / total) * 100}%` }}
      ></div>
    </div>
  </div>
);
