import { Menu as MenuIcon, Notifications } from "@mui/icons-material";

export interface UserHeaderProfile {
  name: string;
  roleLabel: string;
  initials: string;
  isActive?: boolean;
}

interface HeaderProps {
  title: string;
  user: UserHeaderProfile;
  onMenuToggle: () => void;
  isMenuOpen: boolean; // Necesitamos saber si está abierto para calcular la posición left
}

export const Header = ({
  title,
  user,
  onMenuToggle,
  isMenuOpen,
}: HeaderProps) => {
  return (
    <header
      // CAMBIO CLAVE:
      // 1. Quitamos 'style={{ width: inherit }}'
      // 2. Usamos 'fixed top-0 right-0' para pegarlo arriba y derecha
      // 3. Usamos condicional: 'left-64' (abierto) vs 'left-20' (cerrado)
      className={`bg-white h-20 px-8 flex items-center justify-between border-b border-gray-200 fixed top-0 right-0 z-40 transition-all duration-300 ${
        isMenuOpen ? "left-64" : "left-20"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          <MenuIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        {user.isActive && (
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
            Servicio Activo
          </span>
        )}

        <button className="relative text-gray-500 hover:text-gray-700">
          <Notifications />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.roleLabel}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold cursor-pointer">
            {user.initials}
          </div>
        </div>
      </div>
    </header>
  );
};
