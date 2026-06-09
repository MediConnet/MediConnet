import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

interface CommentResponseModalProps {
  open: boolean;
  commentSubject: string;
  onClose: () => void;
  onConfirm: (response: string) => Promise<void>;
}

export const CommentResponseModal: React.FC<CommentResponseModalProps> = ({
  open,
  commentSubject,
  onClose,
  onConfirm,
}) => {
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!response.trim()) return;
    setSubmitting(true);
    try {
      await onConfirm(response.trim());
      setResponse("");
      onClose();
    } catch (err) {
      console.error("Error submitting response:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setResponse("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Responder Comentario</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Asunto: <strong>{commentSubject}</strong>
        </Typography>
        <TextField
          label="Respuesta del Administrador"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          multiline
          rows={5}
          fullWidth
          required
          placeholder="Escribe tu respuesta..."
          disabled={submitting}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!response.trim() || submitting}
        >
          {submitting ? "Enviando..." : "Enviar Respuesta"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
