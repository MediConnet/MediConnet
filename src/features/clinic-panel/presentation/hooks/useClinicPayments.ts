import { useState, useEffect, useCallback } from 'react';
import type { ClinicPayment } from '../../domain/clinic-payment.entity';
import type { ClinicToDoctorPayment } from '../../domain/clinic-to-doctor-payment.entity';
import { getClinicPaymentsUseCase } from '../../application/get-clinic-payments.usecase';
import { getClinicToDoctorPaymentsUseCase } from '../../application/get-clinic-to-doctor-payments.usecase';
import { distributePaymentUseCase } from '../../application/distribute-payment.usecase';
import { payDoctorUseCase } from '../../application/pay-doctor.usecase';

export const useClinicPayments = (clinicId: string) => {
  const [clinicPayments, setClinicPayments] = useState<ClinicPayment[]>([]);
  const [doctorPayments, setDoctorPayments] = useState<ClinicToDoctorPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clinicTotal, setClinicTotal] = useState(0);
  const [doctorTotal, setDoctorTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [clinic, doctors] = await Promise.all([
        getClinicPaymentsUseCase(clinicId, { page, limit }),
        getClinicToDoctorPaymentsUseCase(clinicId, { page, limit }),
      ]);
      setClinicPayments(clinic.data);
      setDoctorPayments(doctors.data);
      setClinicTotal(clinic.pagination.total);
      setDoctorTotal(doctors.pagination.total);
    } catch (err: any) {
      setError(err.message || 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  }, [clinicId, page, limit]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const distributePayment = async (
    paymentId: string,
    distribution: { doctorId: string; amount: number }[]
  ) => {
    try {
      await distributePaymentUseCase(paymentId, distribution);
      await loadPayments();
    } catch (err: any) {
      throw new Error(err.message || 'Error al distribuir pago');
    }
  };

  const payDoctor = async (doctorId: string, paymentId: string) => {
    try {
      await payDoctorUseCase(doctorId, paymentId);
      await loadPayments();
    } catch (err: any) {
      throw new Error(err.message || 'Error al pagar al médico');
    }
  };

  return {
    clinicPayments,
    doctorPayments,
    loading,
    error,
    clinicTotal,
    doctorTotal,
    page,
    setPage,
    limit,
    setLimit,
    distributePayment,
    payDoctor,
    refetch: loadPayments,
  };
};
