export interface Diagnosis {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // Fecha de la consulta
  diagnosis: string; // Diagnóstico principal
  symptoms?: string; // Síntomas presentados
  treatment?: string; // Tratamiento prescrito
  medications?: string; // Medicamentos recetados
  observations?: string; // Observaciones adicionales
  recommendations?: string; // Recomendaciones
  nextAppointment?: string; // Próxima cita si es necesaria
  createdAt: string; // Fecha de creación del diagnóstico
  updatedAt?: string; // Fecha de última actualización
}

