import { useState } from "react";

export const SettingsSection = () => {
  const [newReviews, setNewReviews] = useState(true);
  const [contacts, setContacts] = useState(true);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Configuración</h3>
        <p className="text-sm text-gray-500 mt-1">
          Ajustes de tu cuenta y notificaciones
        </p>
      </div>

      <div className="space-y-6">
        {/* Notificaciones */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Notificaciones</h4>

          {/* Nueva reseña */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-800">Nuevas reseñas</p>
              <p className="text-sm text-gray-500 mt-1">
                Recibir notificación cuando llegue una reseña
              </p>
            </div>
            <button
              onClick={() => setNewReviews(!newReviews)}
              className={`w-12 h-6 rounded-full transition-colors ${
                newReviews ? "bg-teal-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  newReviews ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Contactos */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-gray-800">Contactos</p>
              <p className="text-sm text-gray-500 mt-1">
                Notificar cuando alguien contacte por WhatsApp
              </p>
            </div>
            <button
              onClick={() => setContacts(!contacts)}
              className={`w-12 h-6 rounded-full transition-colors ${
                contacts ? "bg-teal-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  contacts ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

