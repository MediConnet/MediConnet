import { Logout } from "@mui/icons-material";
import { getMenuByRole, type UserRole } from "../../config/navigation.config";

// Props: Ahora el Sidebar necesita saber qué rol tiene el usuario
interface SidebarProps {
  role: UserRole;
}

export const Sidebar = ({ role }: SidebarProps) => {
  // Obtenemos los items dinámicamente
  const menuItems = getMenuByRole(role);

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">MediConnect</h1>
      </div>

      {/* Menú Dinámico */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.path}
            // Aquí simulamos que el primer item está activo por defecto para visualización
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              index === 0
                ? "bg-emerald-50 text-emerald-600 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Logout />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
