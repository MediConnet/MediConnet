import { useState, useEffect, useCallback } from 'react';
import type { ClinicPayment } from '../types/clinic-payment.entity';
import type { ClinicToDoctorPayment } from '../types/clinic-to-doctor-payment.entity';
import { getClinicPaymentsUseCase } from '../services/get-clinic-payments.usecase';
import { getClinicToDoctorPaymentsUseCase } from '../services/get-clinic-to-doctor-payments.usecase';
import { distributePaymentUseCase } from '../services/distribute-payment.usecase';
import { payDoctorUseCase } from '../services/pay-doctor.usecase';
import { getUserFriendlyMessage } from '../../../shared/lib/api-error';

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
      setError(getUserFriendlyMessage(err, { fallback: 'No fue posible cargar los pagos.' }));
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
      throw new Error(getUserFriendlyMessage(err, { fallback: 'No fue posible distribuir el pago.' }));
    }
  };

  const payDoctor = async (doctorId: string, paymentId: string) => {
    try {
      await payDoctorUseCase(doctorId, paymentId);
      await loadPayments();
    } catch (err: any) {
      throw new Error(getUserFriendlyMessage(err, { fallback: 'No fue posible registrar el pago al médico.' }));
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
