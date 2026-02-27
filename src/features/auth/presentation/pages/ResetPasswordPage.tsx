import {
  ArrowBack,
  CheckCircleOutline,
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
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { ROUTES } from "../../../../app/config/constants";
import { useResetPassword } from "../hooks/useResetPassword";

const resetPasswordValidationSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetPassword = useResetPassword();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values) => {
      if (!token) {
        formik.setFieldError("newPassword", "Token inválido o expirado");
        return;
      }

      try {
        await resetPassword.mutateAsync({
          token,
          newPassword: values.newPassword,
        });
        setSuccess(true);
      } catch (err: any) {
        console.error("Error resetting password:", err);
        const errorMessage =
          err?.response?.data?.message ||
          "Error al restablecer contraseña. El enlace puede haber expirado.";
        formik.setFieldError("newPassword", errorMessage);
      }
    },
  });

  // Si no hay token, mostrar error
  if (!token) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 1, sm: 2 },
          backgroundColor: "#f9fafb",
        }}
      >
        <Card sx={{ maxWidth: { xs: "100%", sm: 480 }, width: "100%", p: { xs: 2, sm: 3 } }}>
          <CardContent sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              color="error" 
              gutterBottom
              sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
              Enlace Inválido
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              El enlace de recuperación es inválido o ha expirado.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
              sx={{
                backgroundColor: "#14b8a6",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                py: { xs: 1, sm: 1.5 },
                "&:hover": { backgroundColor: "#0d9488" },
              }}
            >
              Solicitar Nuevo Enlace
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

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
          maxWidth: { xs: "100%", sm: "480px" },
        }}
      >
        {/* Back Button */}
        <Button
          onClick={() => navigate(ROUTES.LOGIN)}
          startIcon={<ArrowBack />}
          sx={{
            mb: { xs: 2, sm: 3 },
            color: "#14b8a6",
            fontWeight: 500,
            textTransform: "none",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            px: { xs: 1, sm: 2 },
            "&:hover": {
              backgroundColor: "rgba(20, 184, 166, 0.1)",
            },
          }}
        >
          Volver al inicio de sesión
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
                src="/docalink-logo.png?v=2"
                alt="DOCALINK"
                sx={{
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  objectFit: "contain",
                }}
              />
            </Box>

            {success ? (
              // Success View
              <Box>
                <CheckCircleOutline
                  sx={{ 
                    fontSize: { xs: 48, sm: 60 }, 
                    color: "#14b8a6", 
                    mb: { xs: 1.5, sm: 2 } 
                  }}
                />
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="#1f2937"
                  gutterBottom
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                >
                  ¡Contraseña Actualizada!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ 
                    mb: { xs: 3, sm: 4 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Tu contraseña ha sido actualizada correctamente. Ya puedes
                  iniciar sesión con tu nueva contraseña.
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  sx={{
                    py: { xs: 1.25, sm: 1.5 },
                    backgroundColor: "#14b8a6",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "&:hover": { backgroundColor: "#0d9488" },
                  }}
                >
                  Ir al Login
                </Button>
              </Box>
            ) : (
              // Reset Password Form
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#1f2937",
                    fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  }}
                >
                  Nueva Contraseña
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    mb: { xs: 3, sm: 4 },
                    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                    lineHeight: 1.6,
                  }}
                >
                  Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
                </Typography>

                <Box component="form" onSubmit={formik.handleSubmit}>
                  {/* New Password */}
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Nueva Contraseña"
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formik.values.newPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.newPassword &&
                        Boolean(formik.errors.newPassword)
                      }
                      helperText={
                        formik.touched.newPassword && formik.errors.newPassword
                      }
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
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  {/* Confirm Password */}
                  <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <TextField
                      fullWidth
                      label="Confirmar Contraseña"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
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
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                edge="end"
                                size="small"
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={resetPassword.isPending}
                    sx={{
                      py: { xs: 1.25, sm: 1.5 },
                      backgroundColor: "#14b8a6",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      "&:hover": { backgroundColor: "#0d9488" },
                    }}
                  >
                    {resetPassword.isPending ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      "Actualizar Contraseña"
                    )}
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
