import {
  AttachMoney,
  CloudUpload,
  CreditCard,
  Edit,
  Email,
  LocationOn,
  Phone,
  PhotoCamera,
  Publish,
  Visibility,
  VisibilityOff,
  WorkOutline,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import {
  handleBothInput,
  handleEmailInput,
  handleLetterInput,
  handleNumberInput,
  handlePhoneInput,
} from "../../../../shared/lib/inputValidation";
import type {
  DoctorDashboard,
  PaymentMethod,
  ProfileStatus,
  WorkSchedule,
} from "../../domain/DoctorDashboard.entity";
import type { Specialty } from "../../infrastructure/doctors.api";
import { useUpdateDoctorProfile } from "../hooks/useUpdateDoctorProfile";
import { useSpecialties } from "../../../auth/presentation/hooks/useSpecialties";

interface ProfileSectionProps {
  data: DoctorDashboard;
  onUpdate?: (updatedData: DoctorDashboard) => void;
}

// Configuración del menú desplegable del Select
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Esto define el orden y los días que SIEMPRE deben aparecer en el formulario
const DEFAULT_SCHEDULE_TEMPLATE: WorkSchedule[] = [
  { day: "monday", enabled: true, startTime: "09:00", endTime: "17:00", breakStart: null, breakEnd: null },
  { day: "tuesday", enabled: true, startTime: "09:00", endTime: "17:00", breakStart: null, breakEnd: null },
  { day: "wednesday", enabled: true, startTime: "09:00", endTime: "17:00", breakStart: null, breakEnd: null },
  { day: "thursday", enabled: true, startTime: "09:00", endTime: "17:00", breakStart: null, breakEnd: null },
  { day: "friday", enabled: true, startTime: "09:00", endTime: "17:00", breakStart: null, breakEnd: null },
  { day: "saturday", enabled: false, startTime: "09:00", endTime: "17:00", breakStart: null, breakEnd: null },
  { day: "sunday", enabled: false, startTime: "09:00", endTime: "17:00", breakStart: null, breakEnd: null },
];

// Función helper para extraer coordenadas de Google Maps URL
const extractCoordinatesFromGoogleMapsUrl = (url: string): { lat: number | null, lng: number | null } => {
  if (!url || url.trim() === "") return { lat: null, lng: null };
  
  try {
    // Formato 1: https://www.google.com/maps/place/.../@lat,lng,zoom
    const placeMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (placeMatch) {
      const lat = parseFloat(placeMatch[1]);
      const lng = parseFloat(placeMatch[2]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    
    // Formato 2: https://maps.google.com/?q=lat,lng
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (qMatch) {
      const lat = parseFloat(qMatch[1]);
      const lng = parseFloat(qMatch[2]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    
    // Formato 3: https://maps.google.com/?ll=lat,lng
    const llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (llMatch) {
      const lat = parseFloat(llMatch[1]);
      const lng = parseFloat(llMatch[2]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
  } catch (error) {
    console.error('Error extrayendo coordenadas de Google Maps URL:', error);
  }
  
  return { lat: null, lng: null };
};

// Función de validación
const validateLocationData = (data: { latitude?: string; longitude?: string; google_maps_url?: string }) => {
  if (data.latitude !== undefined && data.latitude !== "" && data.latitude !== null) {
    const lat = parseFloat(data.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw new Error("Latitud debe estar entre -90 y 90");
    }
  }
  
  if (data.longitude !== undefined && data.longitude !== "" && data.longitude !== null) {
    const lng = parseFloat(data.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      throw new Error("Longitud debe estar entre -180 y 180");
    }
  }
  
  if (data.google_maps_url && data.google_maps_url !== "") {
    try {
      new URL(data.google_maps_url);
    } catch {
      throw new Error("Google Maps URL no es válida");
    }
  }
};

export const ProfileSection = ({ data, onUpdate }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [newImageBase64, setNewImageBase64] = useState<string | null>(null);

  // Usar hook de React Query para especialidades
  const { data: specialtiesList = [], isLoading: loadingSpecialties } = useSpecialties();

  // Estado para detectar si estamos usando horarios por defecto (BD vacía)
  const [isUsingDefaultSchedule, setIsUsingDefaultSchedule] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const authStore = useAuthStore();
  const { user } = authStore;
  const { mutateAsync: updateProfile, isPending: saving } = useUpdateDoctorProfile();

  // Estado del formulario actual
  const [formData, setFormData] = useState({
    name: "",
    specialty: [] as string[],
    email: "",
    whatsapp: "",
    address: "",
    latitude: "",
    longitude: "",
    google_maps_url: "",
    price: "0",
    experience: "0",
    description: "",
    workSchedule: DEFAULT_SCHEDULE_TEMPLATE,
    isActive: true,
    profileStatus: "draft" as ProfileStatus,
    paymentMethods: "both" as PaymentMethod,
  });

  // Estado para guardar los datos originales y comparar cambios
  const [initialFormData, setInitialFormData] = useState<
    typeof formData | null
  >(null);

  useEffect(() => {
    if (data?.doctor) {
      // --- LÓGICA DE ESPECIALIDADES ROBUSTA ---
      let incomingSpecialty: string[] = [];

      if (Array.isArray(data.doctor.specialty)) {
        // Si ya es un array, lo usamos tal cual
        incomingSpecialty = data.doctor.specialty as unknown as string[];
      } else if (
        typeof data.doctor.specialty === "string" &&
        data.doctor.specialty
      ) {
        // Si es un string separado por comas, lo convertimos a array
        incomingSpecialty = data.doctor.specialty.includes(",")
          ? data.doctor.specialty.split(",").map((s) => s.trim())
          : [data.doctor.specialty];
      }

      const backendSchedule = data.doctor.workSchedule;

      // Iteramos sobre la plantilla base (Lunes a Viernes)
      const scheduleToUse = DEFAULT_SCHEDULE_TEMPLATE.map((defaultDay) => {
        if (!backendSchedule || backendSchedule.length === 0) return defaultDay;

        const found = backendSchedule.find(
          (s) => s.day.toLowerCase() === defaultDay.day.toLowerCase(),
        );

        if (found) {
          return found;
        } else {
          return { ...defaultDay, enabled: false };
        }
      });

      const isDefault = !backendSchedule || backendSchedule.length === 0;
      setIsUsingDefaultSchedule(isDefault);

      const newFormData = {
        name: data.doctor.name || "",
        specialty: incomingSpecialty,
        email: data.doctor.email || "",
        whatsapp: data.doctor.whatsapp || "",
        address: data.doctor.address || "",
        latitude: data.doctor.latitude?.toString() || "",
        longitude: data.doctor.longitude?.toString() || "",
        google_maps_url: data.doctor.google_maps_url || "",
        price: (data.doctor.price || 0).toString(),
        experience: (data.doctor.experience || 0).toString(),
        description: data.doctor.description || "",

        workSchedule: scheduleToUse,

        isActive: data.doctor.isActive !== false,
        profileStatus: (data.doctor.profileStatus || "draft") as ProfileStatus,
        paymentMethods: (data.doctor.paymentMethods || "both") as PaymentMethod,
      };

      setFormData(newFormData);
      setInitialFormData(newFormData);
    }
  }, [data]);

  // Cargar imagen desde el backend (imageUrl del doctor)
  useEffect(() => {
    if (data?.doctor) {
      const imgUrl = (data.doctor as any).imageUrl || (data.doctor as any).profile_picture_url || null;
      if (imgUrl) setProfileImage(imgUrl);
    }
  }, [data]);

  // --- LÓGICA DE DETECCIÓN DE CAMBIOS ---
  const isModified = useMemo(() => {
    if (!initialFormData) return false;

    // 1. Comparar campos simples
    if (formData.name !== initialFormData.name) return true;
    if (formData.email !== initialFormData.email) return true;
    if (formData.whatsapp !== initialFormData.whatsapp) return true;
    if (formData.address !== initialFormData.address) return true;
    if (formData.latitude !== initialFormData.latitude) return true;
    if (formData.longitude !== initialFormData.longitude) return true;
    if (formData.google_maps_url !== initialFormData.google_maps_url) return true;
    if (formData.price !== initialFormData.price) return true;
    if (formData.experience !== initialFormData.experience) return true;
    if (formData.description !== initialFormData.description) return true;
    if (formData.profileStatus !== initialFormData.profileStatus) return true;
    if (formData.paymentMethods !== initialFormData.paymentMethods) return true;

    // 2. Comparar Arrays (Specialties)
    const currentSpecs = [...formData.specialty].sort();
    const initialSpecs = [...initialFormData.specialty].sort();
    if (JSON.stringify(currentSpecs) !== JSON.stringify(initialSpecs))
      return true;

    // 3. Comparar Objetos Complejos (Schedule)
    if (
      JSON.stringify(formData.workSchedule) !==
      JSON.stringify(initialFormData.workSchedule)
    )
      return true;

    return false;
  }, [formData, initialFormData]);

  const isSaveDisabled = saving || (!isModified && !isUsingDefaultSchedule && !newImageBase64);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewImageBase64(null);
    if (initialFormData) {
      setFormData(initialFormData);
    }
  };

  const handleTogglePublish = async () => {
    if (!user?.id) return;

    const newStatus: ProfileStatus =
      formData.profileStatus === "published" ? "draft" : "published";
    const updatedData = await updateProfile({
      profileStatus: newStatus,
    });

    if (updatedData) {
      const newData = { ...formData, profileStatus: newStatus };
      setFormData(newData);
      setInitialFormData(newData);
      if (onUpdate) {
        onUpdate(updatedData);
      }
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    // Validación de horario + almuerzo (break time)
    const timeLessThan = (a: string, b: string) => a < b; // HH:mm funciona lexicográficamente
    for (const s of formData.workSchedule) {
      if (!s.enabled) continue;

      if (!s.startTime || !s.endTime) {
        alert(`Completa el horario de ${dayLabels[s.day] || s.day}`);
        return;
      }

      if (!timeLessThan(s.startTime, s.endTime)) {
        alert(`El horario de ${dayLabels[s.day] || s.day} es inválido: inicio debe ser menor que fin.`);
        return;
      }

      const hasBreakStart = Boolean(s.breakStart);
      const hasBreakEnd = Boolean(s.breakEnd);

      if (hasBreakStart !== hasBreakEnd) {
        alert(`Almuerzo incompleto en ${dayLabels[s.day] || s.day}: selecciona inicio y fin, o elige "Sin almuerzo".`);
        return;
      }

      if (hasBreakStart && hasBreakEnd) {
        const bs = s.breakStart as string;
        const be = s.breakEnd as string;

        if (!timeLessThan(bs, be)) {
          alert(`Almuerzo inválido en ${dayLabels[s.day] || s.day}: inicio debe ser menor que fin.`);
          return;
        }

        // Recomendado: break dentro del rango laboral
        if (!(timeLessThan(s.startTime, bs) && timeLessThan(be, s.endTime))) {
          alert(`El almuerzo de ${dayLabels[s.day] || s.day} debe estar dentro del horario laboral.`);
          return;
        }
      }
    }

    // Validar datos de ubicación
    try {
      validateLocationData({
        latitude: formData.latitude,
        longitude: formData.longitude,
        google_maps_url: formData.google_maps_url,
      });
    } catch (error: any) {
      alert(error.message);
      return;
    }

    // Extraer coordenadas automáticamente si hay Google Maps URL y no hay coordenadas
    let finalLatitude = formData.latitude ? parseFloat(formData.latitude) : null;
    let finalLongitude = formData.longitude ? parseFloat(formData.longitude) : null;
    
    if (formData.google_maps_url && (!finalLatitude || !finalLongitude)) {
      const extracted = extractCoordinatesFromGoogleMapsUrl(formData.google_maps_url);
      if (extracted.lat && extracted.lng) {
        finalLatitude = extracted.lat;
        finalLongitude = extracted.lng;
      }
    }

    const payload = {
      name: formData.name,
      specialties: formData.specialty,
      email: formData.email,
      whatsapp: formData.whatsapp,
      address: formData.address,
      latitude: finalLatitude,
      longitude: finalLongitude,
      google_maps_url: formData.google_maps_url || null,
      price: parseFloat(formData.price) || 0,
      experience: parseInt(formData.experience) || 0,
      description: formData.description,
      workSchedule: formData.workSchedule,
      profileStatus: formData.profileStatus,
      paymentMethods: formData.paymentMethods,
      ...(newImageBase64 ? { imageUrl: newImageBase64 } : {}),
    };
    
    try {
      const updatedData = await updateProfile(payload);

      if (updatedData) {
        setIsEditing(false);
        setIsUsingDefaultSchedule(false);
        setInitialFormData(formData);
        setNewImageBase64(null);
        // Actualizar imagen mostrada con la URL de Cloudinary si el backend la retorna
        const returnedImage = (updatedData.doctor as any)?.imageUrl || (updatedData.doctor as any)?.profile_picture_url;
        if (returnedImage) setProfileImage(returnedImage);
        if (onUpdate) onUpdate(updatedData);
      }
    } catch (error: any) {
      console.error('Error al guardar el perfil:', error);
      alert(error?.message || 'Error al guardar el perfil. Por favor, intenta de nuevo.');
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === "string" ? value.split(",") : value;
    setFormData((prev) => ({ ...prev, specialty: newValue }));
  };

  const handleScheduleChange = (
    day: string,
    field: "enabled" | "startTime" | "endTime" | "breakStart" | "breakEnd",
    value: boolean | string | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      workSchedule: prev.workSchedule.map((schedule: WorkSchedule) =>
        schedule.day === day
          ? {
              ...schedule,
              [field]:
                field === "breakStart" || field === "breakEnd"
                  ? (value === "" ? null : value)
                  : value,
            }
          : schedule,
      ),
    }));
  };

  const handleNoLunch = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workSchedule: prev.workSchedule.map((s: WorkSchedule) =>
        s.day === day ? { ...s, breakStart: null, breakEnd: null } : s,
      ),
    }));
  };

  const dayLabels: Record<string, string> = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
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
        setNewImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Usar datos por defecto si no existen (para usuarios nuevos)
  // Esto permite que el formulario se muestre vacío en lugar de "Cargando..."
  const doctor = data?.doctor || {
    name: user?.name || "",
    specialty: "",
    email: user?.email || "",
    whatsapp: "",
    address: "",
    price: 0,
    description: "",
    isActive: true,
    profileStatus: "draft" as ProfileStatus,
    paymentMethods: "both" as PaymentMethod,
  };
  const appThemeColor = "#06b6d4";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* --- COLUMNA IZQUIERDA: Formulario --- */}
      <div className="lg:col-span-2 min-w-0 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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
              disabled={isSaveDisabled}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isSaveDisabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
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
              <div>
                <label className="text-sm text-gray-600">Nombre completo</label>
                <p className="text-gray-800 font-medium mt-1">{doctor.name}</p>
              </div>

              {/* Especialidades */}
              <div>
                <label className="text-sm text-gray-600">
                  Especialidad(es)
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(Array.isArray(doctor.specialty)
                    ? doctor.specialty
                    : [doctor.specialty]
                  ).map((spec: any, idx: number) =>
                    spec ? (
                      <Chip
                        key={idx}
                        label={spec}
                        size="small"
                        sx={{ backgroundColor: "#e0f2f1", color: "#00695c" }}
                      />
                    ) : (
                      <span>-</span>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-gray-800 font-medium mt-1">{doctor.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">WhatsApp</label>
                <p className="text-gray-800 font-medium mt-1">
                  {doctor.whatsapp}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Dirección</label>
                <p className="text-gray-800 font-medium mt-1 break-words">
                  {doctor.address}
                </p>
                {doctor.google_maps_url && (
                  <div className="mt-2">
                    <a
                      href={doctor.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 text-sm inline-block break-all"
                    >
                      Ver en Google Maps →
                    </a>
                  </div>
                )}
                {(doctor.latitude !== null && doctor.latitude !== undefined && 
                  doctor.longitude !== null && doctor.longitude !== undefined) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Coordenadas: {doctor.latitude}, {doctor.longitude}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Tarifa de consulta
                </label>
                <p className="text-gray-800 font-medium mt-1">
                  ${doctor.price.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Años de Experiencia
                </label>
                <p className="text-gray-800 font-medium mt-1">
                  {doctor.experience || 0} años
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600">Descripción</label>
              <p className="text-gray-800 mt-2 leading-relaxed">
                {doctor.description}
              </p>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600">
                Formas de pago aceptadas
              </label>
              <div className="mt-2 flex gap-2">
                {(doctor.paymentMethods === "card" ||
                  doctor.paymentMethods === "both") && (
                  <Chip
                    icon={<CreditCard />}
                    label="Tarjeta"
                    color="primary"
                    size="small"
                  />
                )}
                {(doctor.paymentMethods === "cash" ||
                  doctor.paymentMethods === "both") && (
                  <Chip
                    icon={<AttachMoney />}
                    label="Presencial"
                    color="primary"
                    size="small"
                  />
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600">Estado del perfil</label>
              <div className="mt-2 flex items-center gap-3">
                <Chip
                  label={
                    doctor.profileStatus === "published"
                      ? "Publicado"
                      : doctor.profileStatus === "suspended"
                        ? "Suspendido"
                        : "Borrador"
                  }
                  color={
                    doctor.profileStatus === "published"
                      ? "success"
                      : doctor.profileStatus === "suspended"
                        ? "error"
                        : "default"
                  }
                  size="medium"
                  sx={{ fontWeight: 600 }}
                />
                <Button
                  variant={
                    doctor.profileStatus === "published"
                      ? "outlined"
                      : "contained"
                  }
                  startIcon={
                    doctor.profileStatus === "published" ? (
                      <VisibilityOff />
                    ) : (
                      <Publish />
                    )
                  }
                  onClick={handleTogglePublish}
                  sx={{
                    textTransform: "none",
                    ...(doctor.profileStatus === "published"
                      ? {
                          borderColor: "#ef4444",
                          color: "#ef4444",
                          "&:hover": {
                            borderColor: "#dc2626",
                            backgroundColor: "#fef2f2",
                          },
                        }
                      : {
                          backgroundColor: "#10b981",
                          "&:hover": { backgroundColor: "#059669" },
                        }),
                  }}
                >
                  {doctor.profileStatus === "published"
                    ? "Ocultar en la app"
                    : "Publicar en la app"}
                </Button>
              </div>
            </div>

            <div className="mt-6 min-w-0 overflow-visible">
              <label className="text-sm text-gray-600 mb-3 block font-semibold">
                Horario Laboral
              </label>

              {/* --- VISTA: Muestra mensaje si no hay horarios --- */}
              {doctor.workSchedule && doctor.workSchedule.length > 0 ? (
                <div className="space-y-2 min-w-0">
                  {doctor.workSchedule.map((schedule: WorkSchedule) => (
                    <div
                      key={schedule.day}
                      className="flex items-center justify-between py-2 border-b border-gray-100 gap-2"
                    >
                      <span className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">
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
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                  <p className="text-sm text-gray-500 italic">
                    No tienes horarios configurados. Haz clic en{" "}
                    <span className="font-semibold">Editar</span> para
                    establecer tus horas de atención.
                  </p>
                </div>
              )}
              {/* ----------------------------------------------- */}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="min-w-0">
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <Phone sx={{ fontSize: 18, color: "#25D366" }} />
                  WhatsApp
                </label>
                <p className="text-gray-800 font-medium mt-1 break-words">
                  {doctor.whatsapp || "No disponible"}
                </p>
              </div>
              <div className="min-w-0">
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <LocationOn sx={{ fontSize: 18, color: "#ef4444" }} />
                  Ubicación / Dirección
                </label>
                <p className="text-gray-800 font-medium mt-1 break-all break-words max-w-full">
                  {doctor.address || "No disponible"}
                </p>
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
            {/* Campo de imagen dentro del formulario */}
            <div className="mt-6 mb-4">
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Imagen de perfil
              </label>
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-100 cursor-pointer hover:border-teal-400 transition-colors"
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <PhotoCamera style={{ fontSize: 32, color: "#9ca3af" }} />
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="px-3 py-1.5 text-sm border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-1"
                  >
                    <CloudUpload style={{ fontSize: 16 }} />
                    {profileImage ? "Cambiar imagen" : "Subir imagen"}
                  </button>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG. Mín. 800x220px (proporción 4:1). En la app se muestra como banner de ancho completo. Máx. 5MB.</p>
                  {newImageBase64 && (
                    <p className="text-xs text-teal-600 mt-1">✓ Nueva imagen lista para guardar</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    handleLetterInput(e, (value) => handleChange("name", value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solo letras y espacios
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Especialidad(es)
                </label>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={formData.specialty}
                    onChange={handleSpecialtyChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    className="bg-white"
                    disabled={loadingSpecialties}
                  >
                    <MenuItem value="" disabled>
                      <em>
                        {loadingSpecialties
                          ? "Cargando..."
                          : "Selecciona especialidades"}
                      </em>
                    </MenuItem>
                    {specialtiesList.map((spec) => (
                      <MenuItem key={spec.id} value={spec.name}>
                        <Checkbox
                          checked={formData.specialty.indexOf(spec.name) > -1}
                        />
                        <ListItemText primary={spec.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <p className="text-xs text-gray-500 mt-1">
                  Puedes seleccionar múltiples opciones
                </p>
              </div>

              {/* ... Resto de inputs (email, whatsapp, address, price, experience) ... */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleEmailInput(e, (value) => handleChange("email", value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: ejemplo@correo.com
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    handlePhoneInput(e, (value) =>
                      handleChange("whatsapp", value),
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+593 99 123 4567"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solo números, espacios, guiones y paréntesis
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    handleBothInput(e, (value) =>
                      handleChange("address", value),
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Letras, números y caracteres especiales
                </p>
              </div>

              {/* Campos de ubicación */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">
                  Link de Google Maps (opcional)
                </label>
                <input
                  type="url"
                  value={formData.google_maps_url}
                  onChange={(e) => {
                    handleChange("google_maps_url", e.target.value);
                    // Intentar extraer coordenadas automáticamente
                    if (e.target.value) {
                      const coords = extractCoordinatesFromGoogleMapsUrl(e.target.value);
                      if (coords.lat && coords.lng) {
                        setFormData(prev => ({
                          ...prev,
                          latitude: coords.lat?.toString() || "",
                          longitude: coords.lng?.toString() || "",
                        }));
                      }
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://maps.app.goo.gl/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si pegas un link de Google Maps, las coordenadas se extraerán automáticamente
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Latitud (opcional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ejemplo: -0.180653"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Entre -90 y 90
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Longitud (opcional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ejemplo: -78.467834"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Entre -180 y 180
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Tarifa de consulta ($)
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) =>
                    handleNumberInput(e, (value) =>
                      handleChange("price", value),
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solo números y punto decimal
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Años de Experiencia
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) =>
                    handleNumberInput(e, (value) =>
                      handleChange("experience", value),
                    )
                  }
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
                onChange={(e) =>
                  handleBothInput(e, (value) =>
                    handleChange("description", value),
                  )
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Letras, números y caracteres especiales
              </p>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600 mb-1 block">
                Formas de pago aceptadas
              </label>
              <FormControl fullWidth>
                <Select
                  value={formData.paymentMethods}
                  onChange={(e) =>
                    handleChange("paymentMethods", e.target.value)
                  }
                  className="w-full"
                >
                  <MenuItem value="card">Solo Tarjeta</MenuItem>
                  <MenuItem value="cash">Solo Presencial</MenuItem>
                  <MenuItem value="both">Tarjeta y Presencial</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-600 mb-1 block">
                Estado del perfil
              </label>
              <FormControl fullWidth>
                <Select
                  value={formData.profileStatus}
                  onChange={(e) =>
                    handleChange("profileStatus", e.target.value)
                  }
                  className="w-full"
                >
                  <MenuItem value="draft">Borrador</MenuItem>
                  <MenuItem value="published">Publicado</MenuItem>
                  <MenuItem value="suspended">Suspendido</MenuItem>
                </Select>
              </FormControl>
              <p className="text-xs text-gray-500 mt-2">
                {formData.profileStatus === "published" &&
                  "Tu perfil es visible en la app"}
                {formData.profileStatus === "draft" &&
                  "Tu perfil no es visible en la app"}
                {formData.profileStatus === "suspended" &&
                  "Tu perfil está suspendido y no es visible"}
              </p>
            </div>

            <div className="mt-6 min-w-0">
              <label className="text-sm text-gray-600 mb-3 block font-semibold">
                Horario Laboral
              </label>
              <div className="space-y-3 min-w-0">
                {formData.workSchedule.map((schedule: WorkSchedule) => (
                  <div
                    key={schedule.day}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 w-24 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) =>
                          handleScheduleChange(
                            schedule.day,
                            "enabled",
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {dayLabels[schedule.day] || schedule.day}
                      </span>
                    </div>
                    {schedule.enabled && (
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            step="1800"
                            value={schedule.startTime}
                            onChange={(e) =>
                              handleScheduleChange(
                                schedule.day,
                                "startTime",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            step="1800"
                            value={schedule.endTime}
                            onChange={(e) =>
                              handleScheduleChange(
                                schedule.day,
                                "endTime",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                          />
                        </div>

                        {/* Break time / Almuerzo */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-20">Almuerzo</span>
                          <input
                            type="time"
                            step="1800"
                            value={schedule.breakStart ?? ""}
                            onChange={(e) =>
                              handleScheduleChange(
                                schedule.day,
                                "breakStart",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            step="1800"
                            value={schedule.breakEnd ?? ""}
                            onChange={(e) =>
                              handleScheduleChange(
                                schedule.day,
                                "breakEnd",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleNoLunch(schedule.day)}
                            className="ml-2 text-xs px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                          >
                            Sin almuerzo
                          </button>
                        </div>
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
            Se recomienda imagen rectangular de al menos 800x220px (proporción 4:1). En la app se muestra como banner de ancho completo. Máximo 5MB.
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

                {/* Fila: Chips de Especialidades + Experiencia */}
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Renderizamos cada especialidad como un Chip */}
                  {(isEditing
                    ? formData.specialty
                    : Array.isArray(doctor.specialty)
                      ? doctor.specialty
                      : [doctor.specialty]
                  )
                    .flat()
                    .map((spec: string, i: number) =>
                      spec ? (
                        <span
                          key={i}
                          className="text-white px-3 py-1 rounded-md text-xs font-bold"
                          style={{ backgroundColor: appThemeColor }}
                        >
                          {spec}
                        </span>
                      ) : null,
                    )}

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
                    <span className="text-xs text-gray-600">
                      Tarifa de consulta
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      $
                      {isEditing
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
