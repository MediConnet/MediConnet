import type { ClinicAppointment, AppointmentStatus } from '../domain/appointment.entity';

const generateMockAppointments = (): ClinicAppointment[] => {
  const today = new Date();
  const appointments: ClinicAppointment[] = [];
  
  // Citas de hoy
  for (let i = 0; i < 8; i++) {
    const hour = 9 + i;
    appointments.push({
      id: `apt-${i + 1}`,
      clinicId: 'clinic-1',
      doctorId: i % 2 === 0 ? 'doctor-1' : 'doctor-2',
      doctorName: i % 2 === 0 ? 'Dr. Juan Pérez' : 'Dra. María García',
      doctorSpecialty: i % 2 === 0 ? 'Cardiología' : 'Pediatría',
      patientId: `patient-${i + 1}`,
      patientName: `Paciente ${i + 1}`,
      patientPhone: `099${1000000 + i}`,
      patientEmail: `patient${i + 1}@email.com`,
      date: today.toISOString().split('T')[0],
      time: `${hour.toString().padStart(2, '0')}:00`,
      reason: `Consulta ${i % 2 === 0 ? 'cardiología' : 'pediatría'}`,
      status: i < 3 ? 'scheduled' : i < 5 ? 'confirmed' : i < 7 ? 'attended' : 'cancelled',
      receptionStatus: i < 5 ? 'arrived' : i < 7 ? 'attended' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  return appointments;
};

export const getClinicAppointmentsMock = (
  clinicId: string,
  date?: string,
  doctorId?: string
): Promise<ClinicAppointment[]> => {
  const saved = localStorage.getItem(`clinic_appointments_${clinicId}`);
  let appointments: ClinicAppointment[] = [];
  
  if (saved) {
    try {
      appointments = JSON.parse(saved);
    } catch {
      appointments = generateMockAppointments();
    }
  } else {
    appointments = generateMockAppointments();
  }
  
  // Filtrar por fecha si se proporciona
  if (date) {
    appointments = appointments.filter(apt => apt.date === date);
  }
  
  // Filtrar por médico si se proporciona
  if (doctorId) {
    appointments = appointments.filter(apt => apt.doctorId === doctorId);
  }
  
  return Promise.resolve(appointments);
};

export const saveClinicAppointmentsMock = (
  clinicId: string,
  appointments: ClinicAppointment[]
): Promise<void> => {
  localStorage.setItem(`clinic_appointments_${clinicId}`, JSON.stringify(appointments));
  return Promise.resolve();
};

export const updateAppointmentStatusMock = (
  clinicId: string,
  appointmentId: string,
  status: AppointmentStatus
): Promise<void> => {
  return getClinicAppointmentsMock(clinicId).then((appointments) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      appointment.status = status;
      appointment.updatedAt = new Date().toISOString();
      return saveClinicAppointmentsMock(clinicId, appointments);
    }
    return Promise.resolve();
  });
};

export const updateReceptionStatusMock = (
  clinicId: string,
  appointmentId: string,
  receptionStatus: 'arrived' | 'not_arrived' | 'attended',
  notes?: string
): Promise<void> => {
  return getClinicAppointmentsMock(clinicId).then((appointments) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      appointment.receptionStatus = receptionStatus;
      appointment.receptionNotes = notes;
      appointment.updatedAt = new Date().toISOString();
      return saveClinicAppointmentsMock(clinicId, appointments);
    }
    return Promise.resolve();
  });
};
