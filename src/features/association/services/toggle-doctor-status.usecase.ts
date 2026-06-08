import { toggleDoctorStatusAPI } from '../api/clinic-doctors.api';

export const toggleDoctorStatusUseCase = async (
  _clinicId: string,
  doctorId: string,
  isActive: boolean
): Promise<void> => {
  await toggleDoctorStatusAPI(doctorId, isActive);
};
