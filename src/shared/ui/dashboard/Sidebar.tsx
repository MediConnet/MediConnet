import { Logout } from "@mui/icons-material";
import { getMenuByRole, type UserRole } from "../../config/navigation.config";

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
}

export const Sidebar = ({ role, isOpen }: SidebarProps) => {
  const menuItems = getMenuByRole(role);

  return (
    <aside
      className={`bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-50 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* --- LOGO --- */}
      {/* Centramos el contenido si está cerrado */}
      <div
        className={`h-20 flex items-center ${
          isOpen ? "px-6 gap-2" : "justify-center px-0"
        }`}
      >
        <div className="bg-emerald-500 p-2 rounded-lg shrink-0">
          <span className="text-white font-bold text-xl">M</span>
        </div>

        {/* Ocultamos el texto 'MediConnect' si está cerrado con overflow-hidden para la animación */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
          }`}
        >
          <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">
            MediConnect
          </h1>
        </div>
      </div>

      {/* --- MENÚ --- */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.path}
            title={!isOpen ? item.label : ""} // Tooltip nativo cuando está cerrado
            className={`flex items-center rounded-lg transition-colors h-12 ${
              isOpen ? "px-4 gap-3" : "justify-center px-0" // Ajuste de padding y justificación
            } ${
              index === 0 // Simulación de activo
                ? "bg-emerald-50 text-emerald-600 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {/* Ícono: aseguramos tamaño consistente */}
            <span className="shrink-0">{item.icon}</span>

            {/* Texto del Link */}
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isOpen
                  ? "opacity-100 w-auto ml-3"
                  : "opacity-0 w-0 ml-0 overflow-hidden"
              }`}
            >
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      {/* --- FOOTER (LOGOUT) --- */}
      <div className="p-3 border-t border-gray-200">
        <button
          className={`flex items-center w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors h-12 ${
            isOpen ? "px-4 gap-3" : "justify-center px-0"
          }`}
          title={!isOpen ? "Cerrar sesión" : ""}
        >
          <Logout className="shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-300 ${
              isOpen
                ? "opacity-100 w-auto ml-3"
                : "opacity-0 w-0 ml-0 overflow-hidden"
            }`}
          >
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  );
};
