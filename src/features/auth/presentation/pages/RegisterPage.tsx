import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Stack,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  LocalHospital,
  Medication,
  Science,
  LocalShipping,
  Inventory,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  CloudUpload,
  Close,
  Description,
} from "@mui/icons-material";
import { ROUTES } from "../../../../app/config/constants";
import { useRegisterProfessional } from "../hooks/useRegisterProfessional";
import { handleLetterInput, handleNumberInput, handlePhoneInput, handleEmailInput, handleBothInput, handleEcuadorPhoneInput } from "../../../../shared/lib/inputValidation";
import { getPharmacyChains } from "../../../../shared/lib/pharmacy-chains";
import type { PharmacyChain } from "../../../../admin-dashboard/domain/pharmacy-chain.entity";

type ServiceType = "doctor" | "pharmacy" | "lab" | "ambulance" | "supplies";

const serviceTypes: ServiceType[] = ["doctor", "pharmacy", "lab", "ambulance", "supplies"];

const serviceLabels: Record<ServiceType, string> = {
  doctor: "Médico",
  pharmacy: "Farmacia",
  lab: "Laboratorio",
  ambulance: "Ambulancia",
  supplies: "Insumos Médicos",
};

const serviceDescriptions: Record<ServiceType, string> = {
  doctor: "Consultas médicas, especialistas y atención personalizada",
  pharmacy: "Venta de medicamentos y productos de salud",
  lab: "Análisis clínicos y estudios de laboratorio",
  ambulance: "Servicios de emergencia y traslados médicos",
  supplies: "Equipos médicos, suministros y material sanitario",
};

const serviceIcons: Record<ServiceType, React.ReactNode> = {
  doctor: <LocalHospital sx={{ fontSize: 40 }} />,
  pharmacy: <Medication sx={{ fontSize: 40 }} />,
  lab: <Science sx={{ fontSize: 40 }} />,
  ambulance: <LocalShipping sx={{ fontSize: 40 }} />,
  supplies: <Inventory sx={{ fontSize: 40 }} />,
};

