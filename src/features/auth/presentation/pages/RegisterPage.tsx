import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
} from "@mui/icons-material";
import { ROUTES } from "../../../../app/config/constants";
import { useRegisterProfessional } from "../hooks/useRegisterProfessional";

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

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { submit, loading } = useRegisterProfessional();

  const initialType = searchParams.get("tipo") as ServiceType | null;
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [selectedType, setSelectedType] = useState<ServiceType | null>(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
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
    // Social
    facebook: "",
    instagram: "",
  });

  const handleTypeSelect = (type: ServiceType) => {
    setSelectedType(type);
    setStep(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const professionalData = {
        type: selectedType!,
        name: formData.nombreCompleto,
        email: formData.email,
        phone: formData.telefono,
        whatsapp: formData.whatsapp,
        serviceName: formData.nombreServicio,
        address: formData.direccion,
        city: formData.ciudad,
        price: formData.tarifaConsulta,
        description: formData.descripcion,
      };

      await submit(professionalData);
      setStep(3); // Step 4 (índice 3) - Success
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
    } finally {
      setIsSubmitting(false);
    }
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

            <Box component="form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
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
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Correo electrónico *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Teléfono *"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="WhatsApp *"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  fullWidth
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Confirmar contraseña *"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  fullWidth
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

            <Box component="form" onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  mb: 3,
                }}
              >
                <TextField
                  label="Nombre del servicio *"
                  name="nombreServicio"
                  placeholder={
                    selectedType === "doctor"
                      ? "Consultorio Dr. Pérez"
                      : "Nombre del establecimiento"
                  }
                  value={formData.nombreServicio}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                {selectedType === "doctor" && (
                  <TextField
                    label="Especialidad *"
                    name="especialidad"
                    placeholder="Cardiología, Pediatría, etc."
                    value={formData.especialidad}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                )}
                <TextField
                  label="Dirección *"
                  name="direccion"
                  placeholder="Calle Principal #123"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Ciudad *"
                  name="ciudad"
                  placeholder="Tu ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Tarifa de consulta"
                  name="tarifaConsulta"
                  placeholder="$50.00"
                  value={formData.tarifaConsulta}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>

              <TextField
                label="Descripción del servicio *"
                name="descripcion"
                placeholder="Describe brevemente los servicios que ofreces..."
                value={formData.descripcion}
                onChange={handleChange}
                required
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
              />

              {/* Documents Upload */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Documentos de respaldo
                </Typography>
                <Box
                  sx={{
                    border: "2px dashed #d1fae5",
                    borderRadius: 3,
                    p: 4,
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
                  <CloudUpload sx={{ fontSize: 40, color: "#94a3b8", mb: 2 }} />
                  <Typography sx={{ mb: 1 }}>
                    Arrastra archivos aquí o haz clic para subir
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Licencias, certificados, títulos profesionales
                  </Typography>
                </Box>
              </Box>

              {/* Social Networks */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "text.secondary" }}>
                  Redes sociales (opcional)
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <TextField
                    label="Facebook"
                    name="facebook"
                    placeholder="facebook.com/tupagina"
                    value={formData.facebook}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Instagram"
                    name="instagram"
                    placeholder="@tucuenta"
                    value={formData.instagram}
                    onChange={handleChange}
                    fullWidth
                  />
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
