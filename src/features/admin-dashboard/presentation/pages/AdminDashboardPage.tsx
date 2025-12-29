import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useDashboardStats } from "../hooks/useDashboardStats";

// Mock del usuario ADMIN (Esto vendría del AuthContext en el futuro)
const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

export const AdminDashboardPage = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) return <div>Cargando estadísticas...</div>;

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN} title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Usamos los datos reales del dominio */}
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Servicios</h3>
          <p className="text-2xl font-bold">{stats?.totalServices}</p>
        </div>
        {/* ... Resto de tarjetas usando stats.usersInApp, etc ... */}
      </div>
    </DashboardLayout>
  );
};
