import { toggleDoctorStatusAPI } from '../infrastructure/clinic-doctors.api';
import { getClinicDoctorsAPI } from '../infrastructure/clinic-doctors.api';

export const toggleDoctorStatusUseCase = async (
  _clinicId: string,
  doctorId: string
): Promise<void> => {
  // Primero obtener el estado actual del médico
  const doctors = await getClinicDoctorsAPI();
  const doctor = doctors.find(d => d.id === doctorId);
  if (doctor) {
    await toggleDoctorStatusAPI(doctorId, !doctor.isActive);
  }
};
