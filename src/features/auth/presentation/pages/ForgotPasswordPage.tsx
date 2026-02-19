import {
  ArrowBack,
  CheckCircleOutline,
  Email as EmailIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
import { useSendResetPassword } from "../hooks/useSendResetPassword";

// Esquema de validación
const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es requerido"),
});

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // Hook de Clean Architecture (TanStack Query)
  const sendResetPassword = useSendResetPassword();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values) => {
      try {
        await sendResetPassword.mutateAsync({ email: values.email });
        setSuccess(true);
      } catch (err: any) {
        console.error("Error sending reset link:", err);
        formik.setFieldError(
          "email",
          "Ocurrió un error. Verifica tu conexión o intenta más tarde.",
        );
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
      {/* --- EFECTOS DE FONDO --- */}
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
          maxWidth: "480px",
          animation: "scaleIn 0.5s ease-out",
          "@keyframes scaleIn": {
            from: { opacity: 0, transform: "scale(0.95)" },
            to: { opacity: 1, transform: "scale(1)" },
          },
        }}
      >
        {/* Botón Volver */}
        <Button
          component={RouterLink}
          to={ROUTES.LOGIN}
          startIcon={<ArrowBack />}
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
          Volver al inicio de sesión
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
          <CardContent sx={{ textAlign: "center", p: { xs: 3, sm: 4 } }}>
            {/* LOGO */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Box
                component="img"
                src="/docalink-logo.png"
                alt="DOCALINK"
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'contain',
                }}
              />
            </Box>

            {success ? (
              // --- VISTA DE ÉXITO ---
              <Box sx={{ animation: "fadeIn 0.5s ease-in" }}>
                <CheckCircleOutline
                  sx={{ fontSize: 60, color: "#14b8a6", mb: 2 }}
                />
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="#1f2937"
                  gutterBottom
                >
                  ¡Correo enviado!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Hemos enviado las instrucciones para restablecer tu contraseña
                  a <strong>{formik.values.email}</strong>.
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: "#14b8a6",
                    color: "#14b8a6",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#0d9488",
                      backgroundColor: "rgba(20, 184, 166, 0.05)",
                    },
                  }}
                >
                  Volver al Login
                </Button>
              </Box>
            ) : (
              // --- FORMULARIO DE RECUPERACIÓN ---
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#1f2937",
                    fontSize: "1.75rem",
                  }}
                >
                  Recuperar contraseña
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    mb: 4,
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                  }}
                >
                  Ingresa tu correo electrónico y te enviaremos un enlace para
                  recuperar tu cuenta.
                </Typography>

                <Box component="form" onSubmit={formik.handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Correo electrónico"
                      type="email"
                      placeholder="tu@email.com"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                      disabled={sendResetPassword.isPending}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon
                                sx={{ color: "#9ca3af", fontSize: 20 }}
                              />
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
                    disabled={sendResetPassword.isPending}
                    sx={{
                      py: 1.5,
                      backgroundColor: "#14b8a6",
                      color: "white",
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#0d9488",
                        boxShadow: "0 4px 12px rgba(13, 148, 136, 0.2)",
                      },
                      "&:disabled": {
                        backgroundColor: "#cbd5e1",
                      },
                    }}
                  >
                    {sendResetPassword.isPending ? (
                      <>
                        <CircularProgress
                          size={20}
                          sx={{ mr: 1, color: "white" }}
                        />
                        Enviando...
                      </>
                    ) : (
                      "Enviar enlace"
                    )}
                  </Button>
                </Box>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    ¿Ya tienes cuenta?{" "}
                    <Link
                      component={RouterLink}
                      to={ROUTES.LOGIN}
                      sx={{
                        color: "#14b8a6",
                        fontWeight: 600,
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Inicia sesión
                    </Link>
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
