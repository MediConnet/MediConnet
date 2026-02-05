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

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [clinic, doctors] = await Promise.all([
        getClinicPaymentsUseCase(clinicId),
        getClinicToDoctorPaymentsUseCase(clinicId),
      ]);
      setClinicPayments(clinic);
      setDoctorPayments(doctors);
    } catch (err: any) {
      setError(err.message || 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  }, [clinicId]);

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
    distributePayment,
    payDoctor,
    refetch: loadPayments,
  };
};
