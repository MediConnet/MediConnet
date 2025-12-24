// NOTE: Página de login con Material UI
// TODO: Integrar con backend cuando esté listo
// TODO: Agregar validación de formulario más robusta

import {
  CalendarToday,
  Email as EmailIcon,
  Favorite,
  Google as GoogleIcon,
  LocalHospital,
  LocalShipping,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../app/store/auth.store";
import { MediConnectLogo } from "../components/MediConnectLogo";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Recuperamos el store mock
  const authStore = useAuthStore();

  // 2. Estados LOCALES para la UI
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Simulamos llamada (delay de 1 segundo)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email && password) {
        // Usamos el método login del mock
        authStore.login(
          {
            id: "1",
            email: email,
            name: "Usuario Prueba",
            role: "patient",
          },
          "mock-token"
        );

        navigate(from, { replace: true });
      } else {
        throw new Error("Faltan datos");
      }
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar autenticación con Google real
    console.log("Google login clicked");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)",
        position: "relative",
        overflow: "hidden",
        m: 0,
        p: 0,
      }}
    >
      {/* NOTE: Patrón de cuadrícula de fondo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.2,
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* NOTE: Iconos médicos flotantes animados */}
      <LocalHospital
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          fontSize: 80,
          color: "rgba(20, 184, 166, 0.12)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Favorite
        sx={{
          position: "absolute",
          top: "15%",
          right: "10%",
          fontSize: 60,
          color: "rgba(20, 184, 166, 0.12)",
          animation: "float 8s ease-in-out infinite",
          animationDelay: "1s",
        }}
      />
      <LocalShipping
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "8%",
          fontSize: 70,
          color: "rgba(20, 184, 166, 0.12)",
          animation: "float 7s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />
      <CalendarToday
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "12%",
          fontSize: 65,
          color: "rgba(20, 184, 166, 0.12)",
          animation: "float 9s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      />

      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
          position: "relative",
          zIndex: 1,
          mx: 2,
        }}
      >
        <CardContent sx={{ p: 4, "&:last-child": { pb: 4 } }}>
          {/* NOTE: Logo de MediConnect */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <MediConnectLogo />
          </Box>

          {/* NOTE: Título de bienvenida */}
          <Typography
            variant="h5"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600, mb: 0.5, color: "text.primary" }}
          >
            Bienvenido a
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 1,
              background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MediConnect
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Inicia sesión para continuar
          </Typography>

          {/* NOTE: Botón de Google */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              mb: 2,
              py: 1.25,
              borderColor: "grey.300",
              color: "text.primary",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": {
                borderColor: "grey.400",
                bgcolor: "grey.50",
              },
            }}
          >
            Continuar con Google
          </Button>

          {/* NOTE: Separador circular */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              my: 2,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "grey.300",
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* NOTE: Formulario de login */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              margin="normal"
              required
              error={!!error}
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "grey.500" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              error={!!error}
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "grey.500" }} />
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
              }}
            />

            {/* NOTE: Recordarme y Olvidé contraseña */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    Recordarme
                  </Typography>
                }
              />
              <Link
                href="/forgot-password"
                underline="hover"
                sx={{
                  fontSize: "0.875rem",
                  color: "primary.main",
                  fontWeight: 500,
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            {/* NOTE: Botón de login */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 1,
                mb: 3,
                py: 1.5,
                background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2,
                color: "white",
                boxShadow: "0 4px 12px rgba(20, 184, 166, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
                  boxShadow: "0 6px 16px rgba(20, 184, 166, 0.4)",
                },
                "&:disabled": {
                  background: "grey.300",
                },
              }}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </Box>

          {/* NOTE: Link de registro */}
          <Typography
            variant="body2"
            align="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            ¿No tienes cuenta?{" "}
            <Link
              component={RouterLink}
              to="/register"
              underline="always"
              sx={{
                color: "#14b8a6",
                fontWeight: 700,
                textDecorationColor: "#14b8a6",
              }}
            >
              Regístrate gratis
            </Link>
          </Typography>

          {/* NOTE: Botones de categorías */}
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
            {/* Botón Médicos */}
            <Button
              variant="contained"
              startIcon={<LocalHospital />}
              sx={{
                flex: 1,
                py: 1.25,
                background: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
                color: "white",
                textTransform: "none",
                borderRadius: 2,
                fontSize: "0.875rem",
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
                },
              }}
            >
              Médicos
            </Button>

            {/* Botón Citas */}
            <Button
              variant="outlined"
              startIcon={<CalendarToday />}
              sx={{
                flex: 1,
                py: 1.25,
                borderColor: "#14b8a6",
                color: "#14b8a6",
                textTransform: "none",
                borderRadius: 2,
                fontSize: "0.875rem",
                fontWeight: 600,
                bgcolor: "white",
                "&:hover": {
                  borderColor: "#0d9488",
                  bgcolor: "#f0fdfa",
                },
              }}
            >
              Citas
            </Button>

            {/* Botón Ambulancias */}
            <Button
              variant="contained"
              startIcon={<LocalShipping />}
              sx={{
                flex: 1,
                py: 1.25,
                background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
                color: "white",
                textTransform: "none",
                borderRadius: 2,
                fontSize: "0.875rem",
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                },
              }}
            >
              Ambulancias
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
