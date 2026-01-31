export interface ReceptionMessage {
  id: string;
  clinicId: string;
  doctorId: string;
  doctorName?: string; // Nombre del médico
  from: 'doctor' | 'reception';
  message: string;
  timestamp: string;
  isRead: boolean;
  senderName?: string;
}
