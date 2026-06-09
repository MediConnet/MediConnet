import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { Comment } from "../../domain/comment.entity";

interface CommentDetailModalProps {
  open: boolean;
  comment: Comment | null;
  onClose: () => void;
}

const statusColors: Record<string, "warning" | "info" | "success" | "error"> = {
  PENDING: "warning",
  REVIEWED: "info",
  RESOLVED: "success",
  REJECTED: "error",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  REVIEWED: "Revisado",
  RESOLVED: "Resuelto",
  REJECTED: "Rechazado",
};

export const CommentDetailModal: React.FC<CommentDetailModalProps> = ({
  open,
  comment,
  onClose,
}) => {
  if (!comment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Detalle del Comentario</Typography>
          <Chip
            label={statusLabels[comment.status] || comment.status}
            color={statusColors[comment.status] || "default"}
            size="small"
          />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Asunto
            </Typography>
            <Typography variant="body1">{comment.subject}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Mensaje
            </Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", bgcolor: "grey.50", p: 2, borderRadius: 1 }}
            >
              {comment.message}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Usuario
            </Typography>
            <Typography variant="body2">
              {comment.userName || "Anónimo"}
              {comment.userEmail && ` (${comment.userEmail})`}
            </Typography>
            {comment.userType && (
              <Typography variant="caption" color="text.secondary">
                Tipo: {comment.userType}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha de Creación
            </Typography>
            <Typography variant="body2">
              {new Date(comment.createdAt).toLocaleDateString("es-EC", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>

          {comment.adminResponse && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="success.main">
                  Respuesta del Administrador
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-wrap",
                    bgcolor: "success.50",
                    p: 2,
                    borderRadius: 1,
                    border: 1,
                    borderColor: "success.200",
                  }}
                >
                  {comment.adminResponse}
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};
