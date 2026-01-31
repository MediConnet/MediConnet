import {
  ArrowBack,
  ArrowForward,
  AttachMoney as AttachMoneyIcon,
  Business as BusinessIcon,
  CheckCircle,
  Close,
  CloudUpload,
  Description,
  Email as EmailIcon,
  Inventory,
  LocalHospital,
  LocalShipping,
  LocationOn as LocationIcon,
  Lock as LockIcon,
  Map as MapIcon,
  Medication,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Science,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { ROUTES } from "../../../../app/config/constants";
import type { PharmacyChain } from "../../../../features/admin-dashboard/domain/pharmacy-chain.entity";
import {
  handleBothInput,
  handleEcuadorPhoneInput,
  handleEmailInput,
  handleLetterInput,
  handleNumberInput,
} from "../../../../shared/lib/inputValidation";
import { getPharmacyChains } from "../../../../shared/lib/pharmacy-chains";
import { useRegisterProfessional } from "../hooks/useRegisterProfessional";

// Tipos
type ServiceType =
  | "doctor"
  | "pharmacy"
  | "lab"
  | "ambulance"
  | "supplies"
  | "clinic";

const serviceTypes: ServiceType[] = [
  "doctor",
  "clinic",
  "pharmacy",
  "lab",
  "ambulance",
  "supplies",
];

const serviceLabels: Record<ServiceType, string> = {
  doctor: "Médico",
  clinic: "Clínica",
  pharmacy: "Farmacia",
  lab: "Laboratorio",
  ambulance: "Ambulancia",
  supplies: "Insumos Médicos",
};

const serviceDescriptions: Record<ServiceType, string> = {
  doctor: "Consultas médicas, especialistas y atención personalizada",
  clinic: "Administra médicos, agenda centralizada y recepción",
  pharmacy: "Venta de medicamentos y productos de salud",
  lab: "Análisis clínicos y estudios de laboratorio",
  ambulance: "Servicios de emergencia y traslados médicos",
  supplies: "Equipos médicos, suministros y material sanitario",
};

const serviceIcons: Record<ServiceType, React.ReactNode> = {
  doctor: <LocalHospital sx={{ fontSize: 40 }} />,
  clinic: <LocalHospital sx={{ fontSize: 40 }} />,
  pharmacy: <Medication sx={{ fontSize: 40 }} />,
  lab: <Science sx={{ fontSize: 40 }} />,
  ambulance: <LocalShipping sx={{ fontSize: 40 }} />,
  supplies: <Inventory sx={{ fontSize: 40 }} />,
};

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
  const [selectedType, setSelectedType] = useState<ServiceType | null>(
    initialType,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para archivos
  const [licenses, setLicenses] = useState<File[]>([]);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [professionalTitles, setProfessionalTitles] = useState<File[]>([]);

  // Refs para inputs de archivos
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);
  const professionalTitleInputRef = useRef<HTMLInputElement>(null);

  const [pharmacyChains, setPharmacyChains] = useState<PharmacyChain[]>([]);

  useEffect(() => {
    if (selectedType === "pharmacy") {
      const loadChains = async () => {
        try {
          const chains = await getPharmacyChains();
          setPharmacyChains(chains.filter((c) => c.isActive));
        } catch (error) {
          console.error('Error loading pharmacy chains:', error);
        }
      };
      loadChains();
    }
  }, [selectedType]);

  // Esquemas de Validación
  const personalInfoSchema = Yup.object({
    nombreCompleto: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .required("Requerido"),
    email: Yup.string().email("Email inválido").required("Requerido"),
    telefono: Yup.string()
      .matches(/^\d{10}$/, "Debe tener 10 dígitos")
      .required("Requerido"),
    whatsapp: Yup.string()
      .matches(/^\d{10}$/, "Debe tener 10 dígitos")
      .required("Requerido"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
      .required("Requerido"),
  });

  const getServiceInfoSchema = () => {
    const baseSchema: any = {
      descripcion: Yup.string()
        .min(10, "Mínimo 10 caracteres")
        .required("Requerido"),
      direccion: Yup.string()
        .min(5, "Mínimo 5 caracteres")
        .required("Requerido"),
      ciudad: Yup.string().min(2, "Mínimo 2 caracteres").required("Requerido"),
      tarifaConsulta: Yup.string(),
    };

    if (selectedType === "pharmacy") {
      baseSchema.chainId = Yup.string().required("Selecciona una cadena");
    } else {
      baseSchema.nombreServicio = Yup.string()
        .min(3, "Mínimo 3 caracteres")
        .required("Requerido");
    }

    if (selectedType === "doctor") {
      baseSchema.especialidad = Yup.string().required("Requerido");
    }

    return Yup.object(baseSchema);
  };

  const formik = useFormik({
    initialValues: {
      nombreCompleto: "",
      email: "",
      telefono: "",
      whatsapp: "",
      password: "",
      confirmPassword: "",
      nombreServicio: "",
      especialidad: "",
      descripcion: "",
      direccion: "",
      ciudad: "",
      tarifaConsulta: "",
      chainId: "",
    },
    validationSchema:
      step === 1
        ? personalInfoSchema
        : step === 2
          ? getServiceInfoSchema()
          : undefined,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (step === 1) {
        setStep(2);
      } else if (step === 2) {
        setIsSubmitting(true);
        try {
          // Construcción del Payload para el Backend
          const professionalData = {
            type: selectedType!,
            name: values.nombreCompleto,
            email: values.email,
            password: values.password,
            phone: values.telefono,
            whatsapp: values.whatsapp,
            serviceName:
              selectedType === "pharmacy"
                ? pharmacyChains.find((c) => c.id === values.chainId)?.name ||
                  values.nombreServicio
                : values.nombreServicio,
            address: values.direccion,
            city: values.ciudad,
            price: selectedType === "doctor" ? values.tarifaConsulta : "",
            description: values.descripcion,
            chainId: selectedType === "pharmacy" ? values.chainId : undefined,
            specialty:
              selectedType === "doctor" ? values.especialidad : undefined,
            files: {
              licenses: selectedType === "doctor" ? licenses : [],
              certificates: selectedType === "doctor" ? certificates : [],
              titles: selectedType === "doctor" ? professionalTitles : [],
            },
          };

          // Llamada al hook (que a su vez llama al backend)
          await submit(professionalData);
          setStep(3); // Éxito
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

  // Helper para renderizar lista de archivos
  const renderFileList = (
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
  ) => (
    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
      {files.map((file, index) => (
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Description sx={{ color: "#14b8a6", fontSize: 20 }} />
            <Typography variant="body2" noWrap sx={{ flex: 1 }}>
              {file.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", flexShrink: 0 }}
            >
              {(file.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setFiles((prev) => prev.filter((_, i) => i !== index));
            }}
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: "#ef4444",
              "&:hover": { backgroundColor: "#fee2e2" },
            }}
          >
            <Close fontSize="small" />
          </Button>
        </Box>
      ))}
    </Box>
  );

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
      {/* Background Decor */}
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
        sx={{ maxWidth: "1200px", mx: "auto", position: "relative", zIndex: 1 }}
      >
        {/* Header Navigation */}
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
            onClick={() =>
              step > 0 && step < 3 ? setStep(step - 1) : navigate(ROUTES.HOME)
            }
            sx={{ color: "#14b8a6", fontWeight: 600 }}
          >
            {step > 0 && step < 3 ? "Atrás" : "Volver al inicio"}
          </Button>
          {/* Steps Indicator */}
          {step < 3 && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {[0, 1, 2].map((s) => (
                <Box
                  key={s}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: step >= s ? "#14b8a6" : "#d1fae5",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* STEP 0: SELECT TYPE */}
        {step === 0 && (
          <Box sx={{ animation: "fadeIn 0.5s ease-in" }}>
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
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
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
                    border:
                      selectedType === type
                        ? "2px solid #14b8a6"
                        : "2px solid transparent",
                    transition: "all 0.3s ease",
                    animation: `slideUp 0.5s ease ${index * 0.1}s both`,
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                      borderColor: "#14b8a6",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        bgcolor: "rgba(20, 184, 166, 0.1)",
                        mx: "auto",
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#14b8a6",
                      }}
                    >
                      {serviceIcons[type]}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {serviceLabels[type]}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {serviceDescriptions[type]}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* STEP 1: PERSONAL INFO */}
        {step === 1 && selectedType && (
          <Card
            sx={{
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              boxShadow: "0 20px 60px rgba(0,0,0,.08)",
              animation: "fadeIn 0.5s ease-in",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "rgba(20, 184, 166, 0.1)",
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
                  fullWidth
                  required
                  label="Nombre completo"
                  name="nombreCompleto"
                  value={formik.values.nombreCompleto}
                  onChange={(e) =>
                    handleLetterInput(e, (val) =>
                      formik.setFieldValue("nombreCompleto", val),
                    )
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.nombreCompleto &&
                    Boolean(formik.errors.nombreCompleto)
                  }
                  helperText={
                    formik.touched.nombreCompleto &&
                    formik.errors.nombreCompleto
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={(e) =>
                    handleEmailInput(e, (val) =>
                      formik.setFieldValue("email", val),
                    )
                  }
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Teléfono"
                  name="telefono"
                  inputProps={{ maxLength: 10 }}
                  value={formik.values.telefono}
                  onChange={(e) =>
                    handleEcuadorPhoneInput(e, (val) =>
                      formik.setFieldValue("telefono", val),
                    )
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.telefono && Boolean(formik.errors.telefono)
                  }
                  helperText={formik.touched.telefono && formik.errors.telefono}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="WhatsApp"
                  name="whatsapp"
                  inputProps={{ maxLength: 10 }}
                  value={formik.values.whatsapp}
                  onChange={(e) =>
                    handleEcuadorPhoneInput(e, (val) =>
                      formik.setFieldValue("whatsapp", val),
                    )
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.whatsapp && Boolean(formik.errors.whatsapp)
                  }
                  helperText={formik.touched.whatsapp && formik.errors.whatsapp}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <WhatsAppIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 3 }}
              >
                Seguridad
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
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
                    bgcolor: "#14b8a6",
                    "&:hover": { bgcolor: "#0d9488" },
                  }}
                >
                  Continuar
                </Button>
              </Box>
            </Box>
          </Card>
        )}

        {/* STEP 2: SERVICE INFO */}
        {step === 2 && selectedType && (
          <Card
            sx={{
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              boxShadow: "0 20px 60px rgba(0,0,0,.08)",
              animation: "fadeIn 0.5s ease-in",
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
                    <InputLabel>Cadena de Farmacias</InputLabel>
                    <Select
                      name="chainId"
                      value={formik.values.chainId}
                      label="Cadena de Farmacias"
                      onChange={(e) => {
                        formik.setFieldValue("chainId", e.target.value);
                        const selectedChain = pharmacyChains.find(
                          (c) => c.id === e.target.value,
                        );
                        if (selectedChain)
                          formik.setFieldValue(
                            "nombreServicio",
                            selectedChain.name,
                          );
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.chainId &&
                        Boolean((formik.errors as any).chainId)
                      }
                    >
                      {pharmacyChains.map((chain) => (
                        <MenuItem key={chain.id} value={chain.id}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            {chain.logoUrl ? (
                              <Box
                                component="img"
                                src={chain.logoUrl}
                                alt={chain.name}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  objectFit: "contain",
                                }}
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
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    required
                    label="Nombre del servicio"
                    name="nombreServicio"
                    value={formik.values.nombreServicio}
                    onChange={(e) =>
                      handleBothInput(e, (val) =>
                        formik.setFieldValue("nombreServicio", val),
                      )
                    }
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.nombreServicio &&
                      Boolean(formik.errors.nombreServicio)
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon sx={{ color: "#9ca3af" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}

                {selectedType === "doctor" && (
                  <FormControl fullWidth required>
                    <InputLabel>Especialidad</InputLabel>
                    <Select
                      name="especialidad"
                      value={formik.values.especialidad}
                      label="Especialidad"
                      onChange={(e) =>
                        formik.setFieldValue("especialidad", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.especialidad &&
                        Boolean(formik.errors.especialidad)
                      }
                    >
                      {medicalSpecialties.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <TextField
                  fullWidth
                  required
                  label="Dirección"
                  name="direccion"
                  value={formik.values.direccion}
                  onChange={(e) =>
                    handleBothInput(e, (val) =>
                      formik.setFieldValue("direccion", val),
                    )
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.direccion && Boolean(formik.errors.direccion)
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Ciudad"
                  name="ciudad"
                  value={formik.values.ciudad}
                  onChange={(e) =>
                    handleLetterInput(e, (val) =>
                      formik.setFieldValue("ciudad", val),
                    )
                  }
                  onBlur={formik.handleBlur}
                  error={formik.touched.ciudad && Boolean(formik.errors.ciudad)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {selectedType === "doctor" && (
                  <TextField
                    fullWidth
                    label="Tarifa de consulta ($)"
                    name="tarifaConsulta"
                    value={formik.values.tarifaConsulta}
                    onChange={(e) =>
                      handleNumberInput(e, (val) =>
                        formik.setFieldValue("tarifaConsulta", val),
                      )
                    }
                    onBlur={formik.handleBlur}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon sx={{ color: "#9ca3af" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </Box>

              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Descripción"
                name="descripcion"
                value={formik.values.descripcion}
                onChange={(e) =>
                  handleBothInput(e, (val) =>
                    formik.setFieldValue("descripcion", val),
                  )
                }
                onBlur={formik.handleBlur}
                error={
                  formik.touched.descripcion &&
                  Boolean(formik.errors.descripcion)
                }
                sx={{ mb: 3 }}
              />

              {/* SECTION: ARCHIVOS (Solo Médicos) */}
              {selectedType === "doctor" && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 3 }}
                  >
                    Documentos de respaldo
                  </Typography>

                  {/* Licencias */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}
                    >
                      Licencias
                    </Typography>
                    <input
                      type="file"
                      ref={licenseInputRef}
                      multiple
                      accept=".pdf,.jpg,.png"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        setLicenses((p) => [
                          ...p,
                          ...Array.from(e.target.files || []),
                        ])
                      }
                    />
                    <Box
                      onClick={() => licenseInputRef.current?.click()}
                      sx={{
                        border: "2px dashed #d1fae5",
                        borderRadius: 3,
                        p: 3,
                        textAlign: "center",
                        bgcolor: "#f8fffd",
                        cursor: "pointer",
                        "&:hover": {
                          borderColor: "#14b8a6",
                          bgcolor: "#f0fdfa",
                        },
                      }}
                    >
                      <CloudUpload
                        sx={{ fontSize: 32, color: "#94a3b8", mb: 1 }}
                      />
                      <Typography variant="body2">
                        Click para subir licencias
                      </Typography>
                    </Box>
                    {licenses.length > 0 &&
                      renderFileList(licenses, setLicenses)}
                  </Box>

                  {/* Certificados */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}
                    >
                      Certificados
                    </Typography>
                    <input
                      type="file"
                      ref={certificateInputRef}
                      multiple
                      accept=".pdf,.jpg,.png"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        setCertificates((p) => [
                          ...p,
                          ...Array.from(e.target.files || []),
                        ])
                      }
                    />
                    <Box
                      onClick={() => certificateInputRef.current?.click()}
                      sx={{
                        border: "2px dashed #d1fae5",
                        borderRadius: 3,
                        p: 3,
                        textAlign: "center",
                        bgcolor: "#f8fffd",
                        cursor: "pointer",
                        "&:hover": {
                          borderColor: "#14b8a6",
                          bgcolor: "#f0fdfa",
                        },
                      }}
                    >
                      <CloudUpload
                        sx={{ fontSize: 32, color: "#94a3b8", mb: 1 }}
                      />
                      <Typography variant="body2">
                        Click para subir certificados
                      </Typography>
                    </Box>
                    {certificates.length > 0 &&
                      renderFileList(certificates, setCertificates)}
                  </Box>

                  {/* Títulos */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}
                    >
                      Títulos Profesionales
                    </Typography>
                    <input
                      type="file"
                      ref={professionalTitleInputRef}
                      multiple
                      accept=".pdf,.jpg,.png"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        setProfessionalTitles((p) => [
                          ...p,
                          ...Array.from(e.target.files || []),
                        ])
                      }
                    />
                    <Box
                      onClick={() => professionalTitleInputRef.current?.click()}
                      sx={{
                        border: "2px dashed #d1fae5",
                        borderRadius: 3,
                        p: 3,
                        textAlign: "center",
                        bgcolor: "#f8fffd",
                        cursor: "pointer",
                        "&:hover": {
                          borderColor: "#14b8a6",
                          bgcolor: "#f0fdfa",
                        },
                      }}
                    >
                      <CloudUpload
                        sx={{ fontSize: 32, color: "#94a3b8", mb: 1 }}
                      />
                      <Typography variant="body2">
                        Click para subir títulos
                      </Typography>
                    </Box>
                    {professionalTitles.length > 0 &&
                      renderFileList(professionalTitles, setProfessionalTitles)}
                  </Box>
                </Box>
              )}

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setStep(1)}
                  sx={{
                    borderColor: "#14b8a6",
                    color: "#14b8a6",
                    "&:hover": {
                      borderColor: "#0d9488",
                      bgcolor: "rgba(20, 184, 166, 0.1)",
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
                    bgcolor: "#14b8a6",
                    "&:hover": { bgcolor: "#0d9488" },
                  }}
                >
                  {isSubmitting || loading ? (
                    <>
                      <CircularProgress
                        size={20}
                        sx={{ mr: 1, color: "white" }}
                      />{" "}
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

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <Box sx={{ textAlign: "center", animation: "scaleIn 0.5s ease-in" }}>
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                bgcolor: "rgba(34, 197, 94, 0.1)",
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
              }}
            >
              Tu solicitud será revisada por el administrador. Recibirás una
              notificación por correo cuando sea aprobada.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(ROUTES.HOME)}
              sx={{
                px: 5,
                py: 1.5,
                bgcolor: "#14b8a6",
                "&:hover": { bgcolor: "#0d9488" },
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
