/**
 * Entidad Appointment
 * Representa una cita médica del usuario
 */
export interface Appointment {
  id: string;
  doctorId: string;      
  doctorName: string;    
  specialty: string;     
  date: string;          // YYYY-MM-DD
  time: string;          // HH:mm
  
  // Datos del paciente
  patientName: string;   
  patientPhone: string;  
  symptoms: string;     
  
  status: 'scheduled' | 'completed' | 'cancelled'; 
  price: number;
  
  createdAt: string;
}

export interface CreateAppointmentParams {
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  symptoms: string;
  price: number;
}

