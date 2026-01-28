import { useEffect, useState } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import type { Patient } from "../../domain/Patient.entity";
import { getPatientsAPI } from "../../infrastructure/patients.api";

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);

  const { user } = useAuthStore();

  const fetchPatients = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { patients: data, meta } = await getPatientsAPI({ page, limit: 10, search });
      setPatients(data);
      setTotalPages(meta.totalPages);
      setTotalPatients(meta.total);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Recargar cuando cambie la página, la búsqueda o el usuario
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPatients();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [page, search, user?.id]);

  const handleSearchChange = (term: string) => {
    setSearch(term);
    setPage(1); 
  };

  return {
    patients,
    loading,
    page,
    totalPages,
    totalPatients,
    search,
    setPage,
    setSearch: handleSearchChange,
    refetch: fetchPatients
  };
};