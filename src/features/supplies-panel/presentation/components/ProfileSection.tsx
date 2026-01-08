import {
  AccessTime, // Icono para horario
  CloudUpload,
  Edit,
  LocationOn,
  PhotoCamera,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import type {
  SupplyDashboard,
  WorkSchedule,
} from "../../domain/SupplyDashboard.entity";

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

  // Colores del tema Suministros (Naranja)
  const themeColor = "#f97316"; // Naranja vibrante
  const bgCardColor = "#fff7ed"; // Fondo naranja muy suave

  const defaultSchedule: WorkSchedule[] = [
    { day: "monday", enabled: true, startTime: "08:00", endTime: "18:00" },
    { day: "tuesday", enabled: true, startTime: "08:00", endTime: "18:00" },
    { day: "wednesday", enabled: true, startTime: "08:00", endTime: "18:00" },
    { day: "thursday", enabled: true, startTime: "08:00", endTime: "18:00" },
    { day: "friday", enabled: true, startTime: "08:00", endTime: "18:00" },
  ];

  const [formData, setFormData] = useState({
    name: data?.supply?.name || "",
    email: data?.supply?.email || "",
    whatsapp: data?.supply?.whatsapp || "",
    address: data?.supply?.address || "",
    description: data?.supply?.description || "",
    // Eliminamos 'schedule' manual, lo calcularemos dinámicamente
    workSchedule: data?.supply?.workSchedule || defaultSchedule,
  });

  // Función para generar el texto del horario (Ej: Lun-Vie 08:00-18:00)
  const getDynamicScheduleText = (schedule: WorkSchedule[]) => {
    const activeDays = schedule.filter((s) => s.enabled);

    if (activeDays.length === 0) return "Cerrado temporalmente";

    const dayMap: Record<string, string> = {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mié",
      thursday: "Jue",
      friday: "Vie",
      saturday: "Sáb",
      sunday: "Dom",
    };

    // Ordenar días si fuera necesario (asumiendo que vienen en orden)
    const startDay = dayMap[activeDays[0].day];
    const endDay = dayMap[activeDays[activeDays.length - 1].day];
    const startTime = activeDays[0].startTime;
    const endTime = activeDays[0].endTime;

    if (activeDays.length === 1) {
      return `${startDay} ${startTime}-${endTime}`;
    }

    return `${startDay}-${endDay} ${startTime}-${endTime}`;
  };

  useEffect(() => {
    if (data?.supply) {
      setFormData({
        name: data.supply.name,
        email: data.supply.email,
        whatsapp: data.supply.whatsapp,
        address: data.supply.address,
        description: data.supply.description,
        workSchedule: data.supply.workSchedule || defaultSchedule,
      });
    }
  }, [data]);

  useEffect(() => {
    if (user?.id) {
      const savedImage = localStorage.getItem(
        `supply-profile-image-${user.id}`
      );
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
    if (data?.supply) {
      setFormData({
        name: data.supply.name,
        email: data.supply.email,
        whatsapp: data.supply.whatsapp,
        address: data.supply.address,
        description: data.supply.description,
        workSchedule: data.supply.workSchedule || defaultSchedule,
      });
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    // Generamos el string del horario para guardarlo también
    const scheduleString = getDynamicScheduleText(formData.workSchedule);

    const updatedData: SupplyDashboard = {
      ...data,
      supply: {
        ...data.supply,
        ...formData,
        schedule: scheduleString,
      },
    };

    localStorage.setItem(
      `supply-profile-${user.id}`,
      JSON.stringify(updatedData)
    );

    setIsEditing(false);
    if (onUpdate) {
      onUpdate(updatedData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (
    day: string,
    field: "enabled" | "startTime" | "endTime",
    value: boolean | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      workSchedule: prev.workSchedule.map((schedule: WorkSchedule) =>
        schedule.day === day ? { ...schedule, [field]: value } : schedule
      ),
    }));
  };

  const dayLabels: Record<string, string> = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        if (user?.id) {
          localStorage.setItem(`supply-profile-image-${user.id}`, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!data || !data.supply) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-500">Cargando información del perfil...</p>
      </div>
    );
  }

  const supply = data.supply;
  // Calculamos el horario para mostrar
  const displaySchedule = isEditing
    ? getDynamicScheduleText(formData.workSchedule)
    : supply.schedule ||
      getDynamicScheduleText(supply.workSchedule || defaultSchedule);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* --- COLUMNA IZQUIERDA: Formulario --- */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Información del Perfil
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona los datos de tu servicio
            </p>
          </div>

          {/* BOTÓN EDITAR: Color Verde (Teal) */}
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
          // VISTA: Solo Lectura
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                { label: "Nombre del negocio", val: supply.name },
                { label: "Email", val: supply.email },
                { label: "WhatsApp", val: supply.whatsapp },
                { label: "Dirección", val: supply.address },
                { label: "Horario", val: displaySchedule },
              ].map((item, idx) => (
                <div key={idx}>
                  <label className="text-sm text-gray-600">{item.label}</label>
                  <p className="text-gray-800 font-medium mt-1">{item.val}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600">Descripción</label>
              <p className="text-gray-800 mt-2 leading-relaxed">
                {supply.description}
              </p>
            </div>

            {supply.workSchedule && supply.workSchedule.length > 0 && (
              <div className="mt-6">
                <label className="text-sm text-gray-600 mb-3 block font-semibold">
                  Horario Laboral
                </label>
                <div className="space-y-2">
                  {supply.workSchedule.map((schedule: WorkSchedule) => (
                    <div
                      key={schedule.day}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
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
          // VISTA: Edición (Formulario)
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Nombre del negocio
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              {/* Horario manual eliminado, se usa el dinámico */}
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600 mb-1 block">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600 mb-3 block font-semibold">
                Horario Laboral
              </label>
              <div className="space-y-3">
                {formData.workSchedule.map((schedule: WorkSchedule) => (
                  <div
                    key={schedule.day}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 w-24">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) =>
                          handleScheduleChange(
                            schedule.day,
                            "enabled",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
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
                          onChange={(e) =>
                            handleScheduleChange(
                              schedule.day,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              schedule.day,
                              "endTime",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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

      {/* --- COLUMNA DERECHA: Vista Previa y Carga de Imagen --- */}
      <div className="lg:col-span-1 space-y-6">
        {/* SECCIÓN DE CARGA DE IMAGEN */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Imagen de Perfil
          </h3>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <PhotoCamera />
                </div>
              )}
            </div>

            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={handleImageClick}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 600,
                color: "text.primary",
                borderColor: "grey.300",
                "&:hover": {
                  borderColor: themeColor,
                  backgroundColor: "rgba(249, 115, 22, 0.04)",
                },
              }}
            >
              {profileImage ? "Cambiar foto" : "Subir foto"}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Se recomienda una imagen rectangular para el banner.
          </p>
        </div>

        {/* --- CARD DE VISTA PREVIA (Estilo Suministros - Naranja) --- */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Vista previa en App
          </h3>

          <div className="flex justify-center">
            {/* Contenedor del Card */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden w-full max-w-[300px] flex flex-col border border-gray-100">
              {/* Imagen Superior */}
              <div className="h-44 w-full bg-gray-200 relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Supply"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                    <PhotoCamera style={{ fontSize: 40, opacity: 0.5 }} />
                  </div>
                )}
              </div>

              {/* Contenido (Fondo Naranja Suave) */}
              <div
                className="p-5 flex flex-col gap-3"
                style={{ backgroundColor: bgCardColor }}
              >
                {/* Nombre */}
                <h4 className="font-extrabold text-gray-900 text-lg leading-tight">
                  {isEditing
                    ? formData.name || "Nombre del Negocio"
                    : supply.name}
                </h4>

                {/* Info: Dirección */}
                <div className="flex items-start gap-2 text-gray-600">
                  <LocationOn
                    style={{ fontSize: 18 }}
                    className="flex-shrink-0 mt-0.5"
                  />
                  <span className="text-xs leading-snug">
                    {isEditing
                      ? formData.address || "Dirección"
                      : supply.address}
                  </span>
                </div>

                {/* Info: Horario (DINÁMICO) */}
                <div className="flex items-start gap-2 text-gray-600">
                  <AccessTime
                    style={{ fontSize: 18 }}
                    className="flex-shrink-0 mt-0.5"
                  />
                  <span className="text-xs leading-snug">
                    {/* Llamada a la función dinámica */}
                    {displaySchedule}
                  </span>
                </div>

                {/* Botón Ver Productos */}
                <div className="mt-2 w-full">
                  <div
                    className="text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm cursor-default flex items-center justify-center w-full transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: themeColor }}
                  >
                    <span>Ver productos</span>
                  </div>
                </div>
              </div>
            </div>
            {/* --- FIN DEL CARD --- */}
          </div>
          <p className="text-xs text-center text-gray-400 mt-4">
            Así verán tu perfil los pacientes en la app
          </p>
        </div>
      </div>
    </div>
  );
};