// Especialidades médicas disponibles
const medicalSpecialties = [
  "Medicina General",
  "Cardiología",
  "Dermatología",
  "Ginecología",
  "Pediatría",
  "Oftalmología",
  "Traumatología",
  "Neurología",
  "Psiquiatría",
  "Urología",
  "Endocrinología",
  "Gastroenterología",
  "Neumología",
  "Otorrinolaringología",
  "Oncología",
  "Reumatología",
  "Nefrología",
  "Cirugía General",
  "Anestesiología",
  "Odontología",
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { submit, loading } = useRegisterProfessional();

  const initialType = searchParams.get("tipo") as ServiceType | null;
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [selectedType, setSelectedType] = useState<ServiceType | null>(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [licenses, setLicenses] = useState<File[]>([]);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [professionalTitles, setProfessionalTitles] = useState<File[]>([]);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);
  const professionalTitleInputRef = useRef<HTMLInputElement>(null);
  const [pharmacyChains, setPharmacyChains] = useState<PharmacyChain[]>([]);
  
  useEffect(() => {
    if (selectedType === "pharmacy") {
      const chains = getPharmacyChains();
      setPharmacyChains(chains.filter((c) => c.isActive));
    }
  }, [selectedType]);

  // Esquema de validación para paso 1 (Información personal)
  const personalInfoSchema = Yup.object({
    nombreCompleto: Yup.string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .required("El nombre completo es requerido"),
    email: Yup.string()
      .email("Correo electrónico inválido")
      .required("El correo electrónico es requerido"),
    telefono: Yup.string()
      .matches(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos")
      .required("El teléfono es requerido"),
    whatsapp: Yup.string()
      .matches(/^\d{10}$/, "El WhatsApp debe tener exactamente 10 dígitos")
      .required("El WhatsApp es requerido"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(50, "La contraseña no puede tener más de 50 caracteres")
      .required("La contraseña es requerida"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
      .required("Debes confirmar tu contraseña"),
  });

  // Esquema de validación para paso 2 (Información del servicio)
  const getServiceInfoSchema = () => {
    const baseSchema: any = {
      descripcion: Yup.string()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .required("La descripción es requerida"),
      direccion: Yup.string()
        .min(5, "La dirección debe tener al menos 5 caracteres")
        .required("La dirección es requerida"),
      ciudad: Yup.string()
        .min(2, "La ciudad debe tener al menos 2 caracteres")
        .required("La ciudad es requerida"),
      tarifaConsulta: Yup.string(),
    };

    if (selectedType === "pharmacy") {
      baseSchema.chainId = Yup.string().required("Debes seleccionar una cadena de farmacias");
    } else {
      baseSchema.nombreServicio = Yup.string()
        .min(3, "El nombre del servicio debe tener al menos 3 caracteres")
        .required("El nombre del servicio es requerido");
    }

    if (selectedType === "doctor") {
      baseSchema.especialidad = Yup.string().required("La especialidad es requerida");
    }

    return Yup.object(baseSchema);
  };

  const formik = useFormik({
    initialValues: {
      // Personal Info
      nombreCompleto: "",
      email: "",
      telefono: "",
      whatsapp: "",
      password: "",
      confirmPassword: "",
      // Service Info
      nombreServicio: "",
      especialidad: "",
      descripcion: "",
      direccion: "",
      ciudad: "",
      tarifaConsulta: "",
      chainId: "", // Para farmacias
    },
    validationSchema: step === 1 ? personalInfoSchema : step === 2 ? getServiceInfoSchema() : undefined,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (step === 1) {
        setStep(2);
      } else if (step === 2) {
        setIsSubmitting(true);
        try {
          const professionalData = {
            type: selectedType!,
            name: values.nombreCompleto,
            email: values.email,
            phone: values.telefono,
            whatsapp: values.whatsapp,
            serviceName: selectedType === "pharmacy" 
              ? (pharmacyChains.find(c => c.id === values.chainId)?.name || values.nombreServicio)
              : values.nombreServicio,
            address: values.direccion,
            city: values.ciudad,
            price: values.tarifaConsulta,
            description: values.descripcion,
            chainId: selectedType === "pharmacy" ? values.chainId : undefined,
          };

          await submit(professionalData);
          setStep(3); // Step 3 - Success
        } catch (error) {
          console.error("Error al enviar solicitud:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
  });

  const handleTypeSelect = (type: ServiceType) => {
    setSelectedType(type);
    setStep(1);
  };

  return (
    <Box
      minHeight="100vh"
      sx={{
        background: "linear-gradient(180deg, #ffffff 0%, #ecfdf5 100%)",
        position: "relative",
        overflow: "hidden",
        py: 4,
        px: 2,
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "500px",
          height: "500px",
          background: "rgba(20, 184, 166, 0.05)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "400px",
          height: "400px",
          background: "rgba(20, 184, 166, 0.05)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            px: { xs: 2, md: 4 },
          }}
        >
          <Button
            variant="text"
            startIcon={<ArrowBack />}
            onClick={() => (step > 0 ? setStep(step - 1) : navigate(ROUTES.HOME))}
            sx={{
              color: "#14b8a6",
              fontWeight: 600,
              textTransform: "uppercase",
              "&:hover": {
                backgroundColor: "rgba(20, 184, 166, 0.1)",
              },
            }}
          >
            {step > 0 ? "Atrás" : "Volver al inicio"}
          </Button>

          {/* Progress Indicator */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {[0, 1, 2].map((s) => (
              <Box
                key={s}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: step >= s ? "#14b8a6" : "#d1fae5",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Step 0: Select Service Type */}
        {step === 0 && (
          <Box
            sx={{
              animation: "fadeIn 0.5s ease-in",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                ¿Qué tipo de servicio ofreces?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.125rem" },
                }}
              >
                Selecciona el tipo de servicio que deseas registrar en MEDICONES
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {serviceTypes.map((type, index) => (
                <Card
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    background: selectedType === type ? "#f0fdfa" : "#f8fffd",
                    border: selectedType === type ? "2px solid #14b8a6" : "2px solid transparent",
                    transition: "all 0.3s ease",
                    animation: `slideUp 0.5s ease ${index * 0.1}s both`,
                    "@keyframes slideUp": {
                      from: {
                        opacity: 0,
                        transform: "translateY(30px)",
                      },
                      to: {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                    },
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-8px)",
                      borderColor: "#14b8a6",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        backgroundColor: "rgba(20, 184, 166, 0.1)",
                        mx: "auto",
                        mb: 3,
                        color: "#14b8a6",
                      }}
                    >
                      {serviceIcons[type]}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {serviceLabels[type]}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                    >
                      {serviceDescriptions[type]}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Step 1: Personal Information */}
        {step === 1 && selectedType && (
          <Card
            sx={{
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              boxShadow: "0 20px 60px rgba(0,0,0,.08)",
              animation: "fadeIn 0.5s ease-in",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: "rgba(20, 184, 166, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#14b8a6",
                }}
              >
                {serviceIcons[selectedType]}
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Registro de {serviceLabels[selectedType]}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Información personal y de contacto
                </Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  mb: 3,
                }}
              >
                <TextField
                  label="Nombre completo *"
                  name="nombreCompleto"
                  value={formik.values.nombreCompleto}
                  onChange={(e) => {
                    handleLetterInput(e, (value) => {
                      formik.setFieldValue("nombreCompleto", value);
                    });
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nombreCompleto && Boolean(formik.errors.nombreCompleto)}
                  helperText={formik.touched.nombreCompleto ? formik.errors.nombreCompleto : "Solo letras y espacios"}
                  required
                  fullWidth
                />
                <TextField
                  label="Correo electrónico *"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={(e) => {
                    handleEmailInput(e, (value) => {
                      formik.setFieldValue("email", value);
                    });
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email ? formik.errors.email : "Formato: ejemplo@correo.com"}
                  required
                  fullWidth
                />
                <TextField
                  label="Teléfono *"
                  name="telefono"
                  value={formik.values.telefono}
                  onChange={(e) => {
                    handleEcuadorPhoneInput(e, (value) => {
                      formik.setFieldValue("telefono", value);
                    });
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                  helperText={formik.touched.telefono ? formik.errors.telefono : "Solo números, máximo 10 dígitos (Ecuador)"}
                  required
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                />
                <TextField
                  label="WhatsApp *"
                  name="whatsapp"
                  value={formik.values.whatsapp}
                  onChange={(e) => {
                    handleEcuadorPhoneInput(e, (value) => {
                      formik.setFieldValue("whatsapp", value);
                    });
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.whatsapp && Boolean(formik.errors.whatsapp)}
                  helperText={formik.touched.whatsapp ? formik.errors.whatsapp : "Solo números, máximo 10 dígitos (Ecuador)"}
                  required
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                />
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
                Contraseña
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <TextField
                  label="Contraseña *"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password ? formik.errors.password : "Mínimo 6 caracteres, máximo 50"}
                  required
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                />
                <TextField
                  label="Confirmar contraseña *"
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword ? formik.errors.confirmPassword : "Mínimo 6 caracteres, máximo 50"}
                  required
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 5,
                    py: 1.5,
                    backgroundColor: "#14b8a6",
                    "&:hover": {
                      backgroundColor: "#0d9488",
                    },
                  }}
                >
                  Continuar
                </Button>
              </Box>
            </Box>
          </Card>
        )}

        {/* Step 2: Service Details */}
        {step === 2 && selectedType && (
          <Card
            sx={{
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              boxShadow: "0 20px 60px rgba(0,0,0,.08)",
              animation: "fadeIn 0.5s ease-in",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Información del Servicio
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Detalles sobre tu {serviceLabels[selectedType].toLowerCase()}
              </Typography>
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  mb: 3,
                }}
              >
                {selectedType === "pharmacy" ? (
                  <FormControl fullWidth required>
                    <InputLabel>Cadena de Farmacias *</InputLabel>
                    <Select
                      name="chainId"
                      value={formik.values.chainId}
                      label="Cadena de Farmacias *"
                      onChange={(e) => {
                        formik.setFieldValue("chainId", e.target.value);
                        const selectedChain = pharmacyChains.find(c => c.id === e.target.value);
                        if (selectedChain) {
                          formik.setFieldValue("nombreServicio", selectedChain.name);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.chainId && Boolean((formik.errors as any).chainId)}
                    >
                      {pharmacyChains.map((chain) => (
                        <MenuItem key={chain.id} value={chain.id}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            {chain.logoUrl ? (
                              <Box
                                component="img"
                                src={chain.logoUrl}
                                alt={chain.name}
                                sx={{ width: 32, height: 32, objectFit: "contain" }}
                              />
                            ) : (
                              <Avatar sx={{ width: 24, height: 24 }}>
                                <Medication fontSize="small" />
                              </Avatar>
                            )}
                            <Typography>{chain.name}</Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                    {(formik.touched.chainId && (formik.errors as any).chainId) && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                        {(formik.errors as any).chainId}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.75 }}>
                      Si tu cadena no aparece, contacta al administrador
                    </Typography>
                  </FormControl>
                ) : (
                  <TextField
                    label="Nombre del servicio *"
                    name="nombreServicio"
                    placeholder={
                      selectedType === "doctor"
                        ? "Consultorio Dr. Pérez"
                        : "Nombre del establecimiento"
                    }
                    value={formik.values.nombreServicio}
                    onChange={(e) => {
                      handleBothInput(e, (value) => {
                        formik.setFieldValue("nombreServicio", value);
                      });
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nombreServicio && Boolean(formik.errors.nombreServicio)}
                    helperText={formik.touched.nombreServicio ? formik.errors.nombreServicio : "Letras, números y caracteres especiales"}
                    required
                    fullWidth
                  />
                )}
                {selectedType === "doctor" && (
                  <FormControl fullWidth required>
                    <InputLabel>Especialidad *</InputLabel>
                    <Select
                      name="especialidad"
                      value={formik.values.especialidad}
                      label="Especialidad *"
                      onChange={(e) => {
                        formik.setFieldValue("especialidad", e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.especialidad && Boolean(formik.errors.especialidad)}
                    >
                      {medicalSpecialties.map((specialty) => (
                        <MenuItem key={specialty} value={specialty}>
                          {specialty}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.especialidad && formik.errors.especialidad && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                        {formik.errors.especialidad}
                      </Typography>
                    )}
                  </FormControl>
                )}
                <TextField
                  label="Dirección *"
                  name="direccion"
                  placeholder="Calle Principal #123"
                  value={formik.values.direccion}
                  onChange={(e) => {
                    handleBothInput(e, (value) => {
                      formik.setFieldValue("direccion", value);
                    });
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                  helperText={formik.touched.direccion ? formik.errors.direccion : "Letras, números y caracteres especiales"}
                  required
                  fullWidth
                />
                <TextField
                  label="Ciudad *"
                  name="ciudad"
                  placeholder="Tu ciudad"
                  value={formik.values.ciudad}
                  onChange={(e) => {
                    handleLetterInput(e, (value) => {
                      formik.setFieldValue("ciudad", value);
                    });
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ciudad && Boolean(formik.errors.ciudad)}
                  helperText={formik.touched.ciudad ? formik.errors.ciudad : "Solo letras y espacios"}
                  required
                  fullWidth
                />
                {selectedType !== "pharmacy" && (
                  <TextField
                    label="Tarifa de consulta"
                    name="tarifaConsulta"
                    placeholder="$50.00"
                    value={formik.values.tarifaConsulta}
                    onChange={(e) => {
                      handleNumberInput(e, (value) => {
                        formik.setFieldValue("tarifaConsulta", value);
                      });
                    }}
                    onBlur={formik.handleBlur}
                    helperText="Solo números y punto decimal"
                    fullWidth
                  />
                )}
              </Box>

              <TextField
                label="Descripción del servicio *"
                name="descripcion"
                placeholder="Describe brevemente los servicios que ofreces..."
                value={formik.values.descripcion}
                onChange={(e) => {
                  handleBothInput(e, (value) => {
                    formik.setFieldValue("descripcion", value);
                  });
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                helperText={formik.touched.descripcion ? formik.errors.descripcion : "Letras, números y caracteres especiales"}
                required
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
              />

              {/* Documents Upload */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 3 }}>
                  Documentos de respaldo
                </Typography>

                {/* Licencias */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}>
                    Licencias
                  </Typography>
                  <input
                    type="file"
                    ref={licenseInputRef}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setLicenses((prev) => [...prev, ...files]);
                    }}
                  />
                  <Box
                    onClick={() => licenseInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = Array.from(e.dataTransfer.files);
                      setLicenses((prev) => [...prev, ...files]);
                    }}
                    sx={{
                      border: "2px dashed #d1fae5",
                      borderRadius: 3,
                      p: 3,
                      textAlign: "center",
                      backgroundColor: "#f8fffd",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#14b8a6",
                        backgroundColor: "#f0fdfa",
                      },
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 32, color: "#94a3b8", mb: 1 }} />
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Arrastra archivos aquí o haz clic para subir
                    </Typography>
                  </Box>
                  {licenses.length > 0 && (
                    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                      {licenses.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 1.5,
                            backgroundColor: "#f0fdfa",
                            borderRadius: 2,
                            border: "1px solid #d1fae5",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                            <Description sx={{ color: "#14b8a6", fontSize: 20 }} />
                            <Typography variant="body2" sx={{ flex: 1, textAlign: "left" }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              {(file.size / 1024).toFixed(2)} KB
                            </Typography>
                          </Box>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLicenses((prev) => prev.filter((_, i) => i !== index));
                            }}
                            sx={{
                              minWidth: "auto",
                              p: 0.5,
                              color: "#ef4444",
                              "&:hover": {
                                backgroundColor: "#fee2e2",
                              },
                            }}
                          >
                            <Close />
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Certificados */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}>
                    Certificados
                  </Typography>
                  <input
                    type="file"
                    ref={certificateInputRef}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setCertificates((prev) => [...prev, ...files]);
                    }}
                  />
                  <Box
                    onClick={() => certificateInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = Array.from(e.dataTransfer.files);
                      setCertificates((prev) => [...prev, ...files]);
                    }}
                    sx={{
                      border: "2px dashed #d1fae5",
                      borderRadius: 3,
                      p: 3,
                      textAlign: "center",
                      backgroundColor: "#f8fffd",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#14b8a6",
                        backgroundColor: "#f0fdfa",
                      },
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 32, color: "#94a3b8", mb: 1 }} />
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Arrastra archivos aquí o haz clic para subir
                    </Typography>
                  </Box>
                  {certificates.length > 0 && (
                    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                      {certificates.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 1.5,
                            backgroundColor: "#f0fdfa",
                            borderRadius: 2,
                            border: "1px solid #d1fae5",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                            <Description sx={{ color: "#14b8a6", fontSize: 20 }} />
                            <Typography variant="body2" sx={{ flex: 1, textAlign: "left" }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              {(file.size / 1024).toFixed(2)} KB
                            </Typography>
                          </Box>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCertificates((prev) => prev.filter((_, i) => i !== index));
                            }}
                            sx={{
                              minWidth: "auto",
                              p: 0.5,
                              color: "#ef4444",
                              "&:hover": {
                                backgroundColor: "#fee2e2",
                              },
                            }}
                          >
                            <Close />
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Títulos Profesionales */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}>
                    Títulos Profesionales
                  </Typography>
                  <input
                    type="file"
                    ref={professionalTitleInputRef}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setProfessionalTitles((prev) => [...prev, ...files]);
                    }}
                  />
                  <Box
                    onClick={() => professionalTitleInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = Array.from(e.dataTransfer.files);
                      setProfessionalTitles((prev) => [...prev, ...files]);
                    }}
                    sx={{
                      border: "2px dashed #d1fae5",
                      borderRadius: 3,
                      p: 3,
                      textAlign: "center",
                      backgroundColor: "#f8fffd",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#14b8a6",
                        backgroundColor: "#f0fdfa",
                      },
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 32, color: "#94a3b8", mb: 1 }} />
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Arrastra archivos aquí o haz clic para subir
                    </Typography>
                  </Box>
                  {professionalTitles.length > 0 && (
                    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                      {professionalTitles.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 1.5,
                            backgroundColor: "#f0fdfa",
                            borderRadius: 2,
                            border: "1px solid #d1fae5",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                            <Description sx={{ color: "#14b8a6", fontSize: 20 }} />
                            <Typography variant="body2" sx={{ flex: 1, textAlign: "left" }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              {(file.size / 1024).toFixed(2)} KB
                            </Typography>
                          </Box>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfessionalTitles((prev) => prev.filter((_, i) => i !== index));
                            }}
                            sx={{
                              minWidth: "auto",
                              p: 0.5,
                              color: "#ef4444",
                              "&:hover": {
                                backgroundColor: "#fee2e2",
                              },
                            }}
                          >
                            <Close />
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>


              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => setStep(1)}
                  sx={{
                    borderColor: "#14b8a6",
                    color: "#14b8a6",
                    "&:hover": {
                      borderColor: "#0d9488",
                      backgroundColor: "rgba(20, 184, 166, 0.1)",
                    },
                  }}
                >
                  Atrás
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || loading}
                  sx={{
                    px: 5,
                    backgroundColor: "#14b8a6",
                    "&:hover": {
                      backgroundColor: "#0d9488",
                    },
                  }}
                >
                  {isSubmitting || loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                      Enviando...
                    </>
                  ) : (
                    "Enviar solicitud"
                  )}
                </Button>
              </Box>
            </Box>
          </Card>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <Box
            sx={{
              textAlign: "center",
              animation: "scaleIn 0.5s ease-in",
              "@keyframes scaleIn": {
                from: {
                  opacity: 0,
                  transform: "scale(0.9)",
                },
                to: {
                  opacity: 1,
                  transform: "scale(1)",
                },
              },
            }}
          >
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 4,
              }}
            >
              <CheckCircle sx={{ fontSize: 48, color: "#22c55e" }} />
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              ¡Solicitud Enviada!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 4,
                maxWidth: "500px",
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.125rem" },
              }}
            >
              Tu solicitud será revisada por el administrador. Recibirás una notificación por correo cuando sea aprobada.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(ROUTES.HOME)}
              sx={{
                px: 5,
                py: 1.5,
                backgroundColor: "#14b8a6",
                "&:hover": {
                  backgroundColor: "#0d9488",
                },
              }}
            >
              Volver al inicio
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
