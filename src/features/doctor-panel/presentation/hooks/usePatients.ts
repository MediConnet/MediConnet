import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../app/store/auth.store";
import type { Patient } from "../../domain/Patient.entity";
import { getPatientsAPI, type GetPatientsParams } from "../../infrastructure/patients.api";

/**
 * Hook: Obtener lista de pacientes del doctor
 * Migrado a React Query para mejor gestión de caché y estados
 */
export const usePatients = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Parámetros para la query (con debounce implícito de React Query)
  const queryParams: GetPatientsParams = useMemo(
    () => ({
      page,
      limit: 10,
      search,
    }),
    [page, search]
  );

  // Query con React Query
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['doctors', 'patients', user?.id, queryParams],
    queryFn: () => getPatientsAPI(queryParams),
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });

  // Función para manejar cambios en la búsqueda (resetear página)
  const handleSearchChange = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  return {
    patients: data?.patients || [],
    loading: isLoading,
    error,
    page,
    totalPages: data?.meta?.totalPages || 1,
    totalPatients: data?.meta?.total || 0,
    search,
    setPage,
    setSearch: handleSearchChange,
    refetch,
  };
};