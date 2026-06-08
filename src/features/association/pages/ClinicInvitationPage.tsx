import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, Button, Paper, CircularProgress, Alert } from "@mui/material";
import { CheckCircle, Cancel, LocalHospital } from "@mui/icons-material";
import {
  validateInvitationTokenAPI,
  rejectInvitationAPI,
  associateClinicInvitationAPI,
} from "../api/clinic-doctors.api";
import type { ValidatedClinicInvitation } from "../api/clinic-doctors.api";
import { useAuthStore } from "../../../app/store/auth.store";
import { getUserFriendlyMessage, logApiError } from "../../../shared/lib/api-error";
import { logger } from "../../../shared/lib/logger";
import { normalizeProviderType } from "../../../shared/lib/normalizeProviderType";
import { PENDING_CLINIC_INVITATION_KEY } from "../types/clinic-invitation.constants";
import { useFeedbackStore } from "../../../app/store/feedback.store";

function isDoctorAccount(role: string | undefined, tipo: string | null | undefined): boolean {
  const normalizedRole = role?.toLowerCase();
  return (
    (normalizedRole === "provider" || normalizedRole === "profesional") &&
    normalizeProviderType(tipo) === "doctor"
  );
}

function emailsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export const ClinicInvitationPage = () => {
  const { token: tokenFromPath } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const feedback = useFeedbackStore();
  const { user, isAuthenticated } = authStore;

  const token = tokenFromPath || searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<ValidatedClinicInvitation | null>(null);
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
        logger.info("🔍 Validando token de invitación:", token);
        const data = await validateInvitationTokenAPI(token);
        logger.info("✅ Datos de invitación recibidos:", {
          isValid: data.isValid,
          doctorExiste: data.doctorExiste,
        });
        setInvitation(data);

        if (!data.isValid) {
          setError("Esta invitación ha expirado o ya no es válida");
        }
      } catch (err: unknown) {
        logger.error("❌ Error al validar invitación:", err);
        logApiError("ClinicInvitation", err);
        setError(getUserFriendlyMessage(err, { fallback: "No fue posible cargar la invitación." }));
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [token]);

  const handleAccept = async () => {
    if (!token || !invitation?.isValid || !invitation.clinic) return;

    setProcessing(true);
    setError(null);

    try {
      const doctorExiste = invitation.doctorExiste === true;

      if (isAuthenticated && user && emailsMatch(user.email, invitation.email)) {
        if (!isDoctorAccount(user.role, user.tipo)) {
          setError(
            "Este correo está registrado con otro tipo de cuenta. Contacta al administrador o usa otra cuenta.",
          );
          setProcessing(false);
          return;
        }

        logger.info("🔗 Asociando invitación (usuario ya logueado)");
        await associateClinicInvitationAPI(token);
        sessionStorage.removeItem(PENDING_CLINIC_INVITATION_KEY);
        setStatus("accepted");
        navigate("/doctor/dashboard", { replace: true });
        return;
      }

      if (doctorExiste) {
        logger.info("🔀 Redirección a login (médico ya registrado)");
        sessionStorage.setItem(PENDING_CLINIC_INVITATION_KEY, token);
        const loginUrl = `/login?invitation=${encodeURIComponent(token)}&email=${encodeURIComponent(invitation.email)}`;
        navigate(loginUrl, { replace: true });
        return;
      }

      logger.info("🔀 Redirección a registro (usuario nuevo)");
      navigate(
        `/register?invitation=${encodeURIComponent(token)}&type=doctor&email=${encodeURIComponent(invitation.email)}`,
        { replace: true },
      );
    } catch (err: unknown) {
      logApiError("ClinicInvitation:accept", err);
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!token) return;

    setProcessing(true);
    try {
      await rejectInvitationAPI(token);
      sessionStorage.removeItem(PENDING_CLINIC_INVITATION_KEY);
      setStatus("rejected");
    } catch (err: unknown) {
      logApiError("ClinicInvitation:reject", err);
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación.');
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

  if (error || !invitation || !invitation.isValid || !invitation.clinic) {
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
        </Paper>
      </Box>
    );
  }

  const doctorExiste = invitation.doctorExiste === true;

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", mt: 8, p: 3 }}>
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <LocalHospital sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />

        <Typography variant="h4" gutterBottom fontWeight={700}>
          ¡Únete a {invitation.clinic.name}!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, mt: 2 }}>
          Has sido invitado a formar parte de nuestra clínica en DOCALINK.
          Al aceptar, podrás gestionar tus citas, pacientes y horarios desde la plataforma.
        </Typography>

        {doctorExiste && (
          <Alert severity="info" sx={{ mb: 3, textAlign: "left" }}>
            Ya tienes una cuenta de médico con este correo. Al aceptar, iniciarás sesión para unirte a la
            clínica.
          </Alert>
        )}

        <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2, mb: 4, textAlign: "left" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Clínica:</strong> {invitation.clinic.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Email:</strong> {invitation.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Válido hasta:</strong>{" "}
            {new Date(invitation.expiresAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
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
          {doctorExiste
            ? "Al aceptar serás redirigido al inicio de sesión. Tras ingresar, quedarás vinculado a esta clínica automáticamente."
            : "Al aceptar completarás un breve registro. Una vez registrado, quedarás vinculado a esta clínica automáticamente."}
        </Typography>
      </Paper>
    </Box>
  );
};
