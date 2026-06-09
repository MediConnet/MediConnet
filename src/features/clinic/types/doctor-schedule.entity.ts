export interface DoctorSchedule {
  id: string;
  doctorId: string;
  clinicId: string;
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
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}
