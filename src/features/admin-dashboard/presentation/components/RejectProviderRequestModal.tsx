import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import type { ProviderRequest } from "../../domain/provider-request.entity";

interface Props {
  open: boolean;
  onClose: () => void;
  request: ProviderRequest | null;
  onConfirm: (id: string, reason: string) => void;
}

export const RejectProviderRequestModal = ({
  open,
  onClose,
  request,
  onConfirm,
}: Props) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  // Limpiar el estado cuando el modal se cierre
  useEffect(() => {
    if (!open) {
      setRejectionReason("");
      setError("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (!rejectionReason.trim()) {
      setError("Por favor, ingresa el motivo del rechazo");
      return;
    }

    if (request) {
      // Llamar al callback con el ID y el motivo del rechazo
      onConfirm(request.id, rejectionReason);
    }
  };

  const handleClose = () => {
    // Limpiar el estado al cerrar
    setRejectionReason("");
    setError("");
    onClose();
  };

  // Limpiar el estado cuando el modal se cierre (por cualquier razón)
  const handleDialogClose = (_event?: object, reason?: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      // Permitir cerrar haciendo clic fuera o con ESC
      handleClose();
    } else {
      handleClose();
    }
  };

  if (!request) return null;

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Rechazar Solicitud de Proveedor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Indica el motivo del rechazo
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Solicitud de: <strong>{request.providerName}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tipo de servicio: <strong>{request.serviceType}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: <strong>{request.email}</strong>
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Motivo del rechazo"
          placeholder="Explica por qué se rechaza esta solicitud de registro..."
          value={rejectionReason}
          onChange={(e) => {
            setRejectionReason(e.target.value);
            setError("");
          }}
          error={!!error}
          helperText={error}
          required
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            px: 3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          sx={{
            px: 4,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Rechazar Solicitud
        </Button>
      </DialogActions>
    </Dialog>
  );
};

