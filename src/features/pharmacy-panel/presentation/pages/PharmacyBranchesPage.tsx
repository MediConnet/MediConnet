import { Add, Store } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { PharmacyBranchesTable } from "../components/PharmacyBranchesTable";
import { usePharmacyBranches } from "../hooks/usePharmacyBranches";

// Mock user
const PHARMACY_USER = {
  name: "Fybeca Admin",
  roleLabel: "Farmacia",
  initials: "FA",
  isActive: true,
};

export const PharmacyBranchesPage = () => {
  const { branches, isLoading } = usePharmacyBranches();

  return (
    <DashboardLayout role="PROVIDER" userProfile={PHARMACY_USER}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* HEADER DE SECCIÓN + BOTÓN CREAR */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
              <Store color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Gestión de Sucursales
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Administra los puntos de atención, horarios y servicios de tu
              farmacia.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              color: "white",
              fontWeight: 700,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(20, 184, 166, 0.2)",
              px: 3,
              py: 1,
            }}
            onClick={() => console.log("Abrir modal crear sucursal")}
          >
            Nueva Sucursal
          </Button>
        </Stack>

        {/* TABLA DE SUCURSALES */}
        <PharmacyBranchesTable branches={branches} isLoading={isLoading} />
      </Box>
    </DashboardLayout>
  );
};
