import { useEffect, useMemo, useState } from "react";
import type { ProviderRequest } from "../../domain/provider-request.entity";
import { approveRequestUseCase } from "../../application/approve-request.usecase";
import { rejectRequestUseCase } from "../../application/reject-request.usecase";

export const useRequestFiltering = (
  initialData: ProviderRequest[] | undefined,
  defaultStatusFilter: string = "all"
) => {
  const [requests, setRequests] = useState<ProviderRequest[]>([]);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    if (initialData) {
      setRequests(initialData);
    }
  }, [initialData]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // A. Filtro Texto
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        req.providerName.toLowerCase().includes(searchLower) ||
        req.email.toLowerCase().includes(searchLower);

      // B. Filtro Estado
      const matchesStatus =
        statusFilter === "all" || req.status === statusFilter;

      // C. Filtro Fecha
      const matchesDate = !dateFilter || req.submissionDate >= dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [requests, searchText, statusFilter, dateFilter]);

  const approveRequest = async (id: string) => {
    await approveRequestUseCase(id);
    // Actualizar el estado local
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "APPROVED" } : req))
    );
  };

  const rejectRequest = async (id: string, reason?: string) => {
    await rejectRequestUseCase(id, reason || "");
    // Actualizar el estado local - la solicitud se eliminará de la lista porque el filtro es "PENDING"
    setRequests((prev) =>
      prev.map((req) => 
        req.id === id 
          ? { ...req, status: "REJECTED" as const, rejectionReason: reason || "" } 
          : req
      )
    );
  };

  return {
    // Data
    requests: filteredRequests, 
    totalRequests: requests.length,
    
    // Filters State
    filters: {
      searchText,
      statusFilter,
      dateFilter,
    },
    
    // Filter Setters
    setSearchText,
    setStatusFilter,
    setDateFilter,

    // Actions
    approveRequest,
    rejectRequest,
  };
};