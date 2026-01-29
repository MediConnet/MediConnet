import { useState, useEffect } from 'react';
import type { ReceptionMessage } from '../../domain/ClinicAssociatedDoctor.entity';
import {
  getReceptionMessagesAPI,
  sendReceptionMessageAPI,
  markMessagesAsReadAPI,
} from '../../infrastructure/clinic-associated.api';
import {
  getReceptionMessagesMock,
  saveReceptionMessagesMock,
} from '../../infrastructure/clinic-associated.mock';

export const useReceptionMessages = (clinicId: string) => {
  const [messages, setMessages] = useState<ReceptionMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    try {
      try {
        const data = await getReceptionMessagesAPI();
        setMessages(data);
      } catch (error) {
        // Fallback a mocks
        console.warn('Usando mocks para mensajes de recepción');
        const data = await getReceptionMessagesMock();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageText: string) => {
    setSending(true);
    try {
      try {
        const newMessage = await sendReceptionMessageAPI(messageText);
        setMessages((prev) => [...prev, newMessage]);
        // Guardar en mocks también
        await saveReceptionMessagesMock([...messages, newMessage]);
      } catch (error) {
        // Fallback a mocks
        console.warn('Usando mocks para enviar mensaje');
        const newMessage: ReceptionMessage = {
          id: `msg-${Date.now()}`,
          clinicId,
          doctorId: 'doctor-1', // TODO: obtener del auth
          from: 'doctor',
          message: messageText,
          timestamp: new Date().toISOString(),
          isRead: false,
          senderName: 'Dr. Usuario',
        };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        await saveReceptionMessagesMock(updatedMessages);
      }
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
