import { useEffect, useMemo, useState } from "react";
import type { ProviderRequest } from "../../domain/provider-request.entity";

export const useRequestFiltering = (initialData: ProviderRequest[] | undefined) => {
  const [requests, setRequests] = useState<ProviderRequest[]>([]);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  const approveRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "APPROVED" } : req))
    );
  };

  const rejectRequest = (id: string, reason?: string) => {
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