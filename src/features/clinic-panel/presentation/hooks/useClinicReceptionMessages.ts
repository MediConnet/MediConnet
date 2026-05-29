import { useState, useEffect, useCallback } from 'react';
import type { ReceptionMessage } from '../../domain/reception-message.entity';
import {
  getReceptionMessagesAPI,
  sendReceptionMessageAPI,
  markMessagesAsReadAPI,
} from '../../infrastructure/clinic-reception-messages.api';

export const useClinicReceptionMessages = (clinicId: string, doctorId?: string) => {
  const [messages, setMessages] = useState<ReceptionMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadMessages = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    try {
      const result = await getReceptionMessagesAPI({ page, limit, doctorId });
      setMessages(result.data);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setLoading(false);
    }
  }, [clinicId, doctorId, page, limit]);

  const sendMessage = async (messageText: string, targetDoctorId: string) => {
    if (!targetDoctorId) {
      throw new Error('Debes seleccionar un médico');
    }
    
    setSending(true);
    try {
      const newMessage = await sendReceptionMessageAPI(targetDoctorId, messageText);
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      throw error;
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageIds: string[]) => {
    try {
      await markMessagesAsReadAPI(messageIds);
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marcando mensajes como leídos:', error);
    }
  };

  useEffect(() => {
    if (clinicId) {
      loadMessages();
    }
  }, [clinicId, doctorId, page, limit]);

  return {
    messages,
    loading,
    sending,
    total,
    page,
    setPage,
    limit,
    setLimit,
    sendMessage,
    markAsRead,
    refetch: loadMessages,
  };
};
