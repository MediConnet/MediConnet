import { Alert, Box, Button, Typography } from '@mui/material';
import { USER_MESSAGES } from '../lib/api-error';

interface LoadErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  severity?: 'error' | 'warning' | 'info';
}

/**
 * Estado de error o vacío para secciones — sin detalles técnicos.
 */
export const LoadErrorState = ({
  title = 'Sin información',
  message = USER_MESSAGES.load,
  onRetry,
  severity = 'warning',
}: LoadErrorStateProps) => (
  <Box sx={{ py: 3 }}>
    <Alert severity={severity} sx={{ mb: onRetry ? 2 : 0 }}>
      <Typography variant="subtitle2" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {message}
      </Typography>
    </Alert>
    {onRetry && (
      <Button variant="outlined" size="small" onClick={onRetry}>
        Reintentar
      </Button>
    )}
  </Box>
);
