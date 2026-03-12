import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import { getPharmacyBranchesUseCase } from "../../application/get-pharmacy-branches.usecase";
import type { PharmacyBranch } from "../../domain/pharmacy-branch.entity";
import {
  createPharmacyBranchAPI,
  deletePharmacyBranchAPI,
  updatePharmacyBranchAPI,
} from "../../infrastructure/pharmacy.api";

/**
 * Hook: Obtener sucursales de la farmacia
 * Migrado a React Query
 */
export const usePharmacyBranches = () => {
  const { user } = useAuthStore();

  const {
    data: branches = [],
    isLoading,
  } = useQuery<PharmacyBranch[]>({
    queryKey: ['pharmacies', 'branches', user?.id],
    queryFn: getPharmacyBranchesUseCase,
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  return { branches, isLoading };
};

/**
 * Hook: Crear sucursal con optimistic update
 */
export const useCreatePharmacyBranch = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation<PharmacyBranch, Error, Omit<PharmacyBranch, "id">>({
    mutationFn: createPharmacyBranchAPI,
    onMutate: async (newBranch) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ['pharmacies', 'branches', user?.id] });
      
      // Snapshot del valor anterior
      const previousBranches = queryClient.getQueryData<PharmacyBranch[]>(['pharmacies', 'branches', user?.id]);
      
      // Optimistic update
      const optimisticBranch: PharmacyBranch = {
        ...newBranch,
        id: `temp-${Date.now()}`, // ID temporal
      };
      queryClient.setQueryData<PharmacyBranch[]>(
        ['pharmacies', 'branches', user?.id],
        (old = []) => [...old, optimisticBranch]
      );
      
      return { previousBranches };
    },
    onError: (_err, _newBranch, context) => {
      // Rollback en caso de error
      if (context?.previousBranches) {
        queryClient.setQueryData(['pharmacies', 'branches', user?.id], context.previousBranches);
      }
    },
    onSuccess: () => {
      // Invalidar para refrescar con datos reales
      queryClient.invalidateQueries({ queryKey: ['pharmacies', 'branches', user?.id] });
    },
  });
};

/**
 * Hook: Actualizar sucursal con optimistic update
 */
export const useUpdatePharmacyBranch = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation<PharmacyBranch, Error, PharmacyBranch>({
    mutationFn: (branch) => updatePharmacyBranchAPI(branch.id, branch),
    onMutate: async (updatedBranch) => {
      await queryClient.cancelQueries({ queryKey: ['pharmacies', 'branches', user?.id] });
      
      const previousBranches = queryClient.getQueryData<PharmacyBranch[]>(['pharmacies', 'branches', user?.id]);
      
      // Optimistic update
      queryClient.setQueryData<PharmacyBranch[]>(
        ['pharmacies', 'branches', user?.id],
        (old = []) => old.map((b) => (b.id === updatedBranch.id ? updatedBranch : b))
      );
      
      return { previousBranches };
    },
    onError: (_err, _updatedBranch, context) => {
      if (context?.previousBranches) {
        queryClient.setQueryData(['pharmacies', 'branches', user?.id], context.previousBranches);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacies', 'branches', user?.id] });
    },
  });
};

/**
 * Hook: Eliminar sucursal con optimistic update
 */
export const useDeletePharmacyBranch = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation<void, Error, string>({
    mutationFn: deletePharmacyBranchAPI,
    onMutate: async (branchId) => {
      await queryClient.cancelQueries({ queryKey: ['pharmacies', 'branches', user?.id] });
      
      const previousBranches = queryClient.getQueryData<PharmacyBranch[]>(['pharmacies', 'branches', user?.id]);
      
      // Optimistic update
      queryClient.setQueryData<PharmacyBranch[]>(
        ['pharmacies', 'branches', user?.id],
        (old = []) => old.filter((b) => b.id !== branchId)
      );
      
      return { previousBranches };
    },
    onError: (_err, _branchId, context) => {
      if (context?.previousBranches) {
        queryClient.setQueryData(['pharmacies', 'branches', user?.id], context.previousBranches);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacies', 'branches', user?.id] });
    },
  });
};