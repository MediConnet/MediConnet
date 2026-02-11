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

        console.log("🔍 [LOGIN] Respuesta completa del backend:", response);
        console.log("🔍 [LOGIN] User recibido:", user);
        console.log("🔍 [LOGIN] Token recibido:", token?.substring(0, 30) + "...");

        // 3. Normalización para el Store y Redirección
        const roleForStore = user.role.toLowerCase();
        // Prioridad: tipo (backend) > serviceType (backend)
        const tipoForStore = (
          user.tipo ||
          user.serviceType ||
          ""
        ).toLowerCase();

        console.log("✅ Login Exitoso:", {
          role: roleForStore,
          tipo: tipoForStore,
          userId: user.userId,
          email: user.email,
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
        console.error("❌ Error al iniciar sesión:", error);

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
        }}
      >
        {/* Back Button */}
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => navigate(ROUTES.HOME)}
          sx={{ mb: 3, color: "#14b8a6", fontWeight: 500 }}
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
                  sx={{ color: "white", fontWeight: 700, fontSize: "2rem" }}
                >
                  M
                </Typography>
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 1, color: "#1f2937" }}
            >
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 4 }}>
              Accede a tu panel de gestión de servicios
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mb: 3 }}>
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
                  // ✅ FIX: Reemplazo de InputProps por slotProps
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
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Link
                  component={RouterLink}
                  to={ROUTES.FORGOT_PASSWORD}
                  sx={{ color: "#14b8a6", textDecoration: "none" }}
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
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
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
