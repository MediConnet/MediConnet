import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close, Warning } from '@mui/icons-material';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
}

export const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
}: ConfirmDeleteModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Warning sx={{ fontSize: 24, color: '#ef4444' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          {message}
        </Typography>
        <Box
          sx={{
            p: 2,
            backgroundColor: '#fef2f2',
            borderRadius: 1,
            border: '1px solid #fecaca',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#991b1b' }}>
            {itemName}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: '#d1d5db',
            color: '#4b5563',
            textTransform: 'none',
            px: 3,
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            backgroundColor: '#ef4444',
            color: 'white',
            textTransform: 'none',
            px: 3,
            '&:hover': {
              backgroundColor: '#dc2626',
            },
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

