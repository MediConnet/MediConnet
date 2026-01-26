import {
  ArrowBack,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ROUTES } from "../../../../app/config/constants";
import { useAuthStore } from "../../../../app/store/auth.store";
import { loginAPI } from "../../infrastructure/auth.api";

// Mock users para cuentas de prueba
const mockUsers = [
  {
    id: "1",
    email: "admin@medicones.com",
    password: "admin123",
    nombre: "Administrador",
    role: "admin" as const,
    tipo: null as string | null,
  },
  {
    id: "2",
    email: "doctor@medicones.com",
    password: "doctor123",
    nombre: "Dr. Juan Pérez",
    role: "profesional" as const,
    tipo: "doctor" as string,
  },
  {
    id: "3",
    email: "farmacia@medicones.com",
    password: "farmacia123",
    nombre: "Farmacia Central",
    role: "profesional" as const,
    tipo: "pharmacy" as string,
  },
  {
    id: "4",
    email: "lab@medicones.com",
    password: "lab123",
    nombre: "Laboratorio Clínico",
    role: "profesional" as const,
    tipo: "lab" as string,
  },
  {
    id: "5",
    email: "ambulancia@medicones.com",
    password: "ambulancia123",
    nombre: "Servicio de Ambulancias",
    role: "profesional" as const,
    tipo: "ambulance" as string,
  },
  {
    id: "6",
    email: "insumos@medicones.com",
    password: "insumos123",
    nombre: "Insumos Médicos",
    role: "profesional" as const,
    tipo: "supplies" as string,
  },
];

const serviceLabels: Record<string, string> = {
  doctor: "Médico",
  pharmacy: "Farmacia",
  lab: "Laboratorio",
  ambulance: "Ambulancia",
  supplies: "Insumos Médicos",
};

// NOTE: authenticateUser y mockUsers ya no se usan porque ahora usamos la API real del backend

