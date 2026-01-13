import {
  CloudUpload,
  Edit,
  PhotoCamera,
  Visibility,
  WorkOutline,
} from "@mui/icons-material";
import { Button, Chip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import type {
  DoctorDashboard,
  WorkSchedule,
} from "../../domain/DoctorDashboard.entity";
import { useUpdateDoctorProfile } from "../hooks/useUpdateDoctorProfile";

interface ProfileSectionProps {
  data: DoctorDashboard;
  onUpdate?: (updatedData: DoctorDashboard) => void;
}

export const ProfileSection = ({ data, onUpdate }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authStore = useAuthStore();
  const { user } = authStore;
  const { updateProfile, loading: saving } = useUpdateDoctorProfile();

  const defaultSchedule: WorkSchedule[] = [
    { day: "monday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "tuesday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "wednesday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "thursday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "friday", enabled: true, startTime: "09:00", endTime: "17:00" },
  ];

  const [formData, setFormData] = useState({
    name: data?.doctor?.name || "",
    specialty: data?.doctor?.specialty || "",
    email: data?.doctor?.email || "",
    whatsapp: data?.doctor?.whatsapp || "",
    address: data?.doctor?.address || "",
    price: (data?.doctor?.price || 0).toString(),
    experience: (data?.doctor?.experience || 0).toString(),
    description: data?.doctor?.description || "",
    workSchedule: data?.doctor?.workSchedule || defaultSchedule,
    isActive: data?.doctor?.isActive !== false,
  });

  useEffect(() => {
    if (data?.doctor) {
      setFormData({
        name: data.doctor.name,
        specialty: data.doctor.specialty,
        email: data.doctor.email,
        whatsapp: data.doctor.whatsapp,
        address: data.doctor.address,
        price: data.doctor.price.toString(),
        experience: (data.doctor.experience || 0).toString(),
        description: data.doctor.description,
        workSchedule: data.doctor.workSchedule || defaultSchedule,
        isActive: data.doctor.isActive !== false,
      });
    }
  }, [data]);

  useEffect(() => {
    if (user?.id) {
      const savedImage = localStorage.getItem(
        `doctor-profile-image-${user.id}`
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
    if (data?.doctor) {
      setFormData({
        name: data.doctor.name,
        specialty: data.doctor.specialty,
        email: data.doctor.email,
        whatsapp: data.doctor.whatsapp,
        address: data.doctor.address,
        price: data.doctor.price.toString(),
        experience: (data.doctor.experience || 0).toString(),
        description: data.doctor.description,
        workSchedule: data.doctor.workSchedule || defaultSchedule,
        isActive: data.doctor.isActive !== false,
      });
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    const updatedData = await updateProfile(user.id, {
      name: formData.name,
      specialty: formData.specialty,
      email: formData.email,
      whatsapp: formData.whatsapp,
      address: formData.address,
      price: parseFloat(formData.price) || 0,
      experience: parseInt(formData.experience) || 0,
      description: formData.description,
      workSchedule: formData.workSchedule,
    });

    if (updatedData) {
      setIsEditing(false);
      if (onUpdate) {
        onUpdate(updatedData);
      }
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
          localStorage.setItem(`doctor-profile-image-${user.id}`, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!data || !data.doctor) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-500">Cargando información del perfil...</p>
      </div>
    );
  }

  const doctor = data.doctor;
  const appThemeColor = "#06b6d4";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* --- COLUMNA IZQUIERDA: Formulario de Edición --- */}
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
              disabled={saving}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="text-sm">Guardando...</span>
              ) : (
                <span className="text-sm font-medium">Guardar cambios</span>
              )}
            </button>
          )}
        </div>

        {!isEditing ? (
          // VISTA: Solo Lectura
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                { label: "Nombre completo", val: doctor.name },
                { label: "Especialidad", val: doctor.specialty },
                { label: "Email", val: doctor.email },
                { label: "WhatsApp", val: doctor.whatsapp },
                { label: "Dirección", val: doctor.address },
                {
                  label: "Tarifa de consulta",
                  val: `$${doctor.price.toFixed(2)}`,
                },
                // Mostrar experiencia en el form de solo lectura
                {
                  label: "Años de Experiencia",
                  val: `${doctor.experience || 0} años`,
                },
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
                {doctor.description}
              </p>
            </div>

            {/* Estado del Servicio */}
            <div className="mt-6">
              <label className="text-sm text-gray-600">Estado del Servicio</label>
              <div className="mt-2">
                <Chip
                  label={doctor.isActive !== false ? "Activo" : "Inactivo"}
                  color={doctor.isActive !== false ? "success" : "error"}
                  size="medium"
                  sx={{ fontWeight: 600 }}
                />
              </div>
            </div>

            {doctor.workSchedule && doctor.workSchedule.length > 0 && (
              <div className="mt-6">
                <label className="text-sm text-gray-600 mb-3 block font-semibold">
                  Horario Laboral
                </label>
                <div className="space-y-2">
                  {doctor.workSchedule.map((schedule: WorkSchedule) => (
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
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Especialidad
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => handleChange("specialty", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Tarifa de consulta ($)
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    handleChange("price", value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Campo de Experiencia Editable */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Años de Experiencia
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600 mb-1 block">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
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
                          onChange={(e) =>
                            handleScheduleChange(
                              schedule.day,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
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

      {/* --- COLUMNA DERECHA: Vista Previa y Carga de Imagen --- */}
      <div className="lg:col-span-1 space-y-6">
        {/* 1. SECCIÓN DE CARGA DE IMAGEN */}
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
                  borderColor: "text.primary",
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              {profileImage ? "Cambiar foto" : "Subir foto"}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Se recomienda una imagen cuadrada de al menos 500x500px. Máximo 5MB.
          </p>
        </div>

        {/* 2. CARD DE VISTA PREVIA (Rediseñada estilo App) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Vista previa en App
          </h3>

          <div className="flex justify-center">
            {/* --- EL CARD MÓVIL --- */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden w-full max-w-[300px] flex flex-col border border-gray-100 pb-4">
              {/* Imagen (Cover) */}
              <div className="h-44 w-full bg-gray-200 relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Doctor Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                    <PhotoCamera style={{ fontSize: 40, opacity: 0.5 }} />
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-4 flex flex-col items-start gap-1">
                {/* Nombre */}
                <h4 className="font-extrabold text-gray-900 text-lg leading-tight mb-1">
                  {isEditing
                    ? formData.name || "Nombre del Doctor"
                    : doctor.name}
                </h4>

                {/* Fila: Chip de Especialidad + Experiencia */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-white px-3 py-1 rounded-md text-xs font-bold"
                    style={{ backgroundColor: appThemeColor }}
                  >
                    {isEditing
                      ? formData.specialty || "General"
                      : doctor.specialty}
                  </span>

                  {/* Icono Gris + Años */}
                  <div className="flex items-center gap-1 text-gray-500">
                    <WorkOutline sx={{ fontSize: 16 }} />
                    <span className="text-xs font-medium">
                      {isEditing
                        ? formData.experience || 0
                        : doctor.experience || 0}{" "}
                      años de experiencia
                    </span>
                  </div>
                </div>

                {/* Botón Ver Médico */}
                <div className="mt-4 w-full">
                  <div
                    className="text-white text-base font-bold px-4 py-3 rounded-xl shadow-md cursor-default flex items-center justify-center gap-2 w-full transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: appThemeColor }}
                  >
                    <Visibility sx={{ fontSize: 20 }} />
                    <span>Ver Médico</span>
                  </div>
                </div>
              </div>
            </div>
            {/* --- FIN DEL CARD MÓVIL --- */}
          </div>
          <p className="text-xs text-center text-gray-400 mt-4">
            Así verán tu perfil los pacientes en la app
          </p>
        </div>
      </div>
    </div>
  );
};
