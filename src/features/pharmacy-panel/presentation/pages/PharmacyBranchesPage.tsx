import { Add, Store } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import type { PharmacyBranch } from "../../domain/pharmacy-branch.entity";
import { PharmacyBranchModal } from "../components/PharmacyBranchModal";
import { PharmacyBranchesTable } from "../components/PharmacyBranchesTable";
import {
  usePharmacyBranches,
  useCreatePharmacyBranch,
  useUpdatePharmacyBranch,
  useDeletePharmacyBranch,
} from "../hooks/usePharmacyBranches";
import { useAuthStore } from "../../../../app/store/auth.store";
import { usePharmacyReviews } from "../hooks/usePharmacyReviews";

export const PharmacyBranchesPage = () => {
  const authStore = useAuthStore();
  const { user } = authStore;
  const { reviews } = usePharmacyReviews();

  // Obtener iniciales del usuario
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userProfile = {
    name: user?.name || "Farmacia",
    roleLabel: "Farmacia",
    initials: getInitials(user?.name || "FA"),
    isActive: true,
  };
  // 1. Hook para obtener sucursales
  const { branches, isLoading } = usePharmacyBranches();
  
  // 2. Hooks de mutations con optimistic updates
  const { mutateAsync: addBranch } = useCreatePharmacyBranch();
  const { mutateAsync: updateBranch } = useUpdatePharmacyBranch();
  const { mutateAsync: deleteBranch } = useDeletePharmacyBranch();

  // 2. Estado local para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<PharmacyBranch | null>(
    null
  );

  // --- Handlers ---

  const handleCreate = () => {
    setSelectedBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: PharmacyBranch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta sucursal?")) {
      try {
        await deleteBranch(id);
      } catch (error) {
        console.error("Error eliminando sucursal:", error);
      }
    }
  };

  const handleSave = async (
    branchData: PharmacyBranch | Omit<PharmacyBranch, "id">
  ) => {
    try {
      if ("id" in branchData) {
        // Tiene ID -> Es Edición
        await updateBranch(branchData as PharmacyBranch);
      } else {
        // No tiene ID -> Es Creación
        await addBranch(branchData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error guardando sucursal:", error);
    }
  };

  return (
    <DashboardLayout
      role="PROVIDER"
      userProfile={userProfile}
      notificationType="reviews"
      reviews={reviews}
      notificationsViewAllPath="/provider/pharmacy/reviews"
    >
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {/* HEADER */}
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
            onClick={handleCreate}
          >
            Nueva Sucursal
          </Button>
        </Stack>

        {/* TABLA */}
        <PharmacyBranchesTable
          branches={branches}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* MODAL (CREAR / EDITAR) */}
        <PharmacyBranchModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          branchToEdit={selectedBranch}
          onSave={handleSave}
        />
      </Box>
    </DashboardLayout>
  );
};
