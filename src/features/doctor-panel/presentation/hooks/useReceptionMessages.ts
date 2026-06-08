import { useState, useEffect } from 'react';
import type { ReceptionMessage } from '../../domain/ClinicAssociatedDoctor.entity';
import {
  getReceptionMessagesAPI,
  sendReceptionMessageAPI,
  markMessagesAsReadAPI,
} from '../../infrastructure/clinic-associated.api';
import { ensureArray } from '../../infrastructure/clinic-associated-list.utils';

export const useReceptionMessages = (clinicId: string) => {
  const [messages, setMessages] = useState<ReceptionMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getReceptionMessagesAPI();
      setMessages(ensureArray<ReceptionMessage>(data));
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageText: string) => {
    setSending(true);
    try {
      const newMessage = await sendReceptionMessageAPI(messageText);
      setMessages((prev) => [...ensureArray<ReceptionMessage>(prev), newMessage]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      throw error;
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageIds: string[]) => {
    try {
      try {
        await markMessagesAsReadAPI(messageIds);
      } catch (error) {
        console.warn('Error marcando mensajes como leídos en backend');
      }
      setMessages((prev) =>
        ensureArray<ReceptionMessage>(prev).map((msg) =>
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
  }, [clinicId]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead,
    refetch: loadMessages,
  };
};
