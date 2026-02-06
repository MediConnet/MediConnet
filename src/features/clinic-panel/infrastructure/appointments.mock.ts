import type { ClinicAppointment, AppointmentStatus } from '../domain/appointment.entity';

const generateMockAppointments = (): ClinicAppointment[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const appointments: ClinicAppointment[] = [];
  
  const patients = [
    { name: 'Carlos Mendoza', phone: '0991234567', email: 'carlos.m@email.com', reason: 'Control de presión arterial' },
    { name: 'Ana Rodríguez', phone: '0992345678', email: 'ana.r@email.com', reason: 'Consulta pediátrica - vacunación' },
    { name: 'Luis Torres', phone: '0993456789', email: 'luis.t@email.com', reason: 'Dolor en el pecho' },
    { name: 'María Sánchez', phone: '0994567890', email: 'maria.s@email.com', reason: 'Control de niño sano' },
    { name: 'Pedro Gómez', phone: '0995678901', email: 'pedro.g@email.com', reason: 'Seguimiento cardiológico' },
    { name: 'Laura Díaz', phone: '0996789012', email: 'laura.d@email.com', reason: 'Consulta por fiebre en niño' },
    { name: 'Jorge Ramírez', phone: '0997890123', email: 'jorge.r@email.com', reason: 'Electrocardiograma' },
    { name: 'Carmen López', phone: '0998901234', email: 'carmen.l@email.com', reason: 'Control de desarrollo infantil' },
    { name: 'Roberto Castro', phone: '0999012345', email: 'roberto.c@email.com', reason: 'Consulta por arritmia' },
    { name: 'Patricia Morales', phone: '0990123456', email: 'patricia.m@email.com', reason: 'Consulta pediátrica general' },
  ];
  
  // Citas de HOY - Dr. Juan Pérez (Cardiólogo)
  appointments.push(
    {
      id: 'apt-today-1',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      doctorSpecialty: 'Cardiología',
      officeNumber: '101',
      patientId: 'patient-1',
      patientName: patients[0].name,
      patientPhone: patients[0].phone,
      patientEmail: patients[0].email,
      date: today.toISOString().split('T')[0],
      time: '09:00',
      reason: patients[0].reason,
      status: 'attended',
      receptionStatus: 'attended',
      receptionNotes: 'Paciente atendido sin novedades',
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'apt-today-2',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      doctorSpecialty: 'Cardiología',
      officeNumber: '101',
      patientId: 'patient-3',
      patientName: patients[2].name,
      patientPhone: patients[2].phone,
      patientEmail: patients[2].email,
      date: today.toISOString().split('T')[0],
      time: '10:00',
      reason: patients[2].reason,
      status: 'confirmed',
      receptionStatus: 'arrived',
      receptionNotes: 'Paciente esperando en sala',
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'apt-today-3',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      doctorSpecialty: 'Cardiología',
      officeNumber: '101',
      patientId: 'patient-5',
      patientName: patients[4].name,
      patientPhone: patients[4].phone,
      patientEmail: patients[4].email,
      date: today.toISOString().split('T')[0],
      time: '11:30',
      reason: patients[4].reason,
      status: 'scheduled',
      createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'apt-today-4',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      doctorSpecialty: 'Cardiología',
      officeNumber: '101',
      patientId: 'patient-7',
      patientName: patients[6].name,
      patientPhone: patients[6].phone,
      patientEmail: patients[6].email,
      date: today.toISOString().split('T')[0],
      time: '15:00',
      reason: patients[6].reason,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
  
  // Citas de HOY - Dra. María García (Pediatra)
  appointments.push(
    {
      id: 'apt-today-5',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-2',
      doctorName: 'Dra. María García',
      doctorSpecialty: 'Pediatría',
      officeNumber: '102',
      patientId: 'patient-2',
      patientName: patients[1].name,
      patientPhone: patients[1].phone,
      patientEmail: patients[1].email,
      date: today.toISOString().split('T')[0],
      time: '09:30',
      reason: patients[1].reason,
      status: 'attended',
      receptionStatus: 'attended',
      receptionNotes: 'Vacunación completada',
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'apt-today-6',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-2',
      doctorName: 'Dra. María García',
      doctorSpecialty: 'Pediatría',
      officeNumber: '102',
      patientId: 'patient-4',
      patientName: patients[3].name,
      patientPhone: patients[3].phone,
      patientEmail: patients[3].email,
      date: today.toISOString().split('T')[0],
      time: '10:30',
      reason: patients[3].reason,
      status: 'confirmed',
      receptionStatus: 'arrived',
      receptionNotes: 'Paciente con niño de 2 años',
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'apt-today-7',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-2',
      doctorName: 'Dra. María García',
      doctorSpecialty: 'Pediatría',
      officeNumber: '102',
      patientId: 'patient-6',
      patientName: patients[5].name,
      patientPhone: patients[5].phone,
      patientEmail: patients[5].email,
      date: today.toISOString().split('T')[0],
      time: '14:00',
      reason: patients[5].reason,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'apt-today-8',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-2',
      doctorName: 'Dra. María García',
      doctorSpecialty: 'Pediatría',
      officeNumber: '102',
      patientId: 'patient-8',
      patientName: patients[7].name,
      patientPhone: patients[7].phone,
      patientEmail: patients[7].email,
      date: today.toISOString().split('T')[0],
      time: '16:00',
      reason: patients[7].reason,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
  
  // Citas de MAÑANA
  appointments.push(
    {
      id: 'apt-tomorrow-1',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-1',
      doctorName: 'Dr. Juan Pérez',
      doctorSpecialty: 'Cardiología',
      officeNumber: '101',
      patientId: 'patient-9',
      patientName: patients[8].name,
      patientPhone: patients[8].phone,
      patientEmail: patients[8].email,
      date: tomorrow.toISOString().split('T')[0],
      time: '09:00',
      reason: patients[8].reason,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'apt-tomorrow-2',
      clinicId: 'clinic-1',
      doctorId: 'doctor-clinic-central-2',
      doctorName: 'Dra. María García',
      doctorSpecialty: 'Pediatría',
      officeNumber: '102',
      patientId: 'patient-10',
      patientName: patients[9].name,
      patientPhone: patients[9].phone,
      patientEmail: patients[9].email,
      date: tomorrow.toISOString().split('T')[0],
      time: '10:00',
      reason: patients[9].reason,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
  
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
