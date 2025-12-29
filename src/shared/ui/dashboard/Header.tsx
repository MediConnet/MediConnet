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
}

export const Header = ({ title, user }: HeaderProps) => {
  return (
    <header className="bg-white h-20 px-8 flex items-center justify-between border-b border-gray-200 pl-72 fixed w-full top-0 z-40">
      {/* Título de la sección actual */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-gray-500">
          <MenuIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Badge de "Servicio Activo" (Solo si aplica) */}
        {user.isActive && (
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
            Servicio Activo
          </span>
        )}

        {/* Notificaciones */}
        <button className="relative text-gray-500 hover:text-gray-700">
          <Notifications />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </button>

        {/* Perfil Dinámico */}
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
