import {
  Block,
  Check,
  Close,
  Download,
  Image as ImageIcon,
  PictureAsPdf,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import type { ProviderRequest } from "../../domain/provider-request.entity";
import { RequestStatusBadge } from "./RequestStatusBadge";

interface Props {
  open: boolean;
  onClose: () => void;
  request: ProviderRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const RequestDetailModal = ({
  open,
  onClose,
  request,
  onApprove,
  onReject,
}: Props) => {
  if (!request) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      {/* HEADER */}
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
            Detalle de Solicitud
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Información completa del servicio solicitado
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        {/* SECCIÓN 1: Encabezado del Perfil */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
          <Avatar
            src={request.avatarUrl}
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.light",
              fontSize: 32,
            }}
          >
            {request.providerName.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
              {request.providerName}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ textTransform: "capitalize", mt: 0.5, fontSize: "1.1rem" }}
            >
              {request.serviceType}
            </Typography>
          </Box>
          <RequestStatusBadge status={request.status} />
        </Box>

        {/* SECCIÓN 2: Grid de Información */}
        <Grid2 container spacing={3} mb={4}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              Email
            </Typography>
            <Typography variant="body1" fontWeight={500} fontSize="1.1rem">
              {request.email}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              Teléfono
            </Typography>
            <Typography variant="body1" fontWeight={500} fontSize="1.1rem">
              {request.phone}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              WhatsApp
            </Typography>
            <Typography variant="body1" fontWeight={500} fontSize="1.1rem">
              {request.whatsapp}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              Ciudad
            </Typography>
            <Typography variant="body1" fontWeight={500} fontSize="1.1rem">
              {request.city}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              Dirección
            </Typography>
            <Typography variant="body1" fontWeight={500} fontSize="1.1rem">
              {request.address}
            </Typography>
          </Grid2>
        </Grid2>

        {/* SECCIÓN 3: Descripción */}
        <Box mb={4}>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={1}
          >
            Descripción
          </Typography>
          <Typography
            variant="body1"
            sx={{
              bgcolor: "grey.50",
              p: 2,
              borderRadius: 2,
              fontSize: "1rem",
            }}
          >
            {request.description}
          </Typography>
        </Box>

        {/* SECCIÓN 4: Documentos */}
        <Box>
          <Typography variant="h6" fontSize={18} fontWeight={600} mb={2}>
            Documentos Adjuntos ({request.documents.length})
          </Typography>

          <Grid2 container spacing={2}>
            {request.documents.map((doc) => (
              <Grid2 size={{ xs: 12, sm: 6 }} key={doc.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      color: doc.type === "pdf" ? "error.main" : "primary.main",
                    }}
                  >
                    {doc.type === "pdf" ? <PictureAsPdf /> : <ImageIcon />}
                  </Box>

                  <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                    <Typography variant="body1" noWrap fontWeight={500}>
                      {doc.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: "uppercase" }}
                    >
                      {doc.type}
                    </Typography>
                  </Box>

                  <IconButton size="small" color="primary">
                    <Download fontSize="small" />
                  </IconButton>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          color="error"
          size="large"
          startIcon={<Block />}
          onClick={() => onReject(request.id)}
          sx={{
            px: 3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Rechazar Solicitud
        </Button>
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<Check />}
          onClick={() => onApprove(request.id)}
          sx={{
            color: "white",
            px: 4,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
          }}
        >
          Aprobar Solicitud
        </Button>
      </DialogActions>
    </Dialog>
  );
};
