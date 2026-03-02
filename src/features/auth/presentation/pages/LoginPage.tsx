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
import { useFormik } from "formik";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ROUTES } from "../../../../app/config/constants";
import { env } from "../../../../app/config/env";
import { useAuthStore } from "../../../../app/store/auth.store";
import { loginAPI } from "../../infrastructure/auth.api";
import { logger } from "../../../../shared/lib/logger";

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
  const login = useAuthStore((state) => state.login);

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
        // 1. Llamada a la API
        const response = await loginAPI({
          email: values.email,
          password: values.password,
        });

        // 2. Extracción de datos
        const { user, token } = response;

        // Logs de debug solo en desarrollo (no mostrar datos sensibles en producción)
        logger.debug("🔍 [LOGIN] Login exitoso");
        logger.debug("🔍 [LOGIN] Role:", user.role);

        // 3. Normalización para el Store y Redirección
        const roleForStore = user.role.toLowerCase();
        // Prioridad: tipo (backend) > serviceType (backend)
        const tipoForStore = (
          user.tipo ||
          user.serviceType ||
          ""
        ).toLowerCase();

        logger.log("✅ Login Exitoso:", {
          role: roleForStore,
          tipo: tipoForStore,
        });

        // 4. Guardar en Zustand (Persistencia automática)
        const preferredName =
          (user as any)?.provider?.commercialName ||
          user.name ||
          user.email.split("@")[0];
        const providerId = (user as any)?.provider?.id || null;

        login(
          {
            id: user.userId,
            email: user.email,
            name: preferredName,
            role: roleForStore,
            tipo: tipoForStore || null,
            providerId,
          },
          token,
        );

        // 5. Lógica de Redirección (Router Guards)
        if (roleForStore === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (
          roleForStore === "provider" ||
          roleForStore === "profesional"
        ) {
          switch (tipoForStore) {
            case "doctor":
              navigate("/doctor/dashboard", { replace: true });
              break;
            case "pharmacy":
              navigate("/provider/pharmacy/dashboard", { replace: true });
              break;
            case "laboratory":
            case "lab":
              navigate("/laboratory/dashboard", { replace: true });
              break;
            case "ambulance":
              navigate("/provider/ambulance/dashboard", { replace: true });
              break;
            case "supplies":
              navigate("/supply/dashboard", { replace: true });
              break;
            case "clinic":
              navigate("/clinic/dashboard", { replace: true });
              break;
            default:
              console.warn(`⚠️ Tipo de proveedor desconocido: ${tipoForStore}`);
              navigate(ROUTES.HOME);
          }
        } else if (roleForStore === "patient") {
          navigate(ROUTES.HOME, { replace: true });
        } else {
          navigate(ROUTES.HOME, { replace: true });
        }
      } catch (error: any) {
        logger.error("❌ Error al iniciar sesión:", error);

        let errorMessage =
          "Error al iniciar sesión. Verifica tus credenciales.";

        if (error?.code === "ERR_NETWORK") {
          errorMessage = `No se pudo conectar al servidor (${env.API_URL})`;
        } else if (error?.response?.status === 401) {
          errorMessage = "Credenciales incorrectas.";
        } else if (error?.message) {
          errorMessage = error.message;
        }

        formik.setFieldError("password", errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 2 },
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
          opacity: { xs: 0.2, sm: 0.3 },
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: { xs: "30px 30px", sm: "40px 40px" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: { xs: "300px", sm: "500px" },
          height: { xs: "300px", sm: "500px" },
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
          width: { xs: "250px", sm: "400px" },
          height: { xs: "250px", sm: "400px" },
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
          maxWidth: { xs: "100%", sm: "500px" },
        }}
      >
        {/* Back Button */}
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => navigate(ROUTES.HOME)}
          sx={{ 
            mb: { xs: 2, sm: 3 }, 
            color: "#14b8a6", 
            fontWeight: 500,
            fontSize: { xs: "0.875rem", sm: "1rem" },
            px: { xs: 1, sm: 2 },
          }}
        >
          Volver al inicio
        </Button>

        <Card
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            p: { xs: 1.5, sm: 2 },
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardContent sx={{ textAlign: "center", p: { xs: 2, sm: 4 } }}>
            {/* Logo */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 3 } }}>
              <Box
                component="img"
                src="/docalink-logo.png?v=3"
                alt="DOCALINK"
                sx={{
                  width: { xs: 80, sm: 120 },
                  height: { xs: 80, sm: 120 },
                  objectFit: 'contain',
                }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{ 
                fontWeight: 700, 
                mb: 1, 
                color: "#1f2937",
                fontSize: { xs: "1.5rem", sm: "2.125rem" },
              }}
            >
              Iniciar Sesión
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#6b7280", 
                mb: { xs: 3, sm: 4 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Accede a tu panel de gestión de servicios
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mb: { xs: 2, sm: 3 } }}>
              {/* Campo Email */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  size="small"
                  // ✅ FIX: Reemplazo de InputProps por slotProps
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#9ca3af", fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              {/* Campo Contraseña */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#9ca3af", fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: { xs: 2, sm: 3 } }}>
                <Link
                  component={RouterLink}
                  to={ROUTES.FORGOT_PASSWORD}
                  sx={{ 
                    color: "#14b8a6", 
                    textDecoration: "none",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
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
                  py: { xs: 1.25, sm: 1.5 },
                  backgroundColor: "#14b8a6",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  "&:hover": { backgroundColor: "#0d9488" },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </Box>

            {/* Register Link */}
            <Box sx={{ textAlign: "center", mb: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#6b7280",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
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
                  }}
                >
                  Solicitar registro
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
