import {
  AddPhotoAlternate,
  AttachMoney,
  Close,
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
import {
  formatCoordinateForInput,
  parseCoordinate,
} from "../../../../shared/lib/parseCoordinate";
import type {
  DoctorDashboard,
  PaymentMethod,
  ProfileStatus,
  WorkSchedule,
} from "../../domain/DoctorDashboard.entity";
import type { Specialty } from "../../infrastructure/doctors.api";
import { useUpdateDoctorProfile } from "../hooks/useUpdateDoctorProfile";
import { useSpecialties } from "../../../auth/presentation/hooks/useSpecialties";
import { ImageCropperModal } from "../../../../shared/components/ImageCropperModal";

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
    const lat = parseCoordinate(data.latitude);
    if (lat === null || lat < -90 || lat > 90) {
      throw new Error("Latitud debe estar entre -90 y 90");
    }
  }
  
  if (data.longitude !== undefined && data.longitude !== "" && data.longitude !== null) {
    const lng = parseCoordinate(data.longitude);
    if (lng === null || lng < -180 || lng > 180) {
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
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [initialPreviewImages, setInitialPreviewImages] = useState<string[]>([]);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropperMode, setCropperMode] = useState<"avatar" | "gallery">("avatar");
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Usar hook de React Query para especialidades
  const { data: specialtiesList = [], isLoading: loadingSpecialties } = useSpecialties();

  // Estado para detectar si estamos usando horarios por defecto (BD vacía)
  const [isUsingDefaultSchedule, setIsUsingDefaultSchedule] = useState(false);

  const avatarFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
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
        latitude: formatCoordinateForInput(data.doctor.latitude, "lat") || "",
        longitude: formatCoordinateForInput(data.doctor.longitude, "lng") || "",
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

  // Cargar imagen de perfil y galería desde el backend
  useEffect(() => {
    if (data?.doctor) {
      const imgUrl = (data.doctor as any).profile_picture_url || null;
      if (imgUrl) setProfileImage(imgUrl);
      const imgs: string[] = (data.doctor as any).preview_images || [];
      setPreviewImages(imgs);
      setInitialPreviewImages(imgs);
      setCarouselIndex(0);
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

  const previewImagesModified = JSON.stringify(previewImages) !== JSON.stringify(initialPreviewImages);
  const isSaveDisabled = saving || (!isModified && !isUsingDefaultSchedule && !newImageBase64 && !previewImagesModified);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewImageBase64(null);
    setPreviewImages(initialPreviewImages);
    setCarouselIndex(0);
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
    let finalLatitude = formData.latitude ? parseCoordinate(formData.latitude) : null;
    let finalLongitude = formData.longitude ? parseCoordinate(formData.longitude) : null;
    
    if (formData.google_maps_url && (finalLatitude === null || finalLongitude === null)) {
      const extracted = extractCoordinatesFromGoogleMapsUrl(formData.google_maps_url);
      if (extracted.lat !== null && extracted.lng !== null) {
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
      ...(newImageBase64 ? { profile_picture_url: newImageBase64 } : {}),
      ...(previewImagesModified ? { preview_images: previewImages } : {}),
    };
    
    try {
      const updatedData = await updateProfile(payload);

      if (updatedData) {
        setIsEditing(false);
        setIsUsingDefaultSchedule(false);
        setInitialFormData(formData);
        setNewImageBase64(null);
        // Actualizar imagen de perfil con la URL de Cloudinary retornada
        const returnedImage = (updatedData.doctor as any)?.profile_picture_url;
        if (returnedImage) setProfileImage(returnedImage);
        // Actualizar galería con URLs de Cloudinary retornadas
        const returnedPreviews: string[] = (updatedData.doctor as any)?.preview_images || previewImages;
        setPreviewImages(returnedPreviews);
        setInitialPreviewImages(returnedPreviews);
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

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen debe ser menor a 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropperSrc(reader.result as string);
      setCropperMode("avatar");
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen debe ser menor a 10MB");
      return;
    }
    if (previewImages.length >= 10) {
      alert("Has alcanzado el límite de 10 imágenes de vista previa");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropperSrc(reader.result as string);
      setCropperMode("gallery");
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedBase64: string) => {
    if (cropperMode === "avatar") {
      setProfileImage(croppedBase64);
      setNewImageBase64(croppedBase64);
    } else {
      setPreviewImages((prev) => [...prev, croppedBase64]);
    }
    setCropperOpen(false);
    setCropperSrc(null);
  };

  const handleRemovePreviewImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setCarouselIndex((prev) =>
      prev >= previewImages.length - 1 ? Math.max(0, prev - 1) : prev
    );
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
                      if (coords.lat !== null && coords.lng !== null) {
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
                  type="text"
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
                  type="text"
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

      {/* --- COLUMNA DERECHA: Imágenes y Vista Previa --- */}
      <div className="lg:col-span-1 space-y-6">

        {/* 1. IMAGEN DE PERFIL */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Imagen de Perfil</h3>
          <p className="text-xs text-gray-500 mb-4">Foto principal que aparece en tu perfil</p>

          <div className="flex flex-col items-center gap-4">
            {/* Avatar circular */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md bg-gray-100 flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <PhotoCamera style={{ fontSize: 48, color: "#d1d5db" }} />
                )}
              </div>
              <div
                className="absolute bottom-1 right-1 bg-teal-500 rounded-full p-1.5 shadow-lg cursor-pointer hover:bg-teal-600 transition-colors"
                onClick={() => avatarFileRef.current?.click()}
              >
                <PhotoCamera style={{ fontSize: 16, color: "white" }} />
              </div>
            </div>

            {/* Recomendación de tamaño */}
            <div className="w-full bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700">📐 Tamaño recomendado</p>
              <p className="text-xs text-blue-600 mt-0.5">400 × 400 px — Proporción 1:1</p>
              <p className="text-xs text-gray-500 mt-1">
                Podrás ajustar el encuadre después de seleccionar
              </p>
            </div>

            <button
              type="button"
              onClick={() => avatarFileRef.current?.click()}
              className="w-full px-4 py-2 text-sm border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
            >
              <CloudUpload style={{ fontSize: 18 }} />
              {profileImage ? "Cambiar foto de perfil" : "Subir foto de perfil"}
            </button>

            {newImageBase64 && (
              <p className="text-xs text-teal-600 text-center font-medium">
                ✓ Nueva foto lista para guardar
              </p>
            )}
          </div>

          <input
            type="file"
            ref={avatarFileRef}
            onChange={handleAvatarFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* 2. GALERÍA DE VISTA PREVIA */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-gray-800">Imágenes de Vista Previa</h3>
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                previewImages.length >= 10
                  ? "bg-red-100 text-red-600"
                  : "bg-teal-50 text-teal-600"
              }`}
            >
              {previewImages.length}/10
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Galería deslizante que los pacientes ven en tu perfil
          </p>

          {/* Recomendación de tamaño */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-blue-700">📐 Tamaño recomendado</p>
            <p className="text-xs text-blue-600 mt-0.5">800 × 400 px — Proporción 2:1</p>
            <p className="text-xs text-gray-500 mt-1">
              Podrás ajustar el encuadre al subir cada imagen
            </p>
          </div>

          {/* Miniaturas */}
          {previewImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {previewImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden bg-gray-100"
                  style={{ aspectRatio: "2/1" }}
                >
                  <img
                    src={img}
                    alt={`Vista previa ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay con botón eliminar */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemovePreviewImage(idx)}
                      className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                    >
                      <Close style={{ fontSize: 14 }} />
                    </button>
                  </div>
                  {/* Número */}
                  <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center mb-4 flex flex-col items-center gap-2">
              <AddPhotoAlternate style={{ fontSize: 40, color: "#d1d5db" }} />
              <p className="text-sm text-gray-400">Sin imágenes de vista previa</p>
              <p className="text-xs text-gray-400">Agrega hasta 10 imágenes</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => galleryFileRef.current?.click()}
            disabled={previewImages.length >= 10}
            className={`w-full px-4 py-2 text-sm rounded-lg flex items-center justify-center gap-2 transition-colors ${
              previewImages.length >= 10
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "border border-teal-500 text-teal-600 hover:bg-teal-50"
            }`}
          >
            <CloudUpload style={{ fontSize: 18 }} />
            {previewImages.length >= 10
              ? "Límite alcanzado (10/10)"
              : "Agregar imagen de vista previa"}
          </button>

          <input
            type="file"
            ref={galleryFileRef}
            onChange={handleGalleryFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* 3. VISTA PREVIA EN APP */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Vista previa en App</h3>

          <div className="flex justify-center">
            {/* Card móvil */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden w-full max-w-[300px] flex flex-col border border-gray-100 pb-4">

              {/* Carrusel de imágenes de vista previa */}
              <div className="h-44 w-full bg-gray-200 relative overflow-hidden">
                {previewImages.length > 0 ? (
                  <>
                    <img
                      src={previewImages[carouselIndex]}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    {previewImages.length > 1 && (
                      <>
                        {/* Indicadores (dots) */}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                          {previewImages.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setCarouselIndex(i)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === carouselIndex ? "bg-white w-4" : "bg-white/60 w-1.5"
                              }`}
                            />
                          ))}
                        </div>
                        {/* Flecha anterior */}
                        <button
                          type="button"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/50 transition-colors z-10 font-bold text-lg leading-none"
                          onClick={() =>
                            setCarouselIndex(
                              (prev) => (prev - 1 + previewImages.length) % previewImages.length
                            )
                          }
                        >
                          ‹
                        </button>
                        {/* Flecha siguiente */}
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/50 transition-colors z-10 font-bold text-lg leading-none"
                          onClick={() =>
                            setCarouselIndex((prev) => (prev + 1) % previewImages.length)
                          }
                        >
                          ›
                        </button>
                      </>
                    )}
                  </>
                ) : profileImage ? (
                  <img
                    src={profileImage}
                    alt="Doctor Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                    <PhotoCamera style={{ fontSize: 40, opacity: 0.5 }} />
                    <p className="text-xs mt-2">Sin imágenes</p>
                  </div>
                )}
              </div>

              {/* Contenido del card */}
              <div className="p-4 flex flex-col items-start gap-1">
                {/* Nombre */}
                <h4 className="font-extrabold text-gray-900 text-lg leading-tight mb-1">
                  {isEditing ? formData.name || "Nombre del Doctor" : doctor.name}
                </h4>

                {/* Especialidades + Experiencia */}
                <div className="flex flex-wrap gap-2 items-center">
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
                  <div className="flex items-center gap-1 text-gray-500">
                    <WorkOutline sx={{ fontSize: 16 }} />
                    <span className="text-xs font-medium">
                      {isEditing ? formData.experience || 0 : doctor.experience || 0} años
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

                {/* Email */}
                <div className="mt-3 w-full space-y-2">
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
                      ${isEditing ? parseFloat(formData.price) || 0 : doctor.price || 0}
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
          </div>
          <p className="text-xs text-center text-gray-400 mt-4">
            Así verán tu perfil los pacientes en la app
          </p>
        </div>
      </div>

      {/* Modal de recorte de imagen */}
      <ImageCropperModal
        open={cropperOpen}
        onClose={() => {
          setCropperOpen(false);
          setCropperSrc(null);
        }}
        imageSrc={cropperSrc}
        aspectRatio={cropperMode === "avatar" ? 1 : 2}
        onCrop={handleCropComplete}
        title={
          cropperMode === "avatar"
            ? "Ajustar Foto de Perfil"
            : "Ajustar Imagen de Vista Previa"
        }
        recommendationText={
          cropperMode === "avatar"
            ? "Encuadra tu foto. Se mostrará como imagen cuadrada (1:1). Recomendado: 400×400px."
            : "Encuadra la imagen. Se mostrará en formato horizontal (2:1). Recomendado: 800×400px."
        }
      />
    </div>
  );
};
