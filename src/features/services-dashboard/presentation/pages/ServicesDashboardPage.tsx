import {
  AirportShuttle,
  Inventory,
  LocalPharmacy,
  MedicalServices,
  Science,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type { ActiveService } from "../../domain/service-stats.entity";
import { getActiveServicesMock } from "../../infrastructure/stats.mock";
import { ActiveServicesList } from "../components/ActiveServicesList";
import { ServiceStatCard } from "../components/ServiceStatCard";
import { useServiceStats } from "../hooks/useServiceStats";

const CURRENT_ADMIN = {
  name: "Administrador General",
  roleLabel: "Administrator",
  initials: "AG",
};

export const ServicesDashboardPage = () => {
  const { stats, isLoading } = useServiceStats();

  const [activeServices, setActiveServices] = useState<ActiveService[]>([]);

  // Cargamos los datos de la lista al montar el componente
  useEffect(() => {
    getActiveServicesMock().then((data) => setActiveServices(data));
  }, []);

  const themeColors = {
    tealBg: "#E0F2F1",
    tealText: "#009688",
  };

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* --- SECCIÓN 1: Tarjetas de Estadísticas --- */}
        <Box mb={5}>
          <Grid2 container spacing={3}>
            {/* Médico */}
            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
              <ServiceStatCard
                title="Médico"
                count={stats?.doctorCount}
                isLoading={isLoading}
                icon={<MedicalServices />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>

            {/* Farmacia */}
            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
              <ServiceStatCard
                title="Farmacia"
                count={stats?.pharmacyCount}
                isLoading={isLoading}
                icon={<LocalPharmacy />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>

            {/* Laboratorio */}
            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
              <ServiceStatCard
                title="Laboratorio"
                count={stats?.laboratoryCount}
                isLoading={isLoading}
                icon={<Science />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>

            {/* Ambulancia */}
            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
              <ServiceStatCard
                title="Ambulancia"
                count={stats?.ambulanceCount}
                isLoading={isLoading}
                icon={<AirportShuttle />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>

            {/* Insumos Médicos */}
            <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
              <ServiceStatCard
                title="Insumos Médicos"
                count={stats?.suppliesCount}
                isLoading={isLoading}
                icon={<Inventory />}
                iconColorBg={themeColors.tealBg}
                iconColorText={themeColors.tealText}
              />
            </Grid2>
          </Grid2>
        </Box>

        {/* --- SECCIÓN 2: Servicios Activos --- */}
        <Box
          sx={{
            bgcolor: "white",
            p: 3,
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Box mb={3}>
            <Typography variant="h6" fontWeight={700}>
              Servicios Activos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lista de todos los servicios aprobados
            </Typography>
          </Box>

          {/* Componente de Lista */}
          <ActiveServicesList services={activeServices} />
        </Box>
      </Box>
    </DashboardLayout>
  );
};
