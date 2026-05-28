import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../../../app/store/auth.store";
import { getDoctorPaymentsAPI } from "../../infrastructure/payments.api";
import type { Payment } from "../../domain/Payment.entity";

export const useDoctorPayments = () => {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await getDoctorPaymentsAPI({ page, limit });
      setPayments(result.data);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error("Error cargando pagos:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    payments,
    loading,
    total,
    page,
    setPage,
    limit,
    setLimit,
    refetch: loadData,
  };
};
