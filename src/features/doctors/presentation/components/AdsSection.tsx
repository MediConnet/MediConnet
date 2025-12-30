import { Campaign } from "@mui/icons-material";

export const AdsSection = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Anuncios Promocionales</h3>
          <p className="text-sm text-gray-500 mt-1">
            Crea anuncios que aparecerán en la app móvil
          </p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors">
          <Campaign className="text-sm" />
          <span className="text-sm font-medium">Crear anuncio</span>
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Campaign className="text-gray-400 text-4xl" />
        </div>
        <p className="text-lg font-medium text-gray-800 mb-2">
          No tienes anuncios activos
        </p>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Crea un anuncio para promocionar tus servicios
        </p>
      </div>
    </div>
  );
};

