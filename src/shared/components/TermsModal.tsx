import { Close } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { TERMS_SECTIONS } from "../constants/terms";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export const TermsModal = ({ open, onClose }: TermsModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: "85vh" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#1a3a6b",
          color: "white",
          py: 2,
          px: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          TÉRMINOS Y CONDICIONES DE USO — DOCALINK
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, py: 3 }}>
        {TERMS_SECTIONS.map((section, idx) => (
          <Box key={idx} mb={3}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="#1a3a6b"
              gutterBottom
            >
              {section.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}
            >
              {section.content}
            </Typography>
            {idx < TERMS_SECTIONS.length - 1 && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};
