export interface DoctorSchedule {
  id: string;
  doctorId: string;
  clinicId: string;
  // Horarios específicos del médico en esta clínica
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  createdAt: string;
  updatedAt?: string;
}

export interface DaySchedule {
  enabled: boolean;
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  breakStart?: string; // 'HH:mm' (opcional)
  breakEnd?: string; // 'HH:mm' (opcional)
}
