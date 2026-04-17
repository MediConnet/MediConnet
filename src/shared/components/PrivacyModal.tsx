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
import {
  COOKIES_SECTIONS,
  LEGAL_INFO,
  PRIVACY_SECTIONS,
} from "../constants/privacy";

export type PrivacyModalType = "privacy" | "cookies" | "legal";

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
  type: PrivacyModalType;
}

const CONFIG: Record<PrivacyModalType, { title: string; sections: { title: string; content: string; isMainTitle?: boolean }[] }> = {
  privacy: {
    title: "Política de Privacidad",
    sections: PRIVACY_SECTIONS,
  },
  cookies: {
    title: "Política de Cookies",
    sections: COOKIES_SECTIONS,
  },
  legal: {
    title: "Información Legal",
    sections: [{ title: LEGAL_INFO.title, content: LEGAL_INFO.content }],
  },
};

export const PrivacyModal = ({ open, onClose, type }: PrivacyModalProps) => {
  const { title, sections } = CONFIG[type];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{ sx: { borderRadius: 3, maxHeight: "85vh" } }}
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
          {title} — DOCALINK
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, py: 3 }}>
        {sections.map((section, idx) => (
          <Box key={idx} mb={3}>
            {section.isMainTitle ? (
              <Typography
                variant="h6"
                fontWeight={800}
                color="#1a3a6b"
                gutterBottom
                sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
              >
                {section.title}
              </Typography>
            ) : (
              <>
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
              </>
            )}
            {idx < sections.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};
