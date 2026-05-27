import { Error as ErrorIcon } from "@mui/icons-material";
import { Box, Button, Dialog, Typography } from "@mui/material";

interface ErrorModalProps {
  open: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  onAction: () => void;
}

export const ErrorModal = ({
  open,
  title = "Error",
  message = "Ocurrió un error inesperado. Intenta nuevamente.",
  buttonText = "Cerrar",
  onAction,
}: ErrorModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onAction}
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
          bgcolor: "rgba(239, 68, 68, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <ErrorIcon sx={{ fontSize: 48, color: "#ef4444" }} />
      </Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3} px={2}>
        {message}
      </Typography>
      <Button
        variant="outlined"
        size="large"
        onClick={onAction}
        sx={{ px: 5, py: 1.5, mx: "auto" }}
      >
        {buttonText}
      </Button>
    </Dialog>
  );
};
