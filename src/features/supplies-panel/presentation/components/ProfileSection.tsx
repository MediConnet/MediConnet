import { useState, useRef, useEffect } from "react";
import { Edit, LocationOn, Phone, Star } from "@mui/icons-material";
import type { SupplyDashboard, WorkSchedule } from "../../domain/SupplyDashboard.entity";
import { useAuthStore } from "../../../../app/store/auth.store";

interface ProfileSectionProps {
  data: SupplyDashboard;
  onUpdate?: (updatedData: SupplyDashboard) => void;
}

export const ProfileSection = ({ data, onUpdate }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const authStore = useAuthStore();
  const { user } = authStore;
  
  const defaultSchedule: WorkSchedule[] = [
    { day: 'monday', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'tuesday', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'wednesday', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'thursday', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'friday', enabled: true, startTime: '08:00', endTime: '18:00' },
  ];

  const [formData, setFormData] = useState({
    name: data?.supply?.name || '',
    email: data?.supply?.email || '',
    whatsapp: data?.supply?.whatsapp || '',
    address: data?.supply?.address || '',
    description: data?.supply?.description || '',
    schedule: data?.supply?.schedule || '',
    workSchedule: data?.supply?.workSchedule || defaultSchedule,
  });

  // Actualizar formData cuando data cambia
  useEffect(() => {
    if (data?.supply) {
      setFormData({
        name: data.supply.name,
        email: data.supply.email,
        whatsapp: data.supply.whatsapp,
        address: data.supply.address,
        description: data.supply.description,
        schedule: data.supply.schedule,
        workSchedule: data.supply.workSchedule || defaultSchedule,
      });
    }
  }, [data]);

  // Cargar imagen guardada al montar el componente
  useEffect(() => {
    if (user?.id) {
      const savedImage = localStorage.getItem(`supply-profile-image-${user.id}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [user?.id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar valores originales
    if (data?.supply) {
      setFormData({
        name: data.supply.name,
        email: data.supply.email,
        whatsapp: data.supply.whatsapp,
        address: data.supply.address,
        description: data.supply.description,
        schedule: data.supply.schedule,
        workSchedule: data.supply.workSchedule || defaultSchedule,
      });
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    // Simular guardado (en producción esto llamaría a una API)
    const updatedData: SupplyDashboard = {
      ...data,
      supply: {
        ...data.supply,
        ...formData,
      },
    };

    // Guardar en localStorage para persistencia
    localStorage.setItem(`supply-profile-${user.id}`, JSON.stringify(updatedData));

    setIsEditing(false);
    if (onUpdate) {
      onUpdate(updatedData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (day: string, field: 'enabled' | 'startTime' | 'endTime', value: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      workSchedule: prev.workSchedule.map((schedule: WorkSchedule) =>
        schedule.day === day ? { ...schedule, [field]: value } : schedule
      ),
    }));
  };

  const dayLabels: Record<string, string> = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      // Convertir a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        
        // Guardar en localStorage
        if (user?.id) {
          localStorage.setItem(`supply-profile-image-${user.id}`, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Validar que data existe
  if (!data || !data.supply) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-500">Cargando información del perfil...</p>
      </div>
    );
  }

  const supply = data.supply;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Información del Perfil */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Información del Perfil</h3>
            <p className="text-sm text-gray-500 mt-1">Gestiona los datos de tu servicio</p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="bg-teal-50 text-teal-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-100 transition-colors"
            >
              <Edit className="text-sm" />
              <span className="text-sm font-medium">Editar</span>
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors"
            >
              <span className="text-sm font-medium">Guardar cambios</span>
            </button>
          )}
        </div>

        {!isEditing ? (
          // Vista de solo lectura
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="text-sm text-gray-600">Nombre completo</label>
                <p className="text-gray-800 font-medium mt-1">{supply.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-gray-800 font-medium mt-1">{supply.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">WhatsApp</label>
                <p className="text-gray-800 font-medium mt-1">{supply.whatsapp}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Dirección</label>
                <p className="text-gray-800 font-medium mt-1">{supply.address}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Horario</label>
                <p className="text-gray-800 font-medium mt-1">{supply.schedule}</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600">Descripción</label>
              <p className="text-gray-800 mt-2 leading-relaxed">{supply.description}</p>
            </div>

            {/* Horario Laboral */}
            {supply.workSchedule && supply.workSchedule.length > 0 && (
              <div className="mt-6">
                <label className="text-sm text-gray-600 mb-3 block font-semibold">Horario Laboral</label>
                <div className="space-y-2">
                  {supply.workSchedule.map((schedule: WorkSchedule) => (
                    <div key={schedule.day} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-700 w-24">
                        {dayLabels[schedule.day] || schedule.day}
                      </span>
                      {schedule.enabled ? (
                        <span className="text-sm text-gray-800">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Cerrado</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          // Vista de edición
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nombre completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">WhatsApp</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Dirección</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Horario</label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => handleChange("schedule", e.target.value)}
                  placeholder="Ej: Lun-Vie 8:00-18:00, Sáb 9:00-14:00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600 mb-1 block">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Horario Laboral */}
            <div className="mt-6">
              <label className="text-sm text-gray-600 mb-3 block font-semibold">Horario Laboral</label>
              <div className="space-y-3">
                {formData.workSchedule.map((schedule: WorkSchedule) => (
                  <div key={schedule.day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 w-24">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) => handleScheduleChange(schedule.day, 'enabled', e.target.checked)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {dayLabels[schedule.day] || schedule.day}
                      </span>
                    </div>
                    {schedule.enabled && (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => handleScheduleChange(schedule.day, 'startTime', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => handleScheduleChange(schedule.day, 'endTime', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                        />
                      </div>
                    )}
                    {!schedule.enabled && (
                      <span className="text-sm text-gray-400">Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Vista previa en App */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Vista previa en App</h3>
        
        <div className="space-y-4">
          {/* Input de archivo oculto */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          {/* Placeholder de imagen o imagen seleccionada */}
          <div
            onClick={handleImageClick}
            className="w-full h-48 bg-teal-50 rounded-lg flex items-center justify-center border-2 border-dashed border-teal-200 cursor-pointer hover:bg-teal-100 transition-colors relative overflow-hidden"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Imagen de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-teal-600 text-xl">↑</span>
                </div>
                <p className="text-sm text-teal-600">Imagen de perfil</p>
              </div>
            )}
          </div>

          {/* Información del proveedor */}
          <div>
            <h4 className="text-lg font-bold text-gray-800">
              {isEditing ? formData.name : supply.name}
            </h4>
            <p className="text-sm text-gray-500 mt-1">Insumos Médicos</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`text-sm ${
                    star <= Math.floor(data.rating)
                      ? "text-yellow-400 fill-current"
                      : star <= data.rating
                      ? "text-yellow-400 fill-current opacity-50"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({data.rating})</span>
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-2 text-gray-600">
            <LocationOn className="text-sm" />
            <span className="text-sm">
              {isEditing ? formData.address : supply.address}
            </span>
          </div>

          {/* Contacto */}
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="text-sm" />
            <span className="text-sm">
              {isEditing ? formData.whatsapp : supply.whatsapp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