// Esquema de validación
const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Llamar a la API real de login
        const response = await loginAPI({
          email: values.email,
          password: values.password,
        });

        // Leer datos del usuario desde response.user
        const user = response.user;
        // Priorizar accessToken (recomendado por el backend), luego token
        const token = response.accessToken || response.token || '';

        // DEBUG: Verificar datos recibidos del backend
        console.log('📥 Respuesta completa del login:', response);
        console.log('👤 Usuario recibido:', user);
        console.log('🔑 Token recibido del backend:', token ? 'SÍ' : 'NO');
        if (token) {
          console.log('🔑 Token (primeros 20 chars):', token.substring(0, 20) + '...');
        }
        console.log('📋 Role recibido:', user.role);
        console.log('📋 ServiceType recibido:', user.serviceType);
        console.log('📋 Tipo recibido:', user.tipo);

        // Determinar el role para el store (normalizar a minúsculas)
        const roleForStore = user.role?.toLowerCase() || "patient";
        console.log('🔀 Role normalizado para store:', roleForStore);

        // ⚠️ CRÍTICO: Priorizar 'tipo' del backend (para guards), luego 'serviceType' (para redirección)
        // Ambos deben estar normalizados a minúsculas
        const tipoFromBackend = user.tipo?.toLowerCase() || null;
        const serviceTypeNormalized = user.serviceType?.toLowerCase() || null;
        // Usar 'tipo' si viene del backend, sino usar 'serviceType' normalizado
        const tipoForStore = tipoFromBackend || serviceTypeNormalized;
        
        console.log('🔀 Tipo para store (priorizado):', tipoForStore);
        
        // Guardar usuario y TOKEN REAL del backend
        authStore.login(
          {
            id: user.userId,
            email: user.email,
            name: user.name,
            role: roleForStore,
            tipo: tipoForStore, // ⚠️ CRÍTICO: Priorizar 'tipo' del backend, luego 'serviceType'
          },
          token // <-- TOKEN REAL del backend (prioriza accessToken)
        );

        // DEBUG: Verificar que el token se guardó correctamente
        console.log('🔑 Token guardado en store:', authStore.getState().token ? 'SÍ' : 'NO');
        console.log('🔑 Token guardado en localStorage (accessToken):', localStorage.getItem('accessToken') ? 'SÍ' : 'NO');
        console.log('🔑 Token guardado en localStorage (auth-token):', localStorage.getItem('auth-token') ? 'SÍ' : 'NO');

        // Lógica de Redirección según especificación del backend
        console.log('🚀 Iniciando lógica de redirección...');
        console.log('🔀 roleForStore:', roleForStore);
        console.log('🔀 serviceType:', user.serviceType);
        
        if (roleForStore === "admin") {
          console.log('✅ Redirigiendo a admin dashboard');
          navigate("/admin/dashboard", { replace: true });
        } else if (roleForStore === "provider") {
          // Usar 'tipo' o 'serviceType' para redirección (ambos tienen el mismo valor)
          const serviceType = tipoForStore || serviceTypeNormalized;
          console.log('✅ Redirigiendo provider con serviceType/tipo:', serviceType);
          
          switch (serviceType) {
            case "doctor":
              console.log('✅ Redirigiendo a /doctor/dashboard');
              navigate("/doctor/dashboard", { replace: true });
              break;

            case "pharmacy":
              console.log('✅ Redirigiendo a /provider/pharmacy/dashboard');
              navigate("/provider/pharmacy/dashboard", { replace: true });
              break;

            // CASO LABORATORIO (Ruta raíz)
            case "laboratory":
            case "lab":
              console.log('✅ Redirigiendo a /laboratory/dashboard');
              // Usar replace: true para evitar que el usuario pueda volver atrás al login
              navigate("/laboratory/dashboard?tab=profile", { replace: true });
              break;

            // CASO AMBULANCIA (Ruta provider)
            case "ambulance":
              console.log('✅ Redirigiendo a /provider/ambulance/dashboard');
              navigate("/provider/ambulance/dashboard", { replace: true });
              break;

            // CASO INSUMOS MÉDICOS
            case "supplies":
              console.log('✅ Redirigiendo a /supply/dashboard');
              navigate("/supply/dashboard?tab=profile", { replace: true });
              break;

            default:
              console.warn('⚠️ serviceType no reconocido:', serviceType);
              console.warn('⚠️ Redirigiendo a HOME porque serviceType no coincide');
              console.warn('⚠️ Valores recibidos - role:', roleForStore, 'serviceType:', serviceType);
              navigate(ROUTES.HOME);
          }
        } else if (roleForStore === "patient") {
          console.log('✅ Redirigiendo a /patients/dashboard');
          navigate("/patients/dashboard", { replace: true });
        } else {
          console.warn('⚠️ role no reconocido:', roleForStore);
          console.warn('⚠️ Redirigiendo a HOME porque role no coincide');
          console.warn('⚠️ Valores recibidos - role:', roleForStore, 'serviceType:', user.serviceType);
          navigate(ROUTES.HOME);
        }
      } catch (error: any) {
        console.error("Error al iniciar sesión:", error);
        // Mostrar error del backend si está disponible
        const errorMessage =
          error?.message || "Error al iniciar sesión. Verifica tus credenciales.";
        formik.setFieldError("password", errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleQuickLogin = (email: string, password: string) => {
    formik.setValues({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "500px",
          height: "500px",
          background: "rgba(6, 182, 212, 0.05)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "400px",
          height: "400px",
          background: "rgba(6, 182, 212, 0.05)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "500px",
          animation: "scaleIn 0.5s ease-out",
          "@keyframes scaleIn": {
            from: {
              opacity: 0,
              transform: "scale(0.95)",
            },
            to: {
              opacity: 1,
              transform: "scale(1)",
            },
          },
        }}
      >
        {/* Back Button */}
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => navigate(ROUTES.HOME)}
          sx={{
            mb: 3,
            color: "#14b8a6",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(20, 184, 166, 0.1)",
            },
          }}
        >
          Volver al inicio
        </Button>

        <Card
          sx={{
            borderRadius: 3,
            p: 2,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            {/* Logo */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  backgroundColor: "#14b8a6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "2rem",
                  }}
                >
                  M
                </Typography>
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: "#1f2937",
                fontSize: "1.75rem",
              }}
            >
              Iniciar Sesión
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                mb: 4,
                fontSize: "0.9375rem",
              }}
            >
              Accede a tu panel de gestión de servicios
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mb: 3 }}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#9ca3af", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#9ca3af", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "#9ca3af" }}
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 20 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Link
                  component={RouterLink}
                  to={ROUTES.FORGOT_PASSWORD}
                  sx={{
                    color: "#14b8a6",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  backgroundColor: "#14b8a6",
                  color: "white",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#0d9488",
                  },
                  "&:disabled": {
                    backgroundColor: "#cbd5e1",
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{ mr: 1, color: "white" }}
                    />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </Box>

            {/* Register Link */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                }}
              >
                ¿No tienes cuenta?{" "}
                <Link
                  component={RouterLink}
                  to={ROUTES.REGISTER}
                  sx={{
                    color: "#14b8a6",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Solicitar registro
                </Link>
              </Typography>
            </Box>

            {/* Demo Accounts */}
            <Box
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 2,
                backgroundColor: "rgba(236, 253, 245, 0.5)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textAlign: "center",
                  mb: 2,
                  color: "#1f2937",
                  fontSize: "0.875rem",
                }}
              >
                Cuentas de prueba (clic para usar):
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {/* Admin */}
                <Button
                  type="button"
                  onClick={() =>
                    handleQuickLogin("admin@medicones.com", "admin123")
                  }
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: "transparent",
                    color: "#1f2937",
                    textTransform: "none",
                    justifyContent: "flex-start",
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "rgba(6, 182, 212, 0.1)",
                    },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ fontWeight: 600, color: "#14b8a6", mr: 1 }}
                  >
                    Administrador:
                  </Typography>
                  <Typography component="span" sx={{ color: "#6b7280" }}>
                    admin@medicones.com
                  </Typography>
                </Button>

                {/* Service types */}
                {mockUsers
                  .filter((u) => u.role === "profesional")
                  .map((user) => (
                    <Button
                      key={user.id}
                      type="button"
                      onClick={() =>
                        handleQuickLogin(user.email, user.password)
                      }
                      sx={{
                        width: "100%",
                        textAlign: "left",
                        p: 1.5,
                        borderRadius: 1.5,
                        backgroundColor: "transparent",
                        color: "#1f2937",
                        textTransform: "none",
                        justifyContent: "flex-start",
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: "rgba(6, 182, 212, 0.1)",
                        },
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{ fontWeight: 600, color: "#14b8a6", mr: 1 }}
                      >
                        {user.tipo ? serviceLabels[user.tipo] : "Profesional"}:
                      </Typography>
                      <Typography component="span" sx={{ color: "#6b7280" }}>
                        {user.email}
                      </Typography>
                    </Button>
                  ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
