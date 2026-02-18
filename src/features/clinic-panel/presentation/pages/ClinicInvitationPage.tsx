import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, Button, Paper, CircularProgress, Alert } from "@mui/material";
import { CheckCircle, Cancel, LocalHospital } from "@mui/icons-material";
import { validateInvitationTokenAPI, rejectInvitationAPI } from "../../infrastructure/clinic-doctors.api";
import { useAuthStore } from "../../../../app/store/auth.store";

export const ClinicInvitationPage = () => {
  const { token: tokenFromPath } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { user, isAuthenticated } = authStore;
  
  // ⭐ Obtener token de path parameter o query parameter
  const token = tokenFromPath || searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<{
    clinic: { id: string; name: string };
    email: string;
    expiresAt: string;
    isValid: boolean;
  } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected">("pending");

  useEffect(() => {
    const loadInvitation = async () => {
      if (!token) {
        setError("Token de invitación no válido");
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Validando token de invitación:', token);
        const data = await validateInvitationTokenAPI(token);
        console.log('✅ Datos de invitación recibidos:', data);
        setInvitation(data);
        
        if (!data.isValid) {
          setError("Esta invitación ha expirado o ya no es válida");
        }
      } catch (err: any) {
        console.error('❌ Error al validar invitación:', err);
        setError(err.message || "Error al cargar la invitación");
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [token]);

  const handleAccept = async () => {
    if (!token || !invitation) return;

    setProcessing(true);
    try {
      // Si el usuario ya está logueado y es doctor, verificar si puede aceptar directamente
      if (isAuthenticated && user) {
        // Verificar si el email del usuario coincide con el email de la invitación
        if (user.email === invitation.email && user.role === 'profesional' && user.tipo === 'doctor') {
          // El usuario ya está registrado como doctor, redirigir al dashboard
          // El backend debería asociarlo automáticamente cuando acceda al dashboard
          navigate('/doctor/dashboard');
          return;
        } else if (user.email === invitation.email) {
          // Email coincide pero no es doctor, mostrar error
          setError("Este email ya está registrado con otro tipo de cuenta. Por favor, inicia sesión con otra cuenta o contacta al administrador.");
          setProcessing(false);
          return;
        }
      }

      // Si no está logueado o el email no coincide, redirigir al registro
      // El registro manejará la asociación automáticamente cuando se complete
      navigate(`/register?invitation=${token}&type=doctor`);
    } catch (err: any) {
      setError(err.message || "Error al aceptar la invitación");
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!token) return;

    setProcessing(true);
    try {
      await rejectInvitationAPI(token);
      setStatus("rejected");
    } catch (err: any) {
      setError(err.message || "Error al rechazar la invitación");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !invitation || !invitation.isValid) {
    return (
      <Box sx={{ maxWidth: 600, margin: "0 auto", mt: 8, p: 3 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Cancel sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Invitación No Válida
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || "Esta invitación ha expirado o ya no es válida"}
          </Alert>
        </Paper>
      </Box>
    );
  }

  if (status === "rejected") {
    return (
      <Box sx={{ maxWidth: 600, margin: "0 auto", mt: 8, p: 3 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Cancel sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Invitación Rechazada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Has rechazado la invitación de <strong>{invitation.clinic.name}</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Gracias por tu tiempo.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", mt: 8, p: 3 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <LocalHospital sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
          
          <Typography variant="h4" gutterBottom fontWeight={700}>
            ¡Únete a {invitation.clinic.name}!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, mt: 2 }}>
            Has sido invitado a formar parte de nuestra clínica en MediConnect.
            Al aceptar, podrás gestionar tus citas, pacientes y horarios desde nuestra plataforma.
          </Typography>

          <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2, mb: 4, textAlign: "left" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Clínica:</strong> {invitation.clinic.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Email:</strong> {invitation.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Válido hasta:</strong> {new Date(invitation.expiresAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              color="error"
              size="large"
              startIcon={<Cancel />}
              onClick={handleReject}
              disabled={processing}
              sx={{ minWidth: 150 }}
            >
              Rechazar
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<CheckCircle />}
              onClick={handleAccept}
              disabled={processing}
              sx={{ minWidth: 150 }}
            >
              {processing ? "Procesando..." : "Aceptar Invitación"}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: "block" }}>
            {isAuthenticated && user?.email === invitation.email
              ? "Al aceptar, serás asociado a esta clínica y tendrás acceso al panel de médico asociado."
              : "Al aceptar, serás redirigido al registro para completar tu perfil. Una vez registrado, estarás asociado a esta clínica automáticamente."}
          </Typography>
        </Paper>
      </Box>
  );
};
