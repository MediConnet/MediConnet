import type { ReactNode } from "react";
import type { UserRole } from "../config/navigation.config";
import { Header, type UserHeaderProfile } from "../ui/dashboard/Header";
import { Sidebar } from "../ui/dashboard/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  // Estos datos vendrán de tu sistema de Auth (Contexto) en el futuro
  role: UserRole;
  userProfile: UserHeaderProfile;
}

export const DashboardLayout = ({
  children,
  title = "Panel",
  role,
  userProfile,
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar recibe el rol para saber qué menú pintar */}
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header recibe los datos del usuario */}
        <Header title={title} user={userProfile} />

        {/* Contenido Principal con margen superior para no chocar con el header fijo */}
        <main className="flex-1 p-8 pl-72 mt-20">{children}</main>
      </div>
    </div>
  );
};
