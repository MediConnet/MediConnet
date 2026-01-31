import { useState, useEffect } from 'react';
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

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getReceptionMessagesAPI(doctorId);
      setMessages(data);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

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
      // Actualizar estado local
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
  }, [clinicId, doctorId]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead,
    refetch: loadMessages,
  };
};
