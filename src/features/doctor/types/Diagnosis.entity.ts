export interface Diagnosis {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  symptoms?: string;
  treatment?: string;
  medications?: string;
  observations?: string;
  recommendations?: string;
  nextAppointment?: string;
  createdAt: string;
  updatedAt?: string;
}
