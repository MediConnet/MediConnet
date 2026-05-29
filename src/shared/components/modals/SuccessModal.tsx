import { CheckCircle } from "@mui/icons-material";
import { Box, Button, Dialog, Typography } from "@mui/material";

interface SuccessModalProps {
  open: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  onAction: () => void;
}

export const SuccessModal = ({
  open,
  title = "¡Operación Exitosa!",
  message = "La operación se realizó correctamente.",
  buttonText = "Aceptar",
  onAction,
}: SuccessModalProps) => {
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
          bgcolor: "rgba(34, 197, 94, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <CheckCircle sx={{ fontSize: 48, color: "#22c55e" }} />
      </Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3} px={2}>
        {message}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onAction}
        sx={{
          px: 5,
          py: 1.5,
          bgcolor: "#14b8a6",
          "&:hover": { bgcolor: "#0d9488" },
          mx: "auto",
        }}
      >
        {buttonText}
      </Button>
    </Dialog>
  );
};
