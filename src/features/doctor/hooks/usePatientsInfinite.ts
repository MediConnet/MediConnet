import { useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../app/store/auth.store";
import type { Patient } from "../types/Patient.entity";
import { getPatientsAPI, type GetPatientsParams } from "../api/patients.api";

export const usePatientsInfinite = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");

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
    staleTime: 1 * 60 * 1000,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = lastPage.meta?.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const patients: Patient[] = useMemo(
    () => data?.pages.flatMap((page) => page.patients) || [],
    [data]
  );

  const totalPatients = data?.pages[0]?.meta?.total || 0;
  const totalPages = data?.pages[0]?.meta?.totalPages || 1;

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
