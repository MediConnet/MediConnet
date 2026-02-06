import type { ReceptionMessage } from '../domain/reception-message.entity';

const generateMockReceptionMessages = (): ReceptionMessage[] => {
  const now = new Date();
  const messages: ReceptionMessage[] = [];
  
  // Mensajes de hoy con Dr. Juan Pérez (Cardiólogo)
  messages.push(
    {
      id: 'msg-1',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      from: 'doctor',
      message: 'Buenos días. El paciente Carlos Mendoza necesita un electrocardiograma urgente.',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // Hace 2 horas
      isRead: true,
      senderName: 'Dr. Juan Pérez',
    },
    {
      id: 'msg-2',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      from: 'reception',
      message: 'Entendido doctor. Ya coordiné con el técnico para el electrocardiograma.',
      timestamp: new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString(), // Hace 1.5 horas
      isRead: true,
      senderName: 'Recepción',
    },
    {
      id: 'msg-3',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      from: 'doctor',
      message: 'Por favor, confirmar si llegó el paciente Luis Torres de las 10:00.',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // Hace 30 minutos
      isRead: false,
      senderName: 'Dr. Juan Pérez',
    },
    {
      id: 'msg-4',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      from: 'reception',
      message: 'Sí doctor, el paciente Luis Torres ya está en sala de espera.',
      timestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString(), // Hace 25 minutos
      isRead: false,
      senderName: 'Recepción',
    }
  );
  
  // Mensajes de hoy con Dra. María García (Pediatra)
  messages.push(
    {
      id: 'msg-5',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-2',
      doctorName: 'Dra. María García',
      from: 'doctor',
      message: 'Necesito que preparen la sala de vacunación para el siguiente paciente.',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // Hace 3 horas
      isRead: true,
      senderName: 'Dra. María García',
    },
    {
      id: 'msg-6',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-2',
      doctorName: 'Dra. María García',
      from: 'reception',
      message: 'Sala de vacunación lista doctora.',
      timestamp: new Date(now.getTime() - 2.8 * 60 * 60 * 1000).toISOString(), // Hace 2.8 horas
      isRead: true,
      senderName: 'Recepción',
    },
    {
      id: 'msg-7',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-2',
      doctorName: 'Dra. María García',
      from: 'reception',
      message: 'Doctora, la mamá de María Sánchez pregunta si puede adelantar la cita 15 minutos.',
      timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(), // Hace 45 minutos
      isRead: false,
      senderName: 'Recepción',
    },
    {
      id: 'msg-8',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-2',
      doctorName: 'Dra. María García',
      from: 'doctor',
      message: 'Sí, sin problema. Que pase cuando llegue.',
      timestamp: new Date(now.getTime() - 40 * 60 * 1000).toISOString(), // Hace 40 minutos
      isRead: false,
      senderName: 'Dra. María García',
    },
    {
      id: 'msg-9',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-2',
      doctorName: 'Dra. María García',
      from: 'reception',
      message: 'Perfecto doctora, ya le avisé a la mamá.',
      timestamp: new Date(now.getTime() - 38 * 60 * 1000).toISOString(), // Hace 38 minutos
      isRead: false,
      senderName: 'Recepción',
    }
  );
  
  // Mensajes de ayer
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  messages.push(
    {
      id: 'msg-10',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      from: 'doctor',
      message: 'Mañana necesitaré el equipo de electrocardiograma desde las 9 AM.',
      timestamp: new Date(yesterday.getTime() + 16 * 60 * 60 * 1000).toISOString(), // Ayer 4 PM
      isRead: true,
      senderName: 'Dr. Juan Pérez',
    },
    {
      id: 'msg-11',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      from: 'reception',
      message: 'Anotado doctor. El equipo estará listo desde las 8:30 AM.',
      timestamp: new Date(yesterday.getTime() + 16.5 * 60 * 60 * 1000).toISOString(), // Ayer 4:30 PM
      isRead: true,
      senderName: 'Recepción',
    }
  );
  
  return messages;
};

export const getReceptionMessagesMock = (
  clinicId: string,
  doctorId?: string
): Promise<ReceptionMessage[]> => {
  const saved = localStorage.getItem(`clinic_reception_messages_${clinicId}`);
  let messages: ReceptionMessage[] = [];
  
  if (saved) {
    try {
      messages = JSON.parse(saved);
    } catch {
      messages = generateMockReceptionMessages();
    }
  } else {
    messages = generateMockReceptionMessages();
  }
  
  // Filtrar por médico si se proporciona
  if (doctorId) {
    messages = messages.filter(msg => msg.doctorId === doctorId);
  }
  
  // Ordenar por timestamp descendente (más recientes primero)
  messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return Promise.resolve(messages);
};

export const saveReceptionMessagesMock = (
  clinicId: string,
  messages: ReceptionMessage[]
): Promise<void> => {
  localStorage.setItem(`clinic_reception_messages_${clinicId}`, JSON.stringify(messages));
  return Promise.resolve();
};

export const sendReceptionMessageMock = (
  clinicId: string,
  doctorId: string,
  message: string,
  from: 'doctor' | 'reception' = 'reception'
): Promise<ReceptionMessage> => {
  return getReceptionMessagesMock(clinicId).then((messages) => {
    const newMessage: ReceptionMessage = {
      id: `msg-${Date.now()}`,
      clinicId,
      doctorId,
      from,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      senderName: from === 'reception' ? 'Recepción' : 'Doctor',
    };
    
    messages.push(newMessage);
    return saveReceptionMessagesMock(clinicId, messages).then(() => newMessage);
  });
};

export const markMessagesAsReadMock = (
  clinicId: string,
  messageIds: string[]
): Promise<void> => {
  return getReceptionMessagesMock(clinicId).then((messages) => {
    messages.forEach(msg => {
      if (messageIds.includes(msg.id)) {
        msg.isRead = true;
      }
    });
    return saveReceptionMessagesMock(clinicId, messages);
  });
};
