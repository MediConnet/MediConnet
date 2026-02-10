import { useEffect, useState } from "react";
import { getPharmacyBranchesUseCase } from "../../application/get-pharmacy-branches.usecase";
import type { PharmacyBranch } from "../../domain/pharmacy-branch.entity";
import {
  createPharmacyBranchAPI,
  deletePharmacyBranchAPI,
  updatePharmacyBranchAPI,
} from "../../infrastructure/pharmacy.api";

export const usePharmacyBranches = () => {
  const [branches, setBranches] = useState<PharmacyBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carga inicial
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const data = await getPharmacyBranchesUseCase();
        setBranches(data);
      } catch (error) {
        console.error("Error cargando sucursales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // --- ACCIONES (Backend) ---

  const addBranch = async (branch: Omit<PharmacyBranch, "id">) => {
    try {
      const created = await createPharmacyBranchAPI(branch);
      setBranches((prev) => [...prev, created]);
    } catch (error) {
      console.error("Error creando sucursal:", error);
    }
  };

  const updateBranch = async (updatedBranch: PharmacyBranch) => {
    try {
      const saved = await updatePharmacyBranchAPI(updatedBranch.id, updatedBranch);
      setBranches((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
    } catch (error) {
      console.error("Error actualizando sucursal:", error);
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      await deletePharmacyBranchAPI(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error eliminando sucursal:", error);
    }
  };

  return { 
    branches, 
    isLoading, 
    addBranch, 
    updateBranch, 
    deleteBranch 
  };
};