import {
  CalendarToday,
  Email as EmailIcon,
  Favorite,
  LocalHospital,
  LocalShipping,
  Lock as LockIcon,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../app/config/constants";
import { MediConnectLogo } from "../components/MediConnectLogo";

export const RegisterPage = () => {
  const navigate = useNavigate();

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }
    if (formData.password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    // Simulación de registro
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Mismo fondo degradado que Login
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

      {/* NOTE: Iconos flotantes (Copia exacta del Login) */}
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
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <CardContent sx={{ p: 4, "&:last-child": { pb: 4 } }}>
          {/* Logo */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <MediConnectLogo />
          </Box>

          {/* Título */}
          <Typography
            variant="h5"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600, mb: 0.5, color: "text.primary" }}
          >
            Únete a
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
            sx={{ mb: 4 }}
          >
            Crea tu cuenta en segundos
          </Typography>

          {/* Alerta de Error */}
          {formError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {formError}
            </Alert>
          )}

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "grey.500" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
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
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
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

            <TextField
              fullWidth
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "grey.500" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
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
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </Box>

          <Typography
            variant="body2"
            align="center"
            sx={{ color: "text.secondary" }}
          >
            ¿Ya tienes cuenta?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="always"
              sx={{
                color: "#14b8a6",
                fontWeight: 700,
                textDecorationColor: "#14b8a6",
              }}
            >
              Inicia sesión
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
