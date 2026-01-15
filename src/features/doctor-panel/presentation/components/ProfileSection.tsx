import {
  CloudUpload,
  Edit,
  PhotoCamera,
  Visibility,
  WorkOutline,
  CreditCard,
  AttachMoney,
  Publish,
  VisibilityOff,
  Phone,
  LocationOn,
  Email,
} from "@mui/icons-material";
import { Button, Chip, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import type { PaymentMethod, ProfileStatus } from "../../domain/DoctorDashboard.entity";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import type {
  DoctorDashboard,
  WorkSchedule,
} from "../../domain/DoctorDashboard.entity";
import { useUpdateDoctorProfile } from "../hooks/useUpdateDoctorProfile";
import { handleLetterInput, handleNumberInput, handlePhoneInput, handleEmailInput, handleBothInput } from "../../../../shared/lib/inputValidation";

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
    profileStatus: (data?.doctor?.profileStatus || 'draft') as ProfileStatus,
    paymentMethods: (data?.doctor?.paymentMethods || 'both') as PaymentMethod,
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
        profileStatus: (data.doctor.profileStatus || 'draft') as ProfileStatus,
        paymentMethods: (data.doctor.paymentMethods || 'both') as PaymentMethod,
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
        profileStatus: (data.doctor.profileStatus || 'draft') as ProfileStatus,
        paymentMethods: (data.doctor.paymentMethods || 'both') as PaymentMethod,
      });
    }
  };

  const handleTogglePublish = async () => {
    if (!user?.id) return;
    
    const newStatus: ProfileStatus = formData.profileStatus === 'published' ? 'draft' : 'published';
    const updatedData = await updateProfile(user.id, {
      profileStatus: newStatus,
    });

    if (updatedData) {
      setFormData((prev) => ({ ...prev, profileStatus: newStatus }));
      if (onUpdate) {
        onUpdate(updatedData);
      }
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
      profileStatus: formData.profileStatus,
      paymentMethods: formData.paymentMethods,
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

            {/* Formas de Pago Aceptadas */}
            <div className="mt-6">
              <label className="text-sm text-gray-600">Formas de pago aceptadas</label>
              <div className="mt-2 flex gap-2">
                {(doctor.paymentMethods === 'card' || doctor.paymentMethods === 'both') && (
                  <Chip
                    icon={<CreditCard />}
                    label="Tarjeta"
                    color="primary"
                    size="small"
                  />
                )}
                {(doctor.paymentMethods === 'cash' || doctor.paymentMethods === 'both') && (
                  <Chip
                    icon={<AttachMoney />}
                    label="Presencial"
                    color="primary"
                    size="small"
                  />
                )}
              </div>
            </div>

            {/* Estado del Perfil */}
            <div className="mt-6">
              <label className="text-sm text-gray-600">Estado del perfil</label>
              <div className="mt-2 flex items-center gap-3">
                <Chip
                  label={
                    doctor.profileStatus === 'published' ? 'Publicado' :
                    doctor.profileStatus === 'suspended' ? 'Suspendido' : 'Borrador'
                  }
                  color={
                    doctor.profileStatus === 'published' ? 'success' :
                    doctor.profileStatus === 'suspended' ? 'error' : 'default'
                  }
                  size="medium"
                  sx={{ fontWeight: 600 }}
                />
                <Button
                  variant={doctor.profileStatus === 'published' ? 'outlined' : 'contained'}
                  startIcon={doctor.profileStatus === 'published' ? <VisibilityOff /> : <Publish />}
                  onClick={handleTogglePublish}
                  sx={{
                    textTransform: 'none',
                    ...(doctor.profileStatus === 'published' 
                      ? { borderColor: '#ef4444', color: '#ef4444', '&:hover': { borderColor: '#dc2626', backgroundColor: '#fef2f2' } }
                      : { backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }
                    )
                  }}
                >
                  {doctor.profileStatus === 'published' ? 'Ocultar en la app' : 'Publicar en la app'}
                </Button>
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

            {/* Información de Contacto y Ubicación */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <Phone sx={{ fontSize: 18, color: "#25D366" }} />
                  WhatsApp
                </label>
                <p className="text-gray-800 font-medium mt-1">{doctor.whatsapp || "No disponible"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <LocationOn sx={{ fontSize: 18, color: "#ef4444" }} />
                  Ubicación / Dirección
                </label>
                <p className="text-gray-800 font-medium mt-1">{doctor.address || "No disponible"}</p>
              </div>
            </div>
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
                  onChange={(e) => handleLetterInput(e, (value) => handleChange("name", value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Solo letras y espacios</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Especialidad
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => handleLetterInput(e, (value) => handleChange("specialty", value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Solo letras y espacios</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleEmailInput(e, (value) => handleChange("email", value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Formato: ejemplo@correo.com</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handlePhoneInput(e, (value) => handleChange("whatsapp", value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+593 99 123 4567"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Solo números, espacios, guiones y paréntesis</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleBothInput(e, (value) => handleChange("address", value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Letras, números y caracteres especiales</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Tarifa de consulta ($)
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleNumberInput(e, (value) => handleChange("price", value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Solo números y punto decimal</p>
              </div>

              {/* Campo de Experiencia Editable */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Años de Experiencia
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => handleNumberInput(e, (value) => handleChange("experience", value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Solo números</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600 mb-1 block">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleBothInput(e, (value) => handleChange("description", value))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Letras, números y caracteres especiales</p>
            </div>

            {/* Formas de Pago */}
            <div className="mt-6">
              <label className="text-sm text-gray-600 mb-1 block">
                Formas de pago aceptadas
              </label>
              <FormControl fullWidth>
                <Select
                  value={formData.paymentMethods}
                  onChange={(e) => handleChange("paymentMethods", e.target.value)}
                  className="w-full"
                >
                  <MenuItem value="card">Solo Tarjeta</MenuItem>
                  <MenuItem value="cash">Solo Presencial</MenuItem>
                  <MenuItem value="both">Tarjeta y Presencial</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Estado del Perfil */}
            <div className="mt-6">
              <label className="text-sm text-gray-600 mb-1 block">
                Estado del perfil
              </label>
              <FormControl fullWidth>
                <Select
                  value={formData.profileStatus}
                  onChange={(e) => handleChange("profileStatus", e.target.value)}
                  className="w-full"
                >
                  <MenuItem value="draft">Borrador</MenuItem>
                  <MenuItem value="published">Publicado</MenuItem>
                  <MenuItem value="suspended">Suspendido</MenuItem>
                </Select>
              </FormControl>
              <p className="text-xs text-gray-500 mt-2">
                {formData.profileStatus === 'published' && 'Tu perfil es visible en la app'}
                {formData.profileStatus === 'draft' && 'Tu perfil no es visible en la app'}
                {formData.profileStatus === 'suspended' && 'Tu perfil está suspendido y no es visible'}
              </p>
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

            {/* Información de Contacto y Ubicación */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <Phone sx={{ fontSize: 18, color: "#25D366" }} />
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handlePhoneInput(e, (value) => handleChange("whatsapp", value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+593 99 123 4567"
                />
                <p className="text-xs text-gray-500 mt-1">Solo números, espacios, guiones y paréntesis</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <LocationOn sx={{ fontSize: 18, color: "#ef4444" }} />
                  Ubicación / Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleBothInput(e, (value) => handleChange("address", value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Av. Principal 123, Ciudad"
                />
                <p className="text-xs text-gray-500 mt-1">Letras, números y caracteres especiales</p>
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
                <div className="flex items-center gap-3 flex-wrap">
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
                      años
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <div className="mt-3 w-full">
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {isEditing
                      ? formData.description || "Descripción profesional..."
                      : doctor.description || "Descripción profesional..."}
                  </p>
                </div>

                {/* Información de Contacto */}
                <div className="mt-3 w-full space-y-2">
                  {/* WhatsApp */}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone sx={{ fontSize: 16, color: "#25D366" }} />
                    <span className="truncate">
                      {isEditing
                        ? formData.whatsapp || "WhatsApp no disponible"
                        : doctor.whatsapp || "WhatsApp no disponible"}
                    </span>
                  </div>

                  {/* Ubicación */}
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <LocationOn sx={{ fontSize: 16, color: "#ef4444", flexShrink: 0, mt: 0.5 }} />
                    <span className="line-clamp-2">
                      {isEditing
                        ? formData.address || "Dirección no disponible"
                        : doctor.address || "Dirección no disponible"}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Email sx={{ fontSize: 16, color: "#6b7280" }} />
                    <span className="truncate">
                      {isEditing
                        ? formData.email || "Email no disponible"
                        : doctor.email || "Email no disponible"}
                    </span>
                  </div>
                </div>

                {/* Precio */}
                <div className="mt-3 w-full">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-600">Tarifa de consulta</span>
                    <span className="text-sm font-bold text-gray-900">
                      ${isEditing
                        ? parseFloat(formData.price) || 0
                        : doctor.price || 0}
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
