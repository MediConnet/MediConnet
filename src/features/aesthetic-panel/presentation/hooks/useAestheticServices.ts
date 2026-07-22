import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
import {
  getAestheticServicesAPI,
  createAestheticServiceAPI,
  updateAestheticServiceAPI,
  deleteAestheticServiceAPI,
  type AestheticServicesResponse,
  type CreateAestheticServiceDTO,
} from "../../infrastructure/aesthetic-services.api";

export const useAestheticServices = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const feedback = useFeedbackStore();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Query: Obtener lista de tratamientos/servicios con paginación de servidor
  const {
    data: result,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<AestheticServicesResponse>({
    queryKey: ["aesthetic", "services", user?.id, page, limit],
    queryFn: () => getAestheticServicesAPI({ page, limit }),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });

  // Mutation: Crear tratamiento
  const createMutation = useMutation({
    mutationFn: createAestheticServiceAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aesthetic", "services"] });
      feedback.showFeedback("success", "Operación completada", "Tratamiento creado exitosamente.");
    },
    onError: (err: any) => {
      console.error("Error al crear tratamiento:", err);
      feedback.showFeedback("error", "Error", "No fue posible registrar el tratamiento.");
    },
  });

  // Mutation: Actualizar tratamiento
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateAestheticServiceDTO>; showFeedback?: boolean }) =>
      updateAestheticServiceAPI(id, dto),
    onMutate: async (newService) => {
      await queryClient.cancelQueries({ queryKey: ["aesthetic", "services"] });
      const previousData = queryClient.getQueryData<AestheticServicesResponse>([
        "aesthetic",
        "services",
        user?.id,
        page,
        limit,
      ]);

      if (previousData) {
        queryClient.setQueryData<AestheticServicesResponse>(
          ["aesthetic", "services", user?.id, page, limit],
          {
            ...previousData,
            data: previousData.data.map((item) =>
              item.id === newService.id ? { ...item, ...newService.dto } : item
            ),
          }
        );
      }

      return { previousData };
    },
    onSuccess: (_, variables) => {
      if (variables.showFeedback !== false) {
        feedback.showFeedback("success", "Cambios guardados", "Tratamiento actualizado correctamente.");
      }
    },
    onError: (err: any, _, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["aesthetic", "services", user?.id, page, limit],
          context.previousData
        );
      }
      console.error("Error al actualizar tratamiento:", err);
      feedback.showFeedback("error", "Error", "No fue posible actualizar el tratamiento.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["aesthetic", "services"] });
    },
  });

  // Mutation: Eliminar tratamiento
  const deleteMutation = useMutation({
    mutationFn: deleteAestheticServiceAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aesthetic", "services"] });
      feedback.showFeedback("success", "Registro eliminado", "Tratamiento eliminado correctamente.");
    },
    onError: (err: any) => {
      console.error("Error al eliminar tratamiento:", err);
      feedback.showFeedback("error", "Error", "No fue posible eliminar el tratamiento.");
    },
  });

  return {
    services: result?.data || [],
    total: result?.total || 0,
    page,
    setPage,
    limit,
    setLimit,
    isLoading: isLoading,
    refetch,
    createService: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateService: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteService: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
