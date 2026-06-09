import {
  Box,
  Button,
  Dialog,
  Typography,
} from "@mui/material";
import { CheckCircle, Error as ErrorIcon, Warning as WarningIcon, Info as InfoIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useFeedbackStore } from "../../../app/store/feedback.store";
import { SuccessModal } from "./SuccessModal";
import { ErrorModal } from "./ErrorModal";

const ConfirmDialog = () => {
  const { open, type, title, message, confirmText, cancelText, onConfirm, hideFeedback } = useFeedbackStore();

  const isDestructive = type === 'destructive';
  const iconColor = isDestructive ? '#ef4444' : '#f59e0b';
  const bgColor = isDestructive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)';
  const Icon = isDestructive ? DeleteIcon : WarningIcon;

  const handleConfirm = () => {
    onConfirm?.();
    hideFeedback();
  };

  return (
    <Dialog
      open={open}
      onClose={hideFeedback}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, textAlign: "center", py: 4, px: 3 },
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <Icon sx={{ fontSize: 48, color: iconColor }} />
      </Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3} px={2}>
        {message}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Button
          variant="outlined"
          size="large"
          onClick={hideFeedback}
          sx={{ px: 4, py: 1.5 }}
        >
          {cancelText || "Cancelar"}
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleConfirm}
          sx={{
            px: 4,
            py: 1.5,
            bgcolor: isDestructive ? '#ef4444' : '#14b8a6',
            '&:hover': { bgcolor: isDestructive ? '#dc2626' : '#0d9488' },
          }}
        >
          {confirmText || "Confirmar"}
        </Button>
      </Box>
    </Dialog>
  );
};

export const GlobalFeedback = () => {
  const { open, type, title, message, buttonText, hideFeedback } = useFeedbackStore();

  if (type === "confirmation" || type === "destructive") {
    return <ConfirmDialog />;
  }

  if (type === "success") {
    return (
      <SuccessModal
        open={open}
        title={title}
        message={message}
        buttonText={buttonText}
        onAction={hideFeedback}
      />
    );
  }

  return (
    <ErrorModal
      open={open}
      title={title}
      message={message}
      buttonText={buttonText}
      onAction={hideFeedback}
    />
  );
};
