import { useEffect, useState } from "react";
import { getPharmacyBranchesUseCase } from "../../application/get-pharmacy-branches.usecase";
import type { PharmacyBranch } from "../../domain/pharmacy-branch.entity";

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

  // --- ACCIONES (Simulación Local) ---

  const addBranch = (branch: Omit<PharmacyBranch, "id">) => {
    const newBranch: PharmacyBranch = {
      ...branch,
      id: `BR-${Math.floor(Math.random() * 1000)}`, 
    };
    setBranches((prev) => [...prev, newBranch]);
  };

  const updateBranch = (updatedBranch: PharmacyBranch) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === updatedBranch.id ? updatedBranch : b))
    );
  };

  const deleteBranch = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  return { 
    branches, 
    isLoading, 
    addBranch, 
    updateBranch, 
    deleteBranch 
  };
};