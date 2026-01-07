import { useEffect, useState } from "react";
import { getPharmacyBranchesUseCase } from "../../application/get-pharmacy-branches.usecase";
import type { PharmacyBranch } from "../../domain/pharmacy-branch.entity";

export const usePharmacyBranches = () => {
  const [branches, setBranches] = useState<PharmacyBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return { branches, isLoading };
};