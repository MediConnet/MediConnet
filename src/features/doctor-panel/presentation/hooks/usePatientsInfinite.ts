import { useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import type { Patient } from "../../domain/Patient.entity";
import { getPatientsAPI, type GetPatientsParams } from "../../infrastructure/patients.api";

/**
 * Hook: Obtener lista de pacientes del doctor con paginación infinita
 * Ideal para listas largas donde se quiere cargar más datos al hacer scroll
 */
export const usePatientsInfinite = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");

  // Parámetros base para la query
  const baseParams: Omit<GetPatientsParams, 'page'> = useMemo(
    () => ({
      limit: 10,
      search,
    }),
    [search]
  );

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['doctors', 'patients', 'infinite', user?.id, baseParams],
    queryFn: ({ pageParam = 1 }) => getPatientsAPI({ ...baseParams, page: pageParam }),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minuto
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = lastPage.meta?.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Aplanar todos los pacientes de todas las páginas
  const patients: Patient[] = useMemo(
    () => data?.pages.flatMap((page) => page.patients) || [],
    [data]
  );

  const totalPatients = data?.pages[0]?.meta?.total || 0;
  const totalPages = data?.pages[0]?.meta?.totalPages || 1;

  // Función para manejar cambios en la búsqueda (resetear paginación)
  const handleSearchChange = (term: string) => {
    setSearch(term);
  };

  return {
    patients,
    loading: isLoading,
    error,
    search,
    setSearch: handleSearchChange,
    totalPatients,
    totalPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};
