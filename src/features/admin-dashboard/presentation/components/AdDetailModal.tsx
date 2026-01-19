import {
  Close,
  Image as ImageIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import type { AdRequest } from "../../domain/ad-request.entity";
import { PromotionalBanner } from "../../../../shared/components/PromotionalBanner";

interface AdDetailModalProps {
  open: boolean;
  onClose: () => void;
  request: AdRequest | null;
}

export const AdDetailModal = ({
  open,
  onClose,
  request,
}: AdDetailModalProps) => {
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom="1px solid #eee"
      >
        <DialogTitle sx={{ p: 0, fontWeight: 700 }}>
          Detalle del Anuncio
        </DialogTitle>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Preview del Anuncio - Cómo se vería publicado */}
          {request.adContent && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ color: "primary.main" }}>
                📱 PREVIEW DEL ANUNCIO
              </Typography>
              <Box
                sx={{
                  border: "2px solid",
                  borderColor: "primary.main",
                  borderRadius: 3,
                  overflow: "hidden",
                  bgcolor: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  p: 2,
                  minHeight: 220,
                }}
              >
                {/* Usar PromotionalBanner si tiene los nuevos campos, sino mostrar formato legacy */}
                {request.adContent.label && request.adContent.discount && request.adContent.buttonText ? (
                  <PromotionalBanner
                    label={request.adContent.label}
                    discount={request.adContent.discount}
                    description={request.adContent.description}
                    buttonText={request.adContent.buttonText}
                    imageUrl={request.adContent.imageUrl}
                    endDate={request.adContent.endDate}
                  />
                ) : (
                  /* Formato legacy para anuncios antiguos */
                  <Box>
                    {request.adContent.imageUrl && (
                      <Box
                        sx={{
                          width: "100%",
                          height: 200,
                          overflow: "hidden",
                          borderRadius: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          component="img"
                          src={request.adContent.imageUrl}
                          alt={request.adContent.title || "Anuncio"}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Box>
                    )}
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight={700} mb={1}>
                        {request.adContent.title || "Sin título"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {request.adContent.description}
                      </Typography>
                      <Chip
                        label={`${request.providerName} - ${request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)}`}
                        size="small"
                        sx={{
                          bgcolor: "primary.light",
                          color: "primary.main",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <Divider />

          {/* Contenido del Anuncio - Detalles */}
          {request.adContent ? (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={2}>
                INFORMACIÓN DEL ANUNCIO
              </Typography>

              {/* Mostrar campos nuevos si existen, sino mostrar campos legacy */}
              {request.adContent.label && request.adContent.discount && request.adContent.buttonText ? (
                <>
                  {/* Label */}
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} mb={1}>
                      LABEL DEL ANUNCIO
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {request.adContent.label}
                    </Typography>
                  </Box>

                  {/* Descuento */}
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} mb={1}>
                      DESCUENTO
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {request.adContent.discount}
                    </Typography>
                  </Box>

                  {/* Descripción */}
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} mb={1}>
                      DESCRIPCIÓN DEL ANUNCIO
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {request.adContent.description}
                    </Typography>
                  </Box>

                  {/* Texto del botón */}
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} mb={1}>
                      TEXTO DEL BOTÓN
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {request.adContent.buttonText}
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  {/* Formato legacy */}
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} mb={1}>
                      TÍTULO DEL ANUNCIO
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {request.adContent.title || "Sin título"}
                    </Typography>
                  </Box>

                  {/* Descripción */}
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} mb={1}>
                      DESCRIPCIÓN DEL ANUNCIO
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {request.adContent.description}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Información Adicional */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={2}>
                  Información Adicional
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Proveedor
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {request.providerName}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tipo de Servicio
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                      {request.serviceType}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Inicio
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {new Date(request.adContent.startDate).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>
                  </Grid2>
                  {request.adContent.endDate && (
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de Fin
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {new Date(request.adContent.endDate).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </Typography>
                    </Grid2>
                  )}
                </Grid2>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: "grey.50",
                border: "1px dashed",
                borderColor: "grey.300",
                textAlign: "center",
              }}
            >
              <ImageIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
              <Typography variant="body1" fontWeight={600} mb={0.5}>
                No hay contenido de anuncio disponible
              </Typography>
              <Typography variant="body2" color="text.secondary">
                El proveedor aún no ha proporcionado el contenido del anuncio
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Estado */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1}>
              Estado de la Solicitud
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={
                  request.status === "APPROVED"
                    ? "Aprobado"
                    : request.status === "REJECTED"
                    ? "Rechazado"
                    : "Pendiente"
                }
                color={
                  request.status === "APPROVED"
                    ? "success"
                    : request.status === "REJECTED"
                    ? "error"
                    : "warning"
                }
                size="medium"
              />
              {request.hasActiveAd && (
                <Chip label="Anuncio Activo" color="success" size="small" />
              )}
            </Stack>
            {request.rejectionReason && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Motivo de Rechazo
                </Typography>
                <Typography
                  variant="body2"
                  color="error.main"
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "error.50",
                    border: "1px solid",
                    borderColor: "error.200",
                  }}
                >
                  {request.rejectionReason}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

