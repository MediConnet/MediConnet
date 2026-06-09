import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import type { Patient } from "../../domain/Patient.entity";
import { getPatientsAPI, type GetPatientsParams } from "../../infrastructure/patients.api";

export const usePatients = () => {
  const { user } = useAuthStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const queryParams: GetPatientsParams = useMemo(
    () => ({ page, limit, search }),
    [page, limit, search]
  );

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getPatientsAPI(queryParams);
      setPatients(result.data);
      setTotal(result.pagination.total);
    } catch (err: any) {
      setError(err?.message || "Error al cargar pacientes");
    } finally {
      setLoading(false);
    }
  }, [user?.id, queryParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  return {
    patients,
    loading,
    error,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    search,
    setSearch: handleSearchChange,
    refetch: loadData,
  };
};