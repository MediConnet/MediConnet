import {
  Campaign,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useAdminNotificationsLayout } from "../hooks/useAdminNotificationsLayout";
import { getAdRequestsUseCase } from "../../application/get-ad-requests.usecase";
import type { AdRequest } from "../../domain/ad-request.entity";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED": return "success";
    case "REJECTED": return "error";
    case "PENDING": return "warning";
    default: return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "APPROVED": return "Aprobado";
    case "REJECTED": return "Rechazado";
    case "PENDING": return "Pendiente";
    default: return status;
  }
};

const getTabLabel = (label: string, count: number) => `${label} (${count})`;

export const AdsOverviewPage = () => {
  const [ads, setAds] = useState<AdRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const { appointments, notificationsViewAllPath } = useAdminNotificationsLayout();

  const loadAds = useCallback(async () => {
    setIsLoading(true);
    try {
      const allAds = await getAdRequestsUseCase("all");
      setAds(allAds);
    } catch (error) {
      console.error("Error loading ads:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  const pending = ads.filter((a) => a.status === "PENDING");
  const approved = ads.filter((a) => a.status === "APPROVED");
  const rejected = ads.filter((a) => a.status === "REJECTED");

  const filteredAds = tabIndex === 0 ? ads : tabIndex === 1 ? pending : tabIndex === 2 ? approved : rejected;

  const tabs = [
    { label: getTabLabel("Todos", ads.length), value: 0 },
    { label: getTabLabel("Pendientes", pending.length), value: 1 },
    { label: getTabLabel("Aprobados", approved.length), value: 2 },
    { label: getTabLabel("Rechazados", rejected.length), value: 3 },
  ];

  return (
    <DashboardLayout
      role="ADMIN"
      userProfile={CURRENT_ADMIN}
      appointments={appointments}
      notificationsVariant="professional"
      notificationsViewAllPath={notificationsViewAllPath}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Campaign sx={{ fontSize: 32, color: "primary.main" }} />
            <Box>
              <Typography variant="h4" fontWeight={700}>Panel de Anuncios</Typography>
              <Typography variant="body2" color="text.secondary">
                Todos los anuncios del sistema organizados por estado
              </Typography>
            </Box>
          </Stack>
          <Button variant="outlined" onClick={loadAds} sx={{ textTransform: "none" }}>
            Refrescar
          </Button>
        </Stack>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} variant="scrollable" scrollButtons="auto">
            {tabs.map((t) => (
              <Tab key={t.value} label={t.label} sx={{ textTransform: "none", fontWeight: 600 }} />
            ))}
          </Tabs>
        </Box>

        <TabPanel value={tabIndex} index={tabIndex}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredAds.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay anuncios en esta categoría.
            </Alert>
          ) : (
            <Stack spacing={2}>
              {filteredAds.map((ad) => (
                <Card key={ad.id} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} justifyContent="space-between">
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                        <Avatar
                          sx={{ bgcolor: "primary.light", width: 48, height: 48, flexShrink: 0 }}
                        >
                          <Campaign />
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle1" fontWeight={700} noWrap>
                            {ad.adContent?.title || ad.adContent?.label || "Anuncio sin título"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}>
                            {ad.adContent?.description || "Sin descripción"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction={{ xs: "row", sm: "row" }} spacing={1.5} alignItems="center" flexShrink={0} flexWrap="wrap">
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Publicador
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {ad.providerName}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Fecha
                          </Typography>
                          <Typography variant="body2">
                            {ad.submissionDate}
                          </Typography>
                        </Box>

                        <Chip
                          icon={
                            ad.status === "APPROVED" ? <CheckCircle /> :
                            ad.status === "REJECTED" ? <Cancel /> :
                            <HourglassEmpty />
                          }
                          label={getStatusLabel(ad.status)}
                          color={getStatusColor(ad.status) as any}
                          size="small"
                          variant="outlined"
                        />

                        <Tooltip title="Ver detalle">
                          <IconButton size="small" color="primary">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </TabPanel>
      </Box>
    </DashboardLayout>
  );
};
