import { useState, useEffect } from 'react';
import type { DateBlockRequest } from '../../domain/ClinicAssociatedDoctor.entity';
import {
  getDateBlockRequestsAPI,
  requestDateBlockAPI,
} from '../../infrastructure/clinic-associated.api';
import {
  getDateBlockRequestsMock,
  saveDateBlockRequestsMock,
} from '../../infrastructure/clinic-associated.mock';

export const useDateBlockRequests = (clinicId: string) => {
  const [requests, setRequests] = useState<DateBlockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      try {
        const data = await getDateBlockRequestsAPI();
        setRequests(data);
      } catch (error) {
        // Fallback a mocks
        console.warn('Usando mocks para solicitudes de bloqueo');
        const data = await getDateBlockRequestsMock();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error cargando solicitudes de bloqueo:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestBlock = async (startDate: string, endDate: string, reason: string) => {
    setSubmitting(true);
    try {
      try {
        const newRequest = await requestDateBlockAPI(startDate, endDate, reason);
        setRequests((prev) => [...prev, newRequest]);
        // Guardar en mocks también
        await saveDateBlockRequestsMock([...requests, newRequest]);
        return newRequest;
      } catch (error) {
        // Fallback a mocks
        console.warn('Usando mocks para solicitar bloqueo');
        const newRequest: DateBlockRequest = {
          id: `block-${Date.now()}`,
          doctorId: 'doctor-1', // TODO: obtener del auth
          clinicId,
          startDate,
          endDate,
          reason,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        const updatedRequests = [...requests, newRequest];
        setRequests(updatedRequests);
        await saveDateBlockRequestsMock(updatedRequests);
        return newRequest;
      }
    } catch (error) {
      console.error('Error solicitando bloqueo:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (clinicId) {
      loadRequests();
    }
  }, [clinicId]);

  return {
    requests,
    loading,
    submitting,
    requestBlock,
    refetch: loadRequests,
  };
};
