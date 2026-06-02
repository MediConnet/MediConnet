import { useState, useEffect } from 'react';
import type { DateBlockRequest } from '../types/ClinicAssociatedDoctor.entity';
import {
  getDateBlockRequestsAPI,
  requestDateBlockAPI,
} from '../api/clinic-associated.api';
import { ensureArray } from '../api/clinic-associated-list.utils';

export const useDateBlockRequests = (clinicId: string) => {
  const [requests, setRequests] = useState<DateBlockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getDateBlockRequestsAPI();
      setRequests(ensureArray<DateBlockRequest>(data));
    } catch (error) {
      console.error('Error cargando solicitudes de bloqueo:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const requestBlock = async (startDate: string, endDate: string, reason: string) => {
    setSubmitting(true);
    try {
      const newRequest = await requestDateBlockAPI(startDate, endDate, reason);
      setRequests((prev) => [...ensureArray<DateBlockRequest>(prev), newRequest]);
      return newRequest;
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
